import { LINKS } from '../links';
import Logo from '../ui/Logo';

const COLS: { title: string; items: string[][] }[] = [
  { title: 'Product', items: [['Platform', '#features'], ['Search', '#search'], ['Mac', '#native'], ['Rooms', '#rooms'], ['Around the clock', '#clock'], ['Get started', '#start'], ['FAQ', '#faq'], ['Live demo', LINKS.demo]] },
  { title: 'Project', items: [['GitHub', LINKS.github], ['Setup guide', LINKS.readme], ['Report an issue', LINKS.issues]].filter(([, href]) => href) },
  { title: 'Principles', items: [['Self-hosted', '#principles'], ['Bring your own model', '#principles'], ['Native on macOS', '#native'], ['MCP-ready', '#start']] },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-in">
        <div className="footer-brand">
          <Logo />
          <p>Dev tools for lean teams.<br />Shipping around the clock.</p>
          <p>Built as the tool to build ZenMode OS.</p>
        </div>
        {COLS.filter((c) => c.items.length).map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h3>{c.title}</h3>
            <ul>{c.items.map(([label, href]) => <li key={label}><a href={href} {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>{label}</a></li>)}</ul>
          </nav>
        ))}
      </div>
      <div className="footer-mark" aria-hidden="true">Build 365</div>
      <div className="wrap footer-base"><span>© {new Date().getFullYear()} Build 365</span><a href="#top">Back to top ↑</a></div>
    </footer>
  );
}
