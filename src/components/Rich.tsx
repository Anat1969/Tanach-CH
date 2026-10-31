import { Fragment, type ReactNode } from 'react';
import { PEOPLE } from '../content/people';
import { ROUTES } from '../content/route';

// Names of people and places are bold wherever they appear in the text (the house rule for names).
const NAMES = Array.from(
  new Set([...PEOPLE.map((p) => p.he), ...ROUTES.flatMap((r) => r.stops.map((s) => s.he))]),
).sort((a, b) => b.length - a.length);
const NAME_RE = new RegExp(`(${NAMES.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');

function boldNames(text: string): string {
  // Leave existing **bold** and ==marker== segments alone; mark names in the rest.
  return text
    .split(/(\*\*[^*]+\*\*|==[^=]+==)/g)
    .map((part) => (part.startsWith('**') || part.startsWith('==') ? part : part.replace(NAME_RE, '**$1**')))
    .join('');
}

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
  const parts = boldNames(text).split(/(\*\*[^*]+\*\*|==[^=]+==)/g);
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
