"use client";

import { useEffect, useMemo, useRef } from "react";
import { CircleMarker, GeoJSON, MapContainer, Pane, Popup, TileLayer, Tooltip, useMap } from "react-leaflet";
import { LatLngBoundsExpression, Path, latLngBounds } from "leaflet";
import { FeatureCollection } from "geojson";
import { stateGeoFeatures } from "@/data/states-geo";
import { formatInt } from "@/lib/display";
import { LayerKey, LayerVisibilityState, MapLevel, MunicipalityRecord, RankedTerritory } from "@/lib/types";

const BRAZIL_BOUNDS: LatLngBoundsExpression = [
  [-34.5, -74.5],
  [5.5, -32]
];

function colorForValue(value: number) {
  if (value >= 80) return "#0e9f6e";
  if (value >= 60) return "#2fb38b";
  if (value >= 40) return "#f59e0b";
  return "#c2410c";
}

function symbolColor(layerKey: LayerKey) {
  const colors: Partial<Record<LayerKey, string>> = {
    solar: "#f59e0b",
    eolica: "#0f766e",
    biomassa: "#65a30d",
    portos: "#1d4ed8",
    industrias: "#7c3aed",
    hubs: "#db2777"
  };

  return colors[layerKey] ?? "#334155";
}

function valueForLayer(territory: RankedTerritory | MunicipalityRecord, layerKey: LayerKey) {
  const scores = "scores" in territory ? territory.scores : territory.scoresProxy;
  switch (layerKey) {
    case "imte":
      return "imte" in territory ? territory.imte : territory.imteProxy;
    case "energia-score":
      return scores.energiaLimpa;
    case "infraestrutura-score":
      return scores.infraestrutura;
    case "industria-score":
      return scores.industria;
    case "logistica-score":
      return scores.logistica;
    case "socioambiental-score":
      return scores.socioambiental;
    default:
      return "imte" in territory ? territory.imte : territory.imteProxy;
  }
}

function hasSymbolLayer(layerKey: LayerKey) {
  return layerKey === "solar" || layerKey === "eolica" || layerKey === "biomassa" || layerKey === "portos" || layerKey === "industrias" || layerKey === "hubs";
}

function offsetPosition(center: [number, number], layerKey: LayerKey): [number, number] {
  const offsets: Record<string, [number, number]> = {
    solar: [0.35, -0.45],
    eolica: [-0.35, 0.4],
    biomassa: [0.15, 0.55],
    portos: [-0.5, -0.3],
    industrias: [0.45, 0.15],
    hubs: [0, 0]
  };
  const [latOffset, lonOffset] = offsets[layerKey] ?? [0, 0];
  return [center[0] + latOffset, center[1] + lonOffset];
}

function MapViewportController({
  mapLevel,
  selectedUf,
  selectedMunicipality
}: {
  mapLevel: MapLevel;
  selectedUf: string;
  selectedMunicipality?: MunicipalityRecord | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (mapLevel === "national") {
      map.fitBounds(BRAZIL_BOUNDS, { padding: [24, 24] });
      return;
    }

    if (mapLevel === "municipal" && selectedMunicipality) {
      map.fitBounds(
        latLngBounds(
          [selectedMunicipality.bbox[0], selectedMunicipality.bbox[1]],
          [selectedMunicipality.bbox[2], selectedMunicipality.bbox[3]]
        ),
        { padding: [20, 20], maxZoom: 11 }
      );
      return;
    }

    const selectedState = stateGeoFeatures.find((feature) => feature.uf === selectedUf);
    if (selectedState) {
      map.fitBounds(selectedState.bounds, { padding: [22, 22], maxZoom: 8 });
    }
  }, [map, mapLevel, selectedMunicipality, selectedUf]);

  return null;
}

