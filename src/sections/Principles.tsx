import { Cpu, HardDrive, Plug } from 'lucide-react';
import Reveal from '../ui/Reveal';

const MODELS = ['Ollama', 'LM Studio', 'Claude Code', 'Claude API', 'Offline search'];
const CONNECT = ['GitHub', 'Figma', 'PostHog', 'Todoist', 'Telegram', 'Spotify', 'MCP servers'];

export default function Principles() {
  return (
    <section className="section" id="principles" aria-labelledby="principles-h">
      <div className="wrap">
        <div className="centered">
          <Reveal><p className="eyebrow"><span className="idx">07</span> Principles</p></Reveal>
          <Reveal delay={60}><h2 id="principles-h" className="xl">Yours to run.<br /><span className="dim-h">Yours to keep.</span></h2></Reveal>
        </div>
        <div className="principles">
          <Reveal className="pr" delay={0}>
            <HardDrive size={18} />
            <h3>Runs where you choose</h3>
            <p>A small Node server with no runtime dependencies, on your machine or your team’s server. Tokens and data stay with you. Nothing leaves except the calls to services you connect.</p>
          </Reveal>
          <Reveal className="pr" delay={80}>
            <Cpu size={18} />
            <h3>Bring your own model</h3>
            <p>Build 365 uses the first it finds, and works offline without one.</p>
            <div className="chip-row">{MODELS.map((m) => <span key={m}>{m}</span>)}</div>
          </Reveal>
          <Reveal className="pr" delay={160}>
            <Plug size={18} />
            <h3>Connects to your stack</h3>
            <p>Each tool degrades gracefully when it isn’t set up. Nothing is required.</p>
            <div className="chip-row">{CONNECT.map((m) => <span key={m}>{m}</span>)}</div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
