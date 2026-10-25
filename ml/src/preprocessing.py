"""
preprocessing.py
Builds the single modelling dataset from the real and synthetic sources,
cleans the text, removes duplicates and assigns leakage-safe splits.

Sources
  data/raw/ScamShield_Verified_Real_Dataset_FINAL.xlsx   real collected messages
      (private and gitignored, never commit it)
  data/synthetic/*.csv                                   AI-assisted synthetic
      augmentation set(s), see DATASET_README.md

Split design (see DATASET_README.md, "Evaluation protocol"):
  - Real messages are never used to train the primary models. Verbatim real
    rows form the held-out real-world test set (split = real_eval);
    reconstructed rows are kept apart as a secondary set (real_reconstructed).
  - Synthetic rows are split by template, so every augmented variant of a
    template lands in the same split (synth_train / synth_val / synth_test).
    A random row split would put near-identical variants on both sides and
    inflate the scores. The file's own fixed split_grouped column is used when
    present; otherwise a seeded StratifiedGroupKFold split is computed.

Usage:
    python src/preprocessing.py
Writes data/processed/dataset.csv, which is gitignored because it contains
real messages.
"""
import glob
import os

import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.model_selection import StratifiedGroupKFold

from text_cleaning import clean_text, detect_language

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
REAL_PATH = os.path.join(DATA_DIR, "raw", "ScamShield_Verified_Real_Dataset_FINAL.xlsx")
REAL_SHEET = "Verified_Real_Dataset"
SYNTHETIC_DIR = os.path.join(DATA_DIR, "synthetic")
PROCESSED_DIR = os.path.join(DATA_DIR, "processed")
DATASET_PATH = os.path.join(PROCESSED_DIR, "dataset.csv")

LABELS = ("legitimate", "scam", "spam")
SOURCE_TYPES = ("real", "reconstructed", "synthetic_augmentation")
SEED = 42
# Real messages this similar (character n-gram cosine) are treated as the same
# campaign and share a group, so cross-validation never splits them apart.
NEAR_DUP_THRESHOLD = 0.8

COLUMNS = [
    "id", "message", "clean_message", "label", "category", "language",
    "language_source", "source_type", "source_note", "augmentation_ops",
    "group_id", "split",
]


def load_real() -> pd.DataFrame:
    if not os.path.exists(REAL_PATH):
        raise FileNotFoundError(
            f"Real dataset not found at {REAL_PATH}. Copy "
            "ScamShield_Verified_Real_Dataset_FINAL.xlsx into ml/data/raw/ (it is gitignored)."
        )
    df = pd.read_excel(REAL_PATH, sheet_name=REAL_SHEET)
    status = df["Verification_Status"].astype(str)

    out = pd.DataFrame({
        "id": [f"real-{i:04d}" for i in range(1, len(df) + 1)],
        "message": df["Message"].astype(str).str.strip(),
        "label": df["Label"].astype(str).str.strip().str.lower(),
        "category": df["Category"].astype(str),
        "source_type": status.str.startswith("Reconstructed").map(
            {True: "reconstructed", False: "real"}
        ),
        # Source_File is deliberately not carried over: it holds sender phone
        # numbers and names that the model and reports don't need.
        "source_note": status,
        "augmentation_ops": "none",
    })
    out["group_id"] = out["id"]

    uncertain = out["label"].eq("uncertain")
    if uncertain.any():
        print(f"Real: dropping {uncertain.sum()} 'Uncertain' row(s) - no ground-truth label to score against")
    out = out[~uncertain].copy()

    # The real file has no language column, so tag it heuristically (reported as such).
    out["language"] = out["message"].map(detect_language)
    out["language_source"] = "auto"
    return out


def load_synthetic() -> pd.DataFrame:
    paths = sorted(glob.glob(os.path.join(SYNTHETIC_DIR, "*.csv")))
    if not paths:
        raise FileNotFoundError(f"No synthetic CSVs found in {SYNTHETIC_DIR}.")

    frames = []
    for path in paths:
        name = os.path.basename(path)
        df = pd.read_csv(path)
        required = {"id", "message", "label", "language", "category", "template_id", "augmentation_ops"}
        missing = required - set(df.columns)
        if missing:
            raise ValueError(f"{name} is missing columns {sorted(missing)}")
        frames.append(pd.DataFrame({
            "id": "syn-" + df["id"].astype(str),
            "message": df["message"].astype(str).str.strip(),
            "label": df["label"].astype(str).str.strip().str.lower(),
            "category": df["category"].astype(str),
            "language": df["language"].astype(str).str.lower(),
            "language_source": "generator",
            "source_type": "synthetic_augmentation",
            "source_note": name,
            "augmentation_ops": df["augmentation_ops"].fillna("none").astype(str),
            "group_id": name + ":" + df["template_id"].astype(str),
            # Template-grouped train/val/test split shipped with the generator output.
            "generator_split": df["split_grouped"].astype(str) if "split_grouped" in df.columns else "",
        }))
    return pd.concat(frames, ignore_index=True)


