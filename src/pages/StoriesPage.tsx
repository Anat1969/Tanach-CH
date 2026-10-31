import Rich from '../components/Rich';
import { STORIES } from '../content/stories';
import { BOOKS } from '../content/books';
import { STORY_CHAPTERS } from '../content/chapters';
import { orderStories } from '../content/order';

interface Props {
  book: string | null;
}

// Topic: the stories. Each story is a numbered row: the book's own list, in the order of the text.
export default function StoriesPage({ book }: Props) {
  const current = BOOKS.find((b) => b.id === book) ?? null;
  const list = orderStories(current ? STORIES.filter((s) => s.book === current.id) : STORIES);
  return (
    <div className="stories">
      <header className="page-head">
        <p className="eyebrow">{current ? `${current.he} · ${current.en}` : `${STORIES.length} סיפורים`}</p>
        <h1>{current ? `סיפורי ${current.he}` : 'הסיפור נשאר. הקריאה משתנה.'}</h1>
        <p className="lead">
          <Rich text="כל סיפור מופיע בשורה: **מיקומו בספר**, **תקופה**, ו**מושגי הפרשנות**. לחצו על שורה לקריאה." />
        </p>
      </header>
      <section className="stage-list" aria-label="רשימת סיפורים">
        <ol className="story-rows">
          {list.map((s, i) => (
            <li key={s.id}>
              <a className="story-row" href={`#/stories/${s.id}`}>
                <span className="row-num">{i + 1}</span>
                <span className="row-era">{s.era}</span>
                <span className="row-ref">{STORY_CHAPTERS[s.id] ? `פרק ${STORY_CHAPTERS[s.id].from}${STORY_CHAPTERS[s.id].to !== STORY_CHAPTERS[s.id].from ? `–${STORY_CHAPTERS[s.id].to}` : ''}` : s.ref}</span>
                <span className="row-title">{s.title}</span>
                <span className="row-insight">{s.insight}</span>
              </a>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
