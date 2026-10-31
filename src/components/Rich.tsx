import { Fragment, type ReactNode } from 'react';

// Numbers are isolated left-to-right inside Hebrew text, so they never reorder.
function withNumbers(s: string): ReactNode[] {
  return s.split(/(\d[\d.,:-]*)/g).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="num">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

// **bold** marks a key term. ==text== marks the one insight of a block, shown as a yellow marker.
export default function Rich({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|==[^=]+==)/g);
  return (
    <span className={className}>
      {parts.map((p, i) => {
        if (p.startsWith('**') && p.endsWith('**') && p.length > 4) {
          return <strong key={i}>{withNumbers(p.slice(2, -2))}</strong>;
        }
        if (p.startsWith('==') && p.endsWith('==') && p.length > 4) {
          return (
            <mark key={i} className="insight">
              {withNumbers(p.slice(2, -2))}
            </mark>
          );
        }
        return <Fragment key={i}>{withNumbers(p)}</Fragment>;
      })}
    </span>
  );
}
