// Brand marks. Lucide no longer ships third-party logos, so the two we need are drawn here.
// The Build365 mark is the voice-orb ring (see OrbMark), on a dark rounded plate so it reads at small sizes.
import { OrbMark } from './OrbMark';

export function Logo({ size = 20 }: { size?: number }) {
  return <OrbMark size={size} plate />;
}

/** The workspace's own logo when the owner uploaded one, otherwise the Build365 mark. */
export function WorkspaceLogo({ size = 20, src }: { size?: number; src?: string | null }) {
  if (!src) return <Logo size={size} />;
  return <img src={src} width={size} height={size} alt="" style={{ borderRadius: size * 0.25, objectFit: 'cover', flex: 'none', display: 'block' }} />;
}

export function GitHubMark({ className, size = 18 }: { className?: string; size?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export function FigmaMark({ className, size = 18, mono = false }: { className?: string; size?: number; mono?: boolean }) {
  const c = mono ? ['currentColor', 'currentColor', 'currentColor', 'currentColor', 'currentColor'] : ['#f24e1e', '#ff7262', '#a259ff', '#1abcfe', '#0acf83'];
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 38 57" aria-hidden="true" style={mono ? { opacity: 0.95 } : undefined}>
      <path fill={c[3]} d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0Z" opacity={mono ? 0.55 : 1} />
      <path fill={c[4]} d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0Z" opacity={mono ? 0.7 : 1} />
      <path fill={c[1]} d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19Z" opacity={mono ? 0.85 : 1} />
      <path fill={c[0]} d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5Z" />
      <path fill={c[2]} d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5Z" opacity={mono ? 0.7 : 1} />
    </svg>
  );
}

export function SpotifyMark({ className, size = 18 }: { className?: string; size?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#1ed760" />
      <g fill="none" stroke="#000" strokeLinecap="round">
        <path d="M5.6 8.6c4.2-1.2 8.7-.9 12.8 1.2" strokeWidth="1.9" />
        <path d="M6.3 12.1c3.6-1 7.3-.7 10.7 1" strokeWidth="1.6" />
        <path d="M7 15.3c3-.8 5.9-.5 8.7.9" strokeWidth="1.3" />
      </g>
    </svg>
  );
}
