// מפיק את public/creations.json: כתבות ויצירות מתוך הסיפורים של האפליקציה (תקן "יצירות", AppOfApp-GH/docs/creations-standard.md).
// הרצה: node tools/creations.mjs
// מקור: src/content/stories*.ts (פסוק לפי הכתיב, ארבע קומות פרשנות עם הסוגה והמקור שלהן, שאלות, הייקו),
// src/content/art.ts (יצירות בנחלת הכלל, עם אמן, שנה ורישיון) ו-src/content/context.ts (חדשות התקופה, עם מקור).
// בקוד הזה כתובים רק שמות התוויות. כל משפט אחר נלקח כלשונו מהנתונים.
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { build } from 'esbuild';

const tmp = path.resolve('node_modules/.cache/creations-data.mjs');
fs.mkdirSync(path.dirname(tmp), { recursive: true });
await build({
  stdin: { contents: "export { STORIES } from './src/content/stories'; export { ART } from './src/content/art'; export { ERA_CONTEXT } from './src/content/context'; export { LEVELS } from './src/types';", resolveDir: '.', loader: 'ts' },
  bundle: true, format: 'esm', platform: 'node', outfile: tmp, logLevel: 'error',
});
const { STORIES, ART, ERA_CONTEXT, LEVELS } = await import(pathToFileURL(tmp).href);
const S = Object.fromEntries(STORIES.map((s) => [s.id, s]));
const LV = Object.fromEntries(LEVELS.map((l) => [l.id, l]));

const img = (s) => { const a = ART[s.id]; if (!a || !fs.existsSync(path.join('public', a.src))) return {}; return { image: a.src, credit: `${a.title} · ${a.artist}, ${a.year}. ${a.license}` }; };
const quote = (s) => ({ style: 'quote', quote: s.quote.text, who: s.ref, cite: s.quote.source });
const haiku = (s) => ({ style: 'haiku', lines: s.haiku, text: s.haikuNote });
const lv = (s, k) => `**${LV[k].name}.** ${s.levels[k].body}`;
const ln = (s, k) => `**${LV[k].name}.** ${s.levels[k].line}`;
const fact = (s) => { const f = ERA_CONTEXT[s.era]?.facts?.[0]; return f ? `${f.text} (${f.source})` : ''; };
const T = (id, zone, title, sub, creations, kicker) => ({ id, zone, title, sub, creations: creations.filter(Boolean).map((c) => ({ id: c.id || c.style, kicker: c.kicker || kicker, ...c })) });

// שלושה שלבים, אותו סיפור בשלוש קריאות:
// ידע: הכתוב ושלוש הקומות שמעליו, וחדשות התקופה. הבנה: מפשט לדרש, והרמז כהכרעה. יישום: מהסיפור אל היומן.
const BUILD = {
  'ידע': (s) => [
    { style: 'poster', title: ART[s.id]?.title || s.title, text: s.insight, ...img(s), pos: 'center 35%' },
    quote(s),
    { style: 'essay', title: 'ארבע קומות', text: s.levels.pshat.line, body: [lv(s, 'pshat'), ln(s, 'remez'), ln(s, 'derash'), ln(s, 'sod')] },
    { style: 'insight', title: s.insight, text: fact(s) },
    haiku(s),
  ],
  'הבנה': (s) => [
    { style: 'veil', title: s.title, text: s.levels.remez.line, ...img(s), pos: 'center 35%' },
    quote(s),
    { style: 'fromto', title: 'מפשט לדרש', fromLabel: `${LV.pshat.name} · ${s.levels.pshat.kind}`, from: s.levels.pshat.line, toLabel: `${LV.derash.name} · ${s.levels.derash.kind}`, to: s.levels.derash.line, text: s.levels.derash.source },
    { style: 'essay', title: 'מה הכתוב אומר, ומה קוראים בו', text: s.levels.pshat.line, body: [lv(s, 'pshat'), ln(s, 'sod')] },
    { style: 'insight', title: s.levels.remez.line, text: s.levels.remez.body },
    haiku(s),
  ],
  'יישום': (s) => [
    { style: 'post', title: s.title, text: [s.insight, ...s.questions].join('\n'), ...img(s), pos: 'center 35%', tags: ['תנך_כמסע', 'יומן'] },
    quote(s),
    { style: 'fromto', title: 'מהסיפור אל היומן', fromLabel: s.ref, from: s.levels.pshat.line, toLabel: 'שאלה ליומן', to: s.questions[0], text: s.questions[1] || '' },
    { style: 'essay', title: 'קריאה לפני הכתיבה', text: s.insight, body: [lv(s, 'pshat'), ln(s, 'remez'), ln(s, 'derash')] },
    { style: 'insight', title: s.insight, text: s.levels.sod.line },
    haiku(s),
  ],
};
const story = (id, zone) => { const s = S[id]; if (!s) throw new Error(`סיפור לא נמצא: ${id}`); return T(id, zone, s.title, `**${s.ref}**. ${s.levels.pshat.line}`, BUILD[zone](s), s.ref); };

