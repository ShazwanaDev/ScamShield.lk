/**
 * Offline rule-based classifier — a transparent stand-in for the ML model so
 * the check → result flow is fully interactive without a running backend or a
 * trained model. It is deliberately explainable: matched phrases become the
 * highlighted "trigger" spans and the LIME-style contribution list.
 *
 * This is NOT the research model. When the Flask `/predict` endpoint + trained
 * model are available, call the real API and map its response through
 * `normalizeApiResult()` — the result shape here is what the UI consumes.
 */

const SCRIPT_SINHALA = /[඀-෿]/;
const SCRIPT_TAMIL = /[஀-௿]/;

// Weighted signal lexicon. Weight sign: + pushes toward scam, negative toward
// legitimate. `cat` associates a matched signal with a scam category slug.
const SIGNALS = [
  { re: /\botp\b|one[- ]?time (pin|code|password)/i, w: 0.9, cat: "otp_fraud", why: "Requests a one-time password" },
  { re: /\bpin\b|\bcvv\b|card number|expiry/i, w: 0.7, cat: "bank_transfer_scam", why: "Asks for card / PIN details" },
  { re: /suspend|block(ed)?|frozen|deactivat/i, w: 0.6, cat: "bank_transfer_scam", why: "Threatens to block your account" },
  { re: /\bkyc\b|re-?verify|verify (now|your account)/i, w: 0.6, cat: "bank_transfer_scam", why: "Fake KYC / verification demand" },
  { re: /won|winner|congratulat|prize|lottery|draw/i, w: 0.75, cat: "lottery_scam", why: "Claims you won a prize" },
  { re: /reload|top[- ]?up/i, w: 0.5, cat: "lottery_scam", why: "Requests a reload / top-up" },
  { re: /parcel|courier|customs|clearance|redeliver/i, w: 0.55, cat: "delivery_scam", why: "Fake parcel / customs notice" },
  { re: /loan|instant cash|processing fee/i, w: 0.6, cat: "loan_scam", why: "Upfront-fee loan offer" },
  { re: /visa|dubai|qatar|foreign (job|employment)|hiring/i, w: 0.55, cat: "job_scam", why: "Suspicious job / visa offer" },
  { re: /\bcid\b|police|court|arrest|fine|case (is )?filed/i, w: 0.7, cat: "police_impersonation", why: "Impersonates police / court" },
  { re: /\bnic\b|account number|bank details/i, w: 0.5, cat: "bank_transfer_scam", why: "Asks for NIC / bank details" },
  { re: /urgent|immediately|within \d+ ?(h|hour|min)|act now|today/i, w: 0.45, cat: null, why: "Creates false urgency" },
  { re: /hxxps?:\/\/|\[suspicious link\]|bit\.ly|tinyurl/i, w: 0.55, cat: null, why: "Contains a suspicious link" },
  { re: /\bfree\b|offer|discount|activate|dial \*/i, w: 0.35, cat: "subscription_scam", why: "Promotional / activation bait" },
  // De-escalators — hallmarks of genuine transactional messages
  { re: /do not share this code|never share/i, w: -0.8, cat: null, why: "Security reminder typical of real OTPs" },
  { re: /avl bal|available balance|debited|credited|a\/c/i, w: -0.5, cat: null, why: "Transaction-notification wording" },
  { re: /appointment|confirmed|scheduled|reference no/i, w: -0.45, cat: null, why: "Informational / appointment wording" },
];

