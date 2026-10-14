import { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, ChevronRight, File, Folder } from 'lucide-react';
import VoiceOrb from '../../shared/components/VoiceOrb';
import { Sparkline } from '../../shared/components/charts';
import { LabelPill, PriorityIcon, StatusIcon, type Status } from '../../shared/components/icons';
import { useCycle, useOnScreen, useReducedMotion } from '../hooks';

/** Live product visuals shared by the platform panels and the feature cards. Each one animates only while on screen. */
type Task = { key: string; title: string; label: string; priority: number };
const TASKS: Task[] = [
  { key: 'B365-21', title: 'Onboarding checklist', label: 'Design', priority: 2 },
  { key: 'B365-22', title: 'Rate-limit the export API', label: 'Bug', priority: 1 },
  { key: 'B365-23', title: 'Write the launch post', label: 'Launch', priority: 3 },
  { key: 'B365-24', title: 'Invite the first ten teams', label: 'Growth', priority: 3 },
];
const CYCLE: Status[] = ['todo', 'doing', 'done'];

export function TaskCard() {
  const [ref, on] = useOnScreen<HTMLDivElement>();
  const tick = useCycle(12, 1300, on);
  const status = (i: number): Status => CYCLE[Math.min(2, Math.max(0, Math.floor((tick - i * 2 + 12) % 12 / 2) % 3))];
  return (
    <div className="mini rows" ref={ref} aria-hidden="true">
      {TASKS.map((t, i) => (
        <div key={t.key} className="mini-row">
          <PriorityIcon priority={t.priority} size={13} /><span className="k">{t.key}</span><StatusIcon status={status(i)} size={13} /><span className="t">{t.title}</span><LabelPill name={t.label} />
        </div>
      ))}
    </div>
  );
}

