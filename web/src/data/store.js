/**
 * Thin async access layer over the fixture modules. Every getter returns a
 * Promise with a small delay so pages exercise real loading/empty/error states.
 * Swap these bodies for `fetch()` calls when the corresponding backend exists —
 * the page-facing signatures are intentionally API-shaped.
 */
import { ARTICLES, getArticle } from "./awareness.js";
import { ALERTS, getAlert } from "./alerts.js";
import { SCAM_CATEGORIES, getCategory } from "./scamCategories.js";
import { NOTIFICATIONS } from "./notifications.js";
import { QUIZ } from "./quiz.js";
import * as admin from "./admin.js";

function delay(ms = 420) {
  return new Promise((r) => setTimeout(r, ms));
}

/** Simple client-side paginate/filter/sort helper for fixture-backed tables. */
export function paginate(rows, { page = 1, pageSize = 10, sort } = {}) {
  let out = [...rows];
  if (sort?.key) {
    out.sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      if (av === bv) return 0;
      const cmp = av > bv ? 1 : -1;
      return sort.dir === "desc" ? -cmp : cmp;
    });
  }
  const total = out.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const p = Math.min(page, pageCount);
  const slice = out.slice((p - 1) * pageSize, p * pageSize);
  return { rows: slice, total, page: p, pageCount };
}

/* Public content */
export async function fetchArticles() {
  await delay();
  return ARTICLES;
}
export async function fetchArticle(slug) {
  await delay(300);
  return getArticle(slug);
}
export async function fetchAlerts() {
  await delay();
  return ALERTS;
}
export async function fetchAlert(id) {
  await delay(300);
  return getAlert(id);
}
export async function fetchCategories() {
  await delay(280);
  return SCAM_CATEGORIES;
}
export async function fetchCategory(slug) {
  await delay(280);
  return getCategory(slug);
}
export async function fetchQuiz() {
  await delay(300);
  return QUIZ;
}
export async function fetchNotifications() {
  await delay(360);
  return NOTIFICATIONS;
}

/* Admin */
export async function fetchAdmin(key) {
  await delay(400);
  return admin[key];
}
