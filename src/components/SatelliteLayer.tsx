import { GEO_PROJECT } from '../content/geo-data';
import { SAT_BOUNDS, satUrl } from '../content/satellite';

// The satellite image, placed by the same projection as the vector map, so every point lines up.
// Top-left is (lon0, lat1); bottom-right is (lon1, lat0).
export default function SatelliteLayer() {
  const [x, y] = GEO_PROJECT(SAT_BOUNDS.lon0, SAT_BOUNDS.lat1);
  const [x2, y2] = GEO_PROJECT(SAT_BOUNDS.lon1, SAT_BOUNDS.lat0);
  return (
    <g className="map-satellite" aria-hidden="true">
      <image href={satUrl()} x={x} y={y} width={x2 - x} height={y2 - y} preserveAspectRatio="none" />
    </g>
  );
}