function detectLanguage(text) {
  const hasSi = SCRIPT_SINHALA.test(text);
  const hasTa = SCRIPT_TAMIL.test(text);
  const hasLatin = /[a-z]/i.test(text);
  if (hasSi && hasLatin) return { code: "si-mixed", label: "Sinhala + English (code-mixed)" };
  if (hasTa && hasLatin) return { code: "ta-mixed", label: "Tamil + English (code-mixed)" };
  if (hasSi) return { code: "si", label: "Sinhala" };
  if (hasTa) return { code: "ta", label: "Tamil" };
  // crude Singlish detector
  if (/\b(karanna|karan|wenna|dapan|epa|methana|nathi|ikman)\b/i.test(text))
    return { code: "mixed", label: "Singlish (romanised)" };
  return { code: "en", label: "English" };
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

/** Classify a message into the UI result shape. */
export function classifyLocal(message) {
  const text = String(message || "").trim();
  if (!text) return null;

  const matched = [];
  let score = -0.2; // slight prior toward legitimate
  const catScores = {};

  for (const sig of SIGNALS) {
    const m = text.match(sig.re);
    if (!m) continue;
    score += sig.w;
    matched.push({ phrase: m[0], weight: sig.w, why: sig.why });
    if (sig.cat) catScores[sig.cat] = (catScores[sig.cat] || 0) + sig.w;
  }

  const scamProb = sigmoid(score * 2.2);
  const language = detectLanguage(text);

  // Decide verdict
  let verdict;
  let confidence;
  const promoOnly =
    matched.length > 0 &&
    matched.every((t) => t.weight <= 0.4) &&
    /free|offer|discount|activate|dial \*|data/i.test(text);

  if (scamProb >= 0.62) {
    verdict = promoOnly && scamProb < 0.72 ? "spam" : "scam";
    confidence = scamProb;
  } else if (scamProb <= 0.4) {
    verdict = "legitimate";
    confidence = 1 - scamProb;
  } else {
    verdict = "low";
    confidence = 0.5 + Math.abs(scamProb - 0.5);
  }
  if (promoOnly && verdict === "scam") verdict = "spam";

  // Winning category
  const category =
    Object.entries(catScores).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    (verdict === "spam" ? "subscription_scam" : verdict === "legitimate" ? null : "other");

  const triggers = matched
    .filter((t) => t.weight > 0)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 6);

  const explanation = matched
    .sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight))
    .slice(0, 5)
    .map((t) => ({ feature: t.phrase, why: t.why, contribution: t.weight }));

  return {
    id: `local-${Date.now()}`,
    verdict,
    confidence: Math.max(0.5, Math.min(0.99, confidence)),
    language,
    category,
    triggers,
    explanation,
    recommendedActions: recommendationsFor(verdict, category),
    source: "offline",
    message: text,
    createdAt: new Date().toISOString(),
  };
}

function recommendationsFor(verdict, category) {
  if (verdict === "legitimate")
    return [
      "No strong scam signals, but stay alert.",
      "If it involves money or codes, verify through an official channel first.",
    ];
  if (verdict === "spam")
    return [
      "Don't reply or dial any codes in the message.",
      "Block the sender and unsubscribe via your telecom's official app.",
    ];
  const base = [
    "Do not click any links or call the numbers in the message.",
    "Never share OTPs, PINs, passwords, or your NIC.",
    "Verify directly with the real organisation using a number you trust.",
    "Report it so others in the community are warned.",
  ];
  if (category === "police_impersonation") base.splice(2, 0, "Real authorities never collect fines by SMS or phone transfer.");
  return base;
}

/** Map the real Flask /predict response into the UI result shape. */
export function normalizeApiResult(api, message) {
  if (!api) return null;
  const label = String(api.label || "").toLowerCase();
  const confidence = typeof api.confidence === "number" ? api.confidence : 0.5;
  let verdict;
  if (confidence < 0.6) verdict = "low";
  else if (label.includes("scam")) verdict = "scam";
  else if (label.includes("spam")) verdict = "spam";
  else verdict = "legitimate";

  const triggers = (api.trigger_words || []).map((t) => ({
    phrase: t.word,
    weight: t.weight ?? 0,
    why: "Weighted feature from the model",
  }));

  return {
    id: api.classification_id != null ? `api-${api.classification_id}` : `api-${Date.now()}`,
    classificationId: api.classification_id ?? null,
    verdict,
    confidence,
    language: { code: "auto", label: "Auto-detected" },
    category: verdict === "legitimate" ? null : "other",
    triggers: triggers.filter((t) => t.weight > 0).slice(0, 6),
    explanation: triggers
      .slice()
      .sort((a, b) => Math.abs(b.weight) - Math.abs(a.weight))
      .slice(0, 5)
      .map((t) => ({ feature: t.phrase, why: t.why, contribution: t.weight })),
    recommendedActions: recommendationsFor(verdict, "other"),
    source: "model",
    message,
    createdAt: new Date().toISOString(),
  };
}