const topics = [
  story('bereshit-creation', 'ידע'),
  story('lech-lecha', 'ידע'),
  story('yetziat', 'ידע'),
  story('akedah', 'הבנה'),
  story('yaakov-peniel', 'הבנה'),
  story('seneh', 'הבנה'),
  story('bavel', 'יישום'),
  story('eliyahu', 'יישום'),
];
// המאגר: כל סיפור, בשלב שלא נבחר לו בכתבות
const used = new Map(topics.map((t) => [t.id, t.zone]));
const ZONES = ['ידע', 'הבנה', 'יישום'];
const pool = [];
STORIES.forEach((s, i) => {
  const zs = used.has(s.id) ? ZONES.filter((z) => z !== used.get(s.id)).slice(0, 1) : [ZONES[i % 3], ZONES[(i + 1) % 3]];
  for (const z of zs) { const t = story(s.id, z); t.id = `${s.id}-${z === 'ידע' ? 'know' : z === 'הבנה' ? 'understand' : 'apply'}`; pool.push(t); }
});

for (const t of [...topics, ...pool]) {
  const st = t.creations.map((c) => c.style);
  if (new Set(st).size !== st.length) throw new Error(`עיצוב חוזר: ${t.id}`);
  if (st.length < 4 || st.length > 6) throw new Error(`ב-${t.id} ${st.length} יצירות`);
  if (t.title.split(/\s+/).length > 8) throw new Error(`כותרת ארוכה: ${t.title}`);
  for (const c of t.creations) {
    if (c.style === 'haiku' && c.lines.length !== 3) throw new Error(`הייקו: ${t.id}`);
    if (c.style === 'post' && c.text.split('\n').length > 6) throw new Error(`פוסט ארוך: ${t.id}`);
    if (c.style === 'quote' && !c.quote) throw new Error(`ציטוט חסר: ${t.id}`);
  }
}
if (topics.length < 6 || new Set(topics.map((t) => t.zone)).size < 3) throw new Error('צריך 6 חדרים לפחות ושלושה שלבים');
if (pool.length < 20) throw new Error(`מאגר קטן: ${pool.length}`);

const data = {
  app: {
    id: 'tanach', name: 'תנ"ך כמסע', url: 'https://tanach-ch.vercel.app', repo: 'Anat1969/Tanach-CH',
    description: 'כתבות מתוך המסע בתנ"ך: כל סיפור כבניין של ארבע קומות, מהפשט ועד הסוד, עם הפסוק לפי הכתיב והמקור לכל קריאה.',
    // צורת הדף: הכתוב במרכז, פירוש ותוספת משני הצדדים, והכרעה למטה. צבעי הקומות של האפליקציה.
    article: { layout: 'daf', css: '& .ar-quote blockquote{text-align:start}& .ar-df-l .ar-ins-t,& .ar-df-r .ar-ins-t{font-size:calc(2.2*var(--u))}' },
    palette: {
      a: '#c0803f', b: '#b5655a', c: '#c9a24a', s: '#6f9a6b', accent: '#c0803f', marker: '#ffe066',
      ink: '#1c1a17', paper: '#fdfdfc', paper2: '#f2f2f0', 'b-wash': '#f5e6e3', 's-wash': '#e9f1e8',
    },
  },
  topics,
  pool,
};
fs.writeFileSync('public/creations.json', JSON.stringify(data, null, 2) + '\n');
console.log(`${topics.length} חדרים, ${topics.reduce((n, t) => n + t.creations.length, 0)} יצירות, ${pool.length} מקורות במאגר`);
