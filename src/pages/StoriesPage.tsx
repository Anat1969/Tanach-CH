import Rich from '../components/Rich';
import { STORIES } from '../content/stories';
import { BOOKS } from '../content/books';

interface Props {
  book: string | null;
}

export default function StoriesPage({ book }: Props) {
  const current = BOOKS.find((b) => b.id === book) ?? null;
  const list = current ? STORIES.filter((s) => s.book === current.id) : STORIES;
  return (
    <div className="stories">
      <header className="page-head">
        <p className="eyebrow">
          {current ? `${current.he} · ${current.en}` : `${STORIES.length} סיפורים · ארבע קומות לכל סיפור`}
        </p>
        <h1>{current ? `סיפורי ${current.he}` : 'הסיפור נשאר. הקומה משתנה.'}</h1>
        <p className="lead">
          <Rich text="בחרו סיפור, ועלו קומה אחר קומה. כל קומה מציגה **מקור**, **סוג הקריאה** ו**כלל** ברור." />
        </p>
        {current && (
          <p>
            <a className="chip press" href="#/stories">כל הסיפורים</a>{' '}
            <a className="chip press" href="#/books">כל הספרים</a>
          </p>
        )}
      </header>
      <div className="grid cards">
        {list.map((s) => (
          <a key={s.id} href={`#/stories/${s.id}`} className="card link-card press">
            <p className="eyebrow">{s.ref}</p>
            <h2>{s.title}</h2>
            <p>
              <Rich text={s.insight} />
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
