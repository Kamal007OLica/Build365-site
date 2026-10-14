import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProgressPie } from './icons';
import type { VisionItem } from '../lib/types';

const DAY = 86_400_000;
const ROW = 76;
const PX_MAX = 14; // pixels per day on a short roadmap
const PX_MIN = 3.2; // below this the bars stop being readable, so scroll instead
const HUE = ['var(--accent)', 'var(--purple)', 'var(--orange)', 'var(--green)'];

const parse = (d: string) => new Date(`${d.slice(0, 10)}T00:00:00`).getTime();
const startOfDay = (t: number) => new Date(new Date(t).setHours(0, 0, 0, 0)).getTime();

type Milestone = VisionItem['milestones'][number];

/** Drop the name of any milestone that would sit on top of the one before it. */
function labelMilestones(milestones: Milestone[], px: number) {
  const sorted = [...milestones].sort((a, b) => a.date.localeCompare(b.date));
  let lastLabelled = -Infinity;
  return sorted.map((m) => {
    const at = parse(m.date) / DAY * px;
    const label = at - lastLabelled >= 86;
    if (label) lastLabelled = at;
    return { m, label };
  });
}

/** Roadmap timeline: month and week scale, one bar per goal, milestone diamonds and a today line. */
export default function Timeline({ items, onOpen }: { items: VisionItem[]; onOpen: (v: VisionItem) => void }) {
  const scroller = useRef<HTMLDivElement>(null);
  const today = startOfDay(Date.now());

  const { from, days } = useMemo(() => {
    const starts = items.map((i) => parse(i.startDate));
    const ends = items.map((i) => parse(i.targetDate));
    let from = Math.min(today - 21 * DAY, ...starts) - 7 * DAY;
    // Start on a Monday so week ticks line up.
    const dow = (new Date(from).getDay() + 6) % 7;
    from -= dow * DAY;
    const to = Math.max(today + 90 * DAY, ...ends) + 21 * DAY;
    return { from, days: Math.round((to - from) / DAY) };
  }, [items, today]);

  // Fit the whole roadmap into the card when it can be fitted. A fixed scale meant a goal
  // starting a few months out sat off the right edge with nothing on screen to say so.
  const [vw, setVw] = useState(0);
  const PX = vw ? Math.min(PX_MAX, Math.max(PX_MIN, vw / days)) : PX_MAX;

  const x = (t: number) => ((t - from) / DAY) * PX;
  const todayX = x(today);

  // Most of the roadmap sits outside the card, so say so: fade the edge that has more
  // timeline behind it, and offer a way back to today once it has scrolled out of sight.
  const [edge, setEdge] = useState({ left: false, right: false, today: null as 'left' | 'right' | null });
  const sync = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdge({
      left: el.scrollLeft > 2,
      right: el.scrollLeft < max - 2,
      today: todayX < el.scrollLeft + 28 ? 'left' : todayX > el.scrollLeft + el.clientWidth - 28 ? 'right' : null,
    });
  }, [todayX]);

  const centreOnToday = () => {
    const el = scroller.current;
    if (!el) return;
    el.scrollTo({ left: Math.max(0, todayX - el.clientWidth * 0.35), behavior: 'smooth' });
  };

  useLayoutEffect(() => {
    const el = scroller.current;
    if (el) {
      // Centre on today, but never scroll past the first goal's label.
      const first = Math.min(...items.map((v) => new Date(`${v.startDate.slice(0, 10)}T12:00:00`).getTime()));
      el.scrollLeft = Math.max(0, Math.min(todayX - el.clientWidth * 0.3, x(first) - 12));
    }
    sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from]);

  // The card shares its row with the launchpad, so its width changes with the window.
  useLayoutEffect(() => {
    const el = scroller.current;
    if (!el) return;
    setVw(el.clientWidth);
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      setVw(el.clientWidth);
      sync();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [sync]);

  const weeks: number[] = [];
  const months: { t: number; label: string }[] = [];
  for (let i = 0; i <= days; i++) {
    const t = from + i * DAY;
    const d = new Date(t);
    if (d.getDay() === 1) weeks.push(t);
    if (d.getDate() === 1) months.push({ t, label: d.toLocaleDateString(undefined, { month: 'short' }).toUpperCase() });
  }
  // Every week still gets a grid line; only the numbers thin out as the scale tightens.
  const labelEvery = PX * 7 >= 44 ? 1 : PX * 7 >= 24 ? 2 : 4;
  const width = days * PX;
  const monthsShown = months.filter((m) => x(m.t) < width - 38);
  const labelled = (ms: Milestone[]) => labelMilestones(ms, PX);
  const height = Math.max(1, items.length) * ROW + 24;

  return (
    <div className={`tl-wrap${edge.left ? ' edge-l' : ''}${edge.right ? ' edge-r' : ''}`}>
      <div className="timeline" ref={scroller} onScroll={sync} tabIndex={0} role="group" aria-label="Roadmap timeline, scrolls sideways">
        <div className="tl-canvas" style={{ width, height: height + 56 }}>
          <div className="tl-scale">
            {monthsShown.map((m) => (
              <span key={m.t} className="tl-month" style={{ left: x(m.t) }}>{m.label}</span>
            ))}
            {weeks.map((w, i) => (
              i % labelEvery ? null : <span key={w} className="tl-week" style={{ left: x(w) }}>{new Date(w).getDate()}</span>
            ))}
          </div>
          <div className="tl-grid" style={{ height }}>
            {months.map((m) => <i key={m.t} className="tl-line month" style={{ left: x(m.t) }} />)}
            {weeks.map((w) => <i key={w} className="tl-line" style={{ left: x(w) }} />)}
            <i className="tl-today" style={{ left: todayX }}><b>Today</b></i>
            {items.map((v, row) => {
              const s = parse(v.startDate);
              const e = parse(v.targetDate) + DAY;
              const late = e <= today && v.progress < 100;
              const lateFrom = late ? Math.max(s, e - Math.max(7, Math.round((today - e) / DAY)) * DAY) : e;
              const color = HUE[v.hue % HUE.length];
              return (
                <div key={v.id} className="tl-row" style={{ top: row * ROW + 12 }}>
                  <button className="tl-name" style={{ left: x(s) }} onClick={() => onOpen(v)}>
                    <ProgressPie value={v.progress} color={color} />
                    <span>{v.title}</span>
                    <span className="faint">{v.progress}%</span>
                  </button>
                  <button className="tl-bar" style={{ left: x(s), width: Math.max(PX * 2, x(e) - x(s)) }} onClick={() => onOpen(v)} aria-label={`${v.title}, ${v.startDate} to ${v.targetDate}`}>
                    <i className="tl-fill" style={{ width: `${v.progress}%`, background: color }} />
                    {late && <i className="tl-late" style={{ left: x(lateFrom) - x(s), right: 0 }} />}
                    {labelled(v.milestones).map(({ m, label }) => {
                      const mt = parse(m.date);
                      const past = mt < today;
                      return (
                        <span key={m.name + m.date} className="tl-ms" style={{ left: x(mt) - x(s) }} title={`${m.name} · ${new Date(mt).toLocaleDateString()}`}>
                          <i className={past ? 'past' : ''} />
                          {label && <em>{m.name}</em>}
                        </span>
                      );
                    })}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {edge.today && (
        <button className={`tl-jump ${edge.today}`} onClick={centreOnToday} title="Scroll back to today">
          {edge.today === 'left' && <ChevronLeft size={12} />}
          Today
          {edge.today === 'right' && <ChevronRight size={12} />}
        </button>
      )}
    </div>
  );
}