def validate(df: pd.DataFrame) -> None:
    bad_labels = set(df["label"]) - set(LABELS)
    if bad_labels:
        raise ValueError(f"Unexpected labels {sorted(bad_labels)}; expected {LABELS}")
    bad_sources = set(df["source_type"]) - set(SOURCE_TYPES)
    if bad_sources:
        raise ValueError(f"Unexpected source_type values {sorted(bad_sources)}")
    placeholders = df["message"].str.contains("REPLACE_WITH", regex=False)
    if placeholders.any():
        raise ValueError(f"{placeholders.sum()} row(s) still contain placeholder text — transcribe them first")
    empty = df["message"].str.len().eq(0)
    if empty.any():
        raise ValueError(f"{empty.sum()} row(s) have an empty message")


def drop_duplicates(df: pd.DataFrame) -> pd.DataFrame:
    """Drop exact duplicates after cleaning. Real rows come first, so they win."""
    key = df["clean_message"].str.lower()
    dup = key.duplicated(keep="first")
    if dup.any():
        by_source = df.loc[dup, "source_type"].value_counts().to_dict()
        print(f"Dropping {dup.sum()} duplicate message(s) after cleaning: {by_source}")
    return df[~dup].copy()


def group_real_near_duplicates(df: pd.DataFrame) -> pd.DataFrame:
    """Give near-identical real messages (same campaign re-sent) one shared group_id."""
    real_idx = df.index[df["source_type"].isin(["real", "reconstructed"])]
    texts = df.loc[real_idx, "clean_message"].str.lower()
    sim = cosine_similarity(TfidfVectorizer(analyzer="char_wb", ngram_range=(3, 5)).fit_transform(texts))

    parent = list(range(len(real_idx)))

    def find(i):
        while parent[i] != i:
            parent[i] = parent[parent[i]]
            i = parent[i]
        return i

    for i, j in zip(*np.where(np.triu(sim, k=1) >= NEAR_DUP_THRESHOLD)):
        parent[find(i)] = find(j)

    roots = [find(i) for i in range(len(real_idx))]
    df.loc[real_idx, "group_id"] = [df.loc[real_idx[r], "id"] for r in roots]
    merged = len(real_idx) - len(set(roots))
    if merged:
        print(f"Grouped {merged} near-duplicate real message(s) with their campaign (similarity >= {NEAR_DUP_THRESHOLD})")
    return df


def assign_splits(df: pd.DataFrame) -> pd.DataFrame:
    df["split"] = ""
    df.loc[df["source_type"] == "real", "split"] = "real_eval"
    df.loc[df["source_type"] == "reconstructed", "split"] = "real_reconstructed"

    syn = df[df["source_type"] == "synthetic_augmentation"]

    # Prefer the split recorded in the synthetic file: it is fixed, so results
    # don't change with the scikit-learn version (StratifiedGroupKFold's
    # shuffling differs between releases).
    preset = syn["generator_split"].isin(["train", "val", "test"])
    df.loc[syn.index[preset], "split"] = "synth_" + syn.loc[preset, "generator_split"]

    rest_syn = syn[~preset]
    if len(rest_syn):
        # One fold of 5 (~20%) as test, then one fold of 6 of the rest (~13%
        # overall) as validation. Stratified by label, grouped by template.
        outer = StratifiedGroupKFold(n_splits=5, shuffle=True, random_state=SEED)
        rest_idx, test_idx = next(outer.split(rest_syn, rest_syn["label"], groups=rest_syn["group_id"]))
        rest = rest_syn.iloc[rest_idx]
        inner = StratifiedGroupKFold(n_splits=6, shuffle=True, random_state=SEED)
        train_idx, val_idx = next(inner.split(rest, rest["label"], groups=rest["group_id"]))

        df.loc[rest_syn.index[test_idx], "split"] = "synth_test"
        df.loc[rest.index[train_idx], "split"] = "synth_train"
        df.loc[rest.index[val_idx], "split"] = "synth_val"

    syn_splits = df[df["source_type"] == "synthetic_augmentation"]
    leaked = syn_splits.groupby("group_id")["split"].nunique()
    if (leaked > 1).any():
        raise AssertionError(f"{(leaked > 1).sum()} template(s) appear in more than one split")
    return df


def main():
    df = pd.concat([load_real(), load_synthetic()], ignore_index=True)
    validate(df)
    df["clean_message"] = df["message"].map(clean_text)
    df = drop_duplicates(df)
    df = group_real_near_duplicates(df)
    df = assign_splits(df)

    counts = df["source_type"].value_counts()
    print(f"\nLoaded {len(df)} rows")
    print(f"  real: {counts.get('real', 0)} | reconstructed: {counts.get('reconstructed', 0)} "
          f"| synthetic_augmentation: {counts.get('synthetic_augmentation', 0)}")
    if counts.get("real", 0) < 100:
        print("WARNING: fewer than 100 verbatim real messages. Real-world results will have wide "
              "confidence intervals; say so explicitly in the report.")

    print("\nRows per split and label:")
    print(pd.crosstab(df["split"], df["label"], margins=True).to_string())

    os.makedirs(PROCESSED_DIR, exist_ok=True)
    # utf-8-sig so Sinhala/Tamil text displays correctly if the file is opened in Excel.
    df[COLUMNS].to_csv(DATASET_PATH, index=False, encoding="utf-8-sig")
    print(f"\nSaved {DATASET_PATH}")


if __name__ == "__main__":
    main()
