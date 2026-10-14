import { Play, Plug, Terminal } from 'lucide-react';
import { LINKS } from '../links';
import DemoButton from '../ui/DemoButton';
import CopyButton from '../ui/CopyButton';
import Reveal from '../ui/Reveal';

const RUN = 'npm install\nnpm run serve';
const MCP = 'claude mcp add --transport http build365 \\\n  http://localhost:3650/mcp \\\n  --header "Authorization: Bearer <token>"';

export default function GetStarted() {
  return (
    <section className="section band-paper" id="start" aria-labelledby="start-h">
      <div className="wrap">
        <div className="centered">
          <Reveal><p className="eyebrow"><span className="idx">08</span> Get started</p></Reveal>
          <Reveal delay={60}><h2 id="start-h" className="xl">Three ways in.</h2></Reveal>
          <Reveal delay={120}><p className="section-lede">Look around first, run it when you’re ready, then hand your workspace to the AI you already use.</p></Reveal>
        </div>
        <div className="start-grid">
          <Reveal className="start-card" delay={0}>
            <Play size={18} />
            <h3>{LINKS.demo ? 'Try the live demo' : 'The live demo'}</h3>
            <p>{LINKS.demo ? 'The real app, in your browser, with sample data. The sign-in is pre-filled and nothing leaves your browser.' : 'The real app, in your browser, with sample data. It opens to the public soon.'}</p>
            <DemoButton label="Open the demo" />
          </Reveal>
          <Reveal className="start-card" delay={80}>
            <Terminal size={18} />
            <h3>Run it yourself</h3>
            <p>Needs Node 20 or newer. Create the owner account on first visit, then connect what you use.</p>
            <div className="code-wrap"><pre><code><span className="dim">$</span> npm install{'\n'}<span className="dim">$</span> npm run serve{'\n'}<span className="dim">→ http://localhost:3650</span></code></pre><CopyButton text={RUN} label="Copy" /></div>
          </Reveal>
          <Reveal className="start-card" delay={160}>
            <Plug size={18} />
            <h3>Connect Claude Code</h3>
            <p>Build 365 is also an MCP server. Add it once and Claude can search, read and update your work.</p>
            <div className="code-wrap"><pre><code>{MCP}</code></pre><CopyButton text={MCP} label="Copy" /></div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
