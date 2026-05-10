import { calculateImte, classifyImte } from "@/lib/imte";
import {
  MunicipalityMetricsProxy,
  MunicipalityRecord,
  Scores,
  TerritoryAssets,
  TerritoryRecord,
  TerritorySourceMeta,
  Weights
} from "@/lib/types";

function clampScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function scaleTo100(value: number, max: number) {
  if (max <= 0) {
    return 0;
  }
  return Math.max(0, Math.min(100, Math.round((value / max) * 100)));
}

export function deriveMunicipalityScoresProxy(
  stateTerritory: TerritoryRecord,
  metrics: MunicipalityMetricsProxy
): Scores {
  const densityScore = clampScore(100 - scaleTo100(metrics.populationDensity, 350));
  const economicScore = scaleTo100(metrics.economicScale, 100);
  const populationScore = scaleTo100(metrics.population, 3000000);

  return {
    energiaLimpa: clampScore(stateTerritory.scores.energiaLimpa - 6 + densityScore * 0.12 + populationScore * 0.08),
    infraestrutura: clampScore(stateTerritory.scores.infraestrutura - 8 + economicScore * 0.22 + populationScore * 0.1),
    industria: clampScore(stateTerritory.scores.industria - 10 + economicScore * 0.28 + populationScore * 0.1),
    logistica: clampScore(stateTerritory.scores.logistica - 7 + economicScore * 0.18 + populationScore * 0.12),
    socioambiental: clampScore(stateTerritory.scores.socioambiental - 4 + densityScore * 0.22)
  };
}

export function deriveMunicipalityAssetsProxy(
  stateTerritory: TerritoryRecord,
  metrics: MunicipalityMetricsProxy
): TerritoryAssets {
  const scale = Math.max(0.25, Math.min(1.4, metrics.economicScale / 45 + metrics.population / 1500000));
  return {
    solar: Math.max(1, Math.round(stateTerritory.assets.solar * scale * 0.08)),
    eolica: Math.max(0, Math.round(stateTerritory.assets.eolica * scale * 0.05)),
    biomassa: Math.max(0, Math.round(stateTerritory.assets.biomassa * scale * 0.06)),
    portos: stateTerritory.assets.portos > 0 && metrics.population > 150000 ? 1 : 0,
    industrias: Math.max(1, Math.round(stateTerritory.assets.industrias * scale * 0.1)),
    hubs: stateTerritory.assets.hubs > 0 && metrics.economicScale > 25 ? 1 : 0
  };
}

export function buildMunicipalityExplanation(name: string, stateTerritory: TerritoryRecord, imteProxy: number) {
  return `${name} herda a base estrutural de ${stateTerritory.state} e recebe ajuste demonstrativo por escala economica, densidade e populacao. IMTE proxy ${imteProxy}.`;
}

export function createMunicipalitySourceMeta(stateSourceMeta: TerritorySourceMeta) {
  return {
    sourceType: "demonstrative" as const,
    ibgeMunicipalityYear: stateSourceMeta.ibgePopulationYear,
    ibgeGeometrySource: "IBGE malhas municipios v3",
    proxyMethod:
      "Proxy demonstrativo derivado do score estadual com ajustes locais simples de populacao, densidade e escala economica.",
    notes: [
      "Nao representa metodologia oficial de IMTE municipal.",
      "Serve apenas para navegacao geoespacial e narrativa de pitch."
    ],
    referenceDate: stateSourceMeta.curatedSignalsSnapshotDate ?? stateSourceMeta.aneelSnapshotDate
  };
}

export function finalizeMunicipalityRanking(records: MunicipalityRecord[]) {
  return [...records]
    .sort((left, right) => right.imteProxy - left.imteProxy || left.name.localeCompare(right.name))
    .map((record, index) => ({
      ...record,
      rankInState: index + 1
    }));
}

export function createMunicipalityProxyRecord(input: {
  id: string;
  name: string;
  geometry: MunicipalityRecord["geometry"];
  bbox: MunicipalityRecord["bbox"];
  centroid: MunicipalityRecord["centroid"];
  metrics: MunicipalityMetricsProxy;
  stateTerritory: TerritoryRecord;
  weights: Weights;
}): MunicipalityRecord {
  const scoresProxy = deriveMunicipalityScoresProxy(input.stateTerritory, input.metrics);
  const imteProxy = calculateImte(scoresProxy, input.weights);

  return {
    id: input.id,
    name: input.name,
    uf: input.stateTerritory.uf,
    state: input.stateTerritory.state,
    region: input.stateTerritory.region,
    geometry: input.geometry,
    bbox: input.bbox,
    centroid: input.centroid,
    dataStatus: "demonstrative",
    imteProxy,
    classification: classifyImte(imteProxy),
    scoresProxy,
    assetsProxy: deriveMunicipalityAssetsProxy(input.stateTerritory, input.metrics),
    sourceMeta: createMunicipalitySourceMeta(input.stateTerritory.sourceMeta!),
    metricsProxy: input.metrics,
    strengths: [
      `Leitura demonstrativa ancorada no contexto estadual de ${input.stateTerritory.state}.`,
      input.metrics.economicScale > 40 ? "Escala economica local acima da media demonstrativa." : "Escala economica local intermediaria para o recorte."
    ],
    bottlenecks: [
      "Proxy municipal simplificado sem validacao setorial fina.",
      input.metrics.populationDensity > 120 ? "Densidade territorial elevada para expansao acelerada." : "Dependencia do contexto logistico estadual."
    ],
    recommendations: [
      "Usar este recorte para explorar onde aprofundar diligencia territorial.",
      `Cruzar ${input.name} com estudos locais antes de qualquer decisao real.`
    ],
    explanation: buildMunicipalityExplanation(input.name, input.stateTerritory, imteProxy),
    rankInState: 0
  };
}
