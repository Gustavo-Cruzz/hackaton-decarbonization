import rawStateGeometries from "@/data/raw/ibge/estados-malha.geojson.json";

export interface StateGeoFeature {
  uf: string;
  center: [number, number];
  bounds: [[number, number], [number, number]];
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
}

function walkCoordinates(
  coordinates: number[][][] | number[][][][],
  visitor: (lon: number, lat: number) => void
) {
  for (const part of coordinates as Array<number[][] | number[][][]>) {
    if (typeof part[0]?.[0] === "number") {
      for (const [lon, lat] of part as number[][]) {
        visitor(lon, lat);
      }
      continue;
    }

    for (const ring of part as number[][][]) {
      for (const [lon, lat] of ring) {
        visitor(lon, lat);
      }
    }
  }
}

function computeBounds(geometry: StateGeoFeature["geometry"]): [[number, number], [number, number]] {
  let minLat = Infinity;
  let minLon = Infinity;
  let maxLat = -Infinity;
  let maxLon = -Infinity;

  walkCoordinates(geometry.coordinates as number[][][] | number[][][][], (lon, lat) => {
    minLat = Math.min(minLat, lat);
    minLon = Math.min(minLon, lon);
    maxLat = Math.max(maxLat, lat);
    maxLon = Math.max(maxLon, lon);
  });

  return [
    [minLat, minLon],
    [maxLat, maxLon]
  ];
}

export const stateGeoFeatures: StateGeoFeature[] = rawStateGeometries.map((item) => ({
  uf: item.uf,
  center: [item.metadata.centroide.latitude, item.metadata.centroide.longitude],
  bounds: computeBounds(item.geometry as StateGeoFeature["geometry"]),
  geometry: item.geometry as StateGeoFeature["geometry"]
}));
