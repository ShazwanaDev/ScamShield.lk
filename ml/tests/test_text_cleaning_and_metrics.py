"""Text cleaning, tokenising, language tagging and the shared scoring helpers."""
import pathlib
import sys

import pytest

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1] / "src"))

from metrics import bootstrap_ci, scam_metrics  # noqa: E402
from text_cleaning import clean_text, detect_language, tokenize  # noqa: E402


@pytest.mark.parametrize("raw, expected", [
    ("Visit cutt.ly/8kLp2 now.Click here", "Visit __url__ now.Click here"),
    ("Call +94 75 037 5068 or 0717371313 today", "Call __phone__ or __phone__ today"),
    ("Pay Rs.1,850 at www.gov.lk/pay e.g. via A/L", "Pay Rs.1,850 at __url__ e.g. via A/L"),
])
def test_links_and_phone_numbers_are_masked(raw, expected):
    assert clean_text(raw) == expected


def test_sinhala_and_tamil_words_stay_whole():
    # Python's \w alone would split these at every vowel sign.
    assert tokenize("සුබ පැතුම්! ත්‍යාග வணக்கம்") == ["සුබ", "පැතුම්", "ත්‍යාග", "வணக்கம்"]


@pytest.mark.parametrize("text, language", [
    ("Your OTP is 482913. Do not share.", "english"),
    ("Ammee maam gedara enawa raa 8ta", "singlish"),
    ("Unga ATM card block aagiduchu", "thanglish"),
    ("සුබ පැතුම්! ත්‍යාග", "sinhala"),
    ("ඔබගේ NIC number එකට case එකක් file වී ඇත", "code_mixed"),
])
def test_language_tagging(text, language):
    assert detect_language(text) == language


def test_scam_metrics_on_a_small_known_case():
    m = scam_metrics([True, True, False, False], [True, False, True, False], [0.9, 0.4, 0.6, 0.1])
    assert (m["precision"], m["recall"], m["f1"], m["accuracy"]) == (0.5, 0.5, 0.5, 0.5)
    assert m["auc_roc"] == 0.75


def test_bootstrap_interval_contains_the_point_estimate():
    y_true = [True, False] * 30
    y_pred = [True, False, False, False] * 15
    point = scam_metrics(y_true, y_pred)["f1"]
    low, high = bootstrap_ci(y_true, y_pred)["f1"]
    assert low <= point <= high
