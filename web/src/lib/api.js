export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request(path, { headers, ...options } = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json", ...headers },
      ...options,
    });
  } catch {
    throw new ApiError("Can't reach the server. Check your connection and try again.", 0);
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // response wasn't JSON; keep the generic message
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return null;
  return res.json();
}

/** Categories used for community reports — mirrors ml/data/DATASET_README.md's taxonomy.
 * There is no GET /api/categories endpoint yet, so this list is maintained here until
 * one exists (see docs/wireframe_brief.md §10). `value` is sent as the `category` field;
 * the backend matches it by name and silently ignores anything that doesn't match a row
 * in scam_categories, so an unmatched value never blocks submission. */
export const REPORT_CATEGORIES = [
  { value: "lottery_scam", label: "Lottery / prize" },
  { value: "bank_transfer_scam", label: "Banking / bank transfer" },
  { value: "otp_fraud", label: "OTP fraud" },
  { value: "loan_scam", label: "Loan scam" },
  { value: "job_scam", label: "Job / foreign employment" },
  { value: "delivery_scam", label: "Delivery / courier scam" },
  { value: "police_impersonation", label: "Police impersonation" },
  { value: "subscription_scam", label: "Subscription scam" },
  { value: "other", label: "Other" },
];

export function classifyMessage(message) {
  return request("/predict", { method: "POST", body: JSON.stringify({ message }) });
}

export function sendFeedback(classificationId, correct) {
  return request(`/feedback/${classificationId}`, {
    method: "POST",
    body: JSON.stringify({ correct }),
  });
}

export const REPORT_LANGUAGES = [
  { value: "si", label: "Sinhala" },
  { value: "ta", label: "Tamil" },
  { value: "en", label: "English" },
  { value: "mixed", label: "Mixed / Singlish" },
];

/**
 * `language` isn't stored server-side yet (ScamReport has no language column — see
 * backend/models/db.py) but the backend ignores unrecognised JSON fields, so sending it now
 * is harmless and saves a payload-shape change later once that column exists.
 */
export function submitReport(message, category, language) {
  return request("/submit-sms", {
    method: "POST",
    body: JSON.stringify({
      message,
      ...(category ? { category } : {}),
      ...(language ? { language } : {}),
    }),
  });
}

export function fetchStats() {
  return request("/stats");
}

/*
 * Admin session. The backend checks the passphrase and returns a signed token
 * that expires after a working day; moderation requests send it back in an
 * Authorization header. It lives in sessionStorage, so closing the tab signs
 * the admin out.
 */
const ADMIN_TOKEN_KEY = "scamshield_admin_token";

export function getAdminToken() {
  try {
    return sessionStorage.getItem(ADMIN_TOKEN_KEY);
  } catch {
    return null;
  }
}

function setAdminToken(token) {
  try {
    if (token) sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
    else sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  } catch {
    // storage blocked (private mode); the session just won't survive a reload
  }
}

function adminHeaders() {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function adminSignIn(passphrase) {
  const { token } = await request("/admin/login", {
    method: "POST",
    body: JSON.stringify({ passphrase }),
  });
  setAdminToken(token);
}

export function adminSignOut() {
  setAdminToken(null);
}

/** `status` is "pending" (the queue), "approved" or "rejected". */
export function fetchModerationQueue(status = "pending") {
  return request(`/moderate?status=${encodeURIComponent(status)}`, { headers: adminHeaders() });
}

export function moderateReport(reportId, decision) {
  return request(`/moderate/${reportId}`, {
    method: "POST",
    headers: adminHeaders(),
    body: JSON.stringify({ decision }),
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Mock auth — the Flask backend has no auth routes yet (only /predict and the community
 * report/moderate/stats endpoints). These simulate a login/register round trip so the
 * Login/Register/History pages have something real to call. Swap for real POST
 * /api/auth/login + /api/auth/register calls once the backend grows them; the request
 * shape here (email/password in, {email, token} out) is deliberately what a real JWT
 * endpoint would return so that swap is a one-function change.
 */
export async function mockLogin(email, password) {
  await delay(450);
  if (!email || !password) throw new ApiError("Enter your email and password.", 400);
  if (password.length < 6) throw new ApiError("Incorrect email or password.", 401);
  return { email, token: `mock.${btoa(unescape(encodeURIComponent(email)))}.${Date.now()}` };
}

export async function mockRegister(email, password) {
  await delay(450);
  if (!email || !password) throw new ApiError("Enter your email and password.", 400);
  if (password.length < 8) throw new ApiError("Password must be at least 8 characters.", 400);
  return { email, token: `mock.${btoa(unescape(encodeURIComponent(email)))}.${Date.now()}` };
}

export { ApiError };
