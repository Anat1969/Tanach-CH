import { GEO_LAND, GEO_LAKES, GEO_RIVERS, GEO_PROJECT, GEO_VIEW } from '../content/geo-data';

// Every label here is placed by real coordinates. Source of the geometry: Natural Earth (public domain).
const at = (lon: number, lat: number) => GEO_PROJECT(lon, lat);
const [, , VIEW_W, VIEW_H] = GEO_VIEW.split(' ').map(Number);

interface Label {
  lon: number;
  lat: number;
  text: string;
  kind: 'water' | 'land' | 'river' | 'region';
}

const LABELS: Label[] = [
  { lon: 33.6, lat: 33.2, text: 'הים התיכון', kind: 'water' },
  { lon: 34.9, lat: 32.6, text: 'ארץ כנען', kind: 'land' },
  { lon: 33.7, lat: 29.4, text: 'חצי האי סיני', kind: 'land' },
  { lon: 31.2, lat: 27.0, text: 'מצרים', kind: 'land' },
  { lon: 43.0, lat: 34.6, text: 'מסופוטמיה', kind: 'land' },
  { lon: 40.8, lat: 26.8, text: 'מפרץ הפרס', kind: 'water' },
  { lon: 35.6, lat: 31.45, text: 'ים המלח', kind: 'water' },
  { lon: 35.6, lat: 32.85, text: 'ים כנרת', kind: 'water' },
  { lon: 35.55, lat: 32.5, text: 'הירדן', kind: 'river' },
  { lon: 39.4, lat: 32.2, text: 'הפרת', kind: 'river' },
  { lon: 44.6, lat: 33.0, text: 'החידקל', kind: 'river' },
  { lon: 32.1, lat: 27.9, text: 'הנילוס', kind: 'river' },
];

export default function MapBase() {
  return (
    <g className="map-base" aria-hidden="true">
      <rect x={-200} y={-200} width={1400} height={1000} className="map-sea" />
      <path d={GEO_LAND} className="map-land" />
      <path d={GEO_LAKES} className="map-lake" />
      <path d={GEO_RIVERS} className="map-river" />
      {LABELS.map((l) => {
        const [x, y] = at(l.lon, l.lat);
        return (
          <text key={l.text} x={x} y={y} textAnchor="middle" className={`geo-label geo-${l.kind}`} style={{ direction: 'rtl' }}>
            {l.text}
          </text>
        );
      })}
      <g transform={`translate(${VIEW_W - 60} 50)`}>
        <circle r="22" className="compass-ring" />
        <path d="M0 -16 L6 6 L0 2 L-6 6 Z" className="compass-needle" />
        <text y="-28" textAnchor="middle" className="map-label map-label-small">
          צפון
        </text>
      </g>
      <text x={20} y={VIEW_H - 14} className="map-scale-note" style={{ direction: 'rtl' }}>
        מפה גאוגרפית פשוטה. קווי החוף והנהרות מ-Natural Earth (נחלת הכלל). המיקומים המסומנים משוערים.
      </text>
    </g>
  );
}
