import { useMemo } from 'react';
import { StatusIcon } from '../../shared/components/icons';
import { useNow, useReducedMotion } from '../hooks';
import Reveal from '../ui/Reveal';

const R = 200;
const polar = (h: number, r: number) => { const a = (h / 24) * Math.PI * 2; return [Math.sin(a) * r, -Math.cos(a) * r] as const; };
const arc = (from: number, to: number, r: number) => {
  const [x1, y1] = polar(from, r), [x2, y2] = polar(to, r);
  return `M${x1.toFixed(1)} ${y1.toFixed(1)} A${r} ${r} 0 ${to - from > 12 ? 1 : 0} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
};

/** An example team over three time zones. Each shift is 9:00 to 17:30 local, drawn on one 24-hour dial in the viewer's time. */
const TEAM = [
  { city: 'Bengaluru', who: 'AD', tz: 'Asia/Kolkata', r: 170, c: 'var(--sun)', g: 'g-sun' },
  { city: 'Berlin', who: 'SR', tz: 'Europe/Berlin', r: 148, c: 'var(--amber)', g: 'g-amber' },
  { city: 'Austin', who: 'MK', tz: 'America/Chicago', r: 126, c: 'var(--green)', g: 'g-green' },
];
const SHIFT: [number, number] = [9, 17.5];

const RELAY = [
  { city: 'Bengaluru', who: 'AD', c: 'var(--sun)', time: '09:40 IST', text: 'Picks up B365-12 with the notes, the links and the Figma frame already attached.' },
  { city: 'Berlin', who: 'SR', c: 'var(--amber)', time: '14:10 CET', text: 'Reviews #248. The review cites the ticket and the diff, so nothing needs re-explaining.' },
  { city: 'Austin', who: 'MK', c: 'var(--green)', time: '16:52 CST', text: 'Deploys from the terminal. The changelog writes itself from what shipped.' },
];

/** The local hour (with minutes as a fraction) in a time zone. */
function hourIn(now: Date, tz: string) {
  const p = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(now);
  const h = Number(p.find((x) => x.type === 'hour')?.value ?? 0), m = Number(p.find((x) => x.type === 'minute')?.value ?? 0);
  return h + m / 60;
}
const fmt = (h: number) => `${String(Math.floor(h)).padStart(2, '0')}:${String(Math.round((h % 1) * 60)).padStart(2, '0')}`;

export default function Clock() {
  const now = useNow(1000);
  const still = useReducedMotion();
  const local = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  const [hx, hy] = polar(local, R - 4);
  const [h0x, h0y] = polar(local, 96);
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  // Each city's shift, converted into the viewer's hours so it lands in the right place on the dial.
  const shifts = useMemo(() => TEAM.map((t) => {
    const there = hourIn(now, t.tz);
    const offset = ((local - there) % 24 + 24) % 24; // viewer minus city, in hours
    const from = (SHIFT[0] + offset) % 24, to = from + (SHIFT[1] - SHIFT[0]);
    const on = there >= SHIFT[0] && there < SHIFT[1];
    const state = on ? 'On now' : there < SHIFT[0] ? `Starts ${fmt(SHIFT[0])}` : 'Handed off';
    return { ...t, there, from, to, on, state };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [Math.floor(now.getTime() / 60000)]);

  return (
    <section className="section clock" id="clock" aria-labelledby="clock-h">
      <div className="wrap">
        <div className="centered">
          <Reveal><p className="eyebrow"><span className="idx">05</span> Around the clock</p></Reveal>
          <Reveal delay={60}><h2 id="clock-h" className="xl">Work hands off.<br /><span className="dim-h">Nothing gets dropped.</span></h2></Reveal>
          <Reveal delay={120}><p className="section-lede">A lean team is rarely in one place or one time zone. Build 365 keeps the task, the notes, the pull request and the deploy in one thread, so whoever picks it up next starts with the whole story.</p></Reveal>
        </div>

        <div className="clock-grid">
          <Reveal className="clock-card" delay={100}>
            <svg className="clock-dial" viewBox="-236 -236 472 472" role="img" aria-label={`A 24-hour dial showing an example team in Bengaluru, Berlin and Austin covering the whole day. It is ${time} where you are.`}>
              <defs>
                <linearGradient id="g-sun" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f1ff00" /><stop offset="1" stopColor="#b8c21a" /></linearGradient>
                <linearGradient id="g-amber" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#ffc46b" /><stop offset="1" stopColor="#f08a2e" /></linearGradient>
                <linearGradient id="g-green" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#7fd6a4" /><stop offset="1" stopColor="#3ea36f" /></linearGradient>
              </defs>
              <circle r={R + 16} className="rim" />
              {Array.from({ length: 96 }, (_, i) => {
                const [x1, y1] = polar(i / 4, i % 4 ? R + 6 : R + 2), [x2, y2] = polar(i / 4, R + 12);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className={i % 4 ? 'tk' : 'tk hr'} />;
              })}
              {[0, 6, 12, 18].map((n) => { const [x, y] = polar(n, R + 28); return <text key={n} x={x} y={y} className="tk-n" textAnchor="middle" dominantBaseline="middle">{String(n).padStart(2, '0')}</text>; })}
              {shifts.map((s, i) => (
                <g key={s.city} className={s.on ? 'on' : ''}>
                  <path d={arc(0, 24 - 0.001, s.r)} className="track" />
                  <path d={arc(s.from, s.to, s.r)} className={`shift${still ? ' in' : ''}`} pathLength={1} style={{ stroke: `url(#${s.g})`, animationDelay: `${i * 220}ms` }} />
                </g>
              ))}
              <line x1={h0x} y1={h0y} x2={hx} y2={hy} className="hand" />
              <circle cx={hx} cy={hy} r="5.5" className="now-dot" />
            </svg>
            <div className="clock-time" aria-hidden="true"><b>{time}</b><span>where you are</span></div>
            <div className="tz-row" aria-hidden="true">
              {shifts.map((s) => (
                <div key={s.city} className={`tz${s.on ? ' on' : ''}`}>
                  <span><i style={{ background: s.c }} />{s.city}</span>
                  <b>{fmt(s.there)}</b>
                  <em>{s.state}</em>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal className="relay-card" delay={160}>
            <div className="relay-head"><StatusIcon status="done" size={15} /> <span className="mono">B365-12</span> <b>Ship the billing page</b> <em>Shipped in one day</em></div>
            <ol className="relay">
              {RELAY.map((r) => (
                <li key={r.city} className="relay-row">
                  <span className="relay-t">{r.time}</span>
                  <span className="relay-dot"><i style={{ background: r.c, boxShadow: `0 0 12px ${r.c}` }} /></span>
                  <div className="relay-body">
                    <b><span className="pw-av" style={{ background: r.c }}>{r.who}</span> {r.city}</b>
                    <p>{r.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="relay-foot">One thread. The task, the notes, the review and the deploy, in the order they happened.</div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
