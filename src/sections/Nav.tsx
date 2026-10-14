import { useEffect, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { LINKS } from '../links';
import Logo from '../ui/Logo';

const ITEMS = [
  { href: '#features', label: 'Platform' },
  { href: '#search', label: 'Search' },
  { href: '#native', label: 'Mac' },
  { href: '#rooms', label: 'Rooms' },
  { href: '#clock', label: 'Around the clock' },
  { href: '#faq', label: 'FAQ' },
];

/** A fixed bar that fades a gradient in behind it as the page scrolls, and folds into a sheet on phones. */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  useEffect(() => {
    const els = ITEMS.map((i) => document.querySelector(i.href)).filter(Boolean) as Element[];
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)), { rootMargin: '-45% 0px -50% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open]);

  return (
    <header className={`nav${scrolled ? ' scrolled' : ''}${open ? ' open' : ''}`}>
      <div className="nav-in">
        <a href="#top" className="nav-logo" aria-label="Build 365, back to top"><Logo animated /><span className="ver">Alpha</span></a>
        <nav className="nav-links" aria-label="Primary">
          {ITEMS.map((i) => <a key={i.href} href={i.href} aria-current={active === i.href ? 'true' : undefined}>{i.label}</a>)}
        </nav>
        <div className="nav-cta">
          {LINKS.github && <a className="nav-gh" href={LINKS.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={13} /></a>}
          <a className="btn-s primary sm" href="#start">Get started</a>
          <button className="nav-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      <div id="mobile-menu" className="nav-mobile" hidden={!open}>
        {ITEMS.map((i) => <a key={i.href} href={i.href} onClick={() => setOpen(false)}>{i.label}</a>)}
        {LINKS.github && <a href={LINKS.github} target="_blank" rel="noreferrer">GitHub</a>}
        <a className="btn-s primary" href="#start" onClick={() => setOpen(false)}>Get started</a>
      </div>
    </header>
  );
}
