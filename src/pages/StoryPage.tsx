import { useState } from 'react';
import { motion } from 'framer-motion';
import IsoStack from '../components/IsoStack';
import Rich from '../components/Rich';
import { STORIES } from '../content/stories';
import { ROUTES } from '../content/route';
import { levelById, type Level, type SourceKind } from '../types';
import { setRoute } from '../lib/hash';

const KIND_TEXT: Record<SourceKind, string> = {
  טקסט: 'טקסט המקרא',
  רמז: 'רמז',
  מדרש: 'מדרש',
  פרשנות: 'פרשנות מסורתית',
  קבלה: 'קבלה',
};

interface Props {
  id: string;
  level: string | null;
}

export default function StoryPage({ id, level }: Props) {
  const index = STORIES.findIndex((s) => s.id === id);
  const story = STORIES[index];
  const [localLevel, setLocalLevel] = useState<Level | null>(null);

  if (!story) {
    return (
      <div className="panel tone-problem">
        <p className="eyebrow">סיפור לא נמצא</p>
        <h1>הקישור הזה לא מוביל לסיפור.</h1>
        <p>
          <a className="chip press" href="#/stories">חזרה לרשימת הסיפורים</a>
        </p>
      </div>
    );
  }

  const active = levelById(localLevel ?? level);
  const content = story.levels[active.id];
  const prev = STORIES[(index - 1 + STORIES.length) % STORIES.length];
  const next = STORIES[(index + 1) % STORIES.length];
  const stops = ROUTES.flatMap((r) => r.stops.filter((s) => s.storyIds.includes(story.id)).map((s) => ({ r, s })));

  const choose = (lv: Level) => {
    setLocalLevel(lv);
    setRoute(['stories', story.id], { level: lv });
  };

  return (
    <article className="story">
      <header className="page-head">
        <p className="eyebrow">{story.ref}</p>
        <h1>{story.title}</h1>
        <p className="insight-line">
          <Rich text={story.insight} />
        </p>
      </header>

      <blockquote className="quote">
        <p>{story.quote.text}</p>
        <cite>{story.quote.source}</cite>
      </blockquote>

      <div className="story-layout">
        <aside className="story-side">
          <p className="eyebrow">בחרו קומה</p>
          <IsoStack active={active.id} onSelect={choose} />
        </aside>

        <motion.section
          key={`${story.id}-${active.id}`}
          className={`panel level-panel level-${active.id}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{ borderInlineStartColor: active.color }}
        >
          <p className="eyebrow">
            {active.floor} · {KIND_TEXT[content.kind]}
          </p>
          <h2>{content.line}</h2>
          <p>
            <Rich text={content.body} />
          </p>
          <p className="source">מקור: {content.source}</p>
        </motion.section>
      </div>

      <div className="grid two">
        <section className="card">
          <p className="eyebrow">שאלות לקורא</p>
          <ul className="plain-list">
            {story.questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
          <a className="chip press" href={`#/journal`}>
            לכתוב ביומן
          </a>
        </section>

        <section className="card tone-insight">
          <p className="eyebrow">שלוש שורות</p>
          <p className="haiku">
            {story.haiku.map((line) => (
              <span key={line} className="haiku-line">
                {line}
              </span>
            ))}
          </p>
          <p className="haiku-note">{story.haikuNote}</p>
        </section>
      </div>

      {stops.length > 0 && (
        <section className="block">
          <p className="eyebrow">במפה</p>
          <div className="grid cards">
            {stops.map(({ r, s }) => (
              <a key={`${r.id}-${s.id}`} className="card link-card press" href={`#/map?route=${r.id}`}>
                <h3>
                  {s.he} <span className="en">({s.en})</span>
                </h3>
                <p className="eyebrow">{s.ref}</p>
                <p>{r.he}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      <nav className="story-nav" aria-label="מעבר בין סיפורים">
        <a className="chip press" href={`#/stories/${prev.id}`}>
          הקודם: {prev.title}
        </a>
        <a className="chip press" href={`#/stories/${next.id}`}>
          הבא: {next.title}
        </a>
      </nav>
    </article>
  );
}
