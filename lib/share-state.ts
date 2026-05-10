import { createDefaultLayerVisibility, getEnabledLayerKeys, layerDefinitions } from "@/lib/map-config";
import { DemoState, LayerKey, MunicipalityRecord, RankedTerritory } from "@/lib/types";

const shareableLayerKeys = new Set(layerDefinitions.map((layer) => layer.key));

function parseBoolean(value: string | null, fallback: boolean) {
  if (value === null) {
    return fallback;
  }
  return value === "1" || value === "true";
}

function parseLayerList(value: string | null) {
  const fallback = createDefaultLayerVisibility();
  if (!value) {
    return fallback;
  }

  const next = { ...fallback };
  for (const key of value.split(",").map((item) => item.trim()).filter(Boolean)) {
    if (shareableLayerKeys.has(key as LayerKey)) {
      next[key as LayerKey] = true;
    }
  }
  return next;
}

export function demoStateToSearchParams(state: DemoState) {
  const params = new URLSearchParams();
  params.set("selectedUf", state.selectedUf);
  params.set("mapLevel", state.mapLevel);
  params.set("profile", state.profile);
  params.set("objective", state.objective);
  params.set("enabledLayers", getEnabledLayerKeys(state.enabledLayers).join(","));
  params.set("compareUfs", state.compareUfs.join(","));
  params.set("layerOpacity", String(state.layerOpacity));
  params.set("useBasemap", state.useBasemap ? "1" : "0");
  if (state.selectedMunicipalityId) {
    params.set("selectedMunicipalityId", state.selectedMunicipalityId);
  }
  if (state.activeTheme) {
    params.set("activeTheme", state.activeTheme);
  }
  return params;
}

export function applySearchParamsToState(fallback: DemoState, searchParams: URLSearchParams): DemoState {
  const next = { ...fallback };
  const compareUfs = searchParams.get("compareUfs");
  const layerOpacity = Number(searchParams.get("layerOpacity"));

  next.selectedUf = searchParams.get("selectedUf") ?? fallback.selectedUf;
  next.mapLevel =
    searchParams.get("mapLevel") === "municipal" || searchParams.get("mapLevel") === "state" || searchParams.get("mapLevel") === "national"
      ? (searchParams.get("mapLevel") as DemoState["mapLevel"])
      : fallback.mapLevel;
  next.selectedMunicipalityId = searchParams.get("selectedMunicipalityId") ?? fallback.selectedMunicipalityId;
  next.activeTheme = (searchParams.get("activeTheme") as DemoState["activeTheme"]) ?? fallback.activeTheme;
  next.enabledLayers = parseLayerList(searchParams.get("enabledLayers"));
  next.compareUfs = compareUfs ? compareUfs.split(",").filter(Boolean).slice(0, 3) : fallback.compareUfs;
  next.layerOpacity = Number.isFinite(layerOpacity) ? Math.max(0.2, Math.min(1, layerOpacity)) : fallback.layerOpacity;
  next.useBasemap = parseBoolean(searchParams.get("useBasemap"), fallback.useBasemap);
  return next;
}

export function buildTerritoryDownloadPayload(
  territory: RankedTerritory,
  state: DemoState,
  municipality?: MunicipalityRecord | null
) {
  if (municipality && state.mapLevel === "municipal") {
    return {
      exportedAt: "2026-05-10",
      territoryType: "municipio",
      mapLevel: state.mapLevel,
      activeLayers: getEnabledLayerKeys(state.enabledLayers),
      territory: municipality
    };
  }

  return {
    exportedAt: "2026-05-10",
    territoryType: "estado",
    mapLevel: state.mapLevel,
    activeLayers: getEnabledLayerKeys(state.enabledLayers),
    territory
  };
}
