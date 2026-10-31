export type Era = 'אבות' | 'יציאה' | 'מלוכה' | 'חורבן' | 'שיבה';

export const ERA_COLOR: Record<Era, string> = {
  אבות: '#a65d2e',
  יציאה: '#1f3558',
  מלוכה: '#4f6b3a',
  חורבן: '#b3261e',
  שיבה: '#2e7d4f',
};

export interface TimelineEvent {
  id: string;
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
    era: 'אבות',
    title: 'אברם יוצא מחרן',
    ref: 'בראשית יב, א-ד',
    note: 'ההתחלה של הסיפור הלאומי: יציאה בלי ידיעה מראש.',
    storyId: 'lech-lecha',
  },
  {
    id: 'yosef-mitzraymah',
    era: 'אבות',
    title: 'יוסף נמכר ומגיע למצרים',
    ref: 'בראשית לז, כח; לט, א',
    note: 'המכירה היא נקודת המעבר של המשפחה למצרים.',
    storyId: 'yosef',
  },
  {
    id: 'yetziat',
    era: 'יציאה',
    title: 'יציאת מצרים',
    ref: 'שמות יב, לז-מא; יד, כא',
    note: 'המעבר הגדול, מהבקיעה ועד המדבר.',
    storyId: 'yetziat',
  },
  {
    id: 'matan-torah',
    era: 'יציאה',
    title: 'מעמד הר סיני',
    ref: 'שמות יט-כ',
    note: 'הברית בהר, ותחילת הקשר בין העם לה\'.',
    storyId: 'seneh',
  },
  {
    id: 'yehoshua',
    era: 'מלוכה',
    title: 'יהושע מוביל את העם מעבר לירדן',
    ref: 'יהושע א, א-ב',
    note: 'אחרי משה, יהושע מוביל את הכיבוש.',
  },
  {
    id: 'david',
    era: 'מלוכה',
    title: 'דוד מלך על ישראל',
    ref: 'שמואל ב ה, ד-ה',
    note: 'בן שלושים שנה דוד במלכו, וארבעים שנה מלך.',
  },
  {
    id: 'mikdash',
    era: 'מלוכה',
    title: 'שלמה בונה את בית המקדש',
    ref: 'מלכים א ו, א',
    note: 'דברי הימים מזהה את מקום הבית עם הר המוריה.',
  },
  {
    id: 'churban-1',
    era: 'חורבן',
    title: 'חורבן הבית הראשון',
    ref: 'מלכים ב כה, ח-ט',
    note: 'ירושלים נחרבת, והעם יוצא לגלות.',
    date: '586 לפנה"ס (תאריך מוסכם בחקר)',
  },
  {
    id: 'shivat-tzion',
    era: 'שיבה',
    title: 'שיבת ציון וצו כורש',
    ref: 'עזרא א, א-ד',
    note: 'הצו מאפשר שיבה לירושלים ובנייה מחדש.',
    date: '538 לפנה"ס (תאריך מוסכם בחקר)',
  },
  {
    id: 'churban-2',
    era: 'חורבן',
    title: 'חורבן הבית השני',
    ref: 'מקור חיצוני: יוסף בן מתתיהו, מלחמת היהודים',
    note: 'ירושלים נכבשת בידי הרומאים, והבית נחרב.',
    date: '70 לספירה (תאריך מוסכם בחקר)',
  },
];
