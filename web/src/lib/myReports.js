/**
 * "My reports" — the signed-in user's own submitted scam reports. The backend
 * `ScamReport` rows aren't scoped to a user yet (see backend/models/db.py), so
 * these are kept client-side per mock-account email, seeded with a couple of
 * example entries so the page has realistic content. Submitting still POSTs to
 * the real /api/submit-sms via the report form; this just tracks the user's
 * own view of what they've sent.
 */
const PREFIX = "scamshield_myreports_";

function keyFor(email) {
  return `${PREFIX}${(email || "guest").toLowerCase()}`;
}

const SEED = [
  {
    id: "SR-5821",
    message: "Your account will be suspended. Share the 6-digit OTP sent to your phone to verify.",
    category: "otp_fraud",
    language: "en",
    status: "approved",
    submittedAt: new Date(Date.now() - 3 * 864e5).toISOString(),
    note: "Added to community stats. Thank you for reporting.",
  },
  {
    id: "SR-5840",
    message: "සුභ පැතුම්! ඔබ රු. 2,000,000ක් දිනා ඇත. reload එකක් එවන්න.",
    category: "lottery_scam",
    language: "si",
    status: "pending",
    submittedAt: new Date(Date.now() - 6 * 36e5).toISOString(),
    note: "Awaiting moderator review.",
  },
];

function read(email) {
  try {
    const raw = localStorage.getItem(keyFor(email));
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  // Seed on first read so the page isn't empty in a demo.
  localStorage.setItem(keyFor(email), JSON.stringify(SEED));
  return [...SEED];
}

export function getMyReports(email) {
  return read(email).sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
}

export function getMyReport(email, id) {
  return read(email).find((r) => String(r.id) === String(id)) || null;
}

const QUEUED_NOTE = "Saved on this device. It will be sent when you're back online.";
const PENDING_NOTE = "Awaiting moderator review.";

export function addMyReport(email, { message, category, language, status = "pending" }) {
  const entries = read(email);
  const entry = {
    id: `SR-${5900 + Math.floor(Math.random() * 900)}`,
    message,
    category: category || null,
    language: language || null,
    status,
    submittedAt: new Date().toISOString(),
    note: status === "queued" ? QUEUED_NOTE : PENDING_NOTE,
  };
  entries.push(entry);
  try {
    localStorage.setItem(keyFor(email), JSON.stringify(entries));
  } catch {
    /* storage blocked: the entry just won't be listed */
  }
  return entry;
}

/** A queued report reached the server: it now waits for a moderator like any other. */
export function markMyReportSent(email, id) {
  try {
    const entries = read(email).map((r) =>
      String(r.id) === String(id) ? { ...r, status: "pending", note: PENDING_NOTE } : r,
    );
    localStorage.setItem(keyFor(email), JSON.stringify(entries));
  } catch {
    /* storage blocked: nothing to update */
  }
}

export const REPORT_STATUS = {
  queued: { label: "Waiting to send", tone: "neutral" },
  pending: { label: "Pending review", tone: "spam" },
  approved: { label: "Approved", tone: "legit" },
  rejected: { label: "Rejected", tone: "scam" },
};
