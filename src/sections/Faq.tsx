import { Plus } from 'lucide-react';
import Reveal from '../ui/Reveal';

const QA: [string, string][] = [
  ['Where does Build 365 run?', 'On your machine or your team’s server. It’s a small Node server with no runtime dependencies (Node 20 or newer). Your data, settings and workspace token live in a folder on that machine.'],
  ['What leaves my machine?', 'Nothing, except the calls to the services you connect, such as GitHub, Figma or PostHog, and to whichever model you choose. Tokens stay on the server and never reach the browser.'],
  ['Which AI models can it use?', 'It uses the first it finds: a local model through Ollama or an OpenAI-compatible server such as LM Studio, then Claude Code, then the Claude API. With none of them, it falls back to offline search across your workspace.'],
  ['Do I need to connect every tool?', 'No. Every integration is optional and degrades gracefully. A tool you haven’t set up simply shows how to connect it.'],
  ['How do teammates join?', 'Owners add people in Settings → Members. Build 365 suggests a temporary password to send privately, and people change it after signing in. Owners manage connectors and the model. Members use everything else.'],
  ['Can Claude Code work with it?', 'Yes. Build 365 runs its own MCP server, with tools to search, list and create tasks, update status, add notes, read KPIs and the roadmap. You can also add any other MCP server to Build 365.'],
  ['What does the live demo do?', 'It runs the real app entirely in your browser with sample data. Nothing is sent to a server, and clearing site data resets it.'],
  ['Is it really free?', 'Yes. Self-hosted Build 365 is MIT licensed, with no seat limit, no feature gates and nothing that phones home. We charge only when we host it, secure it and support it for you.'],
  ['What do enterprises pay for?', 'Running it: a deployment in our India region or on your own servers that we patch, back up and upgrade, with SSO, SCIM and an audit log, and a named engineer who answers in IST. The code is identical to the free version. It is ₹899 a seat a month billed yearly, inclusive of GST, with a 10-seat minimum.'],
  ['I’m a startup in Tamil Nadu. Is there a deal?', 'Yes. StartupTN or DPIIT recognised startups headquartered in Tamil Nadu get Enterprise free for the first 12 months, then half price until ₹1 crore ARR. Student builders and incubator cohorts are free for as long as the cohort runs.'],
  ['Can I bring my existing notes and tasks?', 'Todoist tasks sit alongside your own. You can import an Evernote export into the knowledge base, and a ChatGPT data export so your old chats become searchable.'],
];

export default function Faq() {
  return (
    <section className="section" id="faq" aria-labelledby="faq-h">
      <div className="wrap faq-wrap">
        <div className="centered">
          <Reveal><p className="eyebrow"><span className="idx">10</span> FAQ</p></Reveal>
          <Reveal delay={60}><h2 id="faq-h" className="xl">Questions.</h2></Reveal>
        </div>
        <Reveal delay={100}>
          <div className="faq">
            {QA.map(([q, a]) => (
              <details key={q}>
                <summary><span>{q}</span><Plus size={16} aria-hidden="true" /></summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
