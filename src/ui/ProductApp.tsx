import { forwardRef, useMemo, type ReactElement } from 'react';
import {
  ArrowUp, BookOpen, Bot, ChartLine, ChevronDown, ChevronsUpDown, Inbox, Layers, MonitorSmartphone, Smartphone, Apple, Globe, Users, LayoutDashboard, Lightbulb, ListTodo, Mail, Mic, Palette,
  PenTool, Plus, Search, Settings, Sparkles, SquareTerminal, Star, Check, Paperclip, type LucideIcon,
} from 'lucide-react';
import { FigmaMark, GitHubMark } from '../../shared/components/brand';
import { Sparkline } from '../../shared/components/charts';
import { LabelPill, PriorityIcon, StatusIcon } from '../../shared/components/icons';
import { OrbMark } from '../../shared/components/OrbMark';

/**
 * The whole product, drawn at 1440×900 with real pixels and the app's own components. The stage scales and moves it
 * like a camera, so everything here is laid out in absolute pixels and never reflows.
 *
 * Parts the camera can frame carry data-part. Things that change as the story advances carry data-beat (one switch),
 * data-turn (chat lines, in order) or data-worker (terminal lines, in order); the stage toggles them.
 */
export const APP_W = 1440;
export const APP_H = 900;


type NavItem = { Icon: LucideIcon | ((p: { size?: number; className?: string }) => ReactElement); label: string; n?: number; on?: boolean };
const TOP: NavItem[] = [
  { Icon: Inbox, label: 'Inbox', n: 6 },
  { Icon: LayoutDashboard, label: 'Dashboard', on: true },
  { Icon: ListTodo, label: 'My tasks', n: 5 },
  { Icon: Sparkles, label: 'Ask Build 365' },
];
const Fig = ({ size }: { size?: number }) => <FigmaMark size={size} mono />;
const GH = ({ size }: { size?: number }) => <GitHubMark size={size} />;
const GROUPS: { name: string; items: NavItem[] }[] = [
  { name: 'Workspace', items: [{ Icon: PenTool, label: 'Whiteboard' }, { Icon: BookOpen, label: 'Knowledge' }, { Icon: Fig, label: 'Figma' }] },
  { name: 'Build', items: [{ Icon: Users, label: 'Rooms' }, { Icon: Layers, label: 'Plan' }, { Icon: Bot, label: 'Claude' }, { Icon: GH, label: 'GitHub' }, { Icon: ChartLine, label: 'Analytics' }] },
  { name: 'Platforms', items: [{ Icon: MonitorSmartphone, label: 'Platforms' }, { Icon: Smartphone, label: 'Play Store' }, { Icon: Apple, label: 'App Store' }, { Icon: Globe, label: 'Web' }] },
  { name: 'Launch', items: [{ Icon: Mail, label: 'Mail' }, { Icon: Star, label: 'Reviews' }, { Icon: Lightbulb, label: 'Product board' }, { Icon: Palette, label: 'Brand' }] },
];
const BOTTOM: NavItem[] = [{ Icon: Mic, label: 'Voice note' }, { Icon: SquareTerminal, label: 'Terminal' }, { Icon: Settings, label: 'Settings' }];

const GOALS = [
  { key: 'B365-12', title: 'Ship the billing page', status: 'doing' as const, p: 1, due: 'Today', label: 'Launch', who: 'MK', ship: true },
  { key: 'B365-14', title: 'Fix keyboard on MIUI devices', status: 'todo' as const, p: 2, due: 'Tomorrow', label: 'Bug', who: 'SR' },
  { key: 'B365-9', title: 'Weekly metrics email', status: 'todo' as const, p: 3, due: 'Fri', label: 'Growth', who: 'AD' },
];

const KPIS = [
  { name: 'Weekly active users', v: '1,284', d: '+8.5%', of: 'of 1,500', pts: [40, 44, 43, 50, 54, 53, 61, 66, 64, 72] },
  { name: 'Activation rate', v: '41%', d: '+2.5%', of: 'of 60%', pts: [30, 31, 29, 34, 36, 35, 38, 37, 40, 41] },
  { name: 'Time to first value', v: '14 min', d: '−6.7%', of: 'of 8 min', pts: [22, 21, 20, 19, 19, 18, 17, 16, 15, 14], down: true },
  { name: 'Shipped this week', v: '9', d: '+13%', of: 'of 12', pts: [4, 6, 5, 7, 6, 8, 7, 9, 8, 9] },
];

const SCOPES = ['Workspace', 'Claude', 'GitHub', 'Figma', 'PostHog', 'MCP'];

