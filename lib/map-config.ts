import {
  LayerDefinition,
  LayerGroupKey,
  LayerKey,
  LayerVisibilityState,
  LegendDefinition,
  TerritorySourceMeta
} from "@/lib/types";

export const layerGroups: Array<{ key: LayerGroupKey; label: string; description: string }> = [
  {
    key: "energia",
    label: "Energia",
    description: "Ativos renovaveis e leitura de oferta limpa no territorio."
  },
  {
    key: "infraestrutura",
    label: "Infraestrutura",
    description: "Camadas de suporte territorial e conexoes habilitadoras."
  },
  {
    key: "industria",
    label: "Industria",
    description: "Presenca industrial e sinais de demanda ancora."
  },
  {
    key: "logistica",
    label: "Logistica",
    description: "Portos e corredores com impacto na escalabilidade."
  },
  {
    key: "indicadores",
    label: "Indicadores",
    description: "Leituras sinteticas por IMTE e dimensoes do indice."
  }
];

export const layerDefinitions: LayerDefinition[] = [
  {
    key: "solar",
    group: "energia",
    label: "Parques solares",
    description: "Marcadores proporcionais ao porte do ativo solar estadual ou proxy municipal.",
    source: "ANEEL SIGA + proxy local",
    referenceDate: "2026-05-01",
    legendType: "symbols",
    opacityCapable: true,
    defaultEnabled: true
  },
  {
    key: "eolica",
    group: "energia",
    label: "Parques eolicos",
    description: "Marcadores de base eolica para leitura de escala renovavel.",
    source: "ANEEL SIGA + proxy local",
    referenceDate: "2026-05-01",
    legendType: "symbols",
    opacityCapable: true,
    defaultEnabled: true
  },
  {
    key: "biomassa",
    group: "energia",
    label: "Biomassa e biogas",
    description: "Indica territorios com presenca de biomassa no recorte demonstrativo.",
    source: "ANEEL SIGA + proxy local",
    referenceDate: "2026-05-01",
    legendType: "symbols",
    opacityCapable: true
  },
  {
    key: "hubs",
    group: "infraestrutura",
    label: "Hubs estrategicos",
    description: "Pontos de articulacao de descarbonizacao e infraestrutura estruturante.",
    source: "Curadoria interna PID MVP",
    referenceDate: "2026-05-10",
    legendType: "symbols",
    opacityCapable: true,
    defaultEnabled: true
  },
  {
    key: "infraestrutura-score",
    group: "infraestrutura",
    label: "Score de infraestrutura",
    description: "Coroplata pela dimensao de infraestrutura do IMTE.",
    source: "IBGE + curadoria interna",
    referenceDate: "2026-05-10",
    legendType: "range",
    opacityCapable: true
  },
  {
    key: "industrias",
    group: "industria",
    label: "Ativos industriais",
    description: "Pontos de presenca industrial como ancora de demanda.",
    source: "IBGE PIB industrial + curadoria interna",
    referenceDate: "2026-05-10",
    legendType: "symbols",
    opacityCapable: true
  },
  {
    key: "industria-score",
    group: "industria",
    label: "Score industrial",
    description: "Coroplata pela dimensao de base industrial.",
    source: "IBGE PIB industrial",
    referenceDate: "2026-05-10",
    legendType: "range",
    opacityCapable: true
  },
  {
    key: "portos",
    group: "logistica",
    label: "Portos e escoamento",
    description: "Sinaliza acesso logistico relevante para cadeias exportadoras.",
    source: "Curadoria interna PID MVP",
    referenceDate: "2026-05-10",
    legendType: "symbols",
    opacityCapable: true,
    defaultEnabled: true
  },
  {
    key: "logistica-score",
    group: "logistica",
    label: "Score logistico",
    description: "Coroplata pela dimensao de logistica.",
    source: "Curadoria interna PID MVP",
    referenceDate: "2026-05-10",
    legendType: "range",
    opacityCapable: true
  },
  {
    key: "imte",
    group: "indicadores",
    label: "IMTE",
    description: "Leitura sintetica principal do indice territorial.",
    source: "Base hibrida do MVP",
    referenceDate: "2026-05-10",
    legendType: "range",
    opacityCapable: true,
    defaultEnabled: true
  },
  {
    key: "energia-score",
    group: "indicadores",
    label: "Dimensao energia limpa",
    description: "Coroplata pela dimensao de energia limpa.",
    source: "ANEEL SIGA + IBGE",
    referenceDate: "2026-05-10",
    legendType: "range",
    opacityCapable: true
  },
  {
    key: "socioambiental-score",
    group: "indicadores",
    label: "Dimensao socioambiental",
    description: "Coroplata pela dimensao socioambiental do recorte atual.",
    source: "IBGE + score derivado",
    referenceDate: "2026-05-10",
    legendType: "range",
    opacityCapable: true
  }
];

