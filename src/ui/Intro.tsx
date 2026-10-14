import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatedMark } from '../../shared/components/OrbMark';

/**
 * A short, once-per-session logo reveal: the ring spins up, calms, then flies into its place in the nav while the veil lifts.
 * index.html sets data-intro="on" before first paint (and only when motion is allowed), which holds the hero animations
 * and the nav mark until this finishes.
 */
export default function Intro() {
  const [on, setOn] = useState(() => document.documentElement.dataset.intro === 'on');
  const [calm, setCalm] = useState(false);
  const [fly, setFly] = useState(false);
  const mark = useRef<HTMLDivElement>(null);

  const finish = () => {
    try { sessionStorage.setItem('b365.intro', '1'); } catch {}
    delete document.documentElement.dataset.intro;
    document.body.style.overflow = '';
    setOn(false);
  };

  useLayoutEffect(() => { if (on) document.body.style.overflow = 'hidden'; }, [on]);

  useEffect(() => {
    if (!on) return;
    const t1 = setTimeout(() => setCalm(true), 850);
    const t2 = setTimeout(() => {
      const target = document.querySelector('.nav-logo svg')?.getBoundingClientRect();
      const from = mark.current?.getBoundingClientRect();
      if (target && from && mark.current) {
        mark.current.style.transform = `translate(${target.left - from.left}px, ${target.top - from.top}px) scale(${target.width / from.width})`;
      }
      setFly(true);
    }, 1450);
    const t3 = setTimeout(finish, 2250);
    const skip = (e: KeyboardEvent) => e.key === 'Escape' && finish();
    addEventListener('keydown', skip);
    return () => { [t1, t2, t3].forEach(clearTimeout); removeEventListener('keydown', skip); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on]);

  if (!on) return null;
  return (
    <div className={`intro${fly ? ' fly' : ''}`} onClick={finish} aria-hidden="true">
      <div className="intro-stack">
        <div className="intro-mark" ref={mark}><AnimatedMark size={168} speed={0.05} pulse={0.5} boost={!calm} /></div>
        <div className="intro-word">Build <b>365</b></div>
      </div>
    </div>
  );
}
