"""
text_cleaning.py
Text normalisation shared by training (preprocessing.py) and inference, so the
model sees identically-cleaned text in both places. Standard library only, so
the Flask backend can import it without pandas/scikit-learn data tooling.
"""
import re
import unicodedata

# Bare domains are common in scam SMS ("cutt.ly/8kLp2", "peoplesbank-verify.net"),
# so match known TLDs as well as explicit http(s)/www links. TLDs that are also
# English words (.in, .me, .click, .online...) are left out: SMS often omits the
# space after a full stop ("now.Click here"), which would be masked as a URL.
URL_RE = re.compile(
    r"https?://\S+|www\.\S+"
    r"|\b[\w-]+(?:\.[\w-]+)*\.(?:lk|com|net|org|info|xyz|ly|io)\b(?:/\S*)?",
    flags=re.IGNORECASE,
)
# International (+94 77 123 4567, +63 919 455 9767) and local (077 123 4567,
# 0112 345 678) numbers, with optional spaces/dashes between groups.
PHONE_RE = re.compile(
    r"(?<![\w+])(?:\+|00)\d{1,3}[\s-]?\d{2,4}[\s-]?\d{3,4}[\s-]?\d{3,4}\b"
    r"|\b0\d{2,3}[\s-]?\d{3}[\s-]?\d{3,4}\b"
)
EMOJI_RE = re.compile(
    "["
    "\U0001F300-\U0001FAFF"  # pictographs, emoticons, transport, supplemental symbols
    "\U0001F1E0-\U0001F1FF"  # flags
    "☀-➿"          # misc symbols + dingbats
    "️"                 # emoji variation selector
    "]+",
    flags=re.UNICODE,
)

URL_TOKEN = " __url__ "
PHONE_TOKEN = " __phone__ "

# Python's \w does not match Sinhala/Tamil vowel signs (combining marks), so the
# default scikit-learn token pattern shreds "සුබ" into "ස" + "බ". Treat the whole
# Sinhala and Tamil blocks, plus ZWJ/ZWNJ used in conjuncts, as word characters.
TOKEN_PATTERN = r"(?u)[\w඀-෿஀-௿‌‍]+"

SINHALA_RE = re.compile(r"[඀-෿]")
TAMIL_RE = re.compile(r"[஀-௿]")
LATIN_WORD_RE = re.compile(r"\b[A-Za-z]{2,}\b")

# Distinctive romanised function/verb words. Deliberately excludes short words
# that are also common English ("one", "api", "nam") to keep false hits low.
SINGLISH_MARKERS = {
    "karanna", "karala", "karanne", "karanawa", "wenna", "wenawa", "oyage", "oyata",
    "mage", "ekak", "eka", "nathi", "naththam", "thiyenawa", "thiyena", "kiyala",
    "danna", "ganna", "ewanna", "denna", "machan", "ane", "gedara", "enawa",
    "yanawa", "kohomada", "mokada", "puluwan", "oya", "mama", "ikmanin", "salli",
    "hoyanna", "balanna", "ewwa", "dapan", "methana", "aniwa", "nikan",
}
THANGLISH_MARKERS = {
    "unga", "ungal", "panna", "pannunga", "pannu", "irukku", "irukkum", "illa",
    "enna", "vanga", "vaanga", "sollunga", "aagiduchu", "konjam", "naan", "romba",
    "seri", "thambi", "kudunga", "anuppunga", "ponga", "vandhu", "venum",
    "mudiyum", "ungaluku", "ungalukku", "iruku",
}


def normalize_unicode(text: str) -> str:
    """NFC-normalize so visually identical Sinhala/Tamil glyphs compare equal."""
    return unicodedata.normalize("NFC", str(text))


def clean_text(text: str) -> str:
    """Normalise, mask URLs/phone numbers, strip emoji, collapse whitespace."""
    text = normalize_unicode(text)
    text = URL_RE.sub(URL_TOKEN, text)
    text = PHONE_RE.sub(PHONE_TOKEN, text)
    text = EMOJI_RE.sub(" ", text)
    return re.sub(r"\s+", " ", text).strip()


def tokenize(text: str):
    return re.findall(TOKEN_PATTERN, text)


def detect_language(text: str) -> str:
    """
    Heuristic language tag: sinhala / tamil / english / singlish / thanglish /
    code_mixed. Used only for the per-language results breakdown of messages
    that weren't hand-tagged, so report it as an automatic estimate.
    """
    text = clean_text(text).replace("__url__", " ").replace("__phone__", " ")
    has_si = bool(SINHALA_RE.search(text))
    has_ta = bool(TAMIL_RE.search(text))
    latin_words = LATIN_WORD_RE.findall(text)

    if has_si and has_ta:
        return "code_mixed"
    if has_si or has_ta:
        # native script plus a meaningful amount of Latin-script words
        if len(latin_words) >= 3:
            return "code_mixed"
        return "sinhala" if has_si else "tamil"

    words = {w.lower() for w in latin_words}
    if words & SINGLISH_MARKERS:
        return "singlish"
    if words & THANGLISH_MARKERS:
        return "thanglish"
    return "english"