export function Capture() {
  const [ref, on] = useOnScreen<HTMLDivElement>();
  const still = useReducedMotion();
  const level = useRef(0);
  const [words, setWords] = useState(still ? 8 : 0);
  useEffect(() => {
    if (!on || still) return;
    let raf = 0;
    const t0 = performance.now();
    const loop = (t: number) => {
      const s = (t - t0) / 1000;
      level.current = Math.max(0, Math.sin(s * 2.3) * 0.6 + Math.sin(s * 0.9 + 1) * 0.5) * (0.55 + 0.45 * Math.abs(Math.sin(s * 11))) * 0.9;
      setWords(Math.min(8, Math.floor(s * 1.6) % 14));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [on, still]);
  const phrase = 'Remind me to review the billing copy before Thursday'.split(' ').slice(0, words).join(' ');
  return (
    <div className="mini capture" ref={ref} aria-hidden="true">
      <div className="orb-scale"><VoiceOrb level={level} paused={!on} recording={true} time="00:07" onToggle={() => {}} /></div>
      <div className="mini-transcript">{phrase || <span className="faint">Start talking…</span>}<i className="caret-blink" /></div>
    </div>
  );
}

export function Ask() {
  const [ref, on] = useOnScreen<HTMLDivElement>();
  const still = useReducedMotion();
  const answer = 'Activation rose 2.5% after the onboarding change shipped on Tuesday. The PR touched the checklist, and Sana’s note links the Figma frame.';
  const [n, setN] = useState(still ? answer.length : 0);
  useEffect(() => {
    if (!on || still) return;
    setN(0);
    const id = setInterval(() => setN((x) => (x >= answer.length + 40 ? 0 : x + 2)), 34);
    return () => clearInterval(id);
  }, [on, still, answer.length]);
  return (
    <div className="mini ask" ref={ref} aria-hidden="true">
      <div className="bubble q">How is activation trending this week?</div>
      <div className="bubble a">{answer.slice(0, n)}{n < answer.length && <i className="caret-blink" />}</div>
      <div className="src-row" style={{ opacity: n > answer.length * 0.6 ? 1 : 0 }}>
        {['PostHog · Activation', 'GitHub · #241', 'Figma · Checklist'].map((s) => <span key={s} className="src">{s}</span>)}
      </div>
    </div>
  );
}

export function Board() {
  return (
    <div className="mini board" aria-hidden="true">
      <svg viewBox="0 0 320 170" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
        <path className="wire" d="M104 62 C 140 62, 140 100, 176 100" pathLength={1} />
        <path className="wire d2" d="M228 100 C 250 100, 250 56, 268 56" pathLength={1} />
        <g className="note n1"><rect x="20" y="30" width="86" height="62" rx="6" fill="#e9f23f" /><text x="30" y="52" fontSize="10" fill="#1a1a08" fontWeight="600">Signup</text><text x="30" y="68" fontSize="9" fill="#1a1a08">friction?</text></g>
        <g className="note n2"><rect x="176" y="70" width="52" height="60" rx="6" fill="#ffa94d" /><text x="184" y="94" fontSize="10" fill="#2a1705" fontWeight="600">Try</text><text x="184" y="108" fontSize="9" fill="#2a1705">SSO</text></g>
        <g className="note n3"><rect x="262" y="28" width="46" height="56" rx="6" fill="#4cb782" /><text x="269" y="52" fontSize="10" fill="#08210f" fontWeight="600">B365-</text><text x="269" y="66" fontSize="10" fill="#08210f" fontWeight="600">30</text></g>
      </svg>
    </div>
  );
}

export function Kb() {
  const [ref, on] = useOnScreen<HTMLDivElement>();
  const open = useCycle(3, 1800, on);
  const tree = [
    { name: 'Company', kids: ['Mission', 'Hiring plan'] }, { name: 'Product', kids: ['Roadmap Q4', 'Pricing notes', 'Launch checklist'] }, { name: 'Legal', kids: ['Terms draft'] },
  ];
  return (
    <div className="mini kb" ref={ref} aria-hidden="true">
      {tree.map((f, i) => (
        <div key={f.name}>
          <div className={`kb-folder${i === open ? ' open' : ''}`}><ChevronRight size={12} /> <Folder size={13} /> {f.name}</div>
          {i === open && f.kids.map((k, j) => <div key={k} className="kb-file" style={{ animationDelay: `${j * 90}ms` }}><File size={12} /> {k}{k === 'Pricing notes' && <em> [[Billing page]]</em>}</div>)}
        </div>
      ))}
      <div className="kb-link"><BookOpen size={12} /> Google Drive, Dropbox and Evernote links, filed and searchable</div>
    </div>
  );
}

export function Metrics() {
  const series = useMemo(() => [
    { name: 'Weekly active', v: '1,284', d: '+8.5%', pts: [40, 44, 43, 50, 54, 53, 61, 66, 64, 72], t: 86 },
    { name: 'Activation', v: '41%', d: '+2.5%', pts: [30, 31, 29, 34, 36, 35, 38, 37, 40, 41], t: 68 },
  ], []);
  return (
    <div className="mini metrics" aria-hidden="true">
      {series.map((s) => (
        <div key={s.name} className="m-tile">
          <span className="faint">{s.name}</span><b>{s.v}</b>
          <Sparkline values={s.pts} height={36} />
          <div className="m-foot"><em>{s.d}</em><div className="meter"><i style={{ width: `${s.t}%` }} /></div></div>
        </div>
      ))}
    </div>
  );
}

export function Mcp() {
  const tools = ['search', 'list_tasks', 'create_task', 'update_status', 'add_note', 'kpis', 'roadmap'];
  const i = useCycle(tools.length, 900);
  return (
    <div className="mini mcp" aria-hidden="true">
      <pre><span className="dim">$</span> claude mcp add --transport http build365 \{'\n'}  http://localhost:3650/mcp</pre>
      <div className="tools">{tools.map((t, k) => <span key={t} className={k === i ? 'on' : ''}>{t}</span>)}</div>
    </div>
  );
}

export function Launch() {
  return (
    <div className="mini launch-mini" aria-hidden="true">
      <div className="lm-head"><b>v2.4.0</b><span className="faint">vs v2.3.0</span><em>+10 −7</em></div>
      <div className="lm-line del">− ZenMode OS is a minimalist launcher.</div>
      <div className="lm-line add">+ ZenMode OS turns your phone into a calm place.</div>
      <div className="lm-rev"><span className="stars">★★★★★</span> “Finally a launcher that helps.” <button type="button" tabIndex={-1}>3 suggested replies</button></div>
    </div>
  );
}

