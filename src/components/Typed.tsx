import { useEffect, useState } from 'react';

// Three lines typed one after the other, the way text appears when someone types it, with a caret.
export default function Typed({ lines, speed = 34 }: { lines: string[]; speed?: number }) {
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [line, setLine] = useState(reduce ? lines.length : 0);
  const [chars, setChars] = useState(reduce ? Number.MAX_SAFE_INTEGER : 0);

  useEffect(() => {
    if (reduce || line >= lines.length) return;
    if (chars >= lines[line].length) {
      const t = window.setTimeout(() => {
        setLine((l) => l + 1);
        setChars(0);
      }, 260);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setChars((c) => c + 1), speed);
    return () => window.clearTimeout(t);
  }, [line, chars, lines, speed, reduce]);

  return (
    <p className="haiku typed" aria-label={lines.join(' ')}>
      {lines.map((text, i) => {
        const shown = i < line ? text : i === line ? text.slice(0, chars) : '';
        const active = i === line && line < lines.length;
        return (
          <span key={text} className="haiku-line">
            {shown}
            {active && <span className="caret" aria-hidden="true">|</span>}
          </span>
        );
      })}
    </p>
  );
}
