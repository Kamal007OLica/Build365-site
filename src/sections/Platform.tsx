import { useEffect, useRef, useState, type ReactNode } from 'react';
import { LabelPill, PriorityIcon, StatusIcon, type Status } from '../../shared/components/icons';
import Timeline from '../../shared/components/Timeline';
import type { VisionItem } from '../../shared/lib/types';
import { Ask, Board, Kb, Mcp } from '../ui/visuals';
import Reveal from '../ui/Reveal';
import { PlanMini, PlatformsMini } from '../ui/minis';

const day = (n: number) => new Date(Date.now() + n * 86_400_000).toISOString().slice(0, 10);
const ROADMAP: VisionItem[] = [
  { id: 'a', title: 'Public launch', description: '', horizon: 'now', progress: 62, hue: 0, startDate: day(-30), targetDate: day(30), milestones: [{ name: 'Beta', date: day(-6) }, { name: 'Launch', date: day(30) }], createdAt: '' },
  { id: 'b', title: 'Team workspaces', description: '', horizon: 'next', progress: 18, hue: 3, startDate: day(8), targetDate: day(84), milestones: [{ name: 'Roles', date: day(46) }], createdAt: '' },
  { id: 'c', title: 'Integrations API', description: '', horizon: 'later', progress: 5, hue: 2, startDate: day(50), targetDate: day(130), milestones: [{ name: 'Docs', date: day(110) }], createdAt: '' },
];

const COLS: { name: string; status: Status; cards: { key: string; title: string; label: string; p: number; who: string }[] }[] = [
  { name: 'Up next', status: 'todo', cards: [{ key: 'B365-16', title: 'Attachment picker', label: 'Design', p: 3, who: 'AD' }, { key: 'B365-17', title: 'Saved payment methods', label: 'Launch', p: 2, who: 'SR' }] },
  { name: 'In progress', status: 'doing', cards: [{ key: 'B365-14', title: 'Fix keyboard on MIUI', label: 'Bug', p: 1, who: 'MK' }, { key: 'B365-15', title: 'Form file field', label: 'Feature', p: 3, who: 'AD' }] },
  { name: 'Done', status: 'done', cards: [{ key: 'B365-12', title: 'Ship the billing page', label: 'Launch', p: 1, who: 'MK' }, { key: 'B365-11', title: 'Upload field schema', label: 'Feature', p: 3, who: 'SR' }] },
];

