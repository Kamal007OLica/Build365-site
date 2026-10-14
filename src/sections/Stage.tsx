import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useReducedMotion } from '../hooks';
import ProductApp, { APP_H, APP_W } from '../ui/ProductApp';
import Marquee from './Marquee';
import AppleMark from '../ui/AppleMark';

/**
 * The opening of the site: a 9000px scroll track with the viewport pinned to one stage. The product sits in a
 * "camera" that the scroll drives: it rests under the headline, pulls back to show the whole window, then flies into
 * four parts of the app while a caption and a shade frame each one, and finally pulls back out. The window is live
 * DOM, so the story can change it as the camera arrives: a goal ships, the assistant answers, the terminal deploys.
 *
 * Scroll is smoothed toward the real position every frame, so trackpads, wheels and fingers all read as one glide.
 */
type Step = { id: string; cap: 'left' | 'right'; from: number; to: number; kicker: string; title: string; body: string };
export const STEPS: Step[] = [
  { id: 'sidebar', cap: 'right', from: 0.14, to: 0.3, kicker: 'Workspace', title: 'Every tool, one click away.', body: 'Inbox, dashboard, tasks, whiteboard, knowledge, Figma, Claude, GitHub, analytics and a launch desk, in one sidebar. No tab juggling, no context lost between them.' },
  { id: 'week', cap: 'left', from: 0.35, to: 0.51, kicker: 'Dashboard', title: 'Plan the whole week. Not just the next task.', body: 'Your top three, the numbers you move and a roadmap you can actually read, before your first coffee. When something ships, it turns green right here.' },
  { id: 'ask', cap: 'right', from: 0.56, to: 0.74, kicker: 'Ask Build 365', title: 'Ask once. Get answers with sources.', body: 'One question searches tasks, docs, pull requests, designs and metrics, and cites where every line came from. It is docked on every screen, a ⌘I away.' },
  { id: 'terminal', cap: 'left', from: 0.79, to: 0.94, kicker: 'Terminal', title: 'Hand the task to Claude, in your repo.', body: 'Press ⌘J. Claude Code works in your workspace folder with your CLAUDE.md, agents and skills already loaded, then deploys from the same drawer.' },
];
const WHOLE = 0.07;

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

type Shot = { s: number; tx: number; ty: number };
type Rect = { x: number; y: number; w: number; h: number };

