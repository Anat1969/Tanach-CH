// The schematic base of the map. Viewbox 640 x 780, north up, sea on the west.
// Every feature has a name on the map (house rule: no mark without a label).
const COAST = 'M0 0 L96 0 C74 110 112 200 92 300 C70 404 122 490 100 580 C84 652 66 718 44 780 L0 780 Z';
const NILE = 'M128 600 C134 650 144 700 150 780';
const EUPHRATES = 'M640 300 C602 380 574 460 562 540 C552 606 566 690 604 780';
const TIGRIS = 'M640 360 C620 420 602 486 592 556 C584 616 592 700 626 780';
const JORDAN = 'M420 0 C400 120 380 220 345 330 C320 430 300 520 285 600';
const SINAI = 'M165 600 L230 584 L258 640 L300 690 L332 760 L270 780 L214 700 L168 650 Z';
const DESERT_NEGEV = 'M176 470 L306 470 L330 540 L286 610 L214 600 L180 540 Z';

// Mountains of the central highlands, drawn as small chevrons.
const hills: string[] = [];
for (let row = 0; row < 7; row++) {
  for (let col = 0; col < 3; col++) {
    const x = 282 + col * 26 + (row % 2) * 13;
    const y = 240 + row * 34;
    hills.push(`M${x} ${y} l6 -9 l6 9`);
  }
}

export default function MapBase() {
  return (
    <g className="map-base" aria-hidden="true">
      <defs>
        <pattern id="desert-dots" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" className="desert-dot" />
        </pattern>
        <pattern id="sinai-lines" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="10" className="sinai-line" />
        </pattern>
      </defs>

      <rect x="-100" y="-100" width="900" height="1000" className="map-ground" />
      <path d={COAST} className="map-sea" />
      <path d={COAST} className="map-coast" />

      <path d={DESERT_NEGEV} fill="url(#desert-dots)" className="map-desert" />
      <path d={SINAI} fill="url(#sinai-lines)" className="map-sinai" />

      <path d={JORDAN} className="map-river" />
      <path d={NILE} className="map-river map-river-minor" />
      <path d={EUPHRATES} className="map-river map-river-minor" />
      <path d={TIGRIS} className="map-river map-river-minor" />

      <ellipse cx="345" cy="222" rx="13" ry="9" className="map-lake" />
      <ellipse cx="285" cy="605" rx="12" ry="26" className="map-dead-sea" />

      <path d={hills.join(' ')} className="map-hills" />

      <text x="364" y="198" className="map-label map-label-small" style={{ direction: 'rtl' }}>
        ים כנרת
      </text>
      <text x="298" y="652" className="map-label map-label-small" style={{ direction: 'rtl' }}>
        ים המלח
      </text>
      <text x="420" y="150" className="map-label" style={{ direction: 'rtl' }}>
        הירדן
      </text>
      <text x="150" y="752" className="map-label map-label-small" style={{ direction: 'rtl' }}>
        הנילוס
      </text>
      <text x="610" y="330" className="map-label map-label-small" style={{ direction: 'rtl' }}>
        הפרת
      </text>
      <text x="612" y="420" className="map-label map-label-small" style={{ direction: 'rtl' }}>
        החידקל
      </text>
      <text x="250" y="340" className="map-region" style={{ direction: 'rtl' }}>
        הרי השומרון ויהודה
      </text>
      <text x="236" y="520" className="map-region" style={{ direction: 'rtl' }}>
        הנגב
      </text>
      <text x="262" y="742" className="map-region" style={{ direction: 'rtl' }}>
        חצי האי סיני
      </text>
      <text x="520" y="250" className="map-region" style={{ direction: 'rtl' }}>
        ארם נהריים ומסופוטמיה
      </text>
      <text x="30" y="420" className="map-sea-label" style={{ direction: 'rtl' }}>
        הים התיכון
      </text>
      <text x="420" y="40" className="map-region" style={{ direction: 'rtl' }}>
        ארץ כנען (סכמטי)
      </text>

      {/* North arrow */}
      <g transform="translate(596 52)">
        <circle r="22" className="compass-ring" />
        <path d="M0 -16 L6 6 L0 2 L-6 6 Z" className="compass-needle" />
        <text y="-28" textAnchor="middle" className="map-label map-label-small">
          צפון
        </text>
      </g>
    </g>
  );
}
