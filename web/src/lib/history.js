/**
 * My History (per-account past checks) has no backend support yet — ClassifiedMessage rows
 * in the Flask DB aren't scoped to a user (see backend/routes/classify.py). Until a real
 * /api/history endpoint exists, entries are kept client-side, namespaced per mock account
 * email, so the History page has real (if non-durable) data to show instead of being faked
 * with static rows.
 */
const PREFIX = "scamshield_history_";

// Pages add, delete and clear entries while the portal layout stays on screen, so the layout's
// "Your checks" count listens for this event instead of reading the history once at sign-in.
const CHANGED = "scamshield:history-changed";

function keyFor(email) {
  return `${PREFIX}${email.toLowerCase()}`;
}

export function notifyHistoryChanged() {
  window.dispatchEvent(new Event(CHANGED));
}

/** Calls onChange whenever a history changes, in this tab or another one. Returns the unsubscribe function. */
export function subscribeHistory(onChange) {
  const onStorage = (e) => {
    if (!e.key || e.key.startsWith(PREFIX)) onChange();
  };
  window.addEventListener(CHANGED, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGED, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/** The stored history exactly as saved, used to tell whether it has changed. */
export function historySnapshot(email) {
  if (!email) return null;
  try {
    return localStorage.getItem(keyFor(email));
  } catch {
    return null;
  }
}

function read(email) {
  if (!email) return [];
  try {
    const raw = localStorage.getItem(keyFor(email));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(email, entries) {
  localStorage.setItem(keyFor(email), JSON.stringify(entries));
  notifyHistoryChanged();
}

export function getHistory(email) {
  return read(email).sort((a, b) => new Date(b.checked_at) - new Date(a.checked_at));
}

export function addHistoryEntry(email, { message, label, confidence, classification_id }) {
  if (!email) return;
  const entries = read(email);
  entries.push({
    id: classification_id ?? `local-${Date.now()}`,
    message,
    label,
    confidence,
    checked_at: new Date().toISOString(),
    feedback: null,
  });
  write(email, entries);
}

export function deleteHistoryEntry(email, id) {
  write(email, read(email).filter((e) => e.id !== id));
}

export function markHistoryFeedback(email, id, correct) {
  write(
    email,
    read(email).map((e) => (e.id === id ? { ...e, feedback: correct ? "correct" : "incorrect" } : e))
  );
}

export function clearHistory(email) {
  if (!email) return;
  localStorage.removeItem(keyFor(email));
  notifyHistoryChanged();
}
