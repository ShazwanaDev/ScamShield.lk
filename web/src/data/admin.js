/**
 * Admin fixture data. This powers the admin portal's dashboards, tables and
 * detail pages so the moderation / dataset / model / evaluation workflows are
 * demonstrable without the (not-yet-built) admin backend. Values are realistic
 * placeholders — clearly labelled in the UI as demo data where relevant.
 */

/* ── Dashboard KPIs & series ────────────────────────────────────── */

export const ADMIN_KPIS = {
  totalClassifications: 18432,
  scam: 7211,
  spam: 3980,
  legit: 7241,
  pendingModeration: 24,
  modelAccuracy: 0.912,
  userFeedback: 1043,
  activeUsers: 2870,
};

// 14-day classification trend
export const TREND_14D = Array.from({ length: 14 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (13 - i));
  const base = 900 + Math.round(Math.sin(i / 2) * 180);
  return {
    date: d.toISOString().slice(5, 10),
    scam: Math.round(base * 0.4 + (i % 3) * 20),
    spam: Math.round(base * 0.22 + (i % 4) * 12),
    legit: Math.round(base * 0.38 + (i % 2) * 15),
  };
});

export const LANGUAGE_DIST = [
  { name: "English", value: 41, color: "#175CD3" },
  { name: "Sinhala", value: 28, color: "#0E9384" },
  { name: "Tamil", value: 16, color: "#6941C6" },
  { name: "Singlish / mixed", value: 15, color: "#DC6803" },
];

export const CATEGORY_DIST = [
  { name: "OTP fraud", value: 22, color: "#D92D20" },
  { name: "Banking", value: 19, color: "#B42318" },
  { name: "Lottery", value: 16, color: "#DC6803" },
  { name: "Delivery", value: 12, color: "#F79009" },
  { name: "Job / visa", value: 10, color: "#6941C6" },
  { name: "Police", value: 8, color: "#0E9384" },
  { name: "Other", value: 13, color: "#667085" },
];

export const CONFIDENCE_DIST = [
  { band: "50–60%", count: 640 },
  { band: "60–70%", count: 1120 },
  { band: "70–80%", count: 2410 },
  { band: "80–90%", count: 4980 },
  { band: "90–100%", count: 9282 },
];

/* ── Models & evaluation ────────────────────────────────────────── */

export const MODELS = [
  {
    id: "tfidf-logreg",
    name: "TF-IDF + Logistic Regression",
    type: "Baseline (production)",
    version: "v1.3",
    status: "active",
    accuracy: 0.912,
    precision: 0.9,
    recall: 0.88,
    f1: 0.89,
    auc: 0.95,
    trainedAt: "2026-07-12",
    dataset: "v7 (824 real + 1,500 augmented)",
    sizeMb: 2.4,
  },
  {
    id: "tfidf-svm",
    name: "TF-IDF + Linear SVM",
    type: "Baseline",
    version: "v1.1",
    status: "candidate",
    accuracy: 0.905,
    precision: 0.91,
    recall: 0.85,
    f1: 0.88,
    auc: 0.94,
    trainedAt: "2026-07-12",
    dataset: "v7 (824 real + 1,500 augmented)",
    sizeMb: 3.1,
  },
  {
    id: "mbert",
    name: "mBERT (multilingual)",
    type: "Transformer",
    version: "v0.4",
    status: "experimental",
    accuracy: 0.927,
    precision: 0.93,
    recall: 0.9,
    f1: 0.915,
    auc: 0.96,
    trainedAt: "2026-07-14",
    dataset: "v7 (824 real + 1,500 augmented)",
    sizeMb: 681,
  },
  {
    id: "keyword",
    name: "Keyword baseline",
    type: "Rule-based",
    version: "v1.0",
    status: "reference",
    accuracy: 0.79,
    precision: 0.82,
    recall: 0.66,
    f1: 0.73,
    auc: 0.81,
    trainedAt: "2026-07-01",
    dataset: "n/a (rules)",
    sizeMb: 0.01,
  },
];

