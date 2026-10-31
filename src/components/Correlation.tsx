import { useState } from 'react';
import RouteMap from './RouteMap';
import StoryAtlas from './StoryAtlas';
import TimeTrack from './TimeTrack';
import FamilyTree from './FamilyTree';
import { ROUTES } from '../content/route';
import { TIMELINE, type Era } from '../content/timeline';
import { TREES } from '../content/families';
import { PEOPLE } from '../content/people';
import { ERA_CONTEXT } from '../content/context';
import { ART } from '../content/art';
import { setRoute } from '../lib/hash';
import type { Story } from '../types';

export type Module = 'place' | 'time' | 'people' | 'stories';

const MODULES: [Module, string][] = [
  ['place', 'מיקום'],
  ['time', 'זמן'],
  ['people', 'דמויות'],
  ['stories', 'סיפורים'],
];

const uniq = <T,>(xs: T[]): T[] => Array.from(new Set(xs));
const personName = (id: string) => PEOPLE.find((p) => p.id === id)?.he ?? id;

// Every stop that a story is tied to, with its route.
function stopsFor(stories: Story[]) {
  const ids = new Set(stories.map((s) => s.id));
  return ROUTES.flatMap((r) =>
    r.stops.filter((s) => s.storyIds.some((id) => ids.has(id))).map((s) => ({ route: r, stop: s })),
  );
}

interface Props {
  stories: Story[];
  title: string;
  initial?: Module;
  // Eras in focus (from the page's own choice), so the timeline can show them strongly.
  eras?: Era[];
}

// The correlation panel: one story set, shown four ways. The chosen module leads; the others follow,
// and everything tied to the same stories stays lit in each module.
export default function Correlation({ stories, title, initial = 'stories', eras }: Props) {
  const [primary, setPrimary] = useState<Module>(initial);
  const order: Module[] = [primary, ...MODULES.map((m) => m[0]).filter((m) => m !== primary)];

  if (stories.length === 0) {
    return (
      <div className="panel corr-empty">
        <p className="eyebrow">{title}</p>
        <h2>אין עדיין סיפור מקושר לבחירה הזו.</h2>
        <p>הבחירה תתעדכן כשיתווספו סיפורים בשלבים הבאים.</p>
      </div>
    );
  }

  const storyIds = stories.map((s) => s.id);
  const stops = stopsFor(stories);
  const routeId = stops[0]?.route.id ?? ROUTES[0].id;
  const route = ROUTES.find((r) => r.id === routeId) ?? ROUTES[0];
  const focusStopIds = stops.filter((x) => x.route.id === route.id).map((x) => x.stop.id);

  const focusEras = uniq(eras ?? stories.map((s) => s.era));
  const focusEvents = TIMELINE.filter((e) => e.storyId && storyIds.includes(e.storyId)).map((e) => e.id);

  const peopleIds = uniq(stories.flatMap((s) => s.people));
  const trees = TREES.filter((t) => t.nodes.some((n) => peopleIds.includes(n.id)));

  const render = (m: Module) => {
    if (m === 'place') {
      return (
        <div className="corr-place">
          {focusStopIds.length > 0 ? (
            <>
              <div className="map-frame">
                <RouteMap
                  route={route}
                  selectedId={null}
                  onSelect={(id) => setRoute(['map'], { route: route.id })}
                  playToken={0}
                  highlightStopIds={focusStopIds}
                />
              </div>
              <ul className="corr-list">
                {stops.map(({ route: r, stop }) => (
                  <li key={`${r.id}-${stop.id}`}>
                    <a href={`#/map?route=${r.id}`} className="link-btn">
                      {stop.he} ({stop.en})
                    </a>{' '}
                    <span className="source">{stop.ref}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="muted">לסיפורים אלה אין עדיין תחנה במפה. הם מתרחשים במקום שלא סומן בשלב הנוכחי.</p>
          )}
        </div>
      );
    }
    if (m === 'time') {
      return (
        <div className="corr-time">
          <TimeTrack highlightEras={focusEras} highlightIds={focusEvents} />
          {focusEras.map((era) => (
            <div key={era} className="era-context" style={{ borderInlineStartColor: 'var(--ink)' }}>
              <p className="eyebrow">{era}: {ERA_CONTEXT[era].years}</p>
              <ul className="plain-list">
                {ERA_CONTEXT[era].facts.map((f) => (
                  <li key={f.text}>
                    {f.text} <span className="source">מקור: {f.source}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    }
    if (m === 'people') {
      return (
        <div className="corr-people">
          {trees.length > 0 ? (
            trees.map((t) => (
              <div key={t.id} className="corr-tree">
                <p className="eyebrow">{t.he}</p>
                <div className="tree-scroll">
                  <FamilyTree tree={t} highlight={peopleIds} />
                </div>
              </div>
            ))
          ) : (
            <p className="muted">לסיפורים אלה אין עדיין עץ משפחתי.</p>
          )}
          <ul className="chip-cloud">
            {peopleIds.map((id) => (
              <li key={id} className="chip is-active">
                {personName(id)}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return (
      <StoryAtlas stories={stories} />
    );
  };

  return (
    <section className="correlation">
      <header className="corr-head">
        <p className="eyebrow">{title}</p>
        <div className="route-switch" role="group" aria-label="מה להדגיש">
          {MODULES.map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`chip press${primary === id ? ' is-active' : ''}`}
              aria-pressed={primary === id}
              onClick={() => setPrimary(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </header>
      {order.map((m) => {
        const label = MODULES.find((x) => x[0] === m)?.[1] ?? '';
        return (
          <article key={m} className={`panel corr-module corr-${m}${m === primary ? ' is-primary' : ' is-secondary'}`}>
            <h2 className={m === primary ? '' : 'corr-h-secondary'}>{label}</h2>
            {render(m)}
          </article>
        );
      })}
    </section>
  );
}
