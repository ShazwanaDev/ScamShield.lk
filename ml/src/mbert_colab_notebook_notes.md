# Running mBERT fine-tuning on Google Colab

Fine-tuning mBERT on a CPU is impractically slow — do this step on Colab with a
free T4 GPU (Runtime → Change runtime type → GPU).

The ready-to-run notebook is `ml/notebooks/mbert_colab.ipynb`. Open it in Colab (File →
Upload notebook), upload `ml/data/processed/dataset.csv` when asked, and run the cells in
order. It downloads `mbert_results.json` at the end; put that in `ml/models/`. The steps
below explain what the notebook does.

## Steps

1. Upload `ml/data/processed/dataset.csv` (written by `preprocessing.py`) to your Colab
   session, or to your own Google Drive. It contains the private real messages: don't share
   the notebook or the Drive folder publicly, and delete the copy when you're done. Use the
   `split` column:
   - train on `synth_train`, using `synth_val` for early stopping;
   - test on `real_eval` (scam vs not-scam) and on `synth_test` (3-way);
   - never train on `real_eval`.
2. Install deps in the Colab cell:
   ```python
   !pip install transformers datasets torch scikit-learn evaluate
   ```
3. Load `bert-base-multilingual-cased` (mBERT) via `AutoTokenizer` /
   `AutoModelForSequenceClassification` with `num_labels=3` (legitimate / scam / spam).
4. Tokenize with `truncation=True, max_length=128` — SMS messages are short,
   so 128 tokens is generous headroom.
5. Use `Trainer` with:
   - `per_device_train_batch_size=16`
   - `num_train_epochs=4` (watch for overfitting given the small dataset size —
     use early stopping on validation F1)
   - `learning_rate=2e-5`
6. Compute the same metrics as the TF-IDF pipeline, on the same sets, so the comparison in
   the report is apples-to-apples:
   - on `real_eval`: precision, recall, F1 and AUC-ROC for scam vs not-scam (a prediction of
     spam or legitimate counts as not-scam), with 95% bootstrap CIs. `ml/src/metrics.py` has
     `scam_metrics` and `bootstrap_ci`, which you can paste into the notebook;
   - on `synth_test`: 3-way macro-F1.

   The "Evaluation protocol" section of `ml/data/DATASET_README.md` has the details.
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
