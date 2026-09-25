'use client';

// The last few address searches, kept in localStorage so they survive a
// reload. Entries are { label, center: [lng, lat] }, newest first and
// de-duped by label. Every read is defensive: a phone in private mode can
// throw on access, and the stored value is user-writable, so nothing here
// trusts its own shape.

const KEY = "fog:recent-locations";
export const MAX_RECENTS = 3;

const valid = r =>
  r && typeof r.label === "string" && r.label.trim().length > 0
  && Array.isArray(r.center) && r.center.length === 2
  && Number.isFinite(Number(r.center[0])) && Number.isFinite(Number(r.center[1]));

export function readRecents() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    return list
      .filter(valid)
      .map(r => ({ label: r.label, center: [Number(r.center[0]), Number(r.center[1])] }))
      .slice(0, MAX_RECENTS);
  } catch {
    return [];
  }
}

// Record a pick and return the new list, so the caller can set state from
// the same value that was written.
export function pushRecent(label, center) {
  const entry = { label, center };
  if (typeof window === "undefined" || !valid(entry)) return readRecents();
  const next = [
    { label, center: [Number(center[0]), Number(center[1])] },
    ...readRecents().filter(r => r.label !== label),
  ].slice(0, MAX_RECENTS);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  return next;
}
