/**
 * Tiny classname joiner — accepts strings, arrays, and { class: boolean } maps.
 * Keeps the UI kit dependency-free (no clsx / tailwind-merge). Later duplicate
 * Tailwind classes are the caller's responsibility, which is fine for our usage
 * where variants are composed deliberately.
 */
export function cn(...parts) {
  const out = [];
  for (const p of parts) {
    if (!p) continue;
    if (typeof p === "string") out.push(p);
    else if (Array.isArray(p)) out.push(cn(...p));
    else if (typeof p === "object") {
      for (const key in p) if (p[key]) out.push(key);
    }
  }
  return out.join(" ");
}
