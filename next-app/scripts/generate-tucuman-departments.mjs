// One-time reproducible extraction from the official GeoRef departamentos.ndjson.
// Usage: node scripts/generate-tucuman-departments.mjs <downloaded-ndjson>
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const source = process.argv[2];
if (!source) throw new Error("Pass the official GeoRef departamentos.ndjson path.");

const records = readFileSync(source, "utf8").trim().split(/\r?\n/);
const metadata = JSON.parse(records.shift());
const departments = records.map(JSON.parse).filter((record) => record.provincia?.id === "90");
if (departments.length !== 17 || departments.some((record) => record.geometria?.type !== "MultiPolygon")) {
  throw new Error("Expected the 17 Tucumán departmental MultiPolygons from GeoRef.");
}

const distance = (point, start, end) => {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  if (!dx && !dy) return (point[0] - start[0]) ** 2 + (point[1] - start[1]) ** 2;
  const t = Math.max(0, Math.min(1, ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / (dx * dx + dy * dy)));
  return (point[0] - start[0] - t * dx) ** 2 + (point[1] - start[1] - t * dy) ** 2;
};

function simplifyLine(points, toleranceSquared) {
  if (points.length < 3) return points;
  let furthest = -1;
  let index = -1;
  for (let i = 1; i < points.length - 1; i += 1) {
    const candidate = distance(points[i], points[0], points.at(-1));
    if (candidate > furthest) { furthest = candidate; index = i; }
  }
  if (furthest <= toleranceSquared) return [points[0], points.at(-1)];
  return [...simplifyLine(points.slice(0, index + 1), toleranceSquared).slice(0, -1), ...simplifyLine(points.slice(index), toleranceSquared)];
}

function simplifyRing(ring) {
  const open = ring.slice(0, -1);
  if (open.length < 5) return ring;
  let pivot = 1;
  let max = -1;
  for (let i = 1; i < open.length; i += 1) {
    const d = (open[i][0] - open[0][0]) ** 2 + (open[i][1] - open[0][1]) ** 2;
    if (d > max) { max = d; pivot = i; }
  }
  const toleranceSquared = 0.00015 ** 2;
  const points = [...simplifyLine(open.slice(0, pivot + 1), toleranceSquared).slice(0, -1), ...simplifyLine([...open.slice(pivot), open[0]], toleranceSquared).slice(0, -1)];
  const rounded = points.map((point) => point.map((coordinate) => Number(coordinate.toFixed(6))));
  return rounded.length >= 3 ? [...rounded, rounded[0]] : ring;
}

const features = departments.sort((a, b) => a.id.localeCompare(b.id)).map((record) => ({
  type: "Feature",
  properties: { id: record.id, name: record.nombre },
  geometry: {
    type: "MultiPolygon",
    coordinates: record.geometria.coordinates.map((polygon) => polygon.map(simplifyRing)),
  },
}));

const output = fileURLToPath(new URL("../public/assets/tucuman-departamentos.geojson", import.meta.url));
writeFileSync(output, JSON.stringify({
  type: "FeatureCollection",
  metadata: { source: "GeoRef Argentina / IGN", version: metadata.version, created: metadata.fecha_creacion, simplificationToleranceDegrees: 0.00015 },
  features,
}));
console.log(`Wrote ${features.length} official Tucumán departments to ${output}`);
