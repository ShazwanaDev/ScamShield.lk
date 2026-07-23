/**
 * Sample messages for the analyser's "try an example" chips and for demos.
 * Spread across languages/scripts and verdicts so the multilingual angle is
 * visible. All contact details / links are safe placeholders.
 */
export const SAMPLE_MESSAGES = [
  {
    id: "s-otp",
    lang: "en",
    langLabel: "English",
    expected: "scam",
    label: "OTP request",
    text: "Your account will be suspended. Verify now by sharing the 6-digit OTP sent to your phone. Call [PHONE REDACTED] immediately.",
  },
  {
    id: "s-si-lottery",
    lang: "si",
    langLabel: "Sinhala",
    expected: "scam",
    label: "Lottery (Sinhala)",
    text: "සුභ පැතුම්! ඔබගේ අංකයට රු. 2,000,000ක් දිනා ඇත. ත්‍යාගය ලබා ගැනීමට රු. 5,000ක reload එකක් [PHONE REDACTED] වෙත එවන්න.",
  },
  {
    id: "s-ta-bank",
    lang: "ta",
    langLabel: "Tamil",
    expected: "scam",
    label: "Bank KYC (Tamil)",
    text: "அன்பு வாடிக்கையாளரே, உங்கள் கணக்கின் KYC முடிக்கப்படவில்லை, இன்று முடக்கப்படும். இங்கே புதுப்பிக்கவும்: hxxps://example.invalid/kyc",
  },
  {
    id: "s-mixed-reload",
    lang: "mixed",
    langLabel: "Singlish",
    expected: "spam",
    label: "Free data (Singlish)",
    text: "FREE 10GB data!! Dial *123*99# eka dapan dan activate karanna. Limited time offer, ikmanata register wenna!",
  },
  {
    id: "s-parcel",
    lang: "en",
    langLabel: "English",
    expected: "scam",
    label: "Parcel / customs",
    text: "Your parcel is held at customs. Pay the Rs. 250 clearance fee within 24h to release: hxxps://example.invalid/parcel",
  },
  {
    id: "s-legit-bank",
    lang: "en",
    langLabel: "English",
    expected: "legitimate",
    label: "Real bank alert",
    text: "Your a/c XXXX1234 is debited Rs. 4,500.00 on 21/07 at KEELLS SUPER. Avl bal Rs. 32,105.20. Not you? Call the number on your card.",
  },
  {
    id: "s-legit-otp",
    lang: "en",
    langLabel: "English",
    expected: "legitimate",
    label: "Genuine OTP notice",
    text: "123456 is your verification code. For your security, do not share this code with anyone, including bank staff.",
  },
  {
    id: "s-si-legit",
    lang: "si",
    langLabel: "Sinhala",
    expected: "legitimate",
    label: "Appointment (Sinhala)",
    text: "ඔබගේ වෛද්‍ය හමුව 24/07 පෙ.ව. 10.30ට තහවුරු කර ඇත. වෙනසක් සඳහා අමතන්න.",
  },
];
