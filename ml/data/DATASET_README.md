# Dataset folder — rules

## Layout

| Path | Contents | In git? |
|---|---|---|
| `raw/ScamShield_Verified_Real_Dataset_FINAL.xlsx` | Real collected messages | **No.** It's personal inbox content, kept private and gitignored |
| `synthetic/scamshield_lk_augmented_3000.csv` | AI-assisted synthetic augmentation set | Yes |
| `processed/dataset.csv` | Merged, cleaned, de-duplicated, split dataset written by `src/preprocessing.py` | **No**, because it contains real messages |
| `processed/real_errors.csv`, `processed/sample_explanations.json` | Evaluation outputs that quote message text | **No** |

**Setup on a new machine:** copy `ScamShield_Verified_Real_Dataset_FINAL.xlsx` from its private
backup into `ml/data/raw/`, then run the pipeline (see the repo README §3.4). Never commit
anything from `raw/` or `processed/`.

## Sources

### 1. Real collected messages (`raw/`)

127 rows, sheet `Verified_Real_Dataset`, columns `Message, Category, Label, Verification_Status, Source_File`.

| Verification status | Rows | Counted as |
|---|---|---|
| Verified Real | 65 | real |
| Verified Real (user-provided, plausible genuine inbox content) | 32 | real |
| Verified Real (OCR-transcribed from Reddit screenshot / phone screenshot) | 17 | real |
| Verified Real (network-flagged spam, screenshot-transcribed) | 1 | real |
| Reconstructed from Documented Real Incident (not verbatim) | 12 | reconstructed |

- Labels are Legitimate 68, Scam 58 and Uncertain 1. There is **no spam label**: promotions
  (telecom offers, bank cashback, political bulk SMS) are labelled Legitimate.
- After preprocessing:
  - **113 verbatim real messages** form the test set `real_eval` (68 legitimate, 45 scam).
  - 1 Uncertain row was dropped, and 1 message was dropped as a duplicate of another after cleaning.
  - **12 reconstructed** messages form the separate set `real_reconstructed`.
- The file records no language. `text_cleaning.detect_language` tags it heuristically
  (`language_source = auto`). The set is mostly Latin script: about 81 English, 12 Singlish and
  16 code-mixed after tagging. Very few messages are in Sinhala or Tamil script.
- `Source_File` (sender numbers, names) is deliberately **not** copied into `processed/`.

Counted strictly, this is *115 verbatim real messages plus 12 reconstructed from documented
incidents*, not 127 real messages.

### 2. Synthetic augmentation set (`synthetic/`)

3,000 rows generated with AI assistance. The supervisor approved its use on 8 Oct 2026, on condition
that it is kept clearly separate from real data, the generation procedure is documented, and
evaluation is reported carefully.

- **Labels:** scam 1,200, legitimate 1,200, spam 600.
- **Language forms:** English 600, Singlish 600, Sinhala 540, code-mixed 540, Tamil 360, Thanglish 360.
- **Categories:** 39, e.g. `bank_phishing`, `otp_theft`, `delivery`, `telco_promo`, `bank_txn`,
  `personal`.

**Generation procedure, as recorded in the file's own columns:**

1. **Base templates.** 231 base messages (`template_id`). Each has a single label, category and
   language form. No template mixes labels.
2. **Rule-based augmentation.** Each variant applies zero or more operations (`augmentation_ops`,
   `n_ops`), using a fixed random seed (`generator_seed = 20260823`), so the set is reproducible.

   | Operation | What it simulates | Rows using it |
   |---|---|---|
   | `none` | the base form | 787 |
   | `typo` | character-level typing errors | 759 |
   | `emoji` | added emoji | 468 |
   | `punct_exaggerate` | "!!!", "???" | 460 |
   | `case_noise` | random capitalisation | 381 |
   | `clause_reorder` | clauses swapped | 372 |
   | `whitespace_noise` | irregular spacing | 289 |
   | `leet` | character substitution (0 for o, 1 for i) | 251 |
   | `urgency_prefix` | "URGENT:"-style prefixes | 250 |
   | `spaced_keyword` | "O T P"-style filter evasion | 187 |
   | `sender_prefix` | sender tags at the start | 159 |
   | `truncate_sms` | messages cut off with "(cont)" | 106 |
   | `number_format` | different number and amount formats | 100 |

3. **Difficulty tag:** `easy` 2,455, `hard` 545.

Still to add: how the 231 base templates were written and checked. That means which real scam
patterns and news reports they were modelled on, how the AI-assisted generation step was set up,
and whether native speakers reviewed the Sinhala and Tamil wording.

