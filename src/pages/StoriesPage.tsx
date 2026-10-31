import Rich from '../components/Rich';
import { STORIES } from '../content/stories';

export default function StoriesPage() {
  return (
    <div className="stories">
      <header className="page-head">
        <p className="eyebrow">ששה סיפורים · ארבע קומות לכל סיפור</p>
        <h1>הסיפור נשאר. הקומה משתנה.</h1>
        <p className="lead">
          <Rich text="בחרו סיפור, ועלו קומה אחר קומה. כל קומה מציגה **מקור**, **סוג הקריאה** ו**כלל** ברור." />
        </p>
      </header>
      <div className="grid cards">
        {STORIES.map((s) => (
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
