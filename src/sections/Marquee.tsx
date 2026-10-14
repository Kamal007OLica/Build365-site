import { Bot, Brain, ChartLine, CheckSquare, Cpu, Music2, PenTool, Plug, Send, ServerCog, Sparkles, WifiOff, type LucideIcon } from 'lucide-react';
import { GitHubMark } from '../../shared/components/brand';

const ITEMS: [string, LucideIcon | null][] = [['Ollama', Cpu], ['LM Studio', ServerCog], ['Claude Code', Bot], ['Claude API', Sparkles], ['OpenAI-compatible', Brain], ['MCP servers', Plug], ['GitHub', null], ['Figma', PenTool], ['PostHog', ChartLine], ['Todoist', CheckSquare], ['Telegram', Send], ['Spotify', Music2], ['Offline search', WifiOff]];

/** A slow, endless strip of what Build 365 works with. It stops on hover and is static when motion is reduced. */
export default function Marquee({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`marquee${compact ? ' compact' : ''}`} aria-label="Works with">
      <p className="marquee-cap">Bring the AI and the tools you already use</p>
      <div className="marquee-track" role="list">
        <div className="marquee-row">
          {[...ITEMS, ...ITEMS].map(([t, Icon], i) => (
            <span key={i} role="listitem" aria-hidden={i >= ITEMS.length ? true : undefined}>{Icon ? <Icon size={15} /> : <GitHubMark size={15} />}{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