**Leakage check:** no synthetic message is a near-copy of any real message. The highest
character 3–5-gram cosine similarity between any real message and the whole synthetic set is
below 0.7 (median 0.13). Testing on real messages is therefore not inflated by augmented copies
of those same messages.

### Files on the project drive that are *not* used, and why

| File | Reason |
|---|---|
| `sms_phishing_dataset_lk.xlsx` (lecturer, 128,650 rows) | Template-generated, 89% one label, binary labels only |
| `Sinhala_Tamil_Scam_SMS_Dataset.xlsx` (17,000) | Synthetic, no generation record |
| `sri_lankan_sms_scam_dataset.xlsx`, `sri_lankan_sms_scam_detection_dataset.xlsx` (2,000 each) | Synthetic fingerprints, no provenance |
| `Sri_Lankan_Augmented_SMS_Dataset_600.*`, `Starter_Multilingual_SMS_Dataset.xlsx` | Binary labels, superseded by the 3,000-row set |
| `ScamShield_77_Verified_Dataset.xlsx`, `ScamShield_New_Verified_Messages.xlsx`, `spam set 4.csv`, most of `Real_Reported_Scam_SMS_Examples.xlsx` | Already merged into the 127-row real file |

## `processed/dataset.csv` schema

| column | meaning |
|---|---|
| `id` | `real-0001…` or `syn-SSLK-00001…` |
| `message` / `clean_message` | original text / text after `text_cleaning.clean_text` (NFC normalisation, URLs replaced by `__url__`, phone numbers by `__phone__`, emoji removed) |
| `label` | `legitimate` / `scam` / `spam` |
| `category` | free-text category (real) or generator category (synthetic) |
| `language`, `language_source` | sinhala / tamil / english / singlish / thanglish / code_mixed; `auto` (heuristic) or `generator` |
| `source_type` | `real` / `reconstructed` / `synthetic_augmentation` (see below) |
| `source_note` | verification status (real) or source file (synthetic) |
| `augmentation_ops` | augmentation applied (synthetic only) |
| `group_id` | template (synthetic), or campaign group of near-duplicate real messages |
| `split` | `synth_train` / `synth_val` / `synth_test` / `real_eval` / `real_reconstructed` |

## `source_type` values — do not skip this

- **real**: a verbatim, verified genuine message (screenshot transcription, personally received
  message, or a source you can point to that quotes the exact wording).
- **reconstructed**: you know the incident happened (news article, SLCERT advisory), but you are
  recreating the likely wording because the cited source didn't quote it verbatim. This is NOT the
  same as real, and must never be presented as primary collected data in the report.
- **synthetic_augmentation**: template-generated or AI-assisted, used only as a documented
  augmentation component. Never counted toward the "real collected dataset" figure in the report.

## Evaluation protocol

1. **Primary models train on synthetic data only** (`synth_train`). `tfidf_baseline.py` refuses to
   train if any real row ends up in the training split.
2. **Synthetic splits are grouped by template.** Every augmented variant of a template sits in
   the same split. A random row split would put near-identical variants on both sides and inflate
   the scores. The split used is the file's own fixed `split_grouped` column: 161 / 35 / 35
   templates, with every label and all six languages in each split. That makes it identical on
   every machine; a computed split would change with the scikit-learn version.
3. **Real messages are the real-world test.** They have only scam and legitimate labels, so the
   3-way predictions are collapsed to **scam vs not-scam** (spam and legitimate both count as
   not-scam) before scoring. This is the headline result.
4. **Experiment A, synthetic to real:** synthetic-trained models are tested on all 113 `real_eval`
   messages. Results include 95% bootstrap confidence intervals, because the set is small.
5. **Experiment B, synthetic + real:** 5-fold × 5-repeat cross-validation over the real messages.
   Each fold trains on synthetic data plus the other real folds (and reconstructed rows) and tests
   on the held-out real fold. Folds are grouped, so near-duplicate campaigns (similarity ≥ 0.8)
   never straddle a fold. This shows how much a little real data helps.
6. **Experiment C, synthetic 3-way:** legitimate / scam / spam on `synth_test`.
7. **Reconstructed messages** are reported separately, as a detection rate, and never as
   real-world accuracy.
8. **Don't tune on the real test set.** Any change made after looking at `real_eval` results
   (keywords, thresholds, features) contaminates it. If that happens, say so in the report.

## Latest results

Run on 25 Oct 2026 with the pinned environment (Python 3.12, scikit-learn 1.5.1, pandas 2.2.2,
numpy 1.26.4). Regenerate with `python src/evaluate.py`; the numbers come from
`models/final_evaluation_results.json`. A and C are identical under scikit-learn 1.9.1. B and the
synthetic cross-validation shift by about 0.02 between versions, because fold shuffling differs,
which is well within their ± range.

