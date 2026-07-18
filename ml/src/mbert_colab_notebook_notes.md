# Running mBERT fine-tuning on Google Colab

Fine-tuning mBERT on a CPU is impractically slow — do this step on Colab with a
free T4 GPU (Runtime → Change runtime type → GPU).

## Steps

1. Upload `train.csv`, `val.csv`, `test.csv` from `ml/data/` to your Colab session
   or mount Google Drive.
2. Install deps in the Colab cell:
   ```python
   !pip install transformers datasets torch scikit-learn evaluate
   ```
3. Load `bert-base-multilingual-cased` (mBERT) via `AutoTokenizer` /
   `AutoModelForSequenceClassification` with `num_labels=2`.
4. Tokenize with `truncation=True, max_length=128` — SMS messages are short,
   so 128 tokens is generous headroom.
5. Use `Trainer` with:
   - `per_device_train_batch_size=16`
   - `num_train_epochs=4` (watch for overfitting given the small dataset size —
     use early stopping on validation F1)
   - `learning_rate=2e-5`
6. Compute the same metrics as the TF-IDF pipeline (precision, recall, F1,
   AUC-ROC) on the same held-out `test.csv` so the comparison in the report is
   apples-to-apples.
7. Export the fine-tuned model with `model.save_pretrained("mbert_scamshield/")`
   and download it back into `ml/models/mbert_scamshield/`.
8. For the explainability comparison, use `bertviz` or manually inspect
   attention weights for the CLS token's attention to input tokens — note in
   the report that this is qualitatively different from LIME/TF-IDF
   feature importance and should be discussed as such, not treated as a
   like-for-like explanation method.

## Why TF-IDF is still the primary model

Given the very small real dataset (currently far below the 500–1000 target),
mBERT is extremely likely to overfit. Report this honestly: mBERT is included
as the required secondary comparison per the proposal, but the TF-IDF +
Logistic Regression/SVM approach is expected to generalize better until the
real dataset grows substantially.
