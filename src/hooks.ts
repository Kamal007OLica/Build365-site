import { useEffect, useRef, useState, type RefObject } from 'react';

const reduce = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/** True when the user asked the OS for less motion. Animations fall back to their end state. */
export function useReducedMotion() {
  const [r, setR] = useState(reduce);
  useEffect(() => {
    const m = matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setR(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, []);
  return r;
}

/** Becomes true (and stays true) the first time the element scrolls into view. */
export function useInView<T extends HTMLElement>(margin = '-12% 0px'): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(() => reduce() || typeof IntersectionObserver === 'undefined');
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), io.disconnect()), { rootMargin: margin, threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, [seen, margin]);
  return [ref, seen];
}

/** True while the element is on screen, false when it scrolls away. Use it to pause off-screen loops. */
export function useOnScreen<T extends HTMLElement>(): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, on];
}

/** 0 to 1 as the element passes through the viewport: 0 when its top meets the bottom edge, 1 when its bottom meets the top. */
export function useScrollProgress<T extends HTMLElement>(mode: 'through' | 'sticky' = 'through'): [RefObject<T | null>, number] {
  const ref = useRef<T>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const tick = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const v = mode === 'sticky' ? -r.top / Math.max(1, r.height - vh) : (vh - r.top) / (vh + r.height);
      setP(Math.min(1, Math.max(0, v)));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(tick); };
    tick();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); if (raf) cancelAnimationFrame(raf); };
  }, [mode]);
  return [ref, p];
}

/** Counts from 0 to `to` once `run` turns true. */
export function useCountUp(to: number, run: boolean, ms = 1100) {
  const [v, setV] = useState(reduce() ? to : 0);
  useEffect(() => {
    if (!run || reduce()) { if (reduce()) setV(to); return; }
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      setV(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, run, ms]);
  return v;
}

/** The current time, ticking every second. */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

/** Cycles 0..n-1 on a timer, paused while `active` is false or motion is reduced. */
export function useCycle(n: number, ms: number, active = true) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!active || reduce()) return;
    const id = setInterval(() => setI((x) => (x + 1) % n), ms);
    return () => clearInterval(id);
  }, [n, ms, active]);
  return i;
}

/** Pointer-tracking light for cards: sets --mx and --my on whichever card the pointer is over. One listener for the whole page. */
export function useSpotlight(selector: string) {
  useEffect(() => {
    if (reduce() || !matchMedia('(hover: hover)').matches) return;
    let raf = 0;
    const on = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.(selector) as HTMLElement | null;
      if (!el) return;
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    };
    document.addEventListener('pointermove', on, { passive: true });
    return () => { document.removeEventListener('pointermove', on); if (raf) cancelAnimationFrame(raf); };
  }, [selector]);
}

/** Eases a value toward its target each frame, so scroll-driven motion glides instead of stepping. */
export function useSmooth(target: number, ease = 0.11) {
  const [v, setV] = useState(target);
  const t = useRef(target);
  t.current = target;
  useEffect(() => {
    if (reduce()) { setV(target); return; }
    let raf = 0;
    const tick = () => {
      setV((cur) => {
        const next = cur + (t.current - cur) * ease;
        return Math.abs(t.current - next) < 0.0008 ? t.current : next;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return v;
}

/** Tracks a CSS media query. */
export function useMedia(query: string) {
  const [m, setM] = useState(() => typeof matchMedia !== 'undefined' && matchMedia(query).matches);
  useEffect(() => {
    const mq = matchMedia(query);
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return m;
}
