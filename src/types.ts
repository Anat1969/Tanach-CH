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
  { id: 'pshat', name: 'פשט', floor: 'משמעות הכתוב', hint: 'המשמעות הישירה של הכתוב, בלשונו ובהקשרו הקרוב. זו הקריאה הראשונה, והבסיס לכל השאר.', color: '#222222' },
  { id: 'remez', name: 'רמז', floor: 'רמז בלשון', hint: 'מילה, שם או מבנה בטקסט שמצביעים על משמעות נוספת, בלי לומר אותה במפורש.', color: '#555555' },
  { id: 'derash', name: 'דרש', floor: 'פירוש מסורתי', hint: 'הפירוש שחכמים ומסורות הפרשנות הסיקו מהכתוב, לפעמים מתוך שאלה על פשוטו.', color: '#888888' },
  { id: 'sod', name: 'סוד', floor: 'קריאה פנימית', hint: 'פירוש קבלי או סימבולי, שנשען על מסורת פנימית ולא על פשט הטקסט. זו פרשנות, לא טקסט.', color: '#aaaaaa' },
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

import type { Era } from './content/timeline';

export interface Story {
  id: string;
  book: string;
  era: Era;
  people: string[];
  title: string;
  ref: string;
  insight: string;
  quote: { text: string; source: string };
  levels: Record<Level, LevelContent>;
  questions: string[];
  haiku: [string, string, string];
  haikuNote: string;
}
