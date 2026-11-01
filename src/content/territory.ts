// Schematic territory for a period, drawn as a dashed outline on the map.
// Each outline follows the border the verse names, not a surveyed line. The map labels it "סכמטי".
// Points are [lon, lat]. Rivers and places are approximate; see the verse for the text itself.
export interface Territory {
  era: string;
  label: string;
  ref: string;
  points: [number, number][];
  // Where the label sits. Chosen in open ground, away from the stations.
  labelAt: [number, number];
}

export const TERRITORY: Territory[] = [
  {
    era: 'אבות',
    label: 'הארץ שהובטחה לזרע אברהם',
    ref: 'בראשית טו, יח: מנחל מצרים עד הנהר הגדול, נהר פרת',
    labelAt: [39.6, 30.4],
    points: [
      [34.2, 31.1],
      [35.0, 33.5],
      [38.0, 36.8],
      [42.8, 33.6],
      [41.0, 29.5],
      [37.0, 29.0],
      [34.5, 29.8],
    ],
  },
  {
    era: 'מלוכה',
    label: 'ממלכת שלמה',
    ref: 'מלכים א ד, כא-כד: מהנהר עד ארץ פלשתים ועד גבול מצרים',
    labelAt: [39.8, 33.6],
    points: [
      [34.45, 31.5],
      [32.6, 30.9],
      [34.95, 29.55],
      [38.5, 31.0],
      [42.0, 33.0],
      [40.0, 35.5],
      [38.0, 36.8],
      [36.0, 35.0],
      [35.0, 33.3],
    ],
  },
];
