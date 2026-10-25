"""
metrics.py
Shared scoring helpers so the keyword baseline and the ML models are measured
in exactly the same way.

"Scam vs not-scam" is the headline task: real messages only carry
scam/legitimate labels, so 3-way predictions are collapsed (spam and
legitimate both count as not-scam) before scoring against them.
"""
import numpy as np
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, roc_auc_score


def scam_metrics(y_true_scam, y_pred_scam, y_score=None) -> dict:
    """Binary metrics with scam as the positive class. Inputs are boolean arrays."""
    y_true = np.asarray(y_true_scam, dtype=bool)
    y_pred = np.asarray(y_pred_scam, dtype=bool)
    precision, recall, f1, _ = precision_recall_fscore_support(
        y_true, y_pred, average="binary", pos_label=True, zero_division=0
    )
    out = {
        "n": int(len(y_true)),
        "n_scam": int(y_true.sum()),
        "accuracy": float(accuracy_score(y_true, y_pred)),
        "precision": float(precision),
        "recall": float(recall),
        "f1": float(f1),
    }
    if y_score is not None and len(np.unique(y_true)) == 2:
        out["auc_roc"] = float(roc_auc_score(y_true, y_score))
    return out


def bootstrap_ci(y_true_scam, y_pred_scam, y_score=None, n_boot=1000, seed=42) -> dict:
    """
    95% percentile bootstrap intervals for scam_metrics. With ~100 real test
    messages a single point estimate is misleading, so report these alongside it.
    """
    y_true = np.asarray(y_true_scam, dtype=bool)
    y_pred = np.asarray(y_pred_scam, dtype=bool)
    y_score = None if y_score is None else np.asarray(y_score)
    rng = np.random.default_rng(seed)

    samples = {}
    n = len(y_true)
    for _ in range(n_boot):
        idx = rng.integers(0, n, n)
        if len(np.unique(y_true[idx])) < 2:
            continue  # AUC/recall are undefined without both classes
        m = scam_metrics(y_true[idx], y_pred[idx], None if y_score is None else y_score[idx])
        for key, value in m.items():
            if key not in ("n", "n_scam"):
                samples.setdefault(key, []).append(value)

    return {key: [float(np.percentile(v, 2.5)), float(np.percentile(v, 97.5))] for key, v in samples.items()}
