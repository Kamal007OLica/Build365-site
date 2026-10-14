// Workflow glyphs in Linear's visual language: status circles, priority bars,
// progress pies and coloured label pills.
import type { Task } from '../lib/types';

export type Status = Task['status'] | 'backlog' | 'canceled';

export function StatusIcon({ status, size = 14 }: { status: Status; size?: number }) {
  const common = { width: size, height: size, viewBox: '0 0 14 14', 'aria-hidden': true } as const;
  if (status === 'backlog')
    return (
      <svg {...common} fill="none">
        <circle cx="7" cy="7" r="6" stroke="var(--status-backlog)" strokeWidth="1.5" strokeDasharray="1.4 1.74" />
      </svg>
    );
  if (status === 'todo')
    return (
      <svg {...common} fill="none">
        <circle cx="7" cy="7" r="6" stroke="var(--status-todo)" strokeWidth="1.5" />
      </svg>
    );
  if (status === 'doing')
    return (
      <svg {...common} fill="none">
        <circle cx="7" cy="7" r="6" stroke="var(--status-progress)" strokeWidth="1.5" />
        <path d="M7 3.5a3.5 3.5 0 0 1 0 7Z" fill="var(--status-progress)" />
      </svg>
    );
  if (status === 'canceled')
    return (
      <svg {...common}>
        <circle cx="7" cy="7" r="7" fill="var(--status-canceled)" />
        <path d="M4.8 4.8l4.4 4.4M9.2 4.8L4.8 9.2" stroke="var(--bg-2)" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  return (
    <svg {...common}>
      <circle cx="7" cy="7" r="7" fill="var(--status-done)" />
      <path d="M4.3 7.2l1.8 1.8 3.6-3.8" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const STATUS_LABEL: Record<Task['status'], string> = { todo: 'Todo', doing: 'In Progress', done: 'Done' };
export const PRIORITY_LABEL: Record<number, string> = { 1: 'Urgent', 2: 'High', 3: 'Medium', 4: 'Low', 0: 'No priority' };

/** Priority as Linear draws it: signal bars, with an orange alert square for urgent. */
export function PriorityIcon({ priority, size = 14 }: { priority: number; size?: number }) {
  if (priority === 1)
    return (
      <svg width={size} height={size} viewBox="0 0 14 14" aria-label="Urgent">
        <rect x="1" y="1" width="12" height="12" rx="3" fill="var(--urgent)" />
        <path d="M7 3.8v4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="7" cy="10.1" r="0.95" fill="#fff" />
      </svg>
    );
  if (!priority)
    return (
      <svg width={size} height={size} viewBox="0 0 14 14" aria-label="No priority">
        {[2, 6, 10].map((x) => <rect key={x} x={x - 0.5} y="6.25" width="2.5" height="1.5" rx="0.6" fill="var(--text-4)" />)}
      </svg>
    );
  const filled = priority === 2 ? 3 : priority === 3 ? 2 : 1;
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" aria-label={PRIORITY_LABEL[priority]}>
      {[0, 1, 2].map((i) => (
        <rect key={i} x={1.5 + i * 4} y={9 - i * 3} width="3" height={3 + i * 3} rx="1" fill={i < filled ? 'var(--text-2)' : 'var(--text-4)'} opacity={i < filled ? 1 : 0.5} />
      ))}
    </svg>
  );
}

/** Project progress as a pie inside a ring. */
export function ProgressPie({ value, size = 14, color = 'var(--accent)' }: { value: number; size?: number; color?: string }) {
  const r = 3.6;
  const a = (Math.min(99.9, Math.max(0, value)) / 100) * Math.PI * 2;
  const x = 7 + r * Math.sin(a);
  const y = 7 - r * Math.cos(a);
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" aria-label={`${Math.round(value)}% complete`}>
      <circle cx="7" cy="7" r="6" fill="none" stroke={color} strokeWidth="1.4" opacity="0.9" />
      {value > 0 && <path d={`M7 7 L7 ${7 - r} A${r} ${r} 0 ${a > Math.PI ? 1 : 0} 1 ${x.toFixed(2)} ${y.toFixed(2)} Z`} fill={color} />}
    </svg>
  );
}

const LABEL_COLORS = ['var(--red)', 'var(--blue)', 'var(--green)', 'var(--purple)', 'var(--orange)', 'var(--teal)', 'var(--yellow)', 'var(--pink)'];
const KNOWN: Record<string, string> = { bug: 'var(--red)', feature: 'var(--purple)', design: 'var(--blue)', ai: 'var(--green)', performance: 'var(--green)', launch: 'var(--orange)', setup: 'var(--teal)' };

export function labelColor(name: string) {
  const k = name.toLowerCase();
  if (KNOWN[k]) return KNOWN[k];
  let h = 0;
  for (const ch of k) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return LABEL_COLORS[h % LABEL_COLORS.length];
}

export function LabelPill({ name }: { name: string }) {
  return (
    <span className="label-pill" style={{ ['--c' as string]: labelColor(name) }}>
      <i />
      {name}
    </span>
  );
}

export const taskKey = (t: Pick<Task, 'number' | 'source' | 'externalId'>) =>
  t.number ? `B365-${t.number}` : t.source === 'todoist' ? 'Todoist' : '';
