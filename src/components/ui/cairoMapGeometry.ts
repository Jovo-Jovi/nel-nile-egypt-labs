// Drawn geography for GreaterCairoMap. Coordinates here are the Nile,
// parks, arteries and district anchors — public city geometry, never a
// Branch address. Branch pins are projected with the same frame from
// published latitude and longitude.

export type MapFrame = {
  west: number;
  east: number;
  south: number;
  north: number;
};

export const MAP_SVG_WIDTH = 100;
export const MAP_SVG_HEIGHT = 56.25;

type LatLng = readonly [number, number];

type Point = { latitude: number; longitude: number };

const ASPECT = 16 / 9;
const MIN_LAT_SPAN = 0.09;
const PAD = 0.18;

const NILE: LatLng[] = [
  [30.16, 31.255],
  [30.14, 31.248],
  [30.12, 31.242],
  [30.1, 31.232],
  [30.085, 31.224],
  [30.07, 31.218],
  [30.058, 31.22],
  [30.045, 31.228],
  [30.032, 31.23],
  [30.015, 31.232],
  [29.995, 31.24],
  [29.97, 31.252],
  [29.945, 31.268],
  [29.91, 31.295],
];

const SALAH_SALEM: LatLng[] = [
  [30.082, 31.278],
  [30.068, 31.305],
  [30.052, 31.332],
  [30.028, 31.345],
  [29.99, 31.31],
];

const OROUBA: LatLng[] = [
  [30.13, 31.355],
  [30.11, 31.345],
  [30.092, 31.332],
  [30.072, 31.322],
];

const BRIDGES: LatLng[][] = [
  [
    [30.08, 31.208],
    [30.08, 31.242],
  ],
  [
    [30.061, 31.204],
    [30.061, 31.24],
  ],
  [
    [30.044, 31.21],
    [30.044, 31.244],
  ],
  [
    [30.027, 31.212],
    [30.027, 31.246],
  ],
];

const PARKS: { lat: number; lng: number; radiusLat: number; radiusLng: number }[] = [
  { lat: 30.058, lng: 31.22, radiusLat: 0.015, radiusLng: 0.007 },
  { lat: 30.041, lng: 31.264, radiusLat: 0.007, radiusLng: 0.009 },
  { lat: 30.09, lng: 31.322, radiusLat: 0.008, radiusLng: 0.01 },
];

const DISTRICTS: { id: string; lat: number; lng: number }[] = [
  { id: "giza", lat: 30.042, lng: 31.198 },
  { id: "cairo", lat: 30.048, lng: 31.255 },
  { id: "maadi", lat: 29.962, lng: 31.275 },
  { id: "heliopolis", lat: 30.098, lng: 31.345 },
  { id: "kobba", lat: 30.096, lng: 31.278 },
];

export function frameAround(points: Point[]): MapFrame {
  const source = points.length > 0 ? points : [{ latitude: 30.06, longitude: 31.28 }];
  let minLat = source[0].latitude;
  let maxLat = source[0].latitude;
  let minLng = source[0].longitude;
  let maxLng = source[0].longitude;
  for (const point of source) {
    minLat = Math.min(minLat, point.latitude);
    maxLat = Math.max(maxLat, point.latitude);
    minLng = Math.min(minLng, point.longitude);
    maxLng = Math.max(maxLng, point.longitude);
  }
  const midLat = (minLat + maxLat) / 2;
  const midLng = (minLng + maxLng) / 2;
  const inner = 1 - 2 * PAD;
  let latSpan = Math.max(maxLat - minLat, 0.0001) / inner;
  let lngSpan = Math.max(maxLng - minLng, 0.0001) / inner;
  const cos = Math.cos((midLat * Math.PI) / 180);
  const lngForAspect = (latSpan * ASPECT) / cos;
  const latForAspect = (lngSpan * cos) / ASPECT;
  if (lngSpan < lngForAspect) lngSpan = lngForAspect;
  else latSpan = latForAspect;
  if (latSpan < MIN_LAT_SPAN) {
    const scale = MIN_LAT_SPAN / latSpan;
    latSpan *= scale;
    lngSpan *= scale;
  }
  return {
    south: midLat - latSpan / 2,
    north: midLat + latSpan / 2,
    west: midLng - lngSpan / 2,
    east: midLng + lngSpan / 2,
  };
}

