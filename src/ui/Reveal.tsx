import type { CSSProperties, ElementType, ReactNode } from 'react';
import { useInView } from '../hooks';

/** Fades and lifts its children in the first time they scroll into view. */
export default function Reveal({ children, delay = 0, as: Tag = 'div', className = '' }: { children: ReactNode; delay?: number; as?: ElementType; className?: string }) {
  const [ref, seen] = useInView<HTMLElement>();
  return (
    <Tag ref={ref} className={`reveal${seen ? ' in' : ''} ${className}`} style={{ '--d': `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}
