import { useState } from 'react';
import Rich from '../components/Rich';
import FamilyTree from '../components/FamilyTree';
import { KIND_LABEL, PEOPLE, RELATIONS, type RelationKind } from '../content/people';
import { TREES } from '../content/families';

const KIND_COLOR: Record<RelationKind, string> = {
  family: '#a65d2e',
  conflict: '#b3261e',
  bond: '#4f6b3a',
};

export default function PeoplePage() {
  const [treeId, setTreeId] = useState(TREES[0].id);
  const [selected, setSelected] = useState('abraham');
  const tree = TREES.find((t) => t.id === treeId) ?? TREES[0];
  const person = PEOPLE.find((p) => p.id === selected) ?? PEOPLE[0];
  const name = (id: string) => PEOPLE.find((p) => p.id === id)?.he ?? id;

  const related = RELATIONS.filter((r) => r.a === selected || r.b === selected).map((r) => ({
    ...r,
    other: r.a === selected ? r.b : r.a,
  }));

  return (
    <div className="people-page">
      <header className="page-head">
        <p className="eyebrow">עץ משפחתי · קשרים · פסוקים</p>
        <h1>מי נולד למי, ומי נאבק עם מי.</h1>
        <p className="lead">
          <Rich text="בחרו **משפחה**, ואז **דמות** בעץ. לכל קישור יש **פסוק** שמעיד עליו, ואין קשר בלי מקור." />
        </p>
      </header>

      <div className="route-switch" role="group" aria-label="בחירת עץ">
        {TREES.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`chip press${t.id === tree.id ? ' is-active' : ''}`}
            aria-pressed={t.id === tree.id}
            onClick={() => setTreeId(t.id)}
          >
            {t.he}
          </button>
        ))}
      </div>

      <section className="panel tree-panel">
        <FamilyTree tree={tree} selected={selected} onPick={setSelected} />
        <p className="source-line">{tree.note}</p>
        <ul className="legend-eras" aria-label="מקרא קשרים">
          {(Object.keys(KIND_LABEL) as RelationKind[]).map((k) => (
            <li key={k} className="legend-item">
              <span className="dot-line" style={{ background: KIND_COLOR[k] }} /> {KIND_LABEL[k]}
            </li>
          ))}
        </ul>
      </section>

      <section className="block">
        <p className="eyebrow">
          <span className="num">{related.length}</span> קשרים · {person.he}
        </p>
        <div className="chip-cloud" role="group" aria-label="בחירת דמות">
          {PEOPLE.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`chip press${p.id === selected ? ' is-active' : ''}`}
              aria-pressed={p.id === selected}
              onClick={() => setSelected(p.id)}
            >
              {p.he} <span className="en">({p.en})</span>
            </button>
          ))}
        </div>
        <ul className="rel-list">
          {related.map((r) => (
            <li key={`${r.a}-${r.b}-${r.label}`} className="rel" style={{ borderInlineStartColor: KIND_COLOR[r.kind] }}>
              <span className="rel-kind" style={{ color: KIND_COLOR[r.kind] }}>
                {KIND_LABEL[r.kind]}
              </span>
              <h3>
                {person.he} ↔ {name(r.other)}
              </h3>
              <p>{r.label}</p>
              <p className="source">מקור: {r.ref}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
