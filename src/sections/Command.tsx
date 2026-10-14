import { useEffect, useMemo, useRef, useState } from 'react';
import { BookOpen, ChartLine, CornerDownLeft, GitPullRequest, LayoutDashboard, ListTodo, PenTool, Search, Sparkles, SquarePen, type LucideIcon } from 'lucide-react';
import { useInView, useReducedMotion } from '../hooks';
import Reveal from '../ui/Reveal';

type Item = { id: string; Icon: LucideIcon; title: string; meta: string; src: string };
const ITEMS: Item[] = [
  { id: 't12', Icon: ListTodo, title: 'Ship the billing page', meta: 'B365-12 · In progress · Urgent', src: 'Tasks' },
  { id: 'pr248', Icon: GitPullRequest, title: 'Ship the billing page', meta: '#248 · 4 checks passing · Sana approved', src: 'GitHub' },
  { id: 'fg', Icon: PenTool, title: 'Billing v3', meta: 'Figma · edited 2 hours ago', src: 'Figma' },
  { id: 'kb', Icon: BookOpen, title: 'Pricing notes', meta: 'Product · links to [[Billing page]]', src: 'Knowledge' },
  { id: 'kpi', Icon: ChartLine, title: 'Activation rate', meta: '41% · up 2.5% this week', src: 'Analytics' },
  { id: 't14', Icon: ListTodo, title: 'Fix keyboard on MIUI devices', meta: 'B365-14 · Todo · High', src: 'Tasks' },
  { id: 'pr251', Icon: GitPullRequest, title: 'Fix keyboard closing on Xiaomi', meta: '#251 · Review requested', src: 'GitHub' },
  { id: 'lc', Icon: BookOpen, title: 'Launch checklist', meta: 'Product · 12 items', src: 'Knowledge' },
  { id: 'wb', Icon: PenTool, title: 'Signup friction', meta: 'Whiteboard · 3 stickies, 2 connectors', src: 'Whiteboard' },
  { id: 'rm', Icon: LayoutDashboard, title: 'Public launch', meta: 'Roadmap · 62% · due in 30 days', src: 'Roadmap' },
  { id: 'nc', Icon: SquarePen, title: 'New capture', meta: 'Note, task or voice note', src: 'Action' },
  { id: 'ask', Icon: Sparkles, title: 'Ask across your tools…', meta: 'Answers with sources', src: 'Action' },
];
const SUGGEST = ['billing', 'activation', 'keyboard', 'launch'];

function score(it: Item, q: string) {
  const hay = `${it.title} ${it.meta} ${it.src}`.toLowerCase();
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.every((w) => hay.includes(w))) return 0;
  return 1 + words.reduce((n, w) => n + (it.title.toLowerCase().includes(w) ? 2 : 0) + (it.src.toLowerCase().startsWith(w) ? 1 : 0), 0);
}

/** A working command palette. It types a few searches for you until you touch it, then it's yours. */
export default function Command() {
  const still = useReducedMotion();
  const [ref, seen] = useInView<HTMLDivElement>();
  const input = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const [opened, setOpened] = useState<Item | null>(null);
  const [manual, setManual] = useState(false);
  const autoText = useRef(false);
  /** The visitor took over: stop the autoplay and clear whatever it had typed. */
  const takeOver = () => {
    if (autoText.current) { autoText.current = false; setQ(''); }
    setManual(true);
  };

  const results = useMemo(() => {
    if (!q.trim()) return ITEMS.slice(0, 6);
    return ITEMS.map((it) => ({ it, s: score(it, q) })).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).map((x) => x.it);
  }, [q]);
  useEffect(() => setSel(0), [q]);

  // Autoplay: type each suggestion, hold, clear, repeat, until the visitor takes over.
  useEffect(() => {
    if (!seen || manual || still) return;
    let dead = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    (async () => {
      await wait(500);
      for (let i = 0; !dead; i = (i + 1) % SUGGEST.length) {
        autoText.current = true;
        for (const ch of SUGGEST[i]) { if (dead) return; setQ((v) => v + ch); await wait(90); }
        await wait(2200);
        for (let k = SUGGEST[i].length; k > 0; k--) { if (dead) return; setQ((v) => v.slice(0, -1)); await wait(35); }
        await wait(500);
      }
    })();
    return () => { dead = true; };
  }, [seen, manual, still]);

  // Cmd/Ctrl+K anywhere on the page jumps here.
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        takeOver();
        document.getElementById('search')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => input.current?.focus({ preventScroll: true }), 350);
      }
    };
    addEventListener('keydown', on);
    return () => removeEventListener('keydown', on);
  }, []);

  const key = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(results.length - 1, s + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(0, s - 1)); }
    else if (e.key === 'Enter' && results[sel]) { setOpened(results[sel]); setTimeout(() => setOpened(null), 1800); }
  };

  return (
    <section className="section" id="search" aria-labelledby="search-h">
      <div className="wrap">
        <div className="centered">
          <Reveal><p className="eyebrow"><span className="idx">01</span> Search</p></Reveal>
          <Reveal delay={60}><h2 id="search-h" className="xl">One keystroke to anything.<br /><span className="dim-h">Try it. It’s live.</span></h2></Reveal>
          <Reveal delay={120}><p className="section-lede">Tasks, pull requests, designs, pages and metrics in one search, with actions a letter away. Press <kbd>⌘</kbd> <kbd>K</kbd> on this page, or just start typing.</p></Reveal>
        </div>
        <Reveal delay={140}>
          <div className="palette-stage" ref={ref}>
            <div className="palette" role="search" onPointerDown={takeOver}>
              <div className="pal-input">
                <Search size={16} className="faint" />
                <input ref={input} value={q} onChange={(e) => { autoText.current = false; setManual(true); setQ(e.target.value); }} onKeyDown={key} onFocus={takeOver} placeholder="Search tasks, PRs, designs, docs…" aria-label="Search the demo workspace" aria-controls="pal-list" autoComplete="off" spellCheck={false} />
                <kbd>esc</kbd>
              </div>
              <div className="pal-label">{q.trim() ? `${results.length} ${results.length === 1 ? 'result' : 'results'}` : 'Suggested'}</div>
              <ul className="pal-list" id="pal-list" role="listbox" aria-label="Results">
                {results.map((it, i) => (
                  <li key={it.id} role="option" aria-selected={i === sel}>
                    <button className={i === sel ? 'on' : ''} onMouseEnter={() => setSel(i)} onClick={() => { setOpened(it); setTimeout(() => setOpened(null), 1800); }}>
                      <span className="pal-ico"><it.Icon size={15} /></span>
                      <span className="pal-txt"><b>{it.title}</b><span>{it.meta}</span></span>
                      <span className="pal-src">{it.src}</span>
                      {i === sel && <CornerDownLeft size={13} className="pal-enter" />}
                    </button>
                  </li>
                ))}
                {!results.length && <li className="pal-empty">Nothing matches “{q}”. Try “billing” or “launch”.</li>}
              </ul>
              <div className="pal-foot"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>↵</kbd> open</span><span className="grow" />{opened ? <em className="pal-toast">Opened {opened.title}</em> : <span className="faint">Sample data. Nothing is sent anywhere.</span>}</div>
            </div>
          </div>
        </Reveal>
        <div className="pal-notes">
          {[['Search everything', 'One index over tasks, notes, pages, PRs, designs and metrics.'], ['Run actions', 'New capture, voice note, terminal and more, from the same box.'], ['Ask a question', 'Turn any search into a question, answered with sources.']].map(([h, t], i) => (
            <Reveal key={h} delay={i * 80}><div><b>{h}</b><p>{t}</p></div></Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