const ProductApp = forwardRef<HTMLDivElement, { className?: string }>(function ProductApp({ className = '' }, ref) {
  const roadmap = useMemo(() => <Roadmap />, []);

  return (
    <div ref={ref} className={`app ${className}`} style={{ width: APP_W, height: APP_H }} aria-hidden="true">
      {/* macOS title bar: traffic lights, a unified search field and the model that is answering. */}
      <div className="app-title" data-part="titlebar">
        <div className="app-lights"><i /><i /><i /></div>
        <div className="app-tabs"><span className="on"><OrbMark size={14} /> Acme Labs</span><span className="faint">Dashboard</span></div>
        <div className="app-search"><Search size={13} /><span>Search tasks, PRs, designs, docs…</span><kbd>⌘K</kbd></div>
        <div className="app-title-end">
          <span className="app-chip"><i className="dot" /> Claude Code · Opus</span>
          <span className="app-ava">MK</span>
        </div>
      </div>

      <div className="app-body">
        {/* Sidebar */}
        <aside className="app-side" data-part="sidebar">
          <button className="app-ws" type="button" tabIndex={-1}><OrbMark size={20} /><b>Acme Labs</b><ChevronDown size={13} className="faint" /></button>
          <div className="app-nav">
            {TOP.map(({ Icon, label, n, on }) => <div key={label} className={`app-nav-it${on ? ' on' : ''}`} data-nav><Icon size={15} /> <span>{label}</span>{n ? <em>{n}</em> : null}</div>)}
          </div>
          {GROUPS.map((g) => (
            <div key={g.name} className="app-group">
              <div className="app-group-h">{g.name} <ChevronDown size={11} /></div>
              {g.items.map(({ Icon, label }) => <div key={label} className="app-nav-it" data-nav><Icon size={15} /> <span>{label}</span></div>)}
            </div>
          ))}
          <div className="app-side-foot">
            {BOTTOM.map(({ Icon, label }) => <div key={label} className="app-nav-it" data-nav><Icon size={15} /> <span>{label}</span></div>)}
            <div className="app-account"><span className="app-ava lg">MK</span><div><b>Mira Kaur</b><small>Owner · Acme Labs</small></div><ChevronsUpDown size={13} className="faint" /></div>
          </div>
        </aside>

        {/* Main: the dashboard, with the terminal docked underneath it. */}
        <main className="app-main" data-part="main">
          <header className="app-crumb"><LayoutDashboard size={14} /> Dashboard <span className="faint">Wednesday 30 September</span><span className="grow" /><span className="app-crumb-btn"><Plus size={13} /> New capture <kbd>n</kbd></span></header>

          <div className="app-dash" data-part="week">
            <div className="dash-greet">
              <div className="dash-orb"><OrbMark size={40} /></div>
              <div className="dash-hello"><b>Good morning, Mira</b><span>Acme Labs · 3 goals this week · 1 deploy queued</span></div>
              <div className="dash-stats">
                <div><b data-beat-text="progress">1</b><span>In progress</span></div>
                <div><b>4</b><span>Due this week</span></div>
                <div><b>0</b><span>Overdue</span></div>
              </div>
            </div>

            <div className="dash-h"><b>This week’s top 3</b><span className="faint">Owner, priority and due date</span><span className="grow" /><span className="faint">All tasks →</span></div>
            <div className="dash-goals">
              {GOALS.map((g) => (
                <div key={g.key} className={`goal p${g.p}`} data-beat={g.ship ? 'ship' : undefined}>
                  <div className="goal-top"><span className="mono">{g.key}</span><em><PriorityIcon priority={g.p} size={12} /> {g.p === 1 ? 'Urgent' : g.p === 2 ? 'High' : 'Medium'}</em></div>
                  <b>{g.title}</b>
                  <div className="goal-foot">
                    <span className="app-ava sm">{g.who}</span>
                    <LabelPill name={g.label} />
                    <span className="goal-status"><span className="s-a"><StatusIcon status={g.status} size={14} /></span><span className="s-b"><StatusIcon status="done" size={14} /></span></span>
                    <span className="goal-due"><span className="s-a">{g.due}</span><span className="s-b">Shipped</span></span>
                  </div>
                </div>
              ))}
            </div>

            <div className="dash-row">
              <div className="dash-kpis">
                <div className="dash-h"><b>Key metrics</b><span className="grow" /><span className="faint"><Plus size={12} /> Add KPI</span></div>
                <div className="kpi-grid">
                  {KPIS.map((k) => (
                    <div key={k.name} className="kpi">
                      <span className="kpi-name">{k.name}</span>
                      <b className="kpi-v">{k.v}</b>
                      <div className="kpi-spark"><Sparkline values={k.pts} height={34} /></div>
                      <span className={`kpi-d${k.down ? ' down' : ''}`}>{k.d} <i>{k.of}</i></span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="dash-road">
                <div className="dash-h"><b>Roadmap</b><span className="faint">Where we’re going</span><span className="grow" /><span className="seg"><b>Timeline</b><span>Board</span></span></div>
                <div className="road-tl">{roadmap}</div>
              </div>
            </div>
          </div>

          <section className="app-term" data-part="terminal">
            <div className="term-bar">
              <span className="term-tab on">Shell</span><span className="term-tab">Ask</span>
              <span className="faint mono">~/code/acme · main</span>
              <span className="grow" />
              <span className="faint">⌘J</span>
            </div>
            <div className="term-body mono">
              <div className="t-line" data-worker><i>$</i> claude "implement B365-12 from the task notes"</div>
              <div className="t-line dim" data-worker>Reading CLAUDE.md, .claude/agents/reviewer.md, Figma · Billing v3</div>
              <div className="t-line dim" data-worker>Plan: 4 files, 1 migration, tests first</div>
              <div className="t-line" data-worker><Check size={12} className="ok" /> Added <code>billing/plans.ts</code> and <code>billing/checkout.tsx</code></div>
              <div className="t-line" data-worker><Check size={12} className="ok" /> 14 tests passing · PR #248 opened · Sana requested as reviewer</div>
              <div className="t-line" data-worker><i>$</i> npm run deploy</div>
              <div className="t-line dim" data-worker>build 12.4s · test 14 passed · staging healthy</div>
              <div className="t-line" data-worker><Check size={12} className="ok" /> production · live in 41s · changelog posted to Telegram</div>
              <div className="t-line caret" data-worker><i>$</i> <span className="type" /></div>
            </div>
          </section>

          <div className="app-toast" data-beat="toast"><StatusIcon status="done" size={16} /><div><b>B365-12 shipped</b><span>Deployed to production · 41s</span></div></div>
        </main>

        {/* Ask Build 365: the assistant, docked on every screen. */}
        <aside className="app-panel" data-part="ask">
          <div className="panel-h"><Sparkles size={14} className="acc" /> Ask Build 365 <span className="grow" /><span className="faint">⌘I</span></div>
          <div className="panel-scopes">{SCOPES.map((s, i) => <span key={s} className={i === 0 ? 'on' : ''}>{s}</span>)}</div>
          <div className="panel-chat">
            <div className="turn q" data-turn="prompt">What changed in checkout this week, and did activation move?</div>
            <div className="turn a" data-turn="reply">
              <p>Three things shipped in checkout: saved payment methods <b>#248</b>, the MIUI keyboard fix <b>#251</b> and the new plan picker. Activation rose from <b>38.5%</b> to <b>41%</b> after Tuesday’s deploy, mostly from the shorter signup.</p>
              <div className="turn-src"><span><GitHubMark size={11} /> #248</span><span><ChartLine size={11} /> Activation</span><span><FigmaMark size={11} mono /> Billing v3</span><span><BookOpen size={11} /> Pricing notes</span></div>
            </div>
            <div className="turn q" data-turn="prompt">Turn the open review comments into a task for Mira, due Friday.</div>
            <div className="turn a" data-turn="reply">
              <p>Done. <b>B365-19 · Checkout polish</b> is assigned to Mira, due Fri, with the three open comments from #248 as a checklist.</p>
              <div className="turn-task"><StatusIcon status="todo" size={13} /><span className="mono">B365-19</span><b>Checkout polish</b><span className="app-ava sm">MK</span></div>
            </div>
          </div>
          <div className="panel-compose"><Paperclip size={14} className="faint" /><span>Ask about tasks, PRs, designs or metrics…</span><span className="send"><ArrowUp size={13} /></span></div>
        </aside>
      </div>
    </div>
  );
});

export default ProductApp;

/** The roadmap, drawn to fit the card: months across the top, three goals as bars with milestones, and a line for today. */
const MONTHS = ['SEP', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB'];
const ROWS = [
  { name: 'Ship something every day', pct: 40, from: 0.02, to: 0.36, ms: [{ at: 0.2, label: 'Daily changelog' }], status: 'doing' as const },
  { name: 'First 100 paying teams', pct: 12, from: 0.3, to: 0.74, ms: [{ at: 0.44, label: 'Beta' }, { at: 0.66, label: 'GA' }], status: 'doing' as const },
  { name: 'OS for small teams', pct: 5, from: 0.58, to: 1.04, ms: [{ at: 0.9, label: 'Integrations API' }], status: 'todo' as const },
];
function Roadmap() {
  const today = 0.165;
  return (
    <div className="roadmap">
      <div className="rm-scale">
        {MONTHS.map((m, i) => <span key={m} style={{ left: `${(i / MONTHS.length) * 100}%` }}>{m}</span>)}
        {Array.from({ length: 12 }, (_, i) => <i key={i} style={{ left: `${(i / 12) * 100}%` }} className={i % 2 ? '' : 'month'} />)}
      </div>
      <div className="rm-rows">
        {ROWS.map((r) => (
          <div key={r.name} className="rm-row">
            <div className="rm-name" style={{ left: `${r.from * 100}%` }}><StatusIcon status={r.status} size={12} /> {r.name} <em>{r.pct}%</em></div>
            <div className="rm-bar" style={{ left: `${r.from * 100}%`, width: `${(r.to - r.from) * 100}%` }}>
              <i style={{ width: `${r.pct}%` }} />
              {r.ms.map((m) => <span key={m.label} className="rm-ms" style={{ left: `${((m.at - r.from) / (r.to - r.from)) * 100}%` }}><i /><em>{m.label}</em></span>)}
            </div>
          </div>
        ))}
        <div className="rm-today" style={{ left: `${today * 100}%` }}><b>Today</b></div>
      </div>
    </div>
  );
}
