/** Scam-spotting quiz. Each question shows a message; the player decides. */
export const QUIZ = [
  {
    id: "q1",
    lang: "en",
    text: "Your account will be suspended. Share the 6-digit OTP sent to your phone to verify. Call [PHONE REDACTED] now.",
    answer: "scam",
    explanation: "No genuine bank or telecom ever asks you to share an OTP. Urgency + OTP request = scam.",
  },
  {
    id: "q2",
    lang: "en",
    text: "Your a/c XXXX1234 is debited Rs. 4,500.00 at KEELLS SUPER. Avl bal Rs. 32,105.20. Not you? Call the number on your card.",
    answer: "legitimate",
    explanation: "A normal transaction alert: it states an amount and balance, and points you to the number on your card — not a link.",
  },
  {
    id: "q3",
    lang: "si",
    text: "සුභ පැතුම්! ඔබ රු. 2,000,000ක් දිනා ඇත. ත්‍යාගය ලබා ගැනීමට රු. 5,000ක reload එකක් එවන්න.",
    answer: "scam",
    explanation: "A prize you never entered, plus an upfront reload to 'claim' it — a classic lottery scam.",
  },
  {
    id: "q4",
    lang: "mixed",
    text: "FREE 10GB data! Dial *123*99# eka dapan activate karanna. Limited time offer!",
    answer: "spam",
    explanation: "Unsolicited promo bait. Dialling the code can activate a paid service — treat as spam, don't engage.",
  },
  {
    id: "q5",
    lang: "en",
    text: "123456 is your verification code. For your security, do not share this code with anyone, including bank staff.",
    answer: "legitimate",
    explanation: "A genuine OTP message tells YOU the code and warns you not to share it — it never asks you to send it back.",
  },
  {
    id: "q6",
    lang: "en",
    text: "Your parcel is held at customs. Pay Rs. 250 clearance fee within 24h: hxxps://example.invalid/parcel",
    answer: "scam",
    explanation: "Unexpected parcel + tiny fee + a link with a countdown. The page steals card details.",
  },
];
