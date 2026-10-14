import { useEffect, useId, useRef, useState } from 'react';

/**
 * The Build365 mark: the voice-orb ring. Tiles are born small at the bottom left, grow as they climb the ring and
 * fade away on the way back down the right. One linear gradient runs across the whole ring, from bright yellow-lime
 * (#F1FF00) at the top left to olive (#919900) at the bottom right. The shapes mirror VoiceOrb, frozen at one moment.
 * The favicon, extension icons, touch icons and share image are all generated from these constants by
 * site/scripts/make-icons.py, so change them together.
 */
const TILES = 24;
export const MARK_GRADIENT = { from: '#F1FF00', to: '#919900' };
const frac = (x: number) => x - Math.floor(x);
const envelope = (u: number) => Math.pow(Math.sin(Math.PI * Math.pow(frac(u), 0.75)), 1.3);

const TURN = 0.06, RADIUS = 32.5, TW = 5.9, TH = 13.4, GROW = 1.32;

export const ORB_TILES = Array.from({ length: TILES }, (_, i) => {
  const u = frac(i / TILES + TURN), a = u * Math.PI * 2, s = envelope(u) * GROW;
  return { i, x: 50 - Math.sin(a) * RADIUS, y: 50 + Math.cos(a) * RADIUS, rot: ((a - 0.35) * 180) / Math.PI, s };
}).filter((t) => t.s > 0.14);

export function OrbMark({ size = 28, plate = false }: { size?: number; plate?: boolean }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-g`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0" stopColor={MARK_GRADIENT.from} />
          <stop offset="1" stopColor={MARK_GRADIENT.to} />
        </linearGradient>
        <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
          {ORB_TILES.map((t) => (
            <rect key={t.i} x={-TW / 2} y={-TH / 2} width={TW} height={TH} rx="2.2" fill="#fff" opacity={Math.min(1, t.s * 1.6)} transform={`translate(${t.x.toFixed(2)} ${t.y.toFixed(2)}) rotate(${t.rot.toFixed(1)}) scale(${t.s.toFixed(3)})`} />
          ))}
        </mask>
      </defs>
      {plate && <rect width="100" height="100" rx="22" fill="#0d0d0a" />}
      <rect width="100" height="100" fill={`url(#${id}-g)`} mask={`url(#${id}-m)`} />
    </svg>
  );
}

/** One tile's pose at a given moment. `turn` rotates the envelope round the ring; `level` (0..1) makes tiles push out and swell, like a voice. */
export function tilePose(i: number, turn: number, level: number) {
  const u = frac(i / TILES + turn), a = u * Math.PI * 2, env = envelope(u), push = 1 + level * 0.16 * env, s = env * GROW * (1 + level * 0.35);
  return { x: 50 - Math.sin(a) * RADIUS * push, y: 50 + Math.cos(a) * RADIUS * push, rot: ((a - 0.35) * 180) / Math.PI, s, o: Math.min(1, s * 1.6) };
}
const tf = (p: ReturnType<typeof tilePose>) => `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) rotate(${p.rot.toFixed(1)}) scale(${Math.max(0.001, p.s).toFixed(3)})`;

const reducedMotion = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * The mark, alive: the ring turns and breathes the way the voice orb does. It draws only while on screen and falls back
 * to the still mark when the visitor prefers reduced motion. `boost` spins it faster and makes it pulse harder.
 */
export function AnimatedMark({ size = 28, plate = false, speed = 0.04, pulse = 0.3, boost = false, className }: { size?: number; plate?: boolean; speed?: number; pulse?: number; boost?: boolean; className?: string }) {
  const id = useId().replace(/:/g, '');
  const svg = useRef<SVGSVGElement>(null);
  const rects = useRef<(SVGRectElement | null)[]>([]);
  const live = useRef({ speed, pulse, boost });
  live.current = { speed, pulse, boost };
  const [still] = useState(reducedMotion);

  useEffect(() => {
    if (still || !svg.current) return;
    let raf = 0, visible = false, turn = TURN, level = 0, last = performance.now();
    const t0 = last;
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { speed: sp, pulse: pl, boost: bo } = live.current;
      const t = (now - t0) / 1000;
      const voice = Math.max(0, Math.sin(t * 1.7) * 0.6 + Math.sin(t * 0.7 + 1) * 0.5) * (0.6 + 0.4 * Math.abs(Math.sin(t * 9)));
      level += (Math.min(1, voice * pl * (bo ? 2.6 : 1)) - level) * Math.min(1, dt * 7);
      turn = (turn + dt * (sp * (bo ? 5 : 1) + level * 0.22)) % 1;
      for (let i = 0; i < TILES; i++) {
        const el = rects.current[i];
        if (!el) continue;
        const p = tilePose(i, turn, level);
        el.setAttribute('transform', tf(p));
        el.setAttribute('opacity', p.s > 0.05 ? String(p.o) : '0');
      }
      raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
      else if (!visible && raf) { cancelAnimationFrame(raf); raf = 0; }
    });
    io.observe(svg.current);
    return () => { io.disconnect(); if (raf) cancelAnimationFrame(raf); };
  }, [still]);

  if (still) return <OrbMark size={size} plate={plate} />;
  const start = Array.from({ length: TILES }, (_, i) => tilePose(i, TURN, 0));
  return (
    <svg ref={svg} className={className} width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-g`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0" stopColor={MARK_GRADIENT.from} />
          <stop offset="1" stopColor={MARK_GRADIENT.to} />
        </linearGradient>
        <mask id={`${id}-m`} maskUnits="userSpaceOnUse" x="-20" y="-20" width="140" height="140">
          {start.map((p, i) => (
            <rect key={i} ref={(el) => { rects.current[i] = el; }} x={-TW / 2} y={-TH / 2} width={TW} height={TH} rx="2.2" fill="#fff" opacity={p.s > 0.05 ? p.o : 0} transform={tf(p)} />
          ))}
        </mask>
      </defs>
      {plate && <rect width="100" height="100" rx="22" fill="#0d0d0a" />}
      <rect x="-20" y="-20" width="140" height="140" fill={`url(#${id}-g)`} mask={`url(#${id}-m)`} />
    </svg>
  );
}
