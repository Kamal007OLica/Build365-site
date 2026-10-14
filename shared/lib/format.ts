export const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
export const MOD = isMac ? '⌘' : 'Ctrl';
export const SHIFT = isMac ? '⇧' : 'Shift';
export const ALT = isMac ? '⌥' : 'Alt';

export function timeAgo(iso: string | null | undefined, now = Date.now()) {
  if (!iso) return '';
  const t = new Date(iso).getTime();
  const s = Math.round((now - t) / 1000);
  const future = s < 0;
  const a = Math.abs(s);
  const fmt = (n: number, u: string) => (future ? `in ${n}${u}` : `${n}${u} ago`);
  if (a < 45) return future ? 'soon' : 'just now';
  if (a < 3600) return fmt(Math.round(a / 60), 'm');
  if (a < 86400) return fmt(Math.round(a / 3600), 'h');
  if (a < 86400 * 7) return fmt(Math.round(a / 86400), 'd');
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function dueLabel(iso: string | null | undefined) {
  if (!iso) return null;
  const d = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso);
  const today = new Date();
  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const diff = Math.round((startOf(d) - startOf(today)) / 86_400_000);
  if (diff < 0) return { text: diff === -1 ? 'Yesterday' : `${-diff}d overdue`, tone: 'bad' as const };
  if (diff === 0) return { text: 'Today', tone: 'warn' as const };
  if (diff === 1) return { text: 'Tomorrow', tone: 'accent' as const };
  if (diff < 7) return { text: d.toLocaleDateString(undefined, { weekday: 'short' }), tone: 'outline' as const };
  return { text: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), tone: 'outline' as const };
}

export function fmtNumber(n: number, unit = '') {
  const abs = Math.abs(n);
  const s = abs >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : abs >= 1e4 ? `${(n / 1e3).toFixed(1)}k` : n.toLocaleString(undefined, { maximumFractionDigits: 1 });
  return unit ? (unit === '%' ? `${s}%` : `${s} ${unit}`) : s;
}

export function greeting(d = new Date()) {
  const h = d.getHours();
  return h < 5 ? 'Working late' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

export const initials = (name?: string | null) =>
  (name || '')
    .split(/\s+/)
    .filter((p) => /^[\p{L}\p{N}]/u.test(p))
    .map((p) => [...p][0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';

export const hostOf = (url: string | null | undefined) => {
  try {
    return url ? new URL(url).host.replace(/^www\./, '') : '';
  } catch {
    return '';
  }
};
