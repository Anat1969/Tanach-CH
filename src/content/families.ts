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

// One lineage from Abraham to Moses, and Joshua as his servant and heir. The lineage runs through Jacob's son Levi.
export const TREES: Tree[] = [
  {
    id: 'avot-moshe',
    he: 'מאברהם עד משה ויהושע: שושלת אחת',
    note: 'אברהם, יצחק, יעקב, לוי, קהת, עמרם, יוכבד, ומשה, אהרן ומרים. הקו מיוחס ללוי, בנו של יעקב מלאה. אחים נוספים של יעקב ושל לוי אינם מוצגים.',
    w: 1000,
    h: 1090,
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
      { id: 'levi', x: 740, y: 480 },
      { id: 'kohath', x: 740, y: 610 },
      { id: 'amram', x: 740, y: 740 },
      { id: 'jochebed', x: 930, y: 740 },
      { id: 'miriam', x: 560, y: 880 },
      { id: 'aaron', x: 740, y: 880 },
      { id: 'moses', x: 930, y: 880 },
      { id: 'joshua', x: 930, y: 1010 },
    ],
    unions: [
      { a: 'abraham', b: 'sarah', kind: 'marriage' },
      { a: 'abraham', b: 'hagar', kind: 'concubine' },
      { a: 'isaac', b: 'rebekah', kind: 'marriage' },
      { a: 'jacob', b: 'leah', kind: 'marriage' },
      { a: 'jacob', b: 'rachel', kind: 'marriage' },
      { a: 'amram', b: 'jochebed', kind: 'marriage' },
      { a: 'moses', b: 'joshua', kind: 'bond' },
    ],
    parentage: [
      { parents: ['abraham', 'hagar'], child: 'ishmael' },
      { parents: ['abraham', 'sarah'], child: 'isaac' },
      { parents: ['isaac', 'rebekah'], child: 'esau' },
      { parents: ['isaac', 'rebekah'], child: 'jacob' },
      { parents: ['jacob', 'rachel'], child: 'joseph' },
      { parents: ['jacob', 'leah'], child: 'levi' },
      { parents: ['levi'], child: 'kohath' },
      { parents: ['kohath'], child: 'amram' },
      { parents: ['amram', 'jochebed'], child: 'miriam' },
      { parents: ['amram', 'jochebed'], child: 'aaron' },
      { parents: ['amram', 'jochebed'], child: 'moses' },
    ],
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
