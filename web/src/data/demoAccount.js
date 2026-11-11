/**
 * Demo data for one presentation account.
 *
 * Which account is the demo account comes from VITE_DEMO_EMAIL / VITE_DEMO_NAME
 * in web/.env (gitignored), so no personal details live in the repository.
 * When that email signs in, its history and "My reports" are filled once with
 * the sample checks below, so the dashboards and charts have realistic content.
 *
 * User accounts are still a frontend mock (see lib/api.js): the password is
 * never stored or checked here. Phone numbers and links are safe placeholders.
 */

const DEMO_EMAIL = String(import.meta.env.VITE_DEMO_EMAIL || "").trim().toLowerCase();
const DEMO_NAME = String(import.meta.env.VITE_DEMO_NAME || "").trim();
const SEEDED_PREFIX = "scamshield_demo_seeded_v1_";
const HISTORY_PREFIX = "scamshield_history_";
const REPORTS_PREFIX = "scamshield_myreports_";

export function isDemoAccount(email) {
  return Boolean(DEMO_EMAIL) && String(email || "").trim().toLowerCase() === DEMO_EMAIL;
}

/** Extra profile fields for the demo account (its display name). */
export function demoProfile(email) {
  return isDemoAccount(email) && DEMO_NAME ? { name: DEMO_NAME } : {};
}

/* ── Sample messages ────────────────────────────────────────────── */

// label: scam | spam | legitimate. Confidence under 0.6 shows as "uncertain".
const MESSAGES = [
  { label: "scam", confidence: 0.94, message: "Your account will be suspended within 2 hours. Verify now by sharing the 6-digit OTP sent to your phone." },
  { label: "scam", confidence: 0.91, message: "සුභ පැතුම්! ඔබගේ අංකයට රු. 2,000,000ක ත්‍යාගයක් දිනා ඇත. ලබා ගැනීමට රු. 5,000ක reload එකක් [PHONE REDACTED] වෙත එවන්න." },
  { label: "legitimate", confidence: 0.91, message: "Your a/c XXXX1234 is debited Rs. 4,500.00 on 07/11 at SUPERMARKET. Avl Bal Rs. 32,105.20. Not you? Call the number on your card." },
  { label: "scam", confidence: 0.88, message: "உங்கள் வங்கி கணக்கு இன்று முடக்கப்படும். KYC புதுப்பிக்க இந்த இணைப்பை கிளிக் செய்யவும்: hxxps://kyc-update.example" },
  { label: "spam", confidence: 0.82, message: "MEGA SALE! 50% off all data packs this weekend only. Dial #123# to activate." },
  { label: "scam", confidence: 0.89, message: "Your parcel is held at customs. Pay Rs. 250 clearance fee within 24 hours to avoid return: hxxps://parcel-release.example" },
  { label: "legitimate", confidence: 0.88, message: "123456 is your verification code. For your security, do not share this code with anyone, including bank staff." },
  { label: "scam", confidence: 0.86, message: "Machan, oyage SIM eka ada block wenawa. OTP eka mata ewanna, mama fix karala dennam." },
  { label: "scam", confidence: 0.57, message: "Hi, this is Nimal from the office. Can you send me the code you just received? It's urgent." },
  { label: "scam", confidence: 0.92, message: "This is the Police Cyber Unit. A case has been filed against your NIC. Pay the fine today to avoid arrest. Call [PHONE REDACTED]." },
  { label: "spam", confidence: 0.78, message: "Aluth offer eka! Rs. 99 ta unlimited YouTube data. Dan ma activate karanna." },
  { label: "legitimate", confidence: 0.86, message: "ඔබගේ වෛද්‍ය හමුව සඳුදා පෙ.ව. 10.30ට තහවුරු කර ඇත. ස්තූතියි." },
  { label: "scam", confidence: 0.84, message: "Overseas job offer in Dubai, salary Rs. 450,000 a month. Pay Rs. 15,000 registration fee today to confirm your visa slot." },
  { label: "scam", confidence: 0.87, message: "Instant loan approved! Rs. 300,000 with no documents. Pay Rs. 3,500 processing fee to release the funds." },
  { label: "legitimate", confidence: 0.84, message: "Reminder: the parent teacher meeting is on Friday at 2pm in the main hall. Thank you." },
  { label: "spam", confidence: 0.75, message: "Get 20% off at City Fashion this Avurudu season. Reply STOP to opt out." },
  { label: "scam", confidence: 0.9, message: "ඔබගේ ගිණුම තහවුරු කිරීමට ලැබුණු OTP අංකය අපට එවන්න. නැතිනම් ගිණුම අද අවහිර වේ." },
  { label: "legitimate", confidence: 0.55, message: "Your electricity bill is overdue. Please pay online to avoid disconnection." },
  { label: "scam", confidence: 0.93, message: "Congratulations! You won an iPhone 15 in our anniversary draw. Claim within 1 hour: hxxps://claim-prize.example" },
  { label: "legitimate", confidence: 0.83, message: "உங்கள் ஆர்டர் இன்று டெலிவரி செய்யப்படும். நன்றி." },
  { label: "scam", confidence: 0.81, message: "Unga bank account la problem iruku. Udane intha link la login pannunga: hxxps://secure-login.example" },
  { label: "spam", confidence: 0.73, message: "විශේෂ දීමනාව! සියලු ඇඳුම් සඳහා 30% වට්ටමක්. අදම පැමිණෙන්න." },
  { label: "legitimate", confidence: 0.8, message: "Your data balance is 2.1GB, valid until 15/11. Thank you for staying with us." },
];

