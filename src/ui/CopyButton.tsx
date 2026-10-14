import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="copy-btn"
      onClick={() => navigator.clipboard.writeText(text).then(() => { setDone(true); setTimeout(() => setDone(false), 1400); }, () => {})}
      aria-label={done ? 'Copied' : label}
    >
      {done ? <Check size={14} /> : <Copy size={14} />}
      <span>{done ? 'Copied' : label}</span>
    </button>
  );
}