**A. Synthetic-trained model on 113 real messages (scam vs not-scam), with 95% CI:**

| Model | Precision | Recall | F1 | AUC-ROC |
|---|---|---|---|---|
| Keyword baseline | 0.80 [0.00–1.00] | 0.09 [0.00–0.19] | 0.16 [0.00–0.31] | 0.54 [0.49–0.59] |
| TF-IDF + LogReg | 0.56 [0.44–0.68] | 0.84 [0.74–0.94] | 0.67 [0.57–0.77] | 0.83 [0.75–0.90] |
| TF-IDF + SVM | 0.55 [0.44–0.68] | 0.82 [0.70–0.93] | 0.66 [0.55–0.76] | 0.79 [0.71–0.87] |

**B. Synthetic + real training, grouped 5×5 CV on real messages (mean ± std):**

| Model | Precision | Recall | F1 | AUC-ROC |
|---|---|---|---|---|
| TF-IDF + LogReg | 0.74 ± 0.10 | 0.93 ± 0.06 | 0.82 ± 0.07 | 0.95 ± 0.03 |
| TF-IDF + SVM | 0.80 ± 0.10 | 0.91 ± 0.09 | 0.85 ± 0.06 | 0.94 ± 0.04 |

**C. Synthetic test split (35 unseen templates, 434 messages), 3-way:**

| Model | Legitimate F1 | Scam F1 | Spam F1 | Macro-F1 |
|---|---|---|---|---|
| TF-IDF + LogReg | 0.79 | 0.83 | 0.72 | 0.78 |
| TF-IDF + SVM | 0.78 | 0.85 | 0.78 | 0.81 |

- The keyword baseline scores scam F1 0.40 on this split.
- Grouped 5-fold CV on the synthetic training split gives macro-F1 0.69 ± 0.15 (LogReg) and
  0.70 ± 0.13 (SVM). The large spread shows how much performance depends on which templates a
  model has seen.
- All 12 reconstructed scams are detected by both models.

### What these results mean

- **The ML models clearly beat the keyword baseline** on real messages: F1 0.67 vs 0.16. The
  baseline catches only 4 of 45 real scams.
- **Synthetic-only training transfers, but imperfectly.**
  - The models catch most real scams: 38 of 45 (recall 0.84).
  - They also raise many false alarms. 30 of 68 real legitimate messages are flagged as scam,
    and another 25 are called spam, which still counts as not-scam. Most false alarms are
    genuine telecom promotions, reload reminders and government notices.
  - The synthetic set does not capture what genuine Sri Lankan promotional and service SMS look
    like. This is the **synthetic-to-real gap**, and it is worth discussing in the report.
- **A small amount of real data helps a lot.** Adding about 90 real messages to training lifts
  F1 from 0.67 to about 0.82–0.85 and AUC to about 0.95.
- **Confidence intervals are wide** (about ±0.1 F1), because there are only 113 real test
  messages. Present them alongside every real-world number.

### Explanation figures

`python src/explainability_lime.py` writes two sets of figures:

- `ml/models/figures/` (tracked, safe for the report):
  - `top_scam_features.png`: the 15 words the logistic regression weighs most towards scam
    and the 15 most away from it.
  - One LIME chart per label for a synthetic test message, with the explanations in
    `sample_explanations_synthetic.json`.
- `ml/data/processed/figures/` (gitignored): LIME charts for five real scam messages. They
  show words from real messages, so check each one before putting it in the report.

The top-words chart shows a limitation of the synthetic data. The strongest "not scam" word is
"2026", and "000" is one of the strongest scam words. Both come from how the templates were
written (dates in genuine notices, round amounts in scams), not from how scams are worded. A
model trained only on synthetic data picks up such template habits, which is part of why it
over-flags genuine real messages.

## Known limitations

- **The real set is small** (113 verbatim messages). Every real-world figure has a wide
  confidence interval.
- **Real data is mostly English or romanised.** Real-world performance on Sinhala-script and
  Tamil-script messages is essentially untested. On synthetic data, 3-way macro-F1 is weakest for
  Sinhala (0.37) and Tamil (0.41), mainly because spam and legitimate get confused. Scam recall
  stays at 0.97 or above for both.
- **The label schemes differ:** real promotions are labelled legitimate, while synthetic ones are
  spam. That's why the headline real-world task is scam vs not-scam.
- **Language tags on real data are heuristic estimates.**
- **The keyword baseline is a short seed list.** If it is extended, use literature and public
  advisories, never the `real_eval` messages.
