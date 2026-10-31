import { useState } from 'react';
import { motion } from 'framer-motion';
import IsoStack from '../components/IsoStack';
import Motif from '../components/Motif';
import Correlation from '../components/Correlation';
import { ART } from '../content/art';
import { QUOTE_VOCAL } from '../content/quotes';
import { PLOTS } from '../content/plots';
import QuestionAnswers from '../components/QuestionAnswers';
import Typed from '../components/Typed';
import { STORY_CHAPTERS } from '../content/chapters';
import { BookRail } from '../components/BookRail';
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
          <Rich text={`==${story.insight}==`} />
        </p>
        <div className="story-motif">
          <Motif size={120} />
        </div>
        {ART[story.id] && (
          <figure className="art-hero">
            <img src={ART[story.id].src} alt={ART[story.id].title} />
            <figcaption className="art-caption">
              {ART[story.id].title}, {ART[story.id].artist}, {ART[story.id].year}. <span className="source">{ART[story.id].license}</span>
            </figcaption>
          </figure>
        )}
      </header>

      <section className="plot" aria-label="תקציר העלילה">
        <p className="eyebrow">תקציר העלילה</p>
        <p>{PLOTS[story.id]}</p>
      </section>

      <blockquote className="quote">
        <p className="quote-text" lang="he">“{QUOTE_VOCAL[story.id] ?? story.quote.text}”</p>
        <cite>{story.quote.source}</cite>
      </blockquote>

      <div className="story-layout">
        <aside className="story-side">
          <p className="eyebrow">בחרו מושג פרשני</p>
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
          <p className="eyebrow">שאלות לקורא · לחצו לכתיבת תשובה</p>
          <QuestionAnswers storyId={story.id} questions={story.questions} />
        </section>

        <section className="card tone-insight">
          <p className="eyebrow">שלוש שורות</p>
          <Typed lines={story.haiku} />
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
                  {s.he}
                </h3>
                <p className="eyebrow">{s.ref}</p>
                <p>{r.he}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {STORY_CHAPTERS[story.id] && (
        <section className="block">
          <BookRail bookId={STORY_CHAPTERS[story.id].book} from={STORY_CHAPTERS[story.id].from} to={STORY_CHAPTERS[story.id].to} />
        </section>
      )}

      <div className="block">
        <Correlation title="הקשר לסיפור: מקום, זמן, דמויות וחדשות התקופה" initial="stories" stories={[story]} />
      </div>

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
