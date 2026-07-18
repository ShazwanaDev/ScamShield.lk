"""
preprocessing.py
Normalizes and cleans SMS text for Sinhala / Tamil / English / Singlish / code-mixed
inputs, then splits into train/val/test.

Usage:
    python src/preprocessing.py
"""
import os
import re
import glob
import unicodedata
import pandas as pd
from sklearn.model_selection import train_test_split

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")

URL_RE = re.compile(r"https?://\S+|www\.\S+")
PHONE_RE = re.compile(r"\b(?:\+94|0)?7\d{8}\b")
EMOJI_RE = re.compile(
    "["
    "\U0001F600-\U0001F64F"
    "\U0001F300-\U0001F5FF"
    "\U0001F680-\U0001F6FF"
    "\U0001F1E0-\U0001F1FF"
    "]+",
    flags=re.UNICODE,
)

# Minimal Sinhala/Tamil-aware stopword list — extend as the dataset grows.
STOPWORDS = {
    "the", "is", "at", "of", "on", "and", "a", "to", "in", "for",
    "oyata", "eka", "eken", "wenne",  # common Singlish function words — extend
}


def normalize_unicode(text: str) -> str:
    """NFC-normalize so visually identical Sinhala/Tamil glyphs compare equal."""
    return unicodedata.normalize("NFC", str(text))


def clean_text(text: str) -> str:
    text = normalize_unicode(text)
    text = URL_RE.sub(" <URL> ", text)
    text = PHONE_RE.sub(" <PHONE> ", text)
    text = EMOJI_RE.sub(" ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def tokenize(text: str):
    """
    Lightweight code-mixed tokenizer: splits on whitespace and punctuation
    while preserving Sinhala/Tamil unicode blocks as single tokens.
    Swap in indic-nlp-library's tokenizer if you need syllable-level splitting.
    """
    return re.findall(r"[\w<>]+", text, flags=re.UNICODE)


def remove_stopwords(tokens):
    return [t for t in tokens if t.lower() not in STOPWORDS]


def load_all_labeled_csvs():
    frames = []
    for path in glob.glob(os.path.join(DATA_DIR, "*.csv")):
        df = pd.read_csv(path)
        required = {"message", "language", "label", "source_type"}
        missing = required - set(df.columns)
        if missing:
            print(f"Skipping {path}: missing columns {missing}")
            continue
        df["__source_file"] = os.path.basename(path)
        frames.append(df)
    if not frames:
        raise FileNotFoundError(
            f"No valid labeled CSVs found in {DATA_DIR}. "
            "Add at least one file following DATASET_README.md's schema."
        )
    return pd.concat(frames, ignore_index=True)


def main():
    df = load_all_labeled_csvs()

    # Flag synthetic rows so downstream scripts can't silently treat them as primary.
    df["is_synthetic"] = df["source_type"].eq("synthetic_augmentation")

    df["clean_message"] = df["message"].astype(str).apply(clean_text)
    df["tokens"] = df["clean_message"].apply(lambda t: remove_stopwords(tokenize(t)))
    df["token_count"] = df["tokens"].apply(len)

    real_count = (df["source_type"] == "real").sum()
    reconstructed_count = (df["source_type"] == "reconstructed").sum()
    synthetic_count = (df["source_type"] == "synthetic_augmentation").sum()
    print(f"Loaded {len(df)} rows total")
    print(f"  real: {real_count} | reconstructed: {reconstructed_count} | synthetic_augmentation: {synthetic_count}")

    if real_count + reconstructed_count < 50:
        print(
            "⚠️  WARNING: fewer than 50 real/reconstructed messages. "
            "Model results will not be reliable and the report should say so explicitly."
        )

    # Stratified split, held-out test set never touched again until final evaluation.
    train_val, test = train_test_split(
        df, test_size=0.2, random_state=42, stratify=df["label"]
    )
    train, val = train_test_split(
        train_val, test_size=0.15, random_state=42, stratify=train_val["label"]
    )

    train.to_csv(os.path.join(DATA_DIR, "train.csv"), index=False)
    val.to_csv(os.path.join(DATA_DIR, "val.csv"), index=False)
    test.to_csv(os.path.join(DATA_DIR, "test.csv"), index=False)

    print(f"Saved train.csv ({len(train)}), val.csv ({len(val)}), test.csv ({len(test)}) to {DATA_DIR}")


if __name__ == "__main__":
    main()
