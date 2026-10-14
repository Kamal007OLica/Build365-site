import { useEffect, useState } from 'react';
import { Brain, Check, FileCode2, FileText, Kanban, Loader2, Pencil, Search, Sparkles, Terminal, Ticket, UserPlus, Users } from 'lucide-react';
import { StatusIcon } from '../../shared/components/icons';
import { useOnScreen, useReducedMotion } from '../hooks';
import Reveal from '../ui/Reveal';

/**
 * A room, live: a request goes in, the coordinator works through its steps, two tickets land on the board, and two
 * workers build them while the team panel follows along. One clock drives the whole scene and loops.
 */
const REQUEST = 'Add image uploads to the website builder and the form builder. They should share one media library, so an image uploaded in one shows up in the other.';
const COORD = [
  { at: 0.6, Icon: Sparkles, label: 'Thought through the task' },
  { at: 1.3, Icon: FileText, label: 'CLAUDE.md' },
  { at: 1.9, Icon: Brain, label: 'brain read', detail: 'knowledge base' },
  { at: 2.4, Icon: Kanban, label: 'board read', detail: 'open tickets' },
  { at: 3.6, Icon: Ticket, label: 'ticket create', detail: 'B365-12 · Media library' },
  { at: 4.0, Icon: Ticket, label: 'ticket create', detail: 'B365-13 · Form file field' },
  { at: 4.5, Icon: UserPlus, label: 'spawn worker', detail: 'Jade · B365-12' },
  { at: 4.9, Icon: UserPlus, label: 'spawn worker', detail: 'Blake · B365-13' },
];
const REPLY_AT = 3.2;
const WORKERS = [
  { name: 'Jade', key: 'B365-12', title: 'Media library', start: 5.2, steps: [[Sparkles, 'Thought through the ticket'], [FileText, 'Read', 'src/media/library.ts'], [Search, 'Glob', 'src/**/*.tsx'], [Pencil, 'Edit', 'src/media/library.ts'], [FileCode2, 'Write', 'src/components/MediaPicker.tsx'], [Terminal, 'Bash', 'npm test']] as const },
  { name: 'Blake', key: 'B365-13', title: 'Form file field', start: 6.0, steps: [[Sparkles, 'Thought through the ticket'], [FileText, 'Read', 'src/forms/fields.ts'], [FileCode2, 'Write', 'src/forms/UploadField.tsx'], [FileCode2, 'Write', 'test/upload.test.ts'], [Terminal, 'Bash', 'npm test']] as const },
];
const STEP = 1.05;
const LOOP = 17;

