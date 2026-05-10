import { resolveWeights } from "@/lib/imte";
import { createDefaultLayerVisibility } from "@/lib/map-config";
import { DemoState, LayerGroupKey, LayerKey, LayerVisibilityState, MapLevel, ObjectiveId, ProfileId, Weights } from "@/lib/types";

export const DEMO_STATE_STORAGE_KEY = "pid-mvp-demo-state:v1";

export const DEFAULT_CHAT_QUESTION = "Qual estado e melhor para hidrogenio verde?";

export const defaultEnabledLayers: LayerVisibilityState = createDefaultLayerVisibility();

export function createDefaultDemoState(): DemoState {
  return {
    profile: "investidor",
    objective: "hidrogenio-verde",
    weights: resolveWeights("hidrogenio-verde", "investidor"),
    selectedUf: "BA",
    mapLevel: "national",
    selectedMunicipalityId: undefined,
    compareUfs: ["BA", "CE", "ES"],
    enabledLayers: { ...defaultEnabledLayers },
    activeTheme: "indicadores",
    layerOpacity: 0.72,
    useBasemap: true,
    chatOpen: true,
    chatQuestion: DEFAULT_CHAT_QUESTION
  };
}

function isProfileId(value: unknown): value is ProfileId {
  return value === "gestor-publico" || value === "investidor" || value === "engenheiro" || value === "pesquisador";
}

function isObjectiveId(value: unknown): value is ObjectiveId {
  return (
    value === "hidrogenio-verde" ||
    value === "saf" ||
    value === "biometano" ||
    value === "industria-baixo-carbono" ||
    value === "politica-publica"
  );
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isMapLevel(value: unknown): value is MapLevel {
  return value === "national" || value === "state" || value === "municipal";
}

function isLayerGroupKey(value: unknown): value is LayerGroupKey {
  return value === "energia" || value === "infraestrutura" || value === "industria" || value === "logistica" || value === "indicadores";
}

function sanitizeWeights(value: unknown, fallback: Weights): Weights {
  if (!value || typeof value !== "object") {
    return fallback;
  }

  const candidate = value as Partial<Weights>;
  const dimensions = Object.keys(fallback) as Array<keyof Weights>;
  const valid = dimensions.every((key) => isFiniteNumber(candidate[key]));

  if (!valid) {
    return fallback;
  }

  return candidate as Weights;
}

function sanitizeCompareUfs(value: unknown, fallback: string[]): string[] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const next = value.filter((item): item is string => typeof item === "string").slice(0, 3);
  return next.length > 0 ? next : fallback;
}

function sanitizeEnabledLayers(value: unknown): LayerVisibilityState {
  if (!value || typeof value !== "object") {
    return { ...defaultEnabledLayers };
  }

  const candidate = value as Partial<Record<LayerKey, unknown>>;
  const next = { ...defaultEnabledLayers };
  for (const key of Object.keys(defaultEnabledLayers) as LayerKey[]) {
    if (candidate[key] !== undefined) {
      next[key] = Boolean(candidate[key]);
    }
  }
  return next;
}

export function sanitizeDemoState(value: unknown): DemoState {
  const fallback = createDefaultDemoState();
  if (!value || typeof value !== "object") {
    return fallback;
  }

  const candidate = value as Partial<DemoState>;
  const profile = isProfileId(candidate.profile) ? candidate.profile : fallback.profile;
  const objective = isObjectiveId(candidate.objective) ? candidate.objective : fallback.objective;
  const weightFallback = resolveWeights(objective, profile);

  return {
    profile,
    objective,
    weights: sanitizeWeights(candidate.weights, weightFallback),
    selectedUf: typeof candidate.selectedUf === "string" ? candidate.selectedUf : fallback.selectedUf,
    mapLevel: isMapLevel(candidate.mapLevel) ? candidate.mapLevel : fallback.mapLevel,
    selectedMunicipalityId:
      typeof candidate.selectedMunicipalityId === "string" ? candidate.selectedMunicipalityId : fallback.selectedMunicipalityId,
    compareUfs: sanitizeCompareUfs(candidate.compareUfs, fallback.compareUfs),
    enabledLayers: sanitizeEnabledLayers(candidate.enabledLayers),
    activeTheme: isLayerGroupKey(candidate.activeTheme) ? candidate.activeTheme : fallback.activeTheme,
    layerOpacity: isFiniteNumber(candidate.layerOpacity) ? Math.max(0.2, Math.min(1, candidate.layerOpacity)) : fallback.layerOpacity,
    useBasemap: typeof candidate.useBasemap === "boolean" ? candidate.useBasemap : fallback.useBasemap,
    chatOpen: typeof candidate.chatOpen === "boolean" ? candidate.chatOpen : fallback.chatOpen,
    chatQuestion: typeof candidate.chatQuestion === "string" && candidate.chatQuestion.length > 0 ? candidate.chatQuestion : fallback.chatQuestion
  };
}

export function loadDemoState(storage: Pick<Storage, "getItem"> | undefined): DemoState {
  if (!storage) {
    return createDefaultDemoState();
  }

  try {
    const raw = storage.getItem(DEMO_STATE_STORAGE_KEY);
    if (!raw) {
      return createDefaultDemoState();
    }

    return sanitizeDemoState(JSON.parse(raw));
  } catch {
    return createDefaultDemoState();
  }
}

export function saveDemoState(storage: Pick<Storage, "setItem"> | undefined, state: DemoState) {
  if (!storage) {
    return;
  }

  storage.setItem(DEMO_STATE_STORAGE_KEY, JSON.stringify(state));
}

export function nextWeightsForSlider(weights: Weights, key: keyof Weights, value: number): Weights {
  const next = {
    ...weights,
    [key]: value / 100
  };
  const total = Object.values(next).reduce((sum, item) => sum + item, 0);
  if (total <= 0) {
    return weights;
  }

  return Object.fromEntries(
    Object.entries(next).map(([dimension, amount]) => [dimension, Number((amount / total).toFixed(4))])
  ) as Weights;
}

export function toggleCompareUfs(current: string[], uf: string): string[] {
  if (current.includes(uf)) {
    return current.filter((item) => item !== uf);
  }
  if (current.length >= 3) {
    return [...current.slice(1), uf];
  }
  return [...current, uf];
}
