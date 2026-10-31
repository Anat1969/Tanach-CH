export type Section = 'תורה' | 'נביאים ראשונים' | 'נביאים אחרונים' | 'כתובים';

export interface Book {
  id: string;
  he: string;
  en: string;
  section: Section;
  stage: number;
}

export const SECTIONS: Section[] = ['תורה', 'נביאים ראשונים', 'נביאים אחרונים', 'כתובים'];

// The 24 books in the traditional order. Stage shows when each book is planned to be built.
export const BOOKS: Book[] = [
  { id: 'bereshit', he: 'בראשית', en: 'Genesis', section: 'תורה', stage: 1 },
  { id: 'shemot', he: 'שמות', en: 'Exodus', section: 'תורה', stage: 1 },
  { id: 'vayikra', he: 'ויקרא', en: 'Leviticus', section: 'תורה', stage: 2 },
  { id: 'bamidbar', he: 'במדבר', en: 'Numbers', section: 'תורה', stage: 2 },
  { id: 'devarim', he: 'דברים', en: 'Deuteronomy', section: 'תורה', stage: 2 },
  { id: 'yehoshua', he: 'יהושע', en: 'Joshua', section: 'נביאים ראשונים', stage: 3 },
  { id: 'shoftim', he: 'שופטים', en: 'Judges', section: 'נביאים ראשונים', stage: 3 },
  { id: 'shmuel', he: 'שמואל', en: 'Samuel', section: 'נביאים ראשונים', stage: 3 },
  { id: 'melachim', he: 'מלכים', en: 'Kings', section: 'נביאים ראשונים', stage: 3 },
  { id: 'yeshayahu', he: 'ישעיהו', en: 'Isaiah', section: 'נביאים אחרונים', stage: 3 },
  { id: 'yirmiyahu', he: 'ירמיהו', en: 'Jeremiah', section: 'נביאים אחרונים', stage: 3 },
  { id: 'yechezkel', he: 'יחזקאל', en: 'Ezekiel', section: 'נביאים אחרונים', stage: 3 },
  { id: 'trei-asar', he: 'תרי עשר', en: 'The Twelve Minor Prophets', section: 'נביאים אחרונים', stage: 3 },
  { id: 'tehilim', he: 'תהילים', en: 'Psalms', section: 'כתובים', stage: 4 },
  { id: 'mishlei', he: 'משלי', en: 'Proverbs', section: 'כתובים', stage: 4 },
  { id: 'iyov', he: 'איוב', en: 'Job', section: 'כתובים', stage: 4 },
  { id: 'shir-hashirim', he: 'שיר השירים', en: 'Song of Songs', section: 'כתובים', stage: 4 },
  { id: 'rut', he: 'רות', en: 'Ruth', section: 'כתובים', stage: 4 },
  { id: 'eicha', he: 'איכה', en: 'Lamentations', section: 'כתובים', stage: 4 },
  { id: 'kohelet', he: 'קהלת', en: 'Ecclesiastes', section: 'כתובים', stage: 4 },
  { id: 'ester', he: 'אסתר', en: 'Esther', section: 'כתובים', stage: 4 },
  { id: 'daniel', he: 'דניאל', en: 'Daniel', section: 'כתובים', stage: 4 },
  { id: 'ezra-nechemia', he: 'עזרא-נחמיה', en: 'Ezra-Nehemiah', section: 'כתובים', stage: 4 },
  { id: 'divrei-hayamim', he: 'דברי הימים', en: 'Chronicles', section: 'כתובים', stage: 4 },
];
