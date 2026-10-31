// Schematic coordinates (viewBox 600 x 760). Positions are for orientation, not to scale.
// Names: Hebrew first, then the Latin transliteration.
export interface Stop {
  id: string;
  he: string;
  en: string;
  x: number;
  y: number;
  side: 'l' | 'r';
  ref: string;
  note: string;
  onPath: boolean;
  storyIds: string[];
}

export interface RouteDef {
  id: 'abraham' | 'exodus';
  he: string;
  subtitle: string;
  color: string;
  view: string;
  path: string[];
  stops: Stop[];
}

export const ROUTES: RouteDef[] = [
  {
    id: 'abraham',
    he: 'מסע האבות',
    subtitle: 'מאור כשדים עד מצרים, ובחזרה לארץ. התחנות לפי בראשית יא-כב.',
    color: '#a65d2e',
    view: '0 0 600 760',
    path: ['ur', 'haran', 'shechem', 'bethel', 'negev', 'egypt'],
    stops: [
      { id: 'ur', he: 'אור כשדים', en: 'Ur', x: 540, y: 600, side: 'l', ref: 'בראשית יא, כח, לא', note: 'מוצא המסע לפי הכתוב.', onPath: true, storyIds: [] },
      { id: 'haran', he: 'חרן', en: 'Haran', x: 470, y: 430, side: 'r', ref: 'בראשית יא, לא-לב; יב, ד', note: 'אברם יוצא מחרן בן שבעים וחמש (יב, ד).', onPath: true, storyIds: ['lech-lecha'] },
      { id: 'shechem', he: 'שכם', en: 'Shechem', x: 330, y: 300, side: 'l', ref: 'בראשית יב, ו-ז', note: 'ה\' נראה לאברם בשכם (יב, ז).', onPath: true, storyIds: [] },
      { id: 'bethel', he: 'בית-אל', en: 'Bethel', x: 300, y: 345, side: 'l', ref: 'בראשית יב, ח', note: 'אברם בונה מזבח בין בית-אל ולעי (יב, ח).', onPath: true, storyIds: [] },
      { id: 'negev', he: 'הנגב', en: 'Negev', x: 250, y: 520, side: 'l', ref: 'בראשית יב, ט', note: 'המסע ממשיך דרומה לנגב (יב, ט).', onPath: true, storyIds: [] },
      { id: 'egypt', he: 'מצרים', en: 'Egypt', x: 120, y: 620, side: 'r', ref: 'בראשית יב, י', note: 'רעב בארץ, ואברם יורד למצרים (יב, י).', onPath: true, storyIds: [] },
      { id: 'hebron', he: 'חברון', en: 'Hebron', x: 290, y: 470, side: 'r', ref: 'בראשית יג, יח', note: 'אברם יושב באלוני ממרא שבחברון (יג, יח).', onPath: false, storyIds: [] },
      { id: 'beersheba', he: 'באר שבע', en: 'Beersheba', x: 215, y: 575, side: 'l', ref: 'בראשית כא, לא-לג', note: 'שם נכרתה ברית עם אבימלך (כא, לא).', onPath: false, storyIds: [] },
      { id: 'moriah', he: 'הר המוריה', en: 'Mount Moriah', x: 300, y: 385, side: 'r', ref: 'בראשית כב, ב; דברי הימים ב ג, א', note: 'מקום העקידה. דברי הימים מזהה אותו עם מקום הבית.', onPath: false, storyIds: ['akedah'] },
    ],
  },
  {
    id: 'exodus',
    he: 'מסע היציאה',
    subtitle: 'מרעמסס עד הר סיני, לפי רשימת המסעות במדבר לג ושמות יב-יט.',
    color: '#1f3558',
    view: '40 460 420 300',
    path: ['ramses', 'succoth', 'etham', 'pihahiroth', 'yamsuf', 'marah', 'elim', 'sinai'],
    stops: [
      { id: 'ramses', he: 'רעמסס', en: 'Ramesses', x: 140, y: 500, side: 'r', ref: 'שמות יב, לז; במדבר לג, ג', note: 'נקודת היציאה לפי המקרא (במדבר לג, ג).', onPath: true, storyIds: [] },
      { id: 'succoth', he: 'סכות', en: 'Succoth', x: 180, y: 540, side: 'r', ref: 'שמות יב, לז', note: 'התחנה הראשונה אחרי היציאה (יב, לז).', onPath: true, storyIds: [] },
      { id: 'etham', he: 'אתם', en: 'Etham', x: 215, y: 575, side: 'r', ref: 'במדבר לג, ו-ח', note: 'בקצה המדבר (במדבר לג, ח).', onPath: true, storyIds: [] },
      { id: 'pihahiroth', he: 'פי החירות', en: 'Pi-hahiroth', x: 190, y: 612, side: 'r', ref: 'שמות יד, ב', note: 'הכתוב מציין את המקום לפני הים (יד, ב).', onPath: true, storyIds: [] },
      { id: 'yamsuf', he: 'ים סוף', en: 'Yam Suf', x: 130, y: 655, side: 'l', ref: 'שמות יד, כא-כב', note: 'הבקיעה והמעבר (יד, כא-כב). השם מתפרש בחקר כ"ים הקנים", ומכאן התרגום Sea of Reeds.', onPath: true, storyIds: ['yetziat'] },
      { id: 'marah', he: 'מרה', en: 'Marah', x: 200, y: 680, side: 'r', ref: 'שמות טו, כג', note: 'המים המרים (טו, כג).', onPath: true, storyIds: [] },
      { id: 'elim', he: 'אילים', en: 'Elim', x: 262, y: 712, side: 'r', ref: 'שמות טו, כז', note: 'שתים עשרה עיינות ושבעים תמרים (טו, כז).', onPath: true, storyIds: [] },
      { id: 'sinai', he: 'הר סיני וחורב', en: 'Mount Sinai (Horeb)', x: 290, y: 738, side: 'r', ref: 'שמות יט, א-ב; מלכים א יט, ח', note: 'ההר שבו נקרא השם, ושאליו חוזר אליהו.', onPath: true, storyIds: ['seneh', 'eliyahu'] },
    ],
  },
];
