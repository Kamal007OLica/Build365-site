import { useEffect, useRef, type MutableRefObject } from 'react';
import { Pause, Play } from 'lucide-react';

const TILES = 24, SIZE = 220, RADIUS = 72, TW = 15, TH = 24, TAU = Math.PI * 2;
const HOLO = ['#f5d547', '#ffa94d', '#ff6f91', '#d66bff', '#8f7bff', '#4e7cff', '#3fd0e0'].map((h) => [0, 2, 4].map((o) => parseInt(h.slice(1 + o, 3 + o), 16)));

const frac = (x: number) => x - Math.floor(x);
const envelope = (u: number) => Math.pow(Math.sin(Math.PI * Math.pow(frac(u), 0.75)), 1.3);
const sample = (t: number) => {
  const p = frac(t) * HOLO.length, i = Math.floor(p), k = p - i, a = HOLO[i % HOLO.length], b = HOLO[(i + 1) % HOLO.length];
  return a.map((v, c) => Math.round(v + (b[c] - v) * k));
};
const rgba = (c: number[], a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

/** Tiles are born at the bottom, grow as they climb the ring, then shrink away on the way back down. */
function pose(i: number, turn: number, level: number, sweep: number | null) {
  const u = frac(i / TILES + turn), a = u * TAU, size = envelope(u), push = 1 + level * 0.16 * size;
  const glow = sweep === null ? 0 : Math.pow(1 - frac(sweep - u), 6);
  return { x: -Math.sin(a) * push, y: Math.cos(a) * push, rotate: a - 0.35, scale: size * (1 + level * 0.35), alpha: Math.min(1, size * 1.6), glow };
}

/**
 * The voice note orb. `level` (0..1) is written by the mic analyser every frame; the canvas reads it
 * without re-rendering React. The centre button pauses and resumes.
 */
export default function VoiceOrb({ level, paused, recording, time, onToggle }: { level: MutableRefObject<number>; paused: boolean; recording: boolean; time: string; onToggle: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const flags = useRef({ paused, recording });
  flags.current = { paused, recording };

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx) return;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0, last = performance.now(), turn = 0, sweep = 0, smooth = 0, speaking = 0, dpr = 0;
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { paused: p, recording: rec } = flags.current;
      const target = p || !rec ? 0 : level.current;
      smooth += (target - smooth) * Math.min(1, dt * 12);
      speaking += ((smooth > 0.14 ? 1 : 0) - speaking) * Math.min(1, dt * 4);
      if (!still) {
        turn = (turn + dt * (p || !rec ? 0.035 : 0.07 + smooth * 0.55)) % 1;
        sweep = (sweep + dt * (0.9 + smooth * 0.6)) % 1;
      }
      const r = window.devicePixelRatio || 1;
      if (r !== dpr) {
        dpr = r;
        el.width = SIZE * dpr;
        el.height = SIZE * dpr;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, SIZE, SIZE);
      const dim = p || !rec ? 0.55 : 1, shift = now / 40000;
      for (let i = 0; i < TILES; i++) {
        const t = pose(i, turn, smooth, speaking > 0.02 ? sweep : null);
        if (t.scale < 0.03) continue;
        const c1 = sample(i / TILES + shift), c2 = sample(i / TILES + shift + 0.22), glow = t.glow * speaking;
        ctx.save();
        ctx.translate(SIZE / 2 + t.x * RADIUS, SIZE / 2 + t.y * RADIUS);
        ctx.rotate(t.rotate);
        const s = t.scale * (1 + glow * 0.18);
        ctx.scale(s, s);
        ctx.globalAlpha = t.alpha * dim;
        ctx.shadowColor = rgba(c1, 0.55 + glow * 0.4);
        ctx.shadowBlur = 10 + glow * 14;
        const g = ctx.createLinearGradient(-TW / 2, -TH / 2, TW / 2, TH / 2);
        g.addColorStop(0, rgba(c1));
        g.addColorStop(1, rgba(c2));
        ctx.beginPath();
        ctx.roundRect(-TW / 2, -TH / 2, TW, TH, 4);
        ctx.fillStyle = g;
        ctx.fill();
        ctx.shadowBlur = 0;
        const sh = ctx.createLinearGradient(-TW / 2, -TH / 2, TW / 4, TH / 4);
        sh.addColorStop(0, `rgba(255,255,255,${0.55 + glow * 0.35})`);
        sh.addColorStop(0.45, 'rgba(255,255,255,0.08)');
        sh.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = sh;
        ctx.fill();
        ctx.restore();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [level]);

  return (
    <div className="voice-orb">
      <canvas ref={canvas} aria-hidden="true" />
      <div className="voice-orb-centre">
        <button type="button" className={`voice-orb-toggle${paused ? ' paused' : ''}`} onClick={onToggle} disabled={!recording} aria-label={paused ? 'Resume' : 'Pause'}>
          {paused ? <Play /> : <Pause />}
          <span>{time}</span>
        </button>
      </div>
    </div>
  );
}
