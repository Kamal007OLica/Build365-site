import { ArrowRight } from 'lucide-react';
import { LINKS } from '../links';

/** The primary call to action: the live demo once it is public, a quiet "Coming soon" until then. */
export default function DemoButton({ large = false, label = 'Open the live demo' }: { large?: boolean; label?: string }) {
  const cls = `btn-s primary${large ? ' lg' : ''}`;
  if (LINKS.demo) return <a className={cls} href={LINKS.demo}>{label} <ArrowRight size={large ? 16 : 15} /></a>;
  return <span className={`${cls} soon`} role="note"><i className="soon-dot" aria-hidden="true" /> Coming soon</span>;
}
