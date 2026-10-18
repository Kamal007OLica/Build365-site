import { ArrowRight, Check, GraduationCap, Headset, IndianRupee, Rocket, Server, ShieldCheck } from 'lucide-react';
import { OrbMark } from '../../shared/components/OrbMark';
import { GitHubMark } from '../../shared/components/brand';
import { LINKS } from '../links';
import Reveal from '../ui/Reveal';

/**
 * The price sheet. One number runs through the whole section: ₹899 a seat a month is what Enterprise pays, and
 * the same number is struck out on the self-hosted card, because the code is identical and only who runs it changes.
 * Priced for Tamil Nadu first: INR, GST on the invoice, UPI, and a founders' programme for StartupTN and DPIIT startups.
 */
export const PRICE = {
  seatYearly: '₹899',
  seatMonthly: '₹1,099',
  minSeats: 10,
  volumeFrom: 50,
} as const;

const INCLUDED: [string, string][] = [
  ['Everything in the box', 'Tasks, roadmap, whiteboard, knowledge, rooms, analytics. No feature gates, ever.'],
  ['Unlimited seats', 'Your whole team on one server, for the price of the server.'],
  ['Bring your own model', 'Ollama, LM Studio, Claude Code or the Claude API. Offline search without one.'],
  ['Every integration', 'GitHub, Figma, PostHog, Todoist, Telegram and any MCP server.'],
  ['MCP server built in', 'Claude Code searches, reads and updates your work.'],
  ['Community support', 'GitHub issues, the setup guide, and the source itself.'],
];

const STEPS: { n: string; icon: typeof Server; title: string; body: string }[] = [
  { n: '01', icon: Server, title: 'Host', body: 'Run in our India region or on your own servers. We patch, back up and upgrade it.' },
  { n: '02', icon: ShieldCheck, title: 'Secure', body: 'SSO with SAML or OIDC, SCIM provisioning, roles and an audit log. Data stays in India.' },
  { n: '03', icon: Headset, title: 'Support', body: 'A named engineer who answers in IST, with onboarding for the whole team.' },
];

const ENT_POINTS = [
  'Priority support on WhatsApp and phone, 4-hour response in IST',
  '99.9% uptime, daily backups, 30-day point-in-time restore',
  'SSO, SCIM and audit log, with a signed DPA on request',
  'Onboarding workshop for your team, in English or Tamil',
];

const TN: { icon: typeof Rocket; title: string; body: string }[] = [
  { icon: Rocket, title: 'Startups in Tamil Nadu', body: 'StartupTN or DPIIT recognised and headquartered in the state? Enterprise is free for your first 12 months, then half price until you cross ₹1 crore ARR.' },
  { icon: GraduationCap, title: 'Students and incubators', body: 'Student builders, college incubators and accelerator cohorts get Enterprise at ₹0 for as long as the cohort runs. Bring the whole batch.' },
  { icon: IndianRupee, title: 'Pay like a local', body: 'INR invoices with GST, paid by UPI, card or bank transfer. No dollar card, no forex markup, no surprise conversions.' },
];

/** A hand-drawn double strike, drawn in when the card scrolls into view. */
function Scribble() {
  return (
    <svg className="price-strike" viewBox="0 0 260 44" preserveAspectRatio="none" aria-hidden="true">
      <path pathLength={1} d="M4 26 C 60 20, 120 18, 256 12" />
      <path pathLength={1} d="M8 33 C 80 28, 150 26, 252 22" />
    </svg>
  );
}

