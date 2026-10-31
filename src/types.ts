export type Level = 'pshat' | 'remez' | 'derash' | 'sod';

export interface LevelInfo {
  id: Level;
  name: string;
  floor: string;
  hint: string;
  color: string;
}

// Four floors of one building, from the ground (pshat) to the roof (sod).
export const LEVELS: LevelInfo[] = [
  { id: 'pshat', name: 'פשט', floor: 'קומת הכניסה', hint: 'מה כתוב, בלשון המקרא.', color: '#a65d2e' },
  { id: 'remez', name: 'רמז', floor: 'קומה ראשונה', hint: 'מה הכתוב מצביע עליו מעבר לעצמו.', color: '#4f6b3a' },
  { id: 'derash', name: 'דרש', floor: 'קומה שנייה', hint: 'מה חכמים ומסורות למדו מהכתוב.', color: '#1f3558' },
  { id: 'sod', name: 'סוד', floor: 'הגג', hint: 'הקריאה הפנימית והסימבולית.', color: '#5b3a6e' },
];

export const levelById = (id: string | null | undefined): LevelInfo =>
  LEVELS.find((l) => l.id === id) ?? LEVELS[0];

export type SourceKind = 'טקסט' | 'רמז' | 'מדרש' | 'פרשנות' | 'קבלה';

export interface LevelContent {
  line: string;
  body: string;
  source: string;
  kind: SourceKind;
}

export interface Story {
  id: string;
  title: string;
  ref: string;
  insight: string;
  quote: { text: string; source: string };
  levels: Record<Level, LevelContent>;
  questions: string[];
  haiku: [string, string, string];
  haikuNote: string;
}