function Kanban() {
  return (
    <div className="kanban" aria-hidden="true">
      {COLS.map((c, ci) => (
        <div key={c.name} className="k-col">
          <div className="k-head"><StatusIcon status={c.status} /> {c.name} <span className="faint">{c.cards.length}</span></div>
          {c.cards.map((k, i) => (
            <div key={k.key} className="k-card" style={{ '--i': ci * 2 + i } as React.CSSProperties}>
              <div className="k-top"><span>{k.key}</span><PriorityIcon priority={k.p} size={12} /></div>
              <b>{k.title}</b>
              <div className="k-foot"><LabelPill name={k.label} /><span className="pw-av">{k.who}</span></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

type Panel = { id: string; nav: string; title: string; body: string; visual: ReactNode; notes: [string, string][] };
const PANELS: Panel[] = [
  { id: 'plan', nav: 'Plan', title: 'Plan the whole app. Not just the next ticket.', body: 'List what people want. The plan finds what those features share, puts that first, and gives you the build order. Slices stacked in one column can be built in parallel, and every slice becomes a ticket.', visual: <PlanMini />, notes: [['See what belongs together.', 'A capability two features share becomes one slice, built once.'], ['Know what comes first.', 'Every slice knows what it needs and what it unlocks.']] },
  { id: 'platforms', nav: 'Platforms', title: 'Android today. iOS and web next.', body: 'One desk for where the product ships: the live version, store status, rollout and a release checklist per platform, with listing versions for the Play Store, the App Store and the web diffed like pull requests.', visual: <PlatformsMini />, notes: [['One release train.', 'Android, iOS and web share the dashboard, the roadmap and the board.'], ['Listings, versioned.', 'Compare any two versions of a store listing word by word, then mark one live.']] },
  { id: 'roadmap', nav: 'Roadmap', title: 'A roadmap you can actually read.', body: 'Goals become bars on a timeline with milestones and a line for today. Drag a date, and the plan and the dashboard move together.', visual: <div className="panel-tl"><Timeline items={ROADMAP} onOpen={() => {}} /></div>, notes: [['Milestones, not guesses.', 'Every goal carries the dates that matter, and slipped work is marked before anyone asks.'], ['One source of truth.', 'The roadmap, your weekly top goals and the KPIs share one dashboard.']] },
  { id: 'tasks', nav: 'Tasks', title: 'Issues that carry their context.', body: 'Status, priority, labels and B365 IDs, on a list or a board. Notes, links and the design travel with the task, and Todoist sits alongside.', visual: <Kanban />, notes: [['Nothing to re-explain.', 'Attach reference links and notes once. Whoever picks it up starts with the whole story.'], ['Keyboard first.', 'Change status, priority and due date without leaving the list.']] },
  { id: 'board', nav: 'Whiteboard', title: 'A whiteboard that stays connected.', body: 'Stickies, shapes and connectors that stay attached to what they join. Turn any sticky into a task, and keep versions and comments with the board.', visual: <div className="panel-mini"><Board /></div>, notes: [['Think, then file.', 'A sticky becomes a B365 task in one click.'], ['Together in real time.', 'Live cursors, comments and history for every board.']] },
  { id: 'knowledge', nav: 'Knowledge', title: 'Company knowledge, in one tree.', body: 'Spaces for Company, Product, Legal and more, with markdown pages, [[links]], files, and links to Google Drive, Dropbox and Evernote that are filed and searchable.', visual: <div className="panel-mini"><Kb /></div>, notes: [['Import what you have.', 'Bring an Evernote export, or drop files straight in.'], ['Found by everything.', 'Search, and the assistant, read the same pages.']] },
  { id: 'ask', nav: 'Ask and MCP', title: 'Ask once. Get answers with sources.', body: 'One question searches tasks, docs, pull requests, designs and metrics, and cites where each answer came from. Add Build 365 to Claude Code over MCP and let it work from the same source.', visual: <div className="panel-duo"><Ask /><Mcp /></div>, notes: [['Bring your own model.', 'Ollama, LM Studio, Claude Code, the Claude API, or plain offline search.'], ['Open by design.', 'Add any MCP server, or expose your workspace as one.']] },
];

export default function Platform() {
  const [active, setActive] = useState(PANELS[0].id);
  const refs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive((e.target as HTMLElement).dataset.id!)), { rootMargin: '-40% 0px -55% 0px' });
    Object.values(refs.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="section platform" id="features" aria-labelledby="platform-h">
      <div className="wrap">
        <div className="centered">
          <Reveal><p className="eyebrow"><span className="idx">04</span> Platform</p></Reveal>
          <Reveal delay={60}><h2 id="platform-h" className="xl">Plan the whole week.<br /><span className="dim-h">Not just the next task.</span></h2></Reveal>
        </div>
        <div className="platform-grid">
          <nav className="side-nav" aria-label="Platform sections">
            {PANELS.map((p) => (
              <a key={p.id} href={`#panel-${p.id}`} className={active === p.id ? 'on' : ''} aria-current={active === p.id ? 'true' : undefined}
                onClick={(e) => { e.preventDefault(); document.getElementById(`panel-${p.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }}>
                {p.nav}
              </a>
            ))}
          </nav>
          <div className="panels">
            {PANELS.map((p) => (
              <Reveal key={p.id}>
                <article id={`panel-${p.id}`} data-id={p.id} ref={(el) => { refs.current[p.id] = el; }} className="panel">
                  <h3>{p.title}</h3>
                  <p className="panel-body">{p.body}</p>
                  <div className="panel-visual">{p.visual}</div>
                  <div className="panel-notes">
                    {p.notes.map(([h, t]) => <div key={h}><b>{h}</b><p>{t}</p></div>)}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
