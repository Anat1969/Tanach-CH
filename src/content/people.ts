export type RelationKind = 'family' | 'conflict' | 'bond';

export const KIND_LABEL: Record<RelationKind, string> = {
  family: 'משפחה',
  conflict: 'מתח',
  bond: 'ברית או שליחות',
};

export interface Person {
  id: string;
  he: string;
  en: string;
}

export interface Relation {
  a: string;
  b: string;
  kind: RelationKind;
  label: string;
  ref: string;
}

export const PEOPLE: Person[] = [
  { id: 'abraham', he: 'אברהם', en: 'Abraham' },
  { id: 'sarah', he: 'שרה', en: 'Sarah' },
  { id: 'hagar', he: 'הגר', en: 'Hagar' },
  { id: 'ishmael', he: 'ישמעאל', en: 'Ishmael' },
  { id: 'isaac', he: 'יצחק', en: 'Isaac' },
  { id: 'rebekah', he: 'רבקה', en: 'Rebekah' },
  { id: 'esau', he: 'עשו', en: 'Esau' },
  { id: 'jacob', he: 'יעקב', en: 'Jacob' },
  { id: 'leah', he: 'לאה', en: 'Leah' },
  { id: 'rachel', he: 'רחל', en: 'Rachel' },
  { id: 'joseph', he: 'יוסף', en: 'Joseph' },
  { id: 'moses', he: 'משה', en: 'Moses' },
  { id: 'aaron', he: 'אהרן', en: 'Aaron' },
  { id: 'miriam', he: 'מרים', en: 'Miriam' },
  { id: 'joshua', he: 'יהושע', en: 'Joshua' },
  { id: 'samuel', he: 'שמואל', en: 'Samuel' },
  { id: 'saul', he: 'שאול', en: 'Saul' },
  { id: 'david', he: 'דוד', en: 'David' },
  { id: 'jonathan', he: 'יהונתן', en: 'Jonathan' },
  { id: 'elijah', he: 'אליהו', en: 'Elijah' },
  { id: 'elisha', he: 'אלישע', en: 'Elisha' },
];

// Every relation carries its verse. A relation without a source is not shown.
export const RELATIONS: Relation[] = [
  { a: 'abraham', b: 'sarah', kind: 'family', label: 'אישה', ref: 'בראשית יא, כט' },
  { a: 'abraham', b: 'hagar', kind: 'family', label: 'שפחה שילדה לו בן', ref: 'בראשית טז, א-טו' },
  { a: 'abraham', b: 'ishmael', kind: 'family', label: 'בן', ref: 'בראשית טז, טו' },
  { a: 'abraham', b: 'isaac', kind: 'family', label: 'בן', ref: 'בראשית כא, ב-ג' },
  { a: 'isaac', b: 'rebekah', kind: 'family', label: 'אישה', ref: 'בראשית כד, סז' },
  { a: 'isaac', b: 'esau', kind: 'family', label: 'בן', ref: 'בראשית כה, כה' },
  { a: 'isaac', b: 'jacob', kind: 'family', label: 'בן', ref: 'בראשית כה, כו' },
  { a: 'esau', b: 'jacob', kind: 'conflict', label: 'מחלוקת על הבכורה', ref: 'בראשית כה, כט-לד' },
  { a: 'jacob', b: 'leah', kind: 'family', label: 'אישה', ref: 'בראשית כט, כג' },
  { a: 'jacob', b: 'rachel', kind: 'family', label: 'אישה', ref: 'בראשית כט, יח-כח' },
  { a: 'jacob', b: 'joseph', kind: 'family', label: 'בן רחל', ref: 'בראשית ל, כד' },
  { a: 'joseph', b: 'jacob', kind: 'bond', label: 'יעקב מעניק לו כתונת פסים', ref: 'בראשית לז, ג' },
  { a: 'moses', b: 'aaron', kind: 'family', label: 'אח', ref: 'שמות ד, יד' },
  { a: 'moses', b: 'miriam', kind: 'family', label: 'אחות', ref: 'שמות ב, ד' },
  { a: 'moses', b: 'joshua', kind: 'bond', label: 'משרת ויורש', ref: 'דברים לד, ט' },
  { a: 'samuel', b: 'saul', kind: 'bond', label: 'נביא ומלך', ref: 'שמואל א, ט-י' },
  { a: 'saul', b: 'jonathan', kind: 'family', label: 'בן', ref: 'שמואל א, יד, מט' },
  { a: 'saul', b: 'david', kind: 'conflict', label: 'שאול רודף את דוד', ref: 'שמואל א, יח-כד' },
  { a: 'david', b: 'jonathan', kind: 'bond', label: 'נפש יהונתן נקשרה בנפש דוד', ref: 'שמואל א, יח, א' },
  { a: 'elijah', b: 'elisha', kind: 'bond', label: 'מעביר לו את המעטפת', ref: 'מלכים א, יט, יט-כא' },
  { a: 'elijah', b: 'moses', kind: 'bond', label: 'חוזר להר חורב, מקום משה', ref: 'מלכים א, יט, ח' },
];