function projectSvg(frame: MapFrame, latitude: number, longitude: number): { x: number; y: number } {
  const lngSpan = frame.east - frame.west;
  const latSpan = frame.north - frame.south;
  return {
    x: ((longitude - frame.west) / lngSpan) * MAP_SVG_WIDTH,
    y: ((frame.north - latitude) / latSpan) * MAP_SVG_HEIGHT,
  };
}

// Outbound Maps URL built from a published coordinate pair. On a phone
// this opens the Google Maps app when it is installed; otherwise it opens
// Google Maps in the browser. No fetch, no embed.
export function branchMapsHref(latitude: number, longitude: number): string {
  const query = `${latitude.toFixed(6)},${longitude.toFixed(6)}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function projectPercent(frame: MapFrame, latitude: number, longitude: number): { x: number; y: number } {
  const point = projectSvg(frame, latitude, longitude);
  return { x: point.x, y: (point.y / MAP_SVG_HEIGHT) * 100 };
}

function linePath(frame: MapFrame, points: LatLng[]): string {
  return points
    .map((point, index) => {
      const projected = projectSvg(frame, point[0], point[1]);
      const command = index === 0 ? "M" : "L";
      return `${command}${projected.x.toFixed(2)} ${projected.y.toFixed(2)}`;
    })
    .join(" ");
}

function ribbonPath(frame: MapFrame, center: LatLng[], halfWidthLng: number): string {
  const nearBank: { x: number; y: number }[] = [];
  const farBank: { x: number; y: number }[] = [];
  for (let index = 0; index < center.length; index += 1) {
    const previous = center[Math.max(0, index - 1)];
    const next = center[Math.min(center.length - 1, index + 1)];
    const dLat = next[0] - previous[0];
    const dLng = next[1] - previous[1];
    const length = Math.hypot(dLng, dLat) || 1;
    const [lat, lng] = center[index];
    const cos = Math.cos((lat * Math.PI) / 180);
    const offLng = (-dLat / length) * halfWidthLng;
    const offLat = (dLng / length) * (halfWidthLng / cos);
    nearBank.push(projectSvg(frame, lat + offLat, lng + offLng));
    farBank.push(projectSvg(frame, lat - offLat, lng - offLng));
  }
  const ring = [...nearBank, ...farBank.reverse()];
  const path = ring
    .map((point, index) => {
      const command = index === 0 ? "M" : "L";
      return `${command}${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
    })
    .join(" ");
  return `${path} Z`;
}

export type DrawnPark = { cx: number; cy: number; rx: number; ry: number };

export type DrawnDistrict = { id: string; x: number; y: number };

export type DrawnCairo = {
  bank: string;
  water: string;
  parks: DrawnPark[];
  arteries: string[];
  streets: string[];
  districts: DrawnDistrict[];
};

export function drawCairo(frame: MapFrame): DrawnCairo {
  const eastBank = NILE.map(([lat, lng]) => [lat, lng + 0.012] as const);
  const westBank = NILE.map(([lat, lng]) => [lat, lng - 0.012] as const);
  const districts: DrawnDistrict[] = [];
  for (const district of DISTRICTS) {
    const point = projectPercent(frame, district.lat, district.lng);
    if (point.x < 6 || point.x > 94 || point.y < 8 || point.y > 92) continue;
    const svg = projectSvg(frame, district.lat, district.lng);
    districts.push({ id: district.id, x: svg.x, y: svg.y });
  }
  return {
    bank: ribbonPath(frame, NILE, 0.011),
    water: ribbonPath(frame, NILE, 0.006),
    parks: PARKS.map((park) => {
      const center = projectSvg(frame, park.lat, park.lng);
      const east = projectSvg(frame, park.lat, park.lng + park.radiusLng);
      const north = projectSvg(frame, park.lat + park.radiusLat, park.lng);
      return {
        cx: center.x,
        cy: center.y,
        rx: Math.abs(east.x - center.x),
        ry: Math.abs(north.y - center.y),
      };
    }),
    arteries: [linePath(frame, SALAH_SALEM), linePath(frame, OROUBA)],
    streets: [linePath(frame, eastBank), linePath(frame, westBank), ...BRIDGES.map((bridge) => linePath(frame, bridge))],
    districts,
  };
}