export function createDefaultLayerVisibility(): LayerVisibilityState {
  return layerDefinitions.reduce(
    (acc, layer) => {
      acc[layer.key] = Boolean(layer.defaultEnabled);
      return acc;
    },
    {} as LayerVisibilityState
  );
}

export function getLayerDefinition(layerKey: LayerKey) {
  return layerDefinitions.find((layer) => layer.key === layerKey);
}

export function getEnabledLayerKeys(enabledLayers: LayerVisibilityState): LayerKey[] {
  return layerDefinitions.filter((layer) => enabledLayers[layer.key]).map((layer) => layer.key);
}

export function getPrimaryActiveLayer(enabledLayers: LayerVisibilityState, activeTheme?: LayerGroupKey): LayerKey {
  const themed = activeTheme
    ? layerDefinitions.filter((layer) => layer.group === activeTheme && enabledLayers[layer.key])
    : [];
  if (themed.length > 0) {
    return themed[0].key;
  }

  return layerDefinitions.find((layer) => enabledLayers[layer.key])?.key ?? "imte";
}

function buildRangeLegend(title: string, description: string, source: string, referenceDate: string): LegendDefinition {
  return {
    title,
    type: "range",
    description,
    source,
    referenceDate,
    items: [
      { label: "0-39", color: "#c2410c" },
      { label: "40-59", color: "#f59e0b" },
      { label: "60-79", color: "#2fb38b" },
      { label: "80-100", color: "#0e9f6e" }
    ]
  };
}

export function buildLegendDefinition(
  layerKey: LayerKey,
  sourceMeta?: TerritorySourceMeta
): LegendDefinition {
  const layer = getLayerDefinition(layerKey);
  const referenceDate = sourceMeta?.curatedSignalsSnapshotDate ?? layer?.referenceDate ?? "2026-05-10";
  const source = layer?.source ?? "Base local do MVP";

  if (layerKey === "solar" || layerKey === "eolica" || layerKey === "biomassa" || layerKey === "portos" || layerKey === "industrias" || layerKey === "hubs") {
    return {
      title: layer?.label ?? "Ativos",
      type: "symbols",
      description: layer?.description ?? "Ativos pontuais.",
      source,
      referenceDate,
      items: [
        { label: "Presenca alta", color: layerKey === "portos" ? "#1d4ed8" : layerKey === "industrias" ? "#7c3aed" : "#0f766e", symbol: "circle" },
        { label: "Presenca media", color: layerKey === "portos" ? "#60a5fa" : layerKey === "industrias" ? "#a78bfa" : "#5eead4", symbol: "circle" },
        { label: "Presenca demonstrativa", color: "#94a3b8", symbol: "square" }
      ]
    };
  }

  if (layerKey === "imte") {
    return buildRangeLegend("Legenda IMTE", "Faixas fixas do indice sintetico principal.", source, referenceDate);
  }

  return buildRangeLegend(layer?.label ?? "Indicador", layer?.description ?? "Escala padronizada de 0 a 100.", source, referenceDate);
}
