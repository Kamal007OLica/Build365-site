import { useState } from 'react';
import { AnimatedMark, OrbMark } from '../../shared/components/OrbMark';

/** The mark lives in the app (src/components/OrbMark.tsx) so the product and the site can never drift apart. */
export function Mark({ size = 28, plate = false }: { size?: number; plate?: boolean }) {
  return <OrbMark size={size} plate={plate} />;
}

/** The wordmark. In the nav the ring turns slowly, and spins up while the pointer is on it. */
export default function Logo({ animated = false }: { animated?: boolean }) {
  const [hot, setHot] = useState(false);
  return (
    <span className="logo" onMouseEnter={() => setHot(true)} onMouseLeave={() => setHot(false)} onFocus={() => setHot(true)} onBlur={() => setHot(false)}>
      {animated ? <AnimatedMark size={30} speed={0.03} pulse={0.18} boost={hot} /> : <Mark size={30} />}
      <span className="logo-word">Build <b>365</b></span>
    </span>
  );
}