export default function Rooms() {
  const still = useReducedMotion();
  const [ref, on] = useOnScreen<HTMLDivElement>();
  const [t, setT] = useState(still ? LOOP : 0);
  useEffect(() => {
    if (!on || still) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => { setT(((now - t0) / 1000) % LOOP); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on, still]);
  const coordDone = t > COORD[COORD.length - 1].at + 0.3;
  const wdone = (w: (typeof WORKERS)[number]) => t > w.start + w.steps.length * STEP + 0.4;
  const allDone = WORKERS.every(wdone);

  return (
    <section className="section" id="rooms" aria-labelledby="rooms-h">
      <div className="wrap">
        <div className="centered">
          <Reveal><p className="eyebrow"><span className="idx">03</span> Rooms</p></Reveal>
          <Reveal delay={60}><h2 id="rooms-h" className="xl">Describe the outcome.<br /><span className="dim-h">Your coordinator runs the team.</span></h2></Reveal>
          <Reveal delay={120}><p className="section-lede">A room is one piece of work. Say what you want, and the coordinator reads your repo and your knowledge base, plans it, puts tickets on the board and starts a worker on each, in its own copy of the repo. You review.</p></Reveal>
        </div>

        <Reveal delay={140}>
          <div className="rd" ref={ref} aria-hidden="true">
            <div className="rd-chat">
              <div className="rd-head"><Users size={13} /> Image uploads <span className="faint">Studio app</span><span className={`rd-pill${allDone ? ' review' : ''}`}>{allDone ? 'Review' : 'Working'}</span></div>
              <div className="rd-user">{REQUEST}</div>
              <div className="rd-agent">
                <div className="rd-who"><span className="rd-av c">R</span><b>Ron</b><span className="faint">Coordinator</span></div>
                <div className="rd-worked">{coordDone ? <Check size={12} className="ok" /> : <Loader2 size={12} className="spin" />} {coordDone ? `Worked through ${COORD.length} steps` : 'Working…'}</div>
                <ol className="rd-steps">
                  {COORD.filter((s) => t > s.at).map((s) => <li key={s.label + (s.detail || '')}><s.Icon size={12} /> {s.label}{s.detail && <em>{s.detail}</em>}</li>)}
                </ol>
                {t > REPLY_AT && (
                  <div className="rd-text">
                    <b>What I found</b>
                    <p>Most of this already exists. The form builder has a Dropzone and the website builder’s image block renders a MediaGrid, but each keeps its own uploads.</p>
                    <b>Plan</b>
                    <p>One media library and a <code>useMediaLibrary()</code> hook both builders read from; then each builder gets its own picker.</p>
                    {t > 4.2 && <div className="rd-tickets">
                      <span><StatusIcon status={wdone(WORKERS[0]) ? 'done' : t > 5.2 ? 'doing' : 'todo'} size={12} /> <i>B365-12</i> Media library</span>
                      {t > 4.6 && <span><StatusIcon status={wdone(WORKERS[1]) ? 'done' : t > 6 ? 'doing' : 'todo'} size={12} /> <i>B365-13</i> Form file field</span>}
                    </div>}
                  </div>
                )}
              </div>
              {WORKERS.filter(wdone).map((w) => (
                <div key={w.name} className="rd-agent worker">
                  <div className="rd-who"><span className="rd-av w">{w.name[0]}</span><b>{w.name}</b><span className="faint">Worker · {w.key}</span></div>
                  <div className="rd-text"><p><b>Done: {w.title}.</b> {w.name === 'Jade' ? 'Added MediaPicker and the shared library hook; 14 tests pass.' : 'Forms accept files through the shared library; the suite passes.'} Ready for review.</p></div>
                </div>
              ))}
              {allDone && <div className="rd-agent"><div className="rd-who"><span className="rd-av c">R</span><b>Ron</b></div><div className="rd-text"><p>Jade and Blake have finished. Both tickets are ready to review.</p></div></div>}
            </div>
            <div className="rd-team">
              <div className="rd-head"><Users size={13} /> Team <span className="faint">3 agents</span></div>
              <div className="rd-card"><span className="rd-av c">R</span><b>Ron</b><span className="faint">Coordinator</span><em className={coordDone && !allDone ? '' : allDone ? 'idle' : 'on'}>{allDone ? 'Idle' : 'Working'}</em></div>
              {WORKERS.map((w) => {
                const started = t > w.start, done = wdone(w);
                const n = Math.max(0, Math.min(w.steps.length, Math.floor((t - w.start) / STEP) + 1));
                return (
                  <div key={w.name} className={`rd-card worker${started ? ' on' : ''}`}>
                    <span className="rd-av w">{w.name[0]}</span><b>{w.name}</b><span className="faint">Worker</span>
                    <em className={done ? 'review' : started ? 'on' : 'q'}>{done ? 'Review' : started ? 'Working' : t > 4.4 ? 'Queued' : ''}</em>
                    {t > 4.4 && <div className="rd-ticket"><StatusIcon status={done ? 'done' : started ? 'doing' : 'todo'} size={11} /> <i>{w.key}</i> {w.title}</div>}
                    {started && <ol className="rd-steps small">{w.steps.slice(0, n).map(([Icon, tool, detail], i) => <li key={i}><Icon size={11} /> {tool}{detail && <em>{detail}</em>}</li>)}</ol>}
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        <div className="pal-notes">
          {[['Tickets, automatically', 'Every plan lands on the board as B365 tasks with the context attached. No ticket writing.'], ['Workers in their own worktree', 'Each worker is a Claude Code run in its own copy of the repo. Nothing touches main until you review.'], ['From the web too', 'Clip a page with the Chrome extension and choose Build in a room. The coordinator starts on it.']].map(([h, p], i) => (
            <Reveal key={h} delay={i * 80}><div><b>{h}</b><p>{p}</p></div></Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
