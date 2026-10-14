import { useEffect, useState } from 'react';
import { ArrowRight, Bell, Command, CornerDownLeft, Keyboard, Mic, Search, Sparkles, SquareTerminal, Wifi, BatteryFull } from 'lucide-react';
import { StatusIcon } from '../../shared/components/icons';
import { OrbMark } from '../../shared/components/OrbMark';
import { useNow, useOnScreen, useReducedMotion } from '../hooks';
import Reveal from '../ui/Reveal';
import AppleMark from '../ui/AppleMark';

const PHRASE = 'Remind me to review the billing copy before Thursday';
const RECENT = [
  { t: 'Signup friction: try SSO first', m: 'Whiteboard · 2 min ago' },
  { t: 'Sana: “checkout copy is live”', m: 'Telegram · 14 min ago' },
  { t: 'Pricing notes', m: 'Clipped page · 1 h ago' },
];
const KEYS: [string[], string][] = [[['⌘', '⇧', 'Space'], 'Quick capture from anywhere'], [['⌘', 'K'], 'Search tasks, PRs, designs and docs'], [['⌘', 'I'], 'Ask Build 365 on any screen'], [['⌘', 'J'], 'Terminal and Claude Code']];

/** The Mac companion: a menu bar item with quick capture, global shortcuts and notifications that carry their source. */
export default function Native() {
  const now = useNow(1000);
  const still = useReducedMotion();
  const [ref, on] = useOnScreen<HTMLDivElement>();
  const [n, setN] = useState(still ? PHRASE.length : 0);
  useEffect(() => {
    if (!on || still) return;
    setN(0);
    const id = setInterval(() => setN((x) => (x >= PHRASE.length + 30 ? 0 : x + 1)), 55);
    return () => clearInterval(id);
  }, [on, still]);
  const typed = PHRASE.slice(0, n);
  const clock = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const date = now.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });

  return (
    <section className="section native" id="native" aria-labelledby="native-h">
      <div className="wrap">
        <div className="centered">
          <Reveal><p className="eyebrow"><span className="idx">02</span> Native on macOS</p></Reveal>
          <Reveal delay={60}><h2 id="native-h" className="xl">At home on your Mac.<br /><span className="dim-h">Menu bar, shortcuts, notifications.</span></h2></Reveal>
          <Reveal delay={120}><p className="section-lede">Build 365 runs as a proper Mac app: a menu bar item for capturing anything in a keystroke, global shortcuts into search, the assistant and the terminal, and notifications that say where they came from.</p></Reveal>
        </div>

        <Reveal delay={140}>
          <div className="nat-stage" ref={ref} aria-hidden="true">
            <div className="nat-wall" />
            <div className="nat-menubar">
              <span className="nat-apple"><AppleMark size={14} /></span>
              <b>Build 365</b><span>File</span><span>Edit</span><span>View</span><span>Capture</span><span>Window</span><span>Help</span>
              <span className="grow" />
              <span className="nat-orb on"><OrbMark size={16} /></span>
              <Wifi size={14} /><BatteryFull size={16} />
              <span className="nat-clock">{date} <b>{clock}</b></span>
            </div>

            <div className="nat-pop">
              <div className="nat-pop-h"><OrbMark size={14} /> Quick capture <span className="grow" /><kbd>⌘</kbd><kbd>⇧</kbd><kbd>Space</kbd></div>
              <div className="nat-field">{typed}{n < PHRASE.length && <i className="caret-blink" />}</div>
              <div className="nat-actions">
                <span className="nat-btn"><Mic size={13} /> Voice</span>
                <span className="grow" />
                <span className="nat-btn">Note <kbd><CornerDownLeft size={10} /></kbd></span>
                <span className="nat-btn primary">Task <kbd>⌘</kbd><kbd><CornerDownLeft size={10} /></kbd></span>
              </div>
              <div className="nat-recent">
                <span className="faint">Recent</span>
                {RECENT.map((r) => <div key={r.t}><b>{r.t}</b><span>{r.m}</span></div>)}
              </div>
            </div>

            <div className="nat-notif">
              <span className="nat-notif-ico"><StatusIcon status="done" size={18} /></span>
              <div><b>B365-12 shipped</b><span>Deployed to production in 41s · from GitHub #248</span></div>
              <em>now</em>
            </div>

            <div className="nat-dock">
              {[Search, Sparkles, SquareTerminal, Mic, Bell].map((Icon, i) => <span key={i} className={i === 1 ? 'on' : ''}><Icon size={18} /></span>)}
            </div>
          </div>
        </Reveal>

        <div className="nat-grid">
          <Reveal className="nat-card" delay={0}>
            <Command size={18} />
            <h3>Lives in the menu bar</h3>
            <p>Capture a note, a task or a voice memo without switching windows. It lands in your inbox with the page or app you were in.</p>
          </Reveal>
          <Reveal className="nat-card" delay={80}>
            <Keyboard size={18} />
            <h3>Global shortcuts</h3>
            <ul className="nat-keys">{KEYS.map(([k, t]) => <li key={t}><span>{k.map((x) => <kbd key={x}>{x}</kbd>)}</span>{t}</li>)}</ul>
          </Reveal>
          <Reveal className="nat-card" delay={160}>
            <Bell size={18} />
            <h3>Notifications with a source</h3>
            <p>A deploy, a review, a mention: each one names the pull request, task or page it came from, and opens straight to it.</p>
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div className="nat-cta">
            <span className="btn-s lg soon" role="note"><AppleMark size={15} /> Download for Mac <i className="soon-tag">Soon</i></span>
            <a className="link-cta" href="#start">Run it with npm today <ArrowRight size={16} /></a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
