import { BOOKS, SECTIONS, type Section } from '../content/books';
import { CHAPTER_COUNT } from '../content/chapters';
import { STORIES } from '../content/stories';

const SECTION_COLOR: Record<Section, string> = {
  תורה: '#a65d2e',
  'נביאים ראשונים': '#4f6b3a',
  'נביאים אחרונים': '#1f3558',
  כתובים: '#5b3a6e',
};

// One book as a rail of chapters. The chapters of the story in focus are highlighted and labelled.
export function BookRail({ bookId, from, to }: { bookId: string; from?: number; to?: number }) {
  const book = BOOKS.find((b) => b.id === bookId);
  const n = CHAPTER_COUNT[bookId] ?? 0;
  if (!book || n === 0) return null;
  const W = 1000;
  const x = (c: number) => 20 + ((c - 1) / Math.max(n - 1, 1)) * (W - 40);
  const ticks = Array.from({ length: n }, (_, i) => i + 1);
  const mark = from !== undefined && to !== undefined;
  return (
    <figure className="book-rail">
      <figcaption className="eyebrow">
        {book.he} <span dir="ltr">({book.en})</span>, {n} פרקים
        {mark && from !== undefined && to !== undefined && (
          <>
            {' · '}הסיפור: פרק{from === to ? ` ${from}` : `ים ${from}–${to}`}
          </>
        )}
      </figcaption>
      <svg viewBox={`0 0 ${W} 90`} className="rail-svg" role="img" aria-label={`פרקי ${book.he}`}>
        <line x1={20} y1={44} x2={W - 20} y2={44} className="rail-line" />
        {ticks.map((c) => {
          const inside = mark && from !== undefined && to !== undefined && c >= from && c <= to;
          return (
            <g key={c}>
              <line x1={x(c)} y1={36} x2={x(c)} y2={52} className={inside ? 'rail-tick is-focus' : 'rail-tick'} />
              {(c === 1 || c === n || c % 10 === 0 || inside) && (
                <text x={x(c)} y={74} textAnchor="middle" className={inside ? 'rail-num is-focus' : 'rail-num'}>
                  {c}
                </text>
              )}
            </g>
          );
        })}
        {mark && from !== undefined && to !== undefined && (
          <rect x={x(from) - 3} y={28} width={Math.max(x(to) - x(from), 0) + 6} height={32} className="rail-focus" />
        )}
      </svg>
    </figure>
  );
}

// All 24 books in the traditional order, widths by chapter count. Built books are solid, others outlined.
export function BookSequence() {
  const total = BOOKS.reduce((sum, b) => sum + (CHAPTER_COUNT[b.id] ?? 0), 0);
  const W = 1000;
  let acc = 0;
  return (
    <figure className="book-seq">
      <figcaption className="eyebrow">כל ספרי התנ"ך לפי הסדר המסורתי, ברוחב לפי מספר הפרקים</figcaption>
      <svg viewBox={`0 0 ${W} 150`} className="seq-svg" role="img" aria-label="סדר ספרי התנ&quot;ך">
        {BOOKS.map((b) => {
          const w = ((CHAPTER_COUNT[b.id] ?? 0) / total) * W;
          const x = acc;
          acc += w;
          const built = STORIES.some((s) => s.book === b.id);
          return (
            <g key={b.id}>
              <rect
                x={x}
                y={20}
                width={Math.max(w - 2, 1)}
                height={60}
                fill={built ? SECTION_COLOR[b.section] : 'none'}
                stroke={SECTION_COLOR[b.section]}
                strokeWidth={built ? 0 : 1.5}
              >
                <title>{`${b.he} (${b.en}): ${CHAPTER_COUNT[b.id] ?? 0} פרקים`}</title>
              </rect>
              {w > 45 && (
                <text x={x + w / 2} y={60} textAnchor="middle" className={`seq-label${built ? ' is-built' : ''}`} style={{ direction: 'rtl' }}>
                  {b.he}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="seq-legend">
        {SECTIONS.map((s) => (
          <span key={s} className="legend-item">
            <span className="dot-line" style={{ background: SECTION_COLOR[s] }} /> {s}
          </span>
        ))}
        <span className="legend-item muted">מלא: פעיל. מסגרת: ממתין לשלב.</span>
      </div>
    </figure>
  );
}