export const CONFUSION_MATRIX = {
  labels: ["Scam", "Spam", "Legit"],
  // rows = actual, cols = predicted
  matrix: [
    [402, 21, 17],
    [18, 233, 24],
    [12, 19, 471],
  ],
};

export const PER_LANGUAGE = [
  { language: "English", precision: 0.93, recall: 0.91, f1: 0.92, support: 512 },
  { language: "Sinhala", precision: 0.89, recall: 0.86, f1: 0.875, support: 348 },
  { language: "Tamil", precision: 0.86, recall: 0.82, f1: 0.84, support: 201 },
  { language: "Singlish / mixed", precision: 0.84, recall: 0.79, f1: 0.815, support: 186 },
];

export const PER_CATEGORY = [
  { category: "OTP fraud", precision: 0.94, recall: 0.92, f1: 0.93, support: 210 },
  { category: "Banking", precision: 0.9, recall: 0.87, f1: 0.885, support: 188 },
  { category: "Lottery", precision: 0.92, recall: 0.9, f1: 0.91, support: 154 },
  { category: "Delivery", precision: 0.88, recall: 0.83, f1: 0.855, support: 121 },
  { category: "Job / visa", precision: 0.85, recall: 0.8, f1: 0.825, support: 96 },
  { category: "Police", precision: 0.87, recall: 0.84, f1: 0.855, support: 78 },
];

/* ── Dataset records ────────────────────────────────────────────── */

const RAW_MESSAGES = [
  "Your account will be suspended. Share the OTP sent to your phone.",
  "සුභ පැතුම්! ඔබ රු. 2,000,000ක් දිනා ඇත. reload එකක් එවන්න.",
  "Your a/c XXXX1234 debited Rs. 4,500 at KEELLS. Avl bal Rs. 32,105.",
  "FREE 10GB data! Dial *123*99# to activate now.",
  "உங்கள் கணக்கின் KYC முடிக்கப்படவில்லை. இங்கே புதுப்பிக்கவும்.",
  "Parcel held at customs. Pay Rs. 250: hxxps://example.invalid/p",
  "123456 is your verification code. Do not share it with anyone.",
  "URGENT hiring Dubai. Registration fee Rs. 15,000. WhatsApp us.",
];
const LABELS = ["scam", "scam", "legitimate", "spam", "scam", "scam", "legitimate", "scam"];
const LANGS = ["en", "si", "en", "mixed", "ta", "en", "en", "en"];
const SOURCES = ["real", "reconstructed", "real", "synthetic_augmentation", "real", "real", "real", "reconstructed"];

export const DATASET_RECORDS = Array.from({ length: 48 }).map((_, i) => {
  const k = i % RAW_MESSAGES.length;
  return {
    id: `DS-${4100 + i}`,
    message: RAW_MESSAGES[k],
    label: LABELS[k],
    language: LANGS[k],
    category: LABELS[k] === "legitimate" ? "—" : ["otp_fraud", "lottery_scam", "bank_transfer_scam", "delivery_scam"][i % 4],
    source: SOURCES[k],
    annotated: i % 5 !== 0,
    addedAt: new Date(Date.now() - i * 36e5 * 9).toISOString().slice(0, 10),
  };
});

export const DATASET_SUMMARY = {
  total: 2324,
  real: 824,
  reconstructed: 142,
  synthetic: 1358,
  target: 1000,
  byLabel: { scam: 1102, spam: 486, legitimate: 736 },
  byLanguage: { en: 951, si: 651, ta: 372, mixed: 350 },
};

/* ── Users ──────────────────────────────────────────────────────── */

