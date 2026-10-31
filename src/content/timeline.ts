export type Era = 'ראשית' | 'אבות' | 'יציאה' | 'מלוכה' | 'חורבן' | 'שיבה';

export const ERA_COLOR: Record<Era, string> = {
  ראשית: '#7d6b55',
  אבות: '#a65d2e',
  יציאה: '#1f3558',
  מלוכה: '#4f6b3a',
  חורבן: '#b3261e',
  שיבה: '#2e7d4f',
};

export interface TimelineEvent {
  id: string;
  // Astronomical year: negative is before the common era. Approximate by design, see `when`.
  year: number;
  when: string;
  era: Era;
  title: string;
  ref: string;
  note: string;
  // Dates are given only where the historical dating is agreed. Biblical events have no date here.
  date?: string;
  storyId?: string;
}

export const TIMELINE: TimelineEvent[] = [
  {
    id: 'avram-yetzia',
    year: -1900,
    when: 'כ-−1900 (הערכה מקובלת; התארוך נדון)',
    era: 'אבות',
    title: 'אברם יוצא מחרן',
    ref: 'בראשית יב, א-ד',
    note: 'ההתחלה של הסיפור הלאומי: יציאה בלי ידיעה מראש.',
    storyId: 'lech-lecha',
  },
  {
    id: 'yosef-mitzraymah',
    year: -1700,
    when: 'כ-−1700 (הערכה מקובלת)',
    era: 'אבות',
    title: 'יוסף נמכר ומגיע למצרים',
    ref: 'בראשית לז, כח; לט, א',
    note: 'המכירה היא נקודת המעבר של המשפחה למצרים.',
    storyId: 'yosef',
  },
  {
    id: 'yetziat',
    year: -1250,
    when: 'כ-−1250 (הערכה; הזמן נדון בחקר)',
    era: 'יציאה',
    title: 'יציאת מצרים',
    ref: 'שמות יב, לז-מא; יד, כא',
    note: 'המעבר הגדול, מהבקיעה ועד המדבר.',
    storyId: 'yetziat',
  },
  {
    id: 'matan-torah',
    year: -1250,
    when: 'כ-−1250 (הערכה; הזמן נדון בחקר)',
    era: 'יציאה',
    title: 'מעמד הר סיני',
    ref: 'שמות יט-כ',
    note: 'הברית בהר, ותחילת הקשר בין העם לה\'.',
    storyId: 'seneh',
  },
  {
    id: 'yehoshua',
    year: -1200,
    when: 'כ-−1200 (הערכה; הזמן נדון בחקר)',
    era: 'מלוכה',
    title: 'יהושע מוביל את העם מעבר לירדן',
    ref: 'יהושע א, א-ב',
    note: 'אחרי משה, יהושע מוביל את הכיבוש.',
  },
  {
    id: 'david',
    year: -1000,
    when: 'כ-−1000 (הערכה מקובלת)',
    era: 'מלוכה',
    title: 'דוד מלך על ישראל',
    ref: 'שמואל ב ה, ד-ה',
    note: 'בן שלושים שנה דוד במלכו, וארבעים שנה מלך.',
  },
  {
    id: 'mikdash',
    year: -960,
    when: 'כ-−960 (הערכה מקובלת)',
    era: 'מלוכה',
    title: 'שלמה בונה את בית המקדש',
    ref: 'מלכים א ו, א',
    note: 'דברי הימים מזהה את מקום הבית עם הר המוריה.',
  },
  {
    id: 'churban-1',
    year: -586,
    when: '−586 (מוסכם בחקר)',
    era: 'חורבן',
    title: 'חורבן הבית הראשון',
    ref: 'מלכים ב כה, ח-ט',
    note: 'ירושלים נחרבת, והעם יוצא לגלות.',
    date: '−586 (תאריך מוסכם בחקר)',
  },
  {
    id: 'shivat-tzion',
    year: -538,
    when: '−538 (מוסכם בחקר)',
    era: 'שיבה',
    title: 'שיבת ציון וצו כורש',
    ref: 'עזרא א, א-ד',
    note: 'הצו מאפשר שיבה לירושלים ובנייה מחדש.',
    date: '−538 (תאריך מוסכם בחקר)',
  },
  {
    id: 'churban-2',
    year: 70,
    when: '70 לספירה (מוסכם בחקר)',
    era: 'חורבן',
    title: 'חורבן הבית השני',
    ref: 'מקור חיצוני: יוסף בן מתתיהו, מלחמת היהודים',
    note: 'ירושלים נכבשת בידי הרומאים, והבית נחרב.',
    date: '70 לספירה (תאריך מוסכם בחקר)',
  },
];

// Conventional era spans on the year scale (not dates of events).
export const ERA_SPAN: Record<Era, [number, number]> = {
  ראשית: [-2000, -2000],
  אבות: [-2000, -1550],
  יציאה: [-1550, -1200],
  מלוכה: [-1200, -586],
  חורבן: [-586, -538],
  שיבה: [-538, 0],
};