export default function Pricing() {
  return (
    <section className="section pricing" id="pricing" aria-labelledby="pricing-h">
      <div className="wrap">
        <div className="centered">
          <Reveal><p className="eyebrow"><span className="idx">09</span> Pricing</p></Reveal>
          <Reveal delay={60}><h2 id="pricing-h" className="xl">Free to self-host.<br /><span className="dim-h">Enterprise keeps the lights on.</span></h2></Reveal>
          <Reveal delay={120}><p className="section-lede">The same open-source code either way. You pay only when you want it run, secured and supported by us.</p></Reveal>
        </div>

        <div className="price-grid">
          <Reveal as="article" className="price-card" delay={0}>
            <span className="price-chip">macOS, Linux and Windows · Node 20+</span>
            <h3>Build 365 Self-hosted</h3>
            <p className="price-lede">The whole workspace on your own machine or your team’s server. Every feature, every integration, unlimited seats.</p>

            <div className="price-tag" role="group" aria-label="Price">
              <span className="price-old"><s><b>{PRICE.seatYearly}</b><em>/seat/mo</em></s><Scribble /></span>
              <span className="price-note" aria-label="Free when you host it yourself">
                <svg viewBox="0 0 28 24" aria-hidden="true"><path pathLength={1} d="M2 13 C 7 16, 9 19, 11 21 C 15 12, 20 6, 27 2" /></svg>
                <span>Free when you host it yourself</span>
              </span>
            </div>

            <p className="price-inc">Self-hosted includes</p>
            <ul className="price-list">
              {INCLUDED.map(([t, d]) => (
                <li key={t}><Check size={16} aria-hidden="true" /><div><b>{t}</b><span>{d}</span></div></li>
              ))}
            </ul>

            {LINKS.github
              ? <a className="btn-s primary lg price-cta" href={LINKS.github} target="_blank" rel="noreferrer"><GitHubMark size={16} /> Get it on GitHub</a>
              : <a className="btn-s primary lg price-cta" href="#start">Run it yourself <ArrowRight size={16} /></a>}
            <p className="price-fine">MIT licensed. No seat limits, no feature gates, nothing phones home. Model usage is billed by your provider, or costs nothing with a local model.</p>
          </Reveal>

          <Reveal className="ent" delay={80}>
            <span className="ent-tile" aria-hidden="true"><OrbMark size={56} plate /></span>
            <h3>Inside Enterprise</h3>
            <p className="ent-lede">
              For companies that want Build 365 run for them, with a human to call. We host it in India or on your servers, keep it patched and backed up,
              wire up single sign-on and the audit trail, and answer in your time zone. Same open-source code, no forks, no lock-in.
            </p>

            <ol className="ent-steps">
              {STEPS.map((s) => (
                <li key={s.n} className="ent-step">
                  <span className="ent-n">{s.n}</span>
                  <b><s.icon size={15} aria-hidden="true" /> {s.title}</b>
                  <p>{s.body}</p>
                </li>
              ))}
            </ol>
            <p className="ent-cap">Starts at {PRICE.minSeats} seats. Volume pricing from {PRICE.volumeFrom}.</p>

            <ul className="ent-points">
              {ENT_POINTS.map((p) => <li key={p}>{p}</li>)}
            </ul>

            <div className="ent-price">
              <div className="ent-amount">
                <span className="ent-big"><b>{PRICE.seatYearly}</b><em>/seat/mo</em></span>
                <span className="ent-terms">billed yearly · {PRICE.seatMonthly} billed monthly · GST extra</span>
              </div>
              {LINKS.contact
                ? <a className="btn-s primary lg" href={LINKS.contact} {...(LINKS.contact.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>Talk to us <ArrowRight size={16} /></a>
                : <span className="btn-s lg soon" role="note"><i className="soon-dot" aria-hidden="true" /> Enterprise opens with 1.0</span>}
            </div>
          </Reveal>
        </div>

        <div className="tn">
          <div className="centered">
            <Reveal><p className="tn-kicker"><span className="tn-dot" aria-hidden="true" /> Built in Tamil Nadu. Priced for it.</p></Reveal>
          </div>
          <div className="tn-grid">
            {TN.map((t, i) => (
              <Reveal key={t.title} className="tn-card" delay={i * 80}>
                <t.icon size={18} aria-hidden="true" />
                <h3>{t.title}</h3>
                <p>{t.body}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={120}><p className="tn-fine">Prices in Indian rupees. Enterprise pricing is per seat per month, with a {PRICE.minSeats}-seat minimum and 18% GST on the invoice. The founders’ programme needs a StartupTN or DPIIT certificate and a registered office in Tamil Nadu.</p></Reveal>
        </div>
      </div>
    </section>
  );
}
