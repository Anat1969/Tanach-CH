import { useMemo, useState } from 'react';
import { STORIES } from '../content/stories';
import { PEOPLE } from '../content/people';
import { ROUTES } from '../content/route';
import { BOOKS } from '../content/books';
import { setRoute } from '../lib/hash';

interface Hit {
  key: string;
  label: string;
  sub: string;
  go: () => void;
}

// Keyword search over stories, people, stops and books. The ✕ clears it; Escape clears too.
export function SearchBox() {
  const [q, setQ] = useState('');
  const term = q.trim();

  const index = useMemo<Hit[]>(() => {
    const hits: Hit[] = [];
    STORIES.forEach((s) =>
      hits.push({ key: `s-${s.id}`, label: s.title, sub: `סיפור · ${s.ref}`, go: () => (window.location.hash = `#/stories/${s.id}`) }),
    );
    PEOPLE.forEach((p) => hits.push({ key: `p-${p.id}`, label: p.he, sub: `דמות · ${p.en}`, go: () => setRoute(['people']) }));
    ROUTES.forEach((r) =>
      r.stops.forEach((st) =>
        hits.push({ key: `t-${r.id}-${st.id}`, label: st.he, sub: `תחנה · ${r.he} · ${st.en}`, go: () => setRoute(['map'], { route: r.id }) }),
      ),
    );
    BOOKS.forEach((b) => hits.push({ key: `b-${b.id}`, label: b.he, sub: `ספר · ${b.en}`, go: () => setRoute(['stories'], { book: b.id }) }));
    return hits;
  }, []);

  const results = term
    ? index.filter((h) => h.label.includes(term) || h.sub.includes(term)).slice(0, 8)
    : [];

  return (
    <div className="search">
      <label className="visually-hidden" htmlFor="site-search">חיפוש</label>
      <div className="search-field">
        <input
          id="site-search"
          type="search"
          value={q}
          placeholder="חיפוש: סיפור, דמות, תחנה, ספר"
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setQ('');
          }}
          autoComplete="off"
        />
        {term && (
          <button type="button" className="search-clear" aria-label="ניקוי החיפוש" onClick={() => setQ('')}>
            ✕
          </button>
        )}
      </div>
      {term && (
        <ul className="search-results" aria-label="תוצאות חיפוש">
          {results.length === 0 && <li className="muted">לא נמצאו תוצאות ל"{term}".</li>}
          {results.map((h) => (
            <li key={h.key}>
              <button
                type="button"
                onClick={() => {
                  h.go();
                  setQ('');
                }}
              >
                <strong>{h.label}</strong> <span className="muted">{h.sub}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