interface LeafletMapCanvasProps {
  ranked: RankedTerritory[];
  municipalities: MunicipalityRecord[];
  selectedUf: string;
  selectedMunicipalityId?: string;
  mapLevel: MapLevel;
  primaryLayer: LayerKey;
  enabledLayers: LayerVisibilityState;
  layerOpacity: number;
  useBasemap: boolean;
  onSelectUf: (uf: string) => void;
  onSelectMunicipality: (municipalityId: string) => void;
  onBasemapFailure: () => void;
}

export default function LeafletMapCanvas({
  ranked,
  municipalities,
  selectedUf,
  selectedMunicipalityId,
  mapLevel,
  primaryLayer,
  enabledLayers,
  layerOpacity,
  useBasemap,
  onSelectUf,
  onSelectMunicipality,
  onBasemapFailure
}: LeafletMapCanvasProps) {
  const basemapFailedRef = useRef(false);
  const selectedMunicipality = municipalities.find((item) => item.id === selectedMunicipalityId) ?? null;
  const stateByUf = useMemo(() => new Map(ranked.map((territory) => [territory.uf, territory])), [ranked]);

  const stateFeatures = useMemo(
    () =>
      stateGeoFeatures.map((feature) => {
        const territory = stateByUf.get(feature.uf);
        return {
          type: "Feature" as const,
          properties: {
            uf: feature.uf,
            state: territory?.state ?? feature.uf,
            imte: territory?.imte ?? 0,
            classification: territory?.classification ?? "Sem dado"
          },
          geometry: feature.geometry
        };
      }),
    [stateByUf]
  );
  const stateFeatureCollection = useMemo(
    () =>
      ({
        type: "FeatureCollection",
        features: stateFeatures
      }) as FeatureCollection,
    [stateFeatures]
  );

  const municipalityFeatures = useMemo(
    () =>
      municipalities.map((municipality) => ({
        type: "Feature" as const,
        properties: {
          id: municipality.id,
          name: municipality.name,
          imteProxy: municipality.imteProxy,
          classification: municipality.classification
        },
        geometry: municipality.geometry
      })),
    [municipalities]
  );
  const municipalityFeatureCollection = useMemo(
    () =>
      ({
        type: "FeatureCollection",
        features: municipalityFeatures
      }) as FeatureCollection,
    [municipalityFeatures]
  );

  const activeSymbolLayers = (Object.keys(enabledLayers) as LayerKey[]).filter((key) => enabledLayers[key] && hasSymbolLayer(key));

  return (
    <MapContainer
      bounds={BRAZIL_BOUNDS}
      scrollWheelZoom
      className="h-[520px] w-full rounded-[24px]"
      zoomControl={false}
    >
      <MapViewportController mapLevel={mapLevel} selectedUf={selectedUf} selectedMunicipality={selectedMunicipality} />

      {useBasemap ? (
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          eventHandlers={{
            tileerror: () => {
              if (!basemapFailedRef.current) {
                basemapFailedRef.current = true;
                onBasemapFailure();
              }
            }
          }}
        />
      ) : null}

      <Pane name="states">
        <GeoJSON
          data={stateFeatureCollection}
          style={(feature) => {
            const territory = feature?.properties?.uf ? stateByUf.get(feature.properties.uf) : undefined;
            const selected = territory?.uf === selectedUf && mapLevel !== "national";
            const value = territory ? valueForLayer(territory, primaryLayer) : 0;
            return {
              color: selected ? "#13354b" : "#5d7a78",
              weight: selected ? 2.4 : 1.1,
              fillColor: colorForValue(value),
              fillOpacity: enabledLayers[primaryLayer] ? layerOpacity : 0.16
            };
          }}
          onEachFeature={(feature, layer) => {
            layer.on("add", () => {
              (layer as Path).getElement()?.setAttribute("data-testid", `map-state-${feature.properties.uf}`);
            });
            layer.on({
              click: () => onSelectUf(feature.properties.uf)
            });
            layer.bindTooltip(`${feature.properties.state} • IMTE ${formatInt(feature.properties.imte)}`, {
              sticky: true
            });
          }}
        />
      </Pane>

      {mapLevel === "municipal" && municipalityFeatures.length > 0 ? (
        <Pane name="municipalities">
          <GeoJSON
            data={municipalityFeatureCollection}
            style={(feature) => {
              const municipality = feature?.properties?.id
                ? municipalities.find((item) => item.id === feature.properties.id)
                : undefined;
              const selected = municipality?.id === selectedMunicipalityId;
              const value = municipality ? valueForLayer(municipality, primaryLayer) : 0;
              return {
                color: selected ? "#102a22" : "#6b7280",
                weight: selected ? 2 : 0.8,
                fillColor: colorForValue(value),
                fillOpacity: enabledLayers[primaryLayer] ? layerOpacity : 0.12
              };
            }}
            onEachFeature={(feature, layer) => {
              layer.on("add", () => {
                (layer as Path).getElement()?.setAttribute("data-testid", `map-municipality-${feature.properties.id}`);
              });
              layer.on({
                click: () => onSelectMunicipality(feature.properties.id)
              });
              layer.bindTooltip(`${feature.properties.name} • IMTE proxy ${formatInt(feature.properties.imteProxy)}`, {
                sticky: true
              });
            }}
          />
        </Pane>
      ) : null}

      {activeSymbolLayers.map((layerKey) =>
        ranked.map((territory) => {
          const feature = stateGeoFeatures.find((item) => item.uf === territory.uf);
          if (!feature) {
            return null;
          }
          const base = feature.center;
          const position = offsetPosition(base, layerKey);
          const assets = territory.assets;
          const value =
            layerKey === "solar"
              ? assets.solar
              : layerKey === "eolica"
                ? assets.eolica
                : layerKey === "biomassa"
                  ? assets.biomassa
                  : layerKey === "portos"
                    ? assets.portos
                    : layerKey === "industrias"
                      ? assets.industrias
                      : assets.hubs;
          if (value <= 0) {
            return null;
          }
          return (
            <CircleMarker
              key={`${layerKey}-${territory.uf}`}
              center={position}
              radius={Math.max(4, Math.min(12, 3 + value))}
              pathOptions={{ color: symbolColor(layerKey), fillColor: symbolColor(layerKey), fillOpacity: 0.78, weight: 1 }}
            >
              <Tooltip>{`${territory.state} • ${formatInt(value)} sinais de ${layerKey.replace("-", " ")}`}</Tooltip>
              <Popup>{`${territory.state}: ${formatInt(value)} ativos/sinais em ${layerKey.replace("-", " ")}.`}</Popup>
            </CircleMarker>
          );
        })
      )}

      {mapLevel === "municipal" && activeSymbolLayers.map((layerKey) =>
        municipalities.map((municipality) => {
          const value =
            layerKey === "solar"
              ? municipality.assetsProxy.solar
              : layerKey === "eolica"
                ? municipality.assetsProxy.eolica
                : layerKey === "biomassa"
                  ? municipality.assetsProxy.biomassa
                  : layerKey === "portos"
                    ? municipality.assetsProxy.portos
                    : layerKey === "industrias"
                      ? municipality.assetsProxy.industrias
                      : municipality.assetsProxy.hubs;
          if (value <= 0) {
            return null;
          }
          return (
            <CircleMarker
              key={`${layerKey}-${municipality.id}`}
              center={offsetPosition(municipality.centroid, layerKey)}
              radius={Math.max(3, Math.min(9, 2 + value))}
              pathOptions={{ color: symbolColor(layerKey), fillColor: symbolColor(layerKey), fillOpacity: 0.68, weight: 1 }}
            >
              <Tooltip>{`${municipality.name} • proxy ${formatInt(value)} em ${layerKey.replace("-", " ")}`}</Tooltip>
            </CircleMarker>
          );
        })
      )}
    </MapContainer>
  );
}
