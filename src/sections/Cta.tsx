import { useState } from 'react';
import { AnimatedMark } from '../../shared/components/OrbMark';
import { GitHubMark } from '../../shared/components/brand';
import { LINKS } from '../links';
import DemoButton from '../ui/DemoButton';
import Reveal from '../ui/Reveal';

export default function Cta() {
  const [hot, setHot] = useState(false);
  return (
    <section className="cta" aria-labelledby="cta-h">
      <div className="cta-horizon" aria-hidden="true">
        <i />
        <svg className="cta-arc" viewBox="0 0 1200 300" preserveAspectRatio="none">
          <defs>
            <linearGradient id="cta-arc-g" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#e6f03c" stopOpacity="0" />
              <stop offset="0.3" stopColor="#e6f03c" stopOpacity="0.7" />
              <stop offset="0.5" stopColor="#fffbd0" stopOpacity="1" />
              <stop offset="0.7" stopColor="#ffa94d" stopOpacity="0.65" />
              <stop offset="1" stopColor="#ffa94d" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path className="cta-arc-far" d="M-40 300 Q600 124 1240 300" fill="none" stroke="url(#cta-arc-g)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <path className="cta-arc-near" d="M-40 300 Q600 48 1240 300" fill="none" stroke="url(#cta-arc-g)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      <div className="wrap cta-in">
        <Reveal><div className="cta-ring"><AnimatedMark size={120} speed={0.05} pulse={0.35} boost={hot} /></div></Reveal>
        <Reveal><h2 id="cta-h">Ship while the world sleeps.</h2></Reveal>
        <Reveal delay={80}><p>{LINKS.demo ? 'Try the real app in your browser with sample data and a pre-filled demo sign-in. It runs on your own machine when you’re ready.' : 'Build 365 is in private preview. The public release is coming soon.'}</p></Reveal>
        <Reveal delay={160}>
          <div className="hero-cta center" onMouseEnter={() => setHot(true)} onMouseLeave={() => setHot(false)} onFocus={() => setHot(true)} onBlur={() => setHot(false)}>
            <DemoButton large />
            {LINKS.github ? (
              <a className="btn-s lg" href={LINKS.github} target="_blank" rel="noreferrer"><GitHubMark size={16} /> Get it on GitHub</a>
            ) : (
              <a className="btn-s lg" href="#features">Explore the features</a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
