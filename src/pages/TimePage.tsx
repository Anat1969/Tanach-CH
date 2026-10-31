import { useState } from 'react';
import Rich from '../components/Rich';
import Stage from '../components/Stage';
import HowTo from '../components/HowTo';
import { TIMELINE, ERA_COLOR, type Era } from '../content/timeline';
import { STORIES } from '../content/stories';

const ERAS = Object.keys(ERA_COLOR) as Era[];

// Topic: the period. Choosing an era narrows the stage below; the year scale stays in its place.
export default function TimePage() {
  const [era, setEra] = useState<Era | null>(null);
  const stories = STORIES.filter((s) => (era ? s.era === era : true));
  const [focusId, setFocusId] = useState(stories[0]?.id ?? '');

  return (
    <div className="time-page">
      <header className="page-head">
        <p className="eyebrow">ציר זמן · שנים</p>
        <h1>המאורעות על ציר אחד.</h1>
        <p className="lead">
          <Rich text="**10** אירועים מרכזיים על ציר של **שנים**. כל אירוע מסומן כ**מוסכם** בחקר, או כ**הערכה**." />
        </p>
      </header>

      <HowTo>גלגלת העכבר מקרבת ומרחיקה את ציר השנים, וגרירה מזיזה אותו. לחיצה כפולה מחזירה לתצוגה המקורית. בחרו תקופה כדי לצמצם את הסיפורים.</HowTo>

      <div className="route-switch" role="group" aria-label="בחירת תקופה">
        <button type="button" className={`chip press${era === null ? ' is-active' : ''}`} aria-pressed={era === null} onClick={() => { setEra(null); setFocusId(STORIES[0].id); }}>
          כל התקופות
        </button>
        {ERAS.map((e) => (
          <button
            key={e}
            type="button"
            className={`chip press${era === e ? ' is-active' : ''}`}
            aria-pressed={era === e}
            onClick={() => {
              setEra(e);
              setFocusId(STORIES.find((s) => s.era === e)?.id ?? '');
            }}
          >
            {e}
          </button>
        ))}
      </div>

      <Stage stories={stories} eras={era ? [era] : undefined} focusId={focusId} onFocus={setFocusId} />

      <section className="stage-list" aria-label="אירועי הציר">
        <p className="eyebrow">אירועים · לפי סדר השנים</p>
        <ol className="stop-rows">
          {TIMELINE.map((ev, i) => (
            <li key={ev.id} id={ev.id}>
              <div className="stop-row event-row">
                <span className="row-num">{i + 1}</span>
                <span className="row-era" style={{ color: ERA_COLOR[ev.era] }}>{ev.era}</span>
                <span className="row-title">{ev.title}</span>
                <span className="row-ref">{ev.when}</span>
              </div>
              <div className="row-detail">
                <p>{ev.note}</p>
                <p className="source">מקור: {ev.ref}</p>
                {ev.storyId && (
                  <a className="chip press" href={`#/stories/${ev.storyId}`}>
                    לסיפור
                  </a>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
