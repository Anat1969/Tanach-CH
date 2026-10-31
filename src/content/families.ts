// Family trees drawn from the text. Each link is backed by a verse in people.ts (RELATIONS).
// Positions are the top-left of the box center, in the tree's own viewBox.
export type UnionKind = 'marriage' | 'concubine' | 'bond' | 'conflict';

export interface TreeNode {
  id: string;
  x: number;
  y: number;
}

export interface Tree {
  id: string;
  he: string;
  note: string;
  w: number;
  h: number;
  nodes: TreeNode[];
  unions: { a: string; b: string; kind: UnionKind }[];
  parentage: { parents: string[]; child: string }[];
  siblings?: string[];
}

export const TREES: Tree[] = [
  {
    id: 'bereshit',
    he: 'בראשית: מאברהם עד יוסף',
    note: 'אברהם, שרה, הגר, ישמעאל, יצחק, רבקה, עשו, יעקב, לאה, רחל ויוסף. אחים נוספים של יעקב אינם מוצגים.',
    w: 1000,
    h: 540,
    nodes: [
      { id: 'hagar', x: 90, y: 30 },
      { id: 'abraham', x: 290, y: 30 },
      { id: 'sarah', x: 530, y: 30 },
      { id: 'ishmael', x: 90, y: 190 },
      { id: 'isaac', x: 410, y: 190 },
      { id: 'rebekah', x: 650, y: 190 },
      { id: 'esau', x: 250, y: 350 },
      { id: 'jacob', x: 520, y: 350 },
      { id: 'leah', x: 740, y: 350 },
      { id: 'rachel', x: 930, y: 350 },
      { id: 'joseph', x: 930, y: 480 },
    ],
    unions: [
      { a: 'abraham', b: 'sarah', kind: 'marriage' },
      { a: 'abraham', b: 'hagar', kind: 'concubine' },
      { a: 'isaac', b: 'rebekah', kind: 'marriage' },
      { a: 'jacob', b: 'leah', kind: 'marriage' },
      { a: 'jacob', b: 'rachel', kind: 'marriage' },
    ],
    parentage: [
      { parents: ['abraham', 'hagar'], child: 'ishmael' },
      { parents: ['abraham', 'sarah'], child: 'isaac' },
      { parents: ['isaac', 'rebekah'], child: 'esau' },
      { parents: ['isaac', 'rebekah'], child: 'jacob' },
      { parents: ['jacob', 'rachel'], child: 'joseph' },
    ],
  },
  {
    id: 'shemot',
    he: 'שמות: משה ואחיו',
    note: 'משה, אהרן ומרים הם אחים. הורי משה אינם מוצגים ברשימת הדמויות. יהושע הוא משרתו ויורשו.',
    w: 1000,
    h: 360,
    nodes: [
      { id: 'miriam', x: 160, y: 120 },
      { id: 'aaron', x: 500, y: 120 },
      { id: 'moses', x: 840, y: 120 },
      { id: 'joshua', x: 840, y: 270 },
    ],
    unions: [{ a: 'moses', b: 'joshua', kind: 'bond' }],
    parentage: [],
    siblings: ['miriam', 'aaron', 'moses'],
  },
  {
    id: 'melachim',
    he: 'שמואל ומלכים: שאול, דוד ושושלת השליחות',
    note: 'שאול הוא אביו של יהונתן. דוד ויהונתן נקשרו בברית, ושאול רדף את דוד. אליהו מעביר את השליחות לאלישע.',
    w: 1000,
    h: 500,
    nodes: [
      { id: 'samuel', x: 160, y: 40 },
      { id: 'saul', x: 500, y: 40 },
      { id: 'jonathan', x: 340, y: 210 },
      { id: 'david', x: 700, y: 210 },
      { id: 'elijah', x: 160, y: 390 },
      { id: 'elisha', x: 500, y: 390 },
    ],
    unions: [
      { a: 'samuel', b: 'saul', kind: 'bond' },
      { a: 'saul', b: 'david', kind: 'conflict' },
      { a: 'jonathan', b: 'david', kind: 'bond' },
      { a: 'elijah', b: 'elisha', kind: 'bond' },
    ],
    parentage: [{ parents: ['saul'], child: 'jonathan' }],
  },
];
