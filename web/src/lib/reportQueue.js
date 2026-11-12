/**
 * Community reports that could not reach the server, kept in this browser until they can be sent.
 *
 * A report is queued only when the API was unreachable (ApiError status 0). It stays in localStorage,
 * so it survives closing the tab, and flushReportQueue() sends it when the browser is back online
 * (ReportQueueSync calls it on start-up and on the browser's "online" event). A report the server
 * refuses as invalid (4xx) is dropped, because sending it again would fail the same way. Any other
 * failure keeps it queued for the next attempt.
 */
import { submitReport, ApiError } from "./api.js";
import { markMyReportSent } from "./myReports.js";

const KEY = "scamshield_report_queue";
let flushing = false;

function readQueue() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeQueue(entries) {
  localStorage.setItem(KEY, JSON.stringify(entries));
}

/** Saves a report for later. Returns false if the browser blocks storage, so the caller can say so. */
export function queueReport({ message, category, language, email = null, myReportId = null }) {
  try {
    const entries = readQueue();
    entries.push({
      id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      message,
      category: category || null,
      language: language || null,
      email,
      myReportId,
      queuedAt: new Date().toISOString(),
    });
    writeQueue(entries);
    return true;
  } catch {
    return false;
  }
}

export function queuedReportCount() {
  return readQueue().length;
}

/** Sends every queued report once. Returns how many were sent and how many are still waiting. */
export async function flushReportQueue() {
  if (flushing) return { sent: 0, remaining: queuedReportCount() };
  flushing = true;
  let sent = 0;
  try {
    const remaining = [];
    for (const entry of readQueue()) {
      try {
        await submitReport(entry.message, entry.category || undefined, entry.language || undefined);
        sent += 1;
        if (entry.myReportId) markMyReportSent(entry.email, entry.myReportId);
      } catch (err) {
        const invalid = err instanceof ApiError && err.status >= 400 && err.status < 500;
        if (!invalid) remaining.push(entry);
      }
    }
    try {
      writeQueue(remaining);
    } catch {
      /* storage blocked: nothing more can be done here */
    }
    return { sent, remaining: remaining.length };
  } finally {
    flushing = false;
  }
}
