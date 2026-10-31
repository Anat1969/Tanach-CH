import { useState } from 'react';
import TimeTrack from './TimeTrack';
import RouteMap from './RouteMap';
import FamilyTree from './FamilyTree';
import { ROUTES, type RouteDef } from '../content/route';
import { TIMELINE, type Era } from '../content/timeline';
import { TREES } from '../content/families';
import { ERA_CONTEXT } from '../content/context';
import { ART } from '../content/art';
import type { Story } from '../types';

// The same stage on every topic page, in the same place:
// 1. the year scale (top band), 2. the map (left) and the family tree (right), 3. the numbered story rows.
// The story in focus lights its point on the scale, its stops on the map, and its people in the tree.
export default function Stage({
  stories,
  eras,
  route,
  focusId,
  onFocus,
}: {
  stories: Story[];
  eras?: Era[];
  route?: RouteDef;
  focusId: string;
  onFocus: (id: string) => void;
}) {
  const [zoom, setZoom] = useState<'wide' | 'close'>('wide');
  const [playToken, setPlayToken] = useState(0);
  const focus = stories.find((s) => s.id === focusId) ?? stories[0];
  const storyIds = stories.map((s) => s.id);
  const timeIds = TIMELINE.filter((e) => e.storyId && (focus ? e.storyId === focus.id : storyIds.includes(e.storyId))).map((e) => e.id);
  const mapRoute = route ?? (focus && ROUTES.find((r) => r.stops.some((st) => st.storyIds.includes(focus.id)))) ?? ROUTES[0];
  const stopIds = mapRoute.stops.filter((st) => stories.some((s) => st.storyIds.includes(s.id))).map((st) => st.id);
  const focusStopIds = focus ? mapRoute.stops.filter((st) => st.storyIds.includes(focus.id)).map((st) => st.id) : [];
  const tree = focus && TREES.find((t) => t.nodes.some((n) => focus.people.includes(n.id)));
  const eraOfFocus = focus ? [focus.era] : eras ?? [];

  return (
    <div className="stage">
      <section className="stage-band" aria-label="ציר זמן">
        <TimeTrack highlightEras={eraOfFocus} highlightIds={timeIds} />
      </section>

      <div className="stage-row">
        <section className="stage-map" aria-label="מפה">
          <div className="stage-tools">
            <span className="eyebrow">{mapRoute.he}</span>
            <div className="zoom-buttons" role="group" aria-label="תצוגת המפה">
              <button type="button" className={`chip press${zoom === 'wide' ? ' is-active' : ''}`} aria-pressed={zoom === 'wide'} onClick={() => setZoom('wide')}>
                המזרח הקרוב
              </button>
              <button type="button" className="chip press" onClick={() => setPlayToken((n) => n + 1)}>הפעל מסע</button>
              <button type="button" className={`chip press${zoom === 'close' ? ' is-active' : ''}`} aria-pressed={zoom === 'close'} onClick={() => setZoom('close')}>
                ארץ ישראל מקרוב
              </button>
            </div>
          </div>
          <div className="map-frame">
            <RouteMap route={mapRoute} selectedId={null} onSelect={() => undefined} playToken={playToken} highlightStopIds={focusStopIds.length ? focusStopIds : stopIds} zoom={zoom} />
          </div>
        </section>

        <section className="stage-people" aria-label="דמויות">
          <p className="eyebrow">{focus ? `דמויות: ${focus.title}` : 'דמויות'}</p>
          {tree ? (
            <FamilyTree tree={tree} highlight={focus?.people ?? []} />
          ) : (
            <p className="muted">לסיפור הזה אין עדיין עץ משפחתי.</p>
          )}
        </section>
      </div>

      <section className="stage-list" aria-label="סיפורים">
        <p className="eyebrow">{stories.length} סיפורים · לחצו על שורה כדי להדגיש אותה בכל התמונה</p>
        <ol className="story-rows">
          {stories.map((s, i) => (
            <li key={s.id}>
              <button type="button" className={`story-row${s.id === focus?.id ? ' is-focus' : ''}`} aria-pressed={s.id === focus?.id} onClick={() => onFocus(s.id)}>
                <span className="row-num">{i + 1}</span>
                <span className="row-era">{s.era}</span>
                <span className="row-ref">{s.ref}</span>
                <span className="row-title">{s.title}</span>
                <span className="row-insight">{s.insight}</span>
              </button>
              {s.id === focus?.id && (
                <div className="row-detail">
                  <p>
                    {ERA_CONTEXT[s.era].years}
                  </p>
                  {ART[s.id] && <p className="source">תמונה: {ART[s.id].title}, {ART[s.id].artist}, {ART[s.id].year}</p>}
                  <p>
                    <a className="chip press" href={`#/stories/${s.id}`}>
                      פתיחת הסיפור
                    </a>
                  </p>
                </div>
              )}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