export default function Stage() {
  const still = useReducedMotion();
  const mw = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const camera = useRef<HTMLDivElement>(null);
  const app = useRef<HTMLDivElement>(null);
  const intro = useRef<HTMLDivElement>(null);
  const dots = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (still) return;
    const M = mw.current!, S = stage.current!, C = camera.current!, A = app.current!, I = intro.current!, D = dots.current!;
    const shade = { right: S.querySelector<HTMLElement>('[data-shade="right"]')!, left: S.querySelector<HTMLElement>('[data-shade="left"]')! };
    const caps = Object.fromEntries([...S.querySelectorAll<HTMLElement>('.cap')].map((c) => [c.dataset.step!, c]));
    const dotEls = [...D.querySelectorAll<HTMLElement>('button')];
    const turns = [...A.querySelectorAll<HTMLElement>('[data-turn]')];
    const workers = [...A.querySelectorAll<HTMLElement>('[data-worker]')];
    const navs = [...A.querySelectorAll<HTMLElement>('[data-nav]')];
    const beats = { ship: A.querySelector<HTMLElement>('[data-beat="ship"]'), toast: A.querySelector<HTMLElement>('[data-beat="toast"]'), progress: A.querySelector<HTMLElement>('[data-beat-text="progress"]') };
    // Inner scroll areas never catch a wheel or a finger: the page always scrolls.
    A.querySelectorAll<HTMLElement>('*').forEach((el) => { const cs = getComputedStyle(el); if (/(auto|scroll)/.test(cs.overflowY + cs.overflowX)) el.style.overflow = 'hidden'; });

    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    let rects: Record<string, Rect | null> = {}, keys: [number, Shot][] = [], vw = 0, vh = 0, travel = 1, idle = 0, dirty = true;
    const prev = new Map<HTMLElement, Record<string, string>>();
    const set = (el: HTMLElement | null, prop: string, v: string) => { if (!el) return; const m = prev.get(el) || {}; if (m[prop] !== v) { m[prop] = v; prev.set(el, m); (el.style as unknown as Record<string, string>)[prop] = v; } };

    /** Where each framed part sits, in the window's own 1440×900 pixels. Read with the camera at rest. */
    function measure() {
      const was = C.style.transform; C.style.transform = 'none'; C.dataset.live = '';
      const base = A.getBoundingClientRect(), k = base.width / APP_W;
      const rect = (sel: string): Rect | null => { const r = A.querySelector(sel)?.getBoundingClientRect(); return r ? { x: (r.left - base.left) / k, y: (r.top - base.top) / k, w: r.width / k, h: r.height / k } : null; };
      const side = rect('[data-part="sidebar"]'), week = rect('[data-part="week"]'), ask = rect('[data-part="ask"]'), term = rect('[data-part="terminal"]');
      rects = {
        sidebar: side && { x: side.x, y: 0, w: side.w + 20, h: 560 },
        week: week && { x: week.x - 8, y: week.y - 48, w: week.w + 16, h: 470 },
        ask: ask && { x: ask.x - 10, y: ask.y - 40, w: ask.w + 20, h: 560 },
        terminal: term && { x: term.x + 20, y: term.y - 6, w: Math.min(term.w, 700), h: term.h + 12 },
      };
      C.style.transform = was;
    }
    /** The transform that puts rect r in the middle of screen region g, never closer than `max`. */
    const shot = (r: Rect, g: Rect, max: number): Shot => { const s = Math.min(max, g.w / r.w, g.h / r.h); return { s, tx: g.x + g.w / 2 - (r.x + r.w / 2) * s, ty: g.y + g.h / 2 - (r.y + r.h / 2) * s }; };
    function shots() {
      const mobile = vw < 760;
      const fit = Math.min((vw - 48) / APP_W, (vh - 120) / APP_H);
      const whole: Shot = { s: fit, tx: (vw - APP_W * fit) / 2, ty: (vh - APP_H * fit) / 2 + 24 };
      const heroScale = Math.min(1240, vw - 48) / APP_W;
      const rest: Shot = { s: heroScale, tx: (vw - APP_W * heroScale) / 2, ty: I.offsetTop + I.offsetHeight + (mobile ? 32 : 52) };
      const L: Rect = mobile ? { x: 12, y: 76, w: vw - 24, h: vh * 0.5 } : { x: vw * 0.04, y: 84, w: vw * 0.54, h: vh - 150 };
      const R: Rect = mobile ? L : { x: vw * 0.42, y: 84, w: vw * 0.56, h: vh - 150 };
      const regions: Record<string, [Rect, number]> = mobile
        ? { sidebar: [L, 1.3], week: [L, 1.1], ask: [L, 1.15], terminal: [L, 1.1] }
        : { sidebar: [L, 1.9], week: [R, 1.3], ask: [L, 1.45], terminal: [R, 1.45] };
      const k: [number, Shot][] = [[0, rest], [WHOLE, whole]];
      for (const st of STEPS) {
        const [g, max] = regions[st.id];
        const v = rects[st.id] ? shot(rects[st.id]!, g, max) : whole;
        // The terminal is a drawer: it reads best docked to the bottom of the screen, like the real one.
        if (st.id === 'terminal' && !mobile) v.ty = Math.max(v.ty, vh - 28 - APP_H * v.s);
        k.push([st.from, v], [st.to, v]);
      }
      k.push([1, whole]);
      return k;
    }
    function layout() {
      vw = M.clientWidth; vh = S.clientHeight;
      travel = Math.max(1, M.offsetHeight - vh);
      measure(); keys = shots(); dirty = false;
    }

    function render(p: number) {
      let i = 0;
      while (i < keys.length - 2 && p > keys[i + 1][0]) i++;
      const [p0, a] = keys[i], [p1, b] = keys[i + 1];
      const t = ease(clamp((p - p0) / (p1 - p0 || 1)));
      C.dataset.live = '';
      C.style.transform = `translate3d(${a.tx + (b.tx - a.tx) * t}px,${a.ty + (b.ty - a.ty) * t}px,0) scale(${a.s + (b.s - a.s) * t})`;
      const out = Math.round(clamp(p / (WHOLE * 0.8)) * 200) / 200;
      set(I, 'opacity', String(1 - out));
      set(I, 'transform', `translateY(${-60 * out}px)`);
      set(I, 'visibility', out >= 1 ? 'hidden' : '');
      A.classList.toggle('story', p > WHOLE + 0.03 && p < 0.97);
      // Beats: the sidebar lights up item by item, the first goal ships, the assistant answers, the terminal deploys.
      const [sb, wk, ask, term] = STEPS;
      // A highlight travels down the sidebar, two items wide, while the camera is on it.
      const sweep = ((p - sb.from - 0.02) / (sb.to - sb.from - 0.04)) * navs.length;
      navs.forEach((el, n) => el.classList.toggle('lit', sweep - n > 0 && sweep - n < 2.2));
      const shipped = p > wk.from + 0.06;
      beats.ship?.classList.toggle('shipped', shipped);
      if (beats.progress) beats.progress.textContent = shipped ? '0' : '1';
      turns.forEach((el, n) => el.classList.toggle('shown', p > ask.from + ((ask.to - ask.from) * 0.8 * (n + 0.25)) / turns.length));
      workers.forEach((el, n) => el.classList.toggle('shown', p > term.from + ((term.to - term.from) * 0.78 * (n + 0.3)) / workers.length));
      beats.toast?.classList.toggle('in', p > term.to - 0.02 && p < 0.995);
      let right = 0, left = 0, on = -1;
      STEPS.forEach((st, n) => {
        const c = caps[st.id]; if (!c) return;
        const o = Math.round(Math.min(clamp((p - st.from) / 0.025), clamp((st.to - p) / 0.025)) * 100) / 100;
        if (o > 0.5) on = n;
        set(c, 'opacity', String(o));
        set(c, 'transform', `translateY(calc(${vw < 760 ? '0%' : '-50%'} + ${(1 - o) * 18}px))`);
        if (st.cap === 'right') right = Math.max(right, o); else left = Math.max(left, o);
      });
      set(shade.right, 'opacity', String(right)); set(shade.left, 'opacity', String(left));
      set(D, 'opacity', String(clamp((p - WHOLE) / 0.04) * clamp((0.995 - p) / 0.03)));
      dotEls.forEach((d, n) => d.classList.toggle('on', n === on));
      // Desktop: its own layer only while moving, so text re-renders sharp when still. Touch keeps the layer (CSS).
      if (fine) { C.classList.add('moving'); clearTimeout(idle); idle = window.setTimeout(() => C.classList.remove('moving'), 260); }
    }

    // Smoothed progress: the story eases toward the real scroll position with a short time constant, and the loop
    // runs only while there is distance left to cover.
    const TAU = fine ? 70 : 110;
    let target = 0, shown = 0, started = false, running = false, lastT = 0, raf = 0;
    const readTarget = () => { target = clamp(-M.getBoundingClientRect().top / travel); };
    function loop(now: number) {
      running = false;
      if (dirty) layout();
      readTarget();
      if (!started) { shown = target; started = true; }
      else {
        const dt = lastT ? Math.min(64, now - lastT) : 16;
        shown += (target - shown) * (1 - Math.exp(-dt / TAU));
        if (Math.abs(target - shown) < 0.0002) shown = target;
      }
      lastT = now;
      render(shown);
      if (shown !== target) { running = true; raf = requestAnimationFrame(loop); } else lastT = 0;
    }
    const request = () => { if (!running) { running = true; raf = requestAnimationFrame(loop); } };
    const ro = new ResizeObserver(() => { dirty = true; request(); });
    ro.observe(M); ro.observe(S); ro.observe(I);
    addEventListener('scroll', request, { passive: true });
    addEventListener('resize', request);
    const jump = (e: Event) => {
      const n = Number((e.currentTarget as HTMLElement).dataset.n);
      const st = STEPS[n];
      window.scrollTo({ top: M.offsetTop + ((st.from + st.to) / 2) * travel, behavior: 'smooth' });
    };
    dotEls.forEach((d) => d.addEventListener('click', jump));

    layout(); readTarget(); shown = target; started = true; render(shown);
    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    fontsReady.then(() => { dirty = true; request(); });
    return () => {
      ro.disconnect(); removeEventListener('scroll', request); removeEventListener('resize', request);
      dotEls.forEach((d) => d.removeEventListener('click', jump));
      cancelAnimationFrame(raf); clearTimeout(idle);
    };
  }, [still]);

  const explore = (e: React.MouseEvent) => {
    const t = document.getElementById('features');
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <section className={`mw${still ? ' static' : ''}`} id="top" ref={mw} aria-label="Build 365, the workspace">
      <div className="stage" ref={stage}>
        <div className="stage-glow" aria-hidden="true" />
        <div className="lead" ref={intro}>
          <a className="pill-link" href="#native"><i className="live-dot" /> Now native on macOS <ChevronRight size={14} /></a>
          <h1>Dev tools for lean teams.<br /><span className="dim-h">Shipping around the clock.</span></h1>
          <p className="lede">One calm, keyboard-first workspace for tasks, roadmap, whiteboard, docs, GitHub, Figma and analytics, with <b>an AI that answers across all of it</b>. It runs on your machine.</p>
          <div className="ctas">
            <a className="btn-s primary lg" href="#native"><AppleMark /> Get Build 365 for Mac</a>
            <a className="btn-s lg quiet" href="#features" onClick={explore}>Explore the platform <ArrowRight size={15} /></a>
          </div>
          <Marquee compact />
        </div>

        <div className="camera" ref={camera} style={{ '--aw': `${APP_W}px`, '--ah': `${APP_H}px` } as CSSProperties}>
          <ProductApp ref={app} />
        </div>

        <div className="shade right" data-shade="right" aria-hidden="true" />
        <div className="shade left" data-shade="left" aria-hidden="true" />
        {STEPS.map((s, n) => (
          <div key={s.id} className={`cap ${s.cap}`} data-step={s.id}>
            <p className="kicker"><span className="idx">{String(n + 1).padStart(2, '0')}</span> {s.kicker}</p>
            <h2>{s.title}</h2>
            <p>{s.body}</p>
          </div>
        ))}
        <div className="stage-dots" ref={dots} aria-hidden="true">
          {STEPS.map((s, n) => <button key={s.id} type="button" tabIndex={-1} data-n={n}><i /><span>{s.kicker}</span></button>)}
        </div>
      </div>
      {still && (
        <div className="wrap static-caps">
          {STEPS.map((s, n) => (
            <div key={s.id} className="cap">
              <p className="kicker"><span className="idx">{String(n + 1).padStart(2, '0')}</span> {s.kicker}</p>
              <h2>{s.title}</h2>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
