import Rich from '../components/Rich';
import { BOOKS, SECTIONS } from '../content/books';
import { STORIES } from '../content/stories';
import { BookSequence } from '../components/BookRail';

export default function BooksPage() {
  const built = BOOKS.filter((b) => STORIES.some((s) => s.book === b.id)).length;
  return (
    <div className="books-page">
      <header className="page-head">
        <p className="eyebrow">עשרים וארבעה ספרים · בנייה בשלבים</p>
        <h1>התנ"ך בשלושה חלקים ובעשרים וארבעה בתים.</h1>
        <p className="lead">
          <Rich text={`**${built}** ספרים פעילים כרגע. שאר הספרים נבנים בשלבים, כל שלב כשחרור נפרד.`} />
        </p>
      </header>

      <section className="block">
        <BookSequence />
      </section>

      {SECTIONS.map((section) => (
        <section key={section} className="block">
          <h2 className="section-title">{section}</h2>
          <div className="grid cards">
            {BOOKS.filter((b) => b.section === section).map((b) => {
              const count = STORIES.filter((s) => s.book === b.id).length;
              return count > 0 ? (
                <a key={b.id} href={`#/stories?book=${b.id}`} className="card link-card press book-card">
                  <h3>{b.he}</h3>
                  <p className="en">{b.en}</p>
                  <p className="eyebrow">{count} סיפורים · פעיל</p>
                </a>
              ) : (
                <div key={b.id} className="card book-card is-planned">
                  <h3>{b.he}</h3>
                  <p className="en">{b.en}</p>
                  <p className="eyebrow">ממתין לשלב {b.stage}</p>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
