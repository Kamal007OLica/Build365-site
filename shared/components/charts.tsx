import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { fmtNumber } from '../lib/format';

/** Single-series sparkline with a hover readout. */
export function Sparkline({ values, height = 44, unit = '', labels }: { values: number[]; height?: number; unit?: string; labels?: string[] }) {
  const id = useId();
  const [hover, setHover] = useState<number | null>(null);
  const W = 200;
  const H = height;
  const pad = 4;
  const { d, area, pts } = useMemo(() => {
    if (values.length < 2) return { d: '', area: '', pts: [] as [number, number][] };
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;
    const pts = values.map((v, i) => [(i / (values.length - 1)) * W, pad + (1 - (v - min) / span) * (H - pad * 2)] as [number, number]);
    const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
    return { d, area: `${d} L${W},${H} L0,${H} Z`, pts };
  }, [values, H]);
  if (!d) return <div style={{ height }} />;
  const p = hover != null ? pts[hover] : null;

  return (
    <div
      style={{ position: 'relative', height }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setHover(Math.round(((e.clientX - r.left) / r.width) * (values.length - 1)));
      }}
      onMouseLeave={() => setHover(null)}
    >
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" width="100%" height={H} style={{ display: 'block', overflow: 'visible' }} role="img" aria-label={`Trend, latest ${fmtNumber(values[values.length - 1], unit)}`}>
        <defs>
          <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--series)" stopOpacity="0.28" />
            <stop offset="1" stopColor="var(--series)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#${id})`} />
        <path d={d} fill="none" stroke="var(--series)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
        {p && <line x1={p[0]} x2={p[0]} y1={0} y2={H} stroke="var(--line-strong)" vectorEffect="non-scaling-stroke" />}
      </svg>
      {p && (
        <>
          <span className="spark-dot" style={{ left: `${(p[0] / W) * 100}%`, top: p[1] }} />
          <span className="chart-tip" style={{ left: `${(p[0] / W) * 100}%`, top: -8 }}>
            {labels?.[hover!] ? <span className="faint">{labels[hover!]} · </span> : null}
            {fmtNumber(values[hover!], unit)}
          </span>
        </>
      )}
    </div>
  );
}

/** Time-series area chart with y-axis gridlines and a crosshair tooltip. */
export function AreaChart({ data, height = 240, unit = '', label }: { data: { day: string; value: number }[]; height?: number; unit?: string; label: string }) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  // Draw at the real pixel width so axis text is never stretched.
  const [W, setW] = useState(800);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => e.contentRect.width > 0 && setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const H = height;
  const m = { l: 44, r: 12, t: 12, b: 26 };
  const values = data.map((d) => d.value);
  const max = Math.max(1, ...values);
  const niceMax = (() => {
    const p = Math.pow(10, Math.floor(Math.log10(max)));
    const n = [1, 2, 2.5, 5, 10].find((s) => s * p >= max)! * p;
    return n;
  })();
  const x = (i: number) => m.l + (i / Math.max(1, data.length - 1)) * (W - m.l - m.r);
  const y = (v: number) => m.t + (1 - v / niceMax) * (H - m.t - m.b);
  const line = data.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(' ');
  const area = data.length ? `${line} L${x(data.length - 1)},${y(0)} L${x(0)},${y(0)} Z` : '';
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * niceMax);
  const every = Math.max(1, Math.ceil(data.length / Math.max(2, Math.floor(W / 110))));
  const h = hover != null ? data[hover] : null;

  return (
    <div
      ref={ref}
      style={{ position: 'relative' }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const px = ((e.clientX - r.left) / r.width) * W;
        const i = Math.round(((px - m.l) / (W - m.l - m.r)) * (data.length - 1));
        setHover(i >= 0 && i < data.length ? i : null);
      }}
      onMouseLeave={() => setHover(null)}
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label={label} style={{ display: 'block' }}>
        <defs>
          <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--series)" stopOpacity="0.3" />
            <stop offset="1" stopColor="var(--series)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={m.l} x2={W - m.r} y1={y(t)} y2={y(t)} stroke="var(--line)" vectorEffect="non-scaling-stroke" />
            <text x={m.l - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="var(--text-3)">{fmtNumber(t)}</text>
          </g>
        ))}
        {data.map((d, i) =>
          i % every === 0 ? (
            <text key={d.day} x={x(i)} y={H - 6} textAnchor="middle" fontSize="11" fill="var(--text-3)">
              {new Date(d.day + 'T12:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </text>
          ) : null,
        )}
        <path d={area} fill={`url(#${id})`} />
        <path d={line} fill="none" stroke="var(--series)" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        {h && <line x1={x(hover!)} x2={x(hover!)} y1={m.t} y2={H - m.b} stroke="var(--line-strong)" vectorEffect="non-scaling-stroke" />}
      </svg>
      {h && (
        <>
          <span className="spark-dot" style={{ left: `${(x(hover!) / W) * 100}%`, top: (y(h.value) / H) * H }} />
          <span className="chart-tip" style={{ left: `${(x(hover!) / W) * 100}%`, top: 0 }}>
            <span className="faint">{new Date(h.day + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} · </span>
            {fmtNumber(h.value, unit)}
          </span>
        </>
      )}
    </div>
  );
}

/** Horizontal bars for a ranked list. Values are direct-labelled. */
export function BarList({ items, unit = '' }: { items: { label: string; value: number }[]; unit?: string }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div className="barlist">
      {items.map((it) => (
        <div key={it.label} className="barlist-row" title={`${it.label}: ${fmtNumber(it.value, unit)}`}>
          <div className="barlist-bar" style={{ width: `${(it.value / max) * 100}%` }} />
          <span className="barlist-label mono">{it.label}</span>
          <span className="barlist-value">{fmtNumber(it.value, unit)}</span>
        </div>
      ))}
    </div>
  );
}
