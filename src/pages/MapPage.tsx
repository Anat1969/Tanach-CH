import { useState } from 'react';
import Rich from '../components/Rich';
import Stage from '../components/Stage';
import { ROUTES } from '../content/route';
import { STORIES } from '../content/stories';
import { setRoute } from '../lib/hash';

interface Props {
  routeId: string | null;
}

// Topic: the route. The choice of route sits in the same bar as the stage below; nothing changes page.
export default function MapPage({ routeId }: Props) {
  const route = ROUTES.find((r) => r.id === routeId) ?? ROUTES[0];
  const stories = STORIES.filter((s) => route.stops.some((st) => st.storyIds.includes(s.id)));
  const [focusId, setFocusId] = useState(stories[0]?.id ?? '');
  const [stopId, setStopId] = useState<string | null>(null);
  const stop = route.stops.find((st) => st.id === stopId) ?? null;
  const number = (id: string) => route.stops.findIndex((st) => st.id === id) + 1;

  return (
    <div className="map-page">
      <header className="page-head">
        <p className="eyebrow">מסלול · תחנות · סיפורים</p>
        <h1>המקרא נעשה בתנועה.</h1>
        <p className="lead">
          <Rich text={`**${route.stops.length}** תחנות במסלול **${route.he}**. הנקודות ממוספרות לפי הסדר במסע.`} />
        </p>
      </header>

      <div className="route-switch" role="group" aria-label="בחירת מסלול">
        {ROUTES.map((r) => (
          <button
            key={r.id}
            type="button"
            className={`chip press${route.id === r.id ? ' is-active' : ''}`}
            aria-pressed={route.id === r.id}
            onClick={() => {
              setRoute(['map'], { route: r.id });
              setStopId(null);
            }}
          >
            {r.he}
          </button>
        ))}
      </div>

      <Stage stories={stories} route={route} focusId={focusId} onFocus={setFocusId} />

      <section className="stage-list" aria-label="תחנות המסלול">
        <p className="eyebrow">תחנות · לחצו על תחנה לפרטים</p>
        <ol className="stop-rows">
          {route.stops.map((st, i) => (
            <li key={st.id}>
              <button type="button" className={`stop-row${stop?.id === st.id ? ' is-focus' : ''}`} onClick={() => setStopId(st.id)} aria-pressed={stop?.id === st.id}>
                <span className="row-num">{i + 1}</span>
                <span className="row-title">{st.he}</span>
                <span className="row-ref">{st.en}</span>
                <span className="row-ref">{st.ref}</span>
              </button>
              {stop?.id === st.id && (
                <div className="row-detail">
                  <p>
                    <Rich text={st.note} />
                  </p>
                  <p className="dig-note">
                    <strong>תיעוד ארכיאולוגי:</strong> {st.dig}
                  </p>
                  {st.disputed && <p className="dispute-note">מיקום שנוי במחלוקת. המיקום המוצג הוא הצעה לאתר זיהוי.</p>}
                  {st.storyIds.length > 0 && (
                    <p>
                      {st.storyIds.map((sid) => {
                        const sty = STORIES.find((x) => x.id === sid);
                        return sty ? (
                          <a key={sid} className="chip press" href={`#/stories/${sid}`}>
                            {sty.title}
                          </a>
                        ) : null;
                      })}
                    </p>
                  )}
                </div>
              )}
            </li>
          ))}
        </ol>
        <p className="source-line">
          מיקומים לפי קואורדינטות. מסע היציאה מוצג במחלוקת בחלק מתחנותיו. מספר התחנה: {number(stop?.id ?? route.stops[0].id)} מתוך {route.stops.length}.
        </p>
      </section>
    </div>
  );
}
