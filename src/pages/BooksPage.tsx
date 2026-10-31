import { useState } from 'react';
import { BOOKS, SECTIONS } from '../content/books';
import { STORIES } from '../content/stories';
import { CHAPTER_COUNT } from '../content/chapters';
import { BookSequence } from '../components/BookRail';

// Three levels on one page: the Bible (the sequence), a book (a row), and its stories (rows under it).
// A book opens in place; nothing leaves the page.
export default function BooksPage() {
  const [open, setOpen] = useState<string | null>(null);
  const built = BOOKS.filter((b) => STORIES.some((s) => s.book === b.id)).length;
  let n = 0;
  return (
    <div className="books-page">
      <header className="page-head">
        <p className="eyebrow">תנ"ך · ספרים · סיפורים</p>
        <h1>התנ"ך בעשרים וארבעה ספרים.</h1>
        <p className="lead">{built} ספרים פעילים. בחרו ספר כדי לראות את סיפוריו בתוכו.</p>
      </header>

      <section className="stage-band" aria-label="סדר הספרים">
        <BookSequence />
      </section>

      {SECTIONS.map((section) => (
        <section key={section} className="stage-list" aria-label={section}>
          <p className="eyebrow">{section}</p>
          <ol className="book-rows">
            {BOOKS.filter((b) => b.section === section).map((b) => {
              n += 1;
              const stories = STORIES.filter((s) => s.book === b.id);
              const isOpen = open === b.id;
              return (
                <li key={b.id}>
                  <button
                    type="button"
                    className={`book-row${isOpen ? ' is-open' : ''}`}
                    aria-expanded={isOpen}
                    disabled={stories.length === 0}
                    onClick={() => setOpen(isOpen ? null : b.id)}
                  >
                    <span className="row-num">{n}</span>
                    <span className="row-title">{b.he}</span>
                    <span className="row-ref">{b.en}</span>
                    <span className="row-ref">{CHAPTER_COUNT[b.id]} פרקים</span>
                    <span className="row-ref">{stories.length > 0 ? `${stories.length} סיפורים` : `ממתין לשלב ${b.stage}`}</span>
                  </button>
                  {isOpen && (
                    <ol className="story-rows nested">
                      {stories.map((s, i) => (
                        <li key={s.id}>
                          <a className="story-row" href={`#/stories/${s.id}`}>
                            <span className="row-num">{i + 1}</span>
                            <span className="row-era">{s.era}</span>
                            <span className="row-ref">{s.ref}</span>
                            <span className="row-title">{s.title}</span>
                            <span className="row-insight">{s.insight}</span>
                          </a>
                        </li>
                      ))}
                    </ol>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