// Days ago for each check, newest first. More activity in the last two weeks.
const DAYS_AGO = [
  0, 0, 1, 1, 1, 2, 3, 3, 4, 5, 5, 6, 7, 7, 8, 9, 9, 10, 11, 12, 12, 13, 14, 15, 16,
  16, 17, 18, 19, 20, 20, 21, 22, 23, 24, 24, 25, 26, 27, 27, 28, 29, 29, 29, 29, 29,
];

function buildHistory(now = Date.now()) {
  return DAYS_AGO.map((days, i) => {
    const m = MESSAGES[i % MESSAGES.length];
    const hour = 8 + ((i * 5) % 13); // between 08:00 and 20:00
    const minute = (i * 17) % 60;
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    d.setHours(hour, minute, 0, 0);
    if (d.getTime() > now) d.setTime(now - (i + 1) * 9 * 60 * 1000); // today's checks stay in the past
    const conf = Math.min(0.97, m.confidence + (i >= MESSAGES.length ? 0.02 : 0));
    return {
      id: `demo-${String(i + 1).padStart(3, "0")}`,
      message: m.message,
      label: m.label,
      confidence: Math.round(conf * 100) / 100,
      checked_at: d.toISOString(),
      feedback: i % 7 === 0 ? "correct" : i === 17 ? "incorrect" : null,
    };
  });
}

function buildReports(now = Date.now()) {
  const ago = (days, hours = 0) => new Date(now - days * 864e5 - hours * 36e5).toISOString();
  return [
    {
      id: "SR-6101",
      message: MESSAGES[0].message,
      category: "otp_fraud",
      language: "en",
      status: "approved",
      submittedAt: ago(26, 3),
      note: "Added to community stats. Thank you for reporting.",
    },
    {
      id: "SR-6118",
      message: MESSAGES[1].message,
      category: "lottery_scam",
      language: "si",
      status: "approved",
      submittedAt: ago(19, 5),
      note: "Added to community stats. Thank you for reporting.",
    },
    {
      id: "SR-6134",
      message: MESSAGES[5].message,
      category: "delivery_scam",
      language: "en",
      status: "approved",
      submittedAt: ago(12, 2),
      note: "Added to community stats and linked to a community alert.",
    },
    {
      id: "SR-6142",
      message: MESSAGES[4].message,
      category: "subscription_scam",
      language: "en",
      status: "rejected",
      submittedAt: ago(9, 6),
      note: "Not added. The moderator judged this as promotional spam rather than a scam.",
    },
    {
      id: "SR-6157",
      message: MESSAGES[9].message,
      category: "police_impersonation",
      language: "en",
      status: "pending",
      submittedAt: ago(2, 4),
      note: "Awaiting moderator review.",
    },
    {
      id: "SR-6160",
      message: MESSAGES[3].message,
      category: "bank_transfer_scam",
      language: "ta",
      status: "pending",
      submittedAt: ago(0, 5),
      note: "Awaiting moderator review.",
    },
  ];
}

function readList(key) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Fill the demo account's history and reports once. Anything the account
 * already has (real checks or reports) is kept alongside the demo entries.
 * Safe to call on every sign-in; it does nothing for other accounts.
 */
export function seedDemoAccount(email) {
  if (!isDemoAccount(email)) return false;
  const key = DEMO_EMAIL;
  try {
    if (localStorage.getItem(SEEDED_PREFIX + key)) return false;

    const history = readList(HISTORY_PREFIX + key).filter((e) => !String(e.id).startsWith("demo-"));
    localStorage.setItem(HISTORY_PREFIX + key, JSON.stringify([...history, ...buildHistory()]));

    const demoReports = buildReports();
    const demoIds = new Set(["SR-5821", "SR-5840", ...demoReports.map((r) => r.id)]); // drop the generic example reports
    const reports = readList(REPORTS_PREFIX + key).filter((r) => !demoIds.has(r.id));
    localStorage.setItem(REPORTS_PREFIX + key, JSON.stringify([...reports, ...demoReports]));

    localStorage.setItem(SEEDED_PREFIX + key, new Date().toISOString());
    return true;
  } catch {
    // Storage blocked (private mode, quota): the app still works, just without demo data.
    return false;
  }
}

/** Clear the seeded flag and reload the demo entries (keeps any real entries). */
export function resetDemoAccount(email) {
  if (!isDemoAccount(email)) return false;
  try {
    localStorage.removeItem(SEEDED_PREFIX + DEMO_EMAIL);
  } catch {
    return false;
  }
  return seedDemoAccount(email);
}
