import { useState } from 'react';
import { motion } from 'framer-motion';
import IsoStack from '../components/IsoStack';
import Rich from '../components/Rich';
import { levelById, type Level } from '../types';
import { setRoute } from '../lib/hash';

const CARDS: { href: string; title: string; text: string; count: string }[] = [
  { href: '#/stories', title: 'סיפורים', text: 'שישה סיפורים, כל אחד בארבע קומות פרשנות, עם מקור לכל קומה.', count: '6 סיפורים' },
  { href: '#/map', title: 'מפה', text: 'שני מסעות על מפה סכמטית: מסע האבות ומסע היציאה.', count: '2 מסעות' },
  { href: '#/time', title: 'ציר זמן', text: 'סדר המאורעות במקרא, עם תאריכים רק במקום שיש בו הסכמה.', count: '10 אירועים' },
  { href: '#/people', title: 'יחסים', text: 'דמויות וקשריהן, וכל קשר עם הפסוק שמעיד עליו.', count: '21 דמויות' },
  { href: '#/journal', title: 'יומן', text: 'ההערות שלך על כל סיפור. נשמרות בדפדפן בלבד.', count: 'אישי' },
];

export default function HomePage() {
  const [level, setLevel] = useState<Level>('remez');
  const current = levelById(level);

  return (
    <div className="home">
      <section className="hero">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="eyebrow">מפה · ציר זמן · יחסים · סיפור</p>
          <h1>התנ"ך נקרא כל שנה בקומה אחרת.</h1>
          <p className="lead">
            <Rich text="**ארבע** קומות פרשנות: **פשט, רמז, דרש, סוד**. כל סיפור הוא בית שעולים בו קומה אחר קומה." />
          </p>
          <p className="lead-line">
            <Rich text="==הטקסט נשאר, הקומה משתנה.==" />
          </p>
        </motion.div>

        <div className="hero-stack">
          <IsoStack active={level} onSelect={setLevel} />
          <div className="panel tone-neutral">
            <p className="eyebrow">{current.floor}</p>
            <h2>{current.name}</h2>
            <p>
              <Rich text={current.hint} />
            </p>
            <button
              type="button"
              className="chip press"
              onClick={() => setRoute(['stories', 'lech-lecha'], { level })}
            >
              פתיחת "לך לך" בקומה הזו
            </button>
          </div>
        </div>
      </section>

      <section className="block">
        <h2 className="section-title">בעיה, פתרון, תובנה</h2>
        <div className="grid three">
          <div className="card tone-problem">
            <p className="eyebrow">בעיה</p>
            <h3>הסיפור מוכר, והקריאה נשארת שטוחה.</h3>
            <p>
              <Rich text="בלי **שכבות**, סיפור מוכר נראה כמו סיפור סגור." />
            </p>
          </div>
          <div className="card tone-solution">
            <p className="eyebrow">פתרון</p>
            <h3>כל סיפור מוצג בארבע קומות.</h3>
            <p>
              <Rich text="**כל קומה** נושאת מקור, סוג קריאה וכלל ברור." />
            </p>
          </div>
          <div className="card tone-insight">
            <p className="eyebrow">תובנה</p>
            <h3>
              <Rich text="==הקומה הרביעית נבנית על הראשונה, לא מחליפה אותה.==" />
            </h3>
            <p>
              <Rich text="כמו **בניין** באשדוד: אותו מבנה, ומרפסת אחרת נותנת נוף אחר." />
            </p>
          </div>
        </div>
      </section>

      <section className="block">
        <h2 className="section-title">מה יש כאן</h2>
        <div className="grid cards">
          {CARDS.map((c, i) => (
            <motion.a
              key={c.href}
              href={c.href}
              className="card link-card press"
              initial={{ y: 12 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <span className="num-badge">{String(i + 1).padStart(2, '0')}</span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
              <span className="eyebrow">{c.count}</span>
            </motion.a>
          ))}
        </div>
      </section>

      <p className="source-line">
        בהשראת מפת הזרימה של צ'ארלס ז'וזף מינאר (Charles Joseph Minard), 1869, לתצוגת המסע.
      </p>
    </div>
  );
}