const NAMES = ["Nimal Perera", "Anusha Fernando", "Kavya Raj", "Mohamed Aslam", "Dilani Silva", "Tharindu Bandara", "Fathima Rizwan", "Suresh Kumar"];
export const USERS = Array.from({ length: 32 }).map((_, i) => {
  const name = NAMES[i % NAMES.length];
  return {
    id: `U-${2100 + i}`,
    name: i % NAMES.length === 3 ? name : `${name}`,
    email: `${name.toLowerCase().replace(/[^a-z]/g, ".")}@example.lk`,
    role: i === 0 ? "admin" : i % 9 === 0 ? "moderator" : "user",
    status: i % 11 === 0 ? "suspended" : "active",
    checks: 20 + ((i * 37) % 300),
    reports: (i * 7) % 20,
    joined: new Date(Date.now() - i * 864e5 * 6).toISOString().slice(0, 10),
  };
});

/* ── Support tickets ────────────────────────────────────────────── */

export const TICKETS = Array.from({ length: 18 }).map((_, i) => ({
  id: `TK-${900 + i}`,
  subject: [
    "A real bank SMS was flagged as scam",
    "How do I delete my history?",
    "Sinhala text not rendering on my phone",
    "Report didn't appear in stats",
    "Offline mode not working",
  ][i % 5],
  requester: NAMES[i % NAMES.length],
  priority: ["low", "medium", "high"][i % 3],
  status: ["open", "pending", "resolved"][i % 3],
  updated: new Date(Date.now() - i * 36e5 * 5).toISOString(),
}));

/* ── Audit log ──────────────────────────────────────────────────── */

export const AUDIT_LOG = Array.from({ length: 24 }).map((_, i) => ({
  id: `LG-${7000 + i}`,
  actor: i % 4 === 0 ? "admin@scamshield.lk" : "moderator@scamshield.lk",
  action: [
    "Approved report SR-58" + (20 - (i % 20)),
    "Rejected report SR-57" + (30 - (i % 30)),
    "Deployed model tfidf-logreg v1.3",
    "Edited category 'OTP fraud'",
    "Suspended user U-2110",
    "Published alert AL-2041",
  ][i % 6],
  target: ["report", "report", "model", "category", "user", "alert"][i % 6],
  at: new Date(Date.now() - i * 36e5 * 3).toISOString(),
}));

/* ── System health ──────────────────────────────────────────────── */

export const SYSTEM_HEALTH = [
  { name: "API (Flask)", status: "operational", latencyMs: 82, uptime: "99.94%" },
  { name: "PostgreSQL", status: "operational", latencyMs: 11, uptime: "99.99%" },
  { name: "Redis cache", status: "operational", latencyMs: 3, uptime: "99.98%" },
  { name: "Model inference", status: "degraded", latencyMs: 240, uptime: "99.41%" },
  { name: "Web app", status: "operational", latencyMs: 45, uptime: "100%" },
];

/* ── Moderation queue (reports) ─────────────────────────────────── */

export const MOD_REPORTS = Array.from({ length: 22 }).map((_, i) => {
  const k = i % RAW_MESSAGES.length;
  return {
    id: `SR-${5800 + i}`,
    message: RAW_MESSAGES[k],
    category: ["otp_fraud", "lottery_scam", "bank_transfer_scam", "delivery_scam", "job_scam"][i % 5],
    language: LANGS[k],
    status: i % 7 === 0 ? "approved" : i % 5 === 0 ? "rejected" : "pending",
    submittedAt: new Date(Date.now() - i * 36e5 * 4).toISOString(),
    reporter: i % 3 === 0 ? "guest" : NAMES[i % NAMES.length],
  };
});

export const FEEDBACK_QUEUE = Array.from({ length: 14 }).map((_, i) => {
  const k = i % RAW_MESSAGES.length;
  return {
    id: `FB-${3300 + i}`,
    message: RAW_MESSAGES[k],
    predicted: LABELS[k],
    userSaid: LABELS[k] === "scam" ? "legitimate" : "scam",
    confidence: 0.6 + ((i * 7) % 35) / 100,
    language: LANGS[k],
    at: new Date(Date.now() - i * 36e5 * 6).toISOString(),
    reviewed: i % 4 === 0,
  };
});
