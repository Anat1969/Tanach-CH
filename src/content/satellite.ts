// Satellite image of the region, for the map. Source: NASA GIBS (Global Imagery Browse Services),
// MODIS Terra true colour, 10 September 2020. NASA imagery is public domain (נחלת הכלל).
// The image is requested for the same box as the map (lon 29–48, lat 26–38), so it lines up with the vector map.
// Resolution is about 250 m per pixel. It shows the land, sea, rivers and the Nile delta, not individual sites.
// Individual sites (Tell es-Saba, Beitin, Qantir and others) are documented in the stop notes, not in the image.

export const SAT_LAYER = 'MODIS_Terra_CorrectedReflectance_TrueColor';
export const SAT_DATE = '2020-09-10';
export const SAT_BOUNDS = { lon0: 29, lon1: 48, lat0: 26, lat1: 38 } as const;

// WMS 1.1.1 with EPSG:4326 takes BBOX as lon,lat,lon,lat. The image is 2x the view size, for sharpness.
export function satUrl(): string {
  const p = new URLSearchParams({
    SERVICE: 'WMS',
    REQUEST: 'GetMap',
    VERSION: '1.1.1',
    LAYERS: SAT_LAYER,
    STYLES: '',
    SRS: 'EPSG:4326',
    BBOX: `${SAT_BOUNDS.lon0},${SAT_BOUNDS.lat0},${SAT_BOUNDS.lon1},${SAT_BOUNDS.lat1}`,
    WIDTH: '1676',
    HEIGHT: '1248',
    FORMAT: 'image/jpeg',
    TIME: SAT_DATE,
  });
  return `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?${p.toString()}`;
}

export const SAT_CREDIT = 'תמונת לוויין: NASA GIBS, MODIS Terra, 10.09.2020, נחלת הכלל.';
