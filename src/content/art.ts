// Artworks that show the events. Public domain only; each entry names its artist, year, and source.
// src is a file under public/art/. Stories without an entry show that no verified image exists yet.
export interface Artwork {
  src: string;
  title: string;
  artist: string;
  year: string;
  source: string;
  license: string;
}

export const ART: Record<string, Artwork> = {
  'seneh': {
    src: 'art/seneh.jpg',
    title: "משה וסנה הבוער",
    artist: "Andrea Schiavone (Andrea Meldola)",
    year: "ca. 1544–48",
    source: 'https://www.metmuseum.org/art/collection/search/366243',
    license: 'נחלת הכלל (CC0, The Met)',
  },
  'moshe-tevah': {
    src: 'art/moshe-tevah.jpg',
    title: "ההצלה של משה מן המים",
    artist: "Jacopo Tintoretto",
    year: "1560ות (לפי המוזיאון)",
    source: 'https://www.metmuseum.org/art/collection/search/437820',
    license: 'נחלת הכלל (CC0, The Met)',
  },
  'yetziat': {
    src: 'art/yetziat.jpg',
    title: "מעבר ים סוף",
    artist: "Orazio Farinati",
    year: "1583",
    source: 'https://www.metmuseum.org/art/collection/search/359558',
    license: 'נחלת הכלל (CC0, The Met)',
  },
  'makot': {
    src: 'art/makot.jpg',
    title: "המכה החמישית של מצרים (מתוך Liber Studiorum)",
    artist: "Joseph Mallord William Turner",
    year: "1808",
    source: 'https://www.metmuseum.org/art/collection/search/382981',
    license: 'נחלת הכלל (CC0, The Met)',
  },
  'pesach': {
    src: 'art/pesach.jpg',
    title: "הכנות לפסח (מתוך סדרת סיפור משה)",
    artist: "Johann Sadeler I",
    year: "1585",
    source: 'https://www.metmuseum.org/art/collection/search/706551',
    license: 'נחלת הכלל (CC0, The Met)',
  },
  'har-sinai': {
    src: 'art/har-sinai.jpg',
    title: "משה מקבל את לוחות החוק בהר סיני",
    artist: "Pietro Santi Bartoli",
    year: "1650–70",
    source: 'https://www.metmuseum.org/art/collection/search/650125',
    license: 'נחלת הכלל (CC0, The Met)',
  },
  'egel': {
    src: 'art/egel.jpg',
    title: "משה שובר את הלוחות אחרי חטא העגל (שמות לב, יט)",
    artist: "Edward Armitage",
    year: "1881",
    source: 'https://www.metmuseum.org/art/collection/search/642908',
    license: 'נחלת הכלל (CC0, The Met)',
  },
  'noah': {
    src: 'art/noah.jpg',
    title: "נח נכנס אל התיבה",
    artist: "Giovanni Benedetto Castiglione",
    year: "1609–64",
    source: 'https://www.metmuseum.org/art/collection/search/335665',
    license: 'נחלת הכלל (CC0, The Met)',
  },
  'bavel': {
    src: 'art/bavel.jpg',
    title: "חורבן מגדל בבל",
    artist: "Crispijn de Passe the Elder",
    year: "1612",
    source: 'https://www.metmuseum.org/art/collection/search/414782',
    license: 'נחלת הכלל (CC0, The Met)',
  },
  'yaakov-sulam': {
    src: 'art/yaakov-sulam.jpg',
    title: "סולם יעקב",
    artist: "J. J. Grandville",
    year: "1836",
    source: 'https://www.metmuseum.org/art/collection/search/813371',
    license: 'נחלת הכלל (CC0, The Met)',
  },
  'yaakov-peniel': {
    src: 'art/yaakov-peniel.jpg',
    title: "יעקב נאבק עם המלאך",
    artist: "Eugène Delacroix",
    year: "1850",
    source: 'https://www.metmuseum.org/art/collection/search/371674',
    license: 'נחלת הכלל (CC0, The Met)',
  },
  'yosef': {
    src: 'art/yosef.jpg',
    title: "יעקב נותן ליוסף כתונת צבעונית",
    artist: "Daniel Seiter",
    year: "17–18 (לפי המוזיאון)",
    source: 'https://www.metmuseum.org/art/collection/search/382002',
    license: 'נחלת הכלל (CC0, The Met)',
  },
  'akedah': {
    src: 'art/akedah.jpg',
    title: "עקדת יצחק",
    artist: "Pietro Testa",
    year: "ca. 1645–50",
    source: 'https://www.metmuseum.org/art/collection/search/397657',
    license: 'נחלת הכלל (CC0, The Met)',
  },
  'lech-lecha': {
    src: 'art/lech-lecha.jpg',
    title: "אברהם ושרה בדרך בכנען למצרים (בראשית יב)",
    artist: "P.M.",
    year: "ca. 1567 (לפי המוזיאון)",
    source: 'https://www.metmuseum.org/art/collection/search/204598',
    license: 'נחלת הכלל (CC0, The Met)',
  },
  'eliyahu': {
    src: 'art/eliyahu.jpg',
    title: "אליהו במדבר, מאכיל אותו מלאך. לפני חורב (מלכים א, יט, ד-ח)",
    artist: "Alessandro Magnasco",
    year: "1687–1749 (לפי המוזיאון)",
    source: 'https://www.metmuseum.org/art/collection/search/335975',
    license: 'נחלת הכלל (CC0, The Met)',
  },
  'bereshit-creation': {
    src: 'art/bereshit-creation.jpg',
    title: 'יצירת המאורות והצומח, התקרה של הקפלה הסיסטינית',
    artist: 'מיכלאנג\'לו בואונרוטי',
    year: '1511',
    source: 'https://commons.wikimedia.org/wiki/File:Michelangelo,_Creation_of_the_Sun,_Moon,_and_Plants_01.jpg',
    license: 'נחלת הכלל (Public domain)',
  },
};
