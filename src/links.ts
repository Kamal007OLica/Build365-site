const base = import.meta.env.BASE_URL;
/** Set VITE_REPO_URL when the repository is public. Without it, every GitHub link is hidden so visitors never hit a 404. */
const repo = ((import.meta.env.VITE_REPO_URL as string | undefined) ?? '').replace(/\/$/, '');

/** The product is not public yet. Set VITE_DEMO_LIVE=1 (and build the demo) to switch every "Coming soon" back to the live demo. */
export const DEMO_LIVE = import.meta.env.VITE_DEMO_LIVE === '1';

/** Where "Talk to us" on the Enterprise plan goes (a mailto:, a form or a calendar link). Unset, the button reads "Enterprise opens with 1.0". */
const contact = ((import.meta.env.VITE_CONTACT_URL as string | undefined) ?? '').trim();

export const LINKS = {
  contact,
  demo: DEMO_LIVE ? `${base}app/` : '',
  github: repo,
  readme: repo ? `${repo}#readme` : '',
  issues: repo ? `${repo}/issues` : '',
} as const;
