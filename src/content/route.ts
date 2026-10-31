import { GEO_VIEW } from './geo-data';

// Close-up of the land of Israel, for the Levant stops.
export const CLOSE_VIEW = '216.1 228.8 110.2 161.2';
// Schematic coordinates (viewBox 600 x 760). Positions are for orientation, not to scale.
// Names: Hebrew first, then the Latin transliteration.
export interface Stop {
  id: string;
  he: string;
  en: string;
  lon: number;
  lat: number;
  // Projected position on the geographic base (see geo-data.ts).
  x: number;
  y: number;
  disputed: boolean;
  dig: string;
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
    view: GEO_VIEW,
    path: ['ur', 'haran', 'shechem', 'bethel', 'negev', 'egypt'],
    stops: [
      { id: 'ur', he: 'אור כשדים', en: 'Ur', lon: 46.1, lat: 30.96, x: 754.1, y: 366.1, disputed: false, dig: 'חפירות לאונרד וולי (1922–1934): בית הקברות המלכותי ומבנה הזיגורט של העיר.', side: 'l', ref: 'בראשית יא, כח, לא', note: 'מוצא המסע לפי הכתוב.', onPath: true, storyIds: [] },
      { id: 'haran', he: 'חרן', en: 'Haran', lon: 39.03, lat: 36.86, x: 442.3, y: 59.3, disputed: false, dig: 'אתר ארכיאולוגי בדרום-מזרח תורכיה. החפירות בו מועטות יחסית.', side: 'r', ref: 'בראשית יא, לא-לב; יב, ד', note: 'אברם יוצא מחרן בן שבעים וחמש (יב, ד).', onPath: true, storyIds: ['lech-lecha'] },
      { id: 'shechem', he: 'שכם', en: 'Shechem', lon: 35.27, lat: 32.22, x: 276.5, y: 300.6, disputed: false, dig: 'Tell Balata (שכם): שכבות מהברונזה התיכונה ועד ימי הברזל, נחפרו בידי משלחות במאה ה-20.', side: 'l', ref: 'בראשית יב, ו-ז', note: 'ה\' נראה לאברם בשכם (יב, ז).', onPath: true, storyIds: [] },
      { id: 'bethel', he: 'בית-אל', en: 'Bethel', lon: 35.23, lat: 31.93, x: 274.7, y: 315.6, disputed: false, dig: 'Beitin (בית-אל): חפירות אמריקאיות במאה ה-20 (אלברייט וקלסו).', side: 'l', ref: 'בראשית יב, ח', note: 'אברם בונה מזבח בין בית-אל ולעי (יב, ח).', onPath: true, storyIds: ['yaakov-sulam'] },
      { id: 'negev', he: 'הנגב', en: 'Negev', lon: 34.9, lat: 30.9, x: 260.2, y: 369.2, disputed: false, dig: 'הנגב: אזור מדברי רחב. ממצאים מתקופות שונות מפוזרים בו.', side: 'l', ref: 'בראשית יב, ט', note: 'המסע ממשיך דרומה לנגב (יב, ט).', onPath: true, storyIds: [] },
      { id: 'egypt', he: 'מצרים', en: 'Egypt', lon: 31.25, lat: 29.85, x: 99.2, y: 423.8, disputed: false, dig: 'ממפיס (Memphis): בירה מצרית עתיקה, מוכרת ממקורות מצריים ומהארכיאולוגיה.', side: 'r', ref: 'בראשית יב, י', note: 'רעב בארץ, ואברם יורד למצרים (יב, י).', onPath: true, storyIds: ['yosef'] },
      { id: 'hebron', he: 'חברון', en: 'Hebron', lon: 35.1, lat: 31.53, x: 269.0, y: 336.4, disputed: false, dig: 'Tell Rumeida (חברון): ממצאים מתקופת הברונזה והברזל.', side: 'r', ref: 'בראשית יג, יח', note: 'אברם יושב באלוני ממרא שבחברון (יג, יח).', onPath: false, storyIds: [] },
      { id: 'beersheba', he: 'באר שבע', en: 'Beersheba', lon: 34.79, lat: 31.24, x: 255.3, y: 351.5, disputed: false, dig: 'Tell es-Saba (באר שבע הישנה): חפירות יוחנן אהרוני, 1969–1976.', side: 'l', ref: 'בראשית כא, לא-לג', note: 'שם נכרתה ברית עם אבימלך (כא, לא).', onPath: false, storyIds: [] },
      { id: 'moriah', he: 'הר המוריה', en: 'Mount Moriah', lon: 35.24, lat: 31.78, x: 275.2, y: 323.4, disputed: false, dig: 'הר הבית בירושלים: החפירה המלאה אינה אפשרית. הזיהוי עם המוריה הוא מסורתי ומקובל.', side: 'r', ref: 'בראשית כב, ב; דברי הימים ב ג, א', note: 'מקום העקידה. דברי הימים מזהה אותו עם מקום הבית.', onPath: false, storyIds: ['akedah'] },
    ],
  },
  {
    id: 'exodus',
    he: 'מסע היציאה',
    subtitle: 'מרעמסס עד הר סיני, לפי רשימת המסעות במדבר לג ושמות יב-יט.',
    color: '#1f3558',
    view: GEO_VIEW,
    path: ['ramses', 'succoth', 'etham', 'pihahiroth', 'yamsuf', 'marah', 'elim', 'sinai'],
    stops: [
      { id: 'ramses', he: 'רעמסס', en: 'Ramesses', lon: 31.82, lat: 30.79, x: 124.4, y: 374.9, disputed: false, dig: 'פי-רעמסס: נחפרה בקנטיר (Qantir) בידי אדגר פוש. הזיהוי עם רעמסס המקראי מקובל.', side: 'r', ref: 'שמות יב, לז; במדבר לג, ג', note: 'נקודת היציאה לפי המקרא (במדבר לג, ג).', onPath: true, storyIds: ['moshe-tevah', 'makot', 'pesach'] },
      { id: 'succoth', he: 'סכות', en: 'Succoth', lon: 32.1, lat: 30.5, x: 136.7, y: 390.0, disputed: true, dig: 'מיקום שנוי במחלוקת. אין זיהוי ארכיאולוגי מוסכם.', side: 'r', ref: 'שמות יב, לז', note: 'התחנה הראשונה אחרי היציאה (יב, לז).', onPath: true, storyIds: [] },
      { id: 'etham', he: 'אתם', en: 'Etham', lon: 32.6, lat: 30.2, x: 158.8, y: 405.6, disputed: true, dig: 'מיקום שנוי במחלוקת. אין זיהוי ארכיאולוגי מוסכם.', side: 'r', ref: 'במדבר לג, ו-ח', note: 'בקצה המדבר (במדבר לג, ח).', onPath: true, storyIds: [] },
      { id: 'pihahiroth', he: 'פי החירות', en: 'Pi-hahiroth', lon: 32.6, lat: 29.95, x: 158.8, y: 418.6, disputed: true, dig: 'מיקום שנוי במחלוקת. אין זיהוי ארכיאולוגי מוסכם.', side: 'r', ref: 'שמות יד, ב', note: 'הכתוב מציין את המקום לפני הים (יד, ב).', onPath: true, storyIds: [] },
      { id: 'yamsuf', he: 'ים סוף', en: 'Yam Suf', lon: 32.6, lat: 29.5, x: 158.8, y: 442.0, disputed: true, dig: 'מיקום שנוי במחלוקת: "ים סוף" יכול להיות מפרץ סואץ או אגם. אין זיהוי ארכיאולוגי מוסכם.', side: 'l', ref: 'שמות יד, כא-כב', note: 'הבקיעה והמעבר (יד, כא-כב). השם מתפרש בחקר כ"ים הקנים", ומכאן התרגום Sea of Reeds.', onPath: true, storyIds: ['yetziat'] },
      { id: 'marah', he: 'מרה', en: 'Marah', lon: 33.1, lat: 29.0, x: 180.8, y: 468.0, disputed: true, dig: 'מיקום שנוי במחלוקת. אין זיהוי ארכיאולוגי מוסכם.', side: 'r', ref: 'שמות טו, כג', note: 'המים המרים (טו, כג).', onPath: true, storyIds: [] },
      { id: 'elim', he: 'אילים', en: 'Elim', lon: 33.4, lat: 28.9, x: 194.0, y: 473.2, disputed: true, dig: 'מיקום שנוי במחלוקת. אין זיהוי ארכיאולוגי מוסכם.', side: 'r', ref: 'שמות טו, כז', note: 'שתים עשרה עיינות ושבעים תמרים (טו, כז).', onPath: true, storyIds: [] },
      { id: 'sinai', he: 'הר סיני וחורב', en: 'Mount Sinai (Horeb)', lon: 33.97, lat: 28.54, x: 219.2, y: 491.9, disputed: false, dig: "הזיהוי המסורתי הוא ג'בל מוסא. אין ממצא ארכיאולוגי שמאשר זאת.", side: 'r', ref: 'שמות יט, א-ב; מלכים א יט, ח', note: 'ההר שבו נקרא השם, ושאליו חוזר אליהו.', onPath: true, storyIds: ['seneh', 'eliyahu', 'har-sinai', 'egel'] },
    ],
  },
];
