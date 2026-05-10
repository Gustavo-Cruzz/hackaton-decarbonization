export type DimensionKey =
  | "energiaLimpa"
  | "infraestrutura"
  | "industria"
  | "logistica"
  | "socioambiental";

export type LayerKey =
  | "energia-score"
  | "infraestrutura-score"
  | "industria-score"
  | "logistica-score"
  | "socioambiental-score"
  | "solar"
  | "eolica"
  | "biomassa"
  | "portos"
  | "industrias"
  | "hubs"
  | "imte";

export type LayerGroupKey = "energia" | "infraestrutura" | "industria" | "logistica" | "indicadores";
export type MapLevel = "national" | "state" | "municipal";
export type LegendType = "range" | "symbols";
export type DataStatus = "official" | "hybrid" | "curated" | "demonstrative" | "partial" | "unavailable";

export type ProfileId = "gestor-publico" | "investidor" | "engenheiro" | "pesquisador";

export type ObjectiveId =
  | "hidrogenio-verde"
  | "saf"
  | "biometano"
  | "industria-baixo-carbono"
  | "politica-publica";

export type Scores = Record<DimensionKey, number>;
export type Weights = Record<DimensionKey, number>;
export type DataSourceKind = "official" | "derived" | "curated" | "hybrid";
export type LayerVisibilityState = Record<LayerKey, boolean>;

export interface TerritoryAssets {
  solar: number;
  eolica: number;
  biomassa: number;
  portos: number;
  industrias: number;
  hubs: number;
}

export interface TerritoryRecord {
  uf: string;
  state: string;
  region: string;
  scores: Scores;
  scoreSources?: Record<DimensionKey, DimensionScoreSource>;
  assets: TerritoryAssets;
  strengths: string[];
  bottlenecks: string[];
  recommendations: string[];
  promisingSectors: string[];
  coords?: Array<[number, number]>;
  geometry?: TerritoryGeometry;
  sourceMeta?: TerritorySourceMeta;
  metrics?: TerritoryMetrics;
}

export interface ObjectivePreset {
  id: ObjectiveId;
  label: string;
  weights: Weights;
  criteriaSummary: string;
}

export interface ProfileConfig {
  id: ProfileId;
  label: string;
  tone: string;
  suggestedObjective: ObjectiveId;
  defaultWeights?: Partial<Weights>;
  suggestedQuestions: string[];
  insightCards: string[];
}

export interface RankedTerritory extends TerritoryRecord {
  imte: number;
  classification: string;
  rank: number;
  explanation: string;
}

export interface ComparisonEntry {
  uf: string;
  state: string;
  imte: number;
  scores: Scores;
  strengths: string[];
  bottlenecks: string[];
}

export interface RankingRequest {
  objective: ObjectiveId;
  profile: ProfileId;
  weights?: Weights;
}

export interface ChatRequest {
  message: string;
  selectedUf?: string;
  objective: ObjectiveId;
  profile: ProfileId;
  weights?: Weights;
  mapLevel?: MapLevel;
  selectedMunicipalityId?: string;
  selectedMunicipalityName?: string;
  activeLayers?: LayerKey[];
  activeTheme?: LayerGroupKey;
  drillDownEnabled?: boolean;
}

export interface ChatResponse {
  answer: string;
  criteriaUsed: string;
  recommendation: string;
  mvpDisclaimer: string;
  referencedTerritories: string[];
  territorialContext?: string;
}

export type ChatUiState = "idle" | "loading" | "success" | "error";

export interface DemoState {
  profile: ProfileId;
  objective: ObjectiveId;
  weights: Weights;
  selectedUf: string;
  mapLevel: MapLevel;
  selectedMunicipalityId?: string;
  compareUfs: string[];
  enabledLayers: LayerVisibilityState;
  activeTheme?: LayerGroupKey;
  layerOpacity: number;
  useBasemap: boolean;
  chatOpen: boolean;
  chatQuestion: string;
}

export interface LayerDefinition {
  key: LayerKey;
  group: LayerGroupKey;
  label: string;
  description: string;
  source: string;
  referenceDate: string;
  legendType: LegendType;
  opacityCapable?: boolean;
  defaultEnabled?: boolean;
}

export interface LegendItem {
  label: string;
  color: string;
  symbol?: "fill" | "circle" | "square";
}

export interface LegendDefinition {
  title: string;
  type: LegendType;
  description: string;
  source: string;
  referenceDate: string;
  items: LegendItem[];
}

export interface TerritoryGeometryPolygon {
  points: Array<[number, number]>;
}

export interface TerritoryGeometry {
  bbox: [number, number, number, number];
  polygons: TerritoryGeometryPolygon[];
  centroid: [number, number];
}

export interface GeoJsonGeometry {
  type: "Polygon" | "MultiPolygon";
  coordinates: number[][][] | number[][][][];
}

export interface TerritorySourceMeta {
  aneelSnapshotDate: string;
  ibgePopulationYear: string;
  ibgeGdpYear: string;
  ibgeGeometrySource: string;
  curatedSignalsSnapshotDate?: string;
  curatedSignalsSource?: string;
  methodVersion: string;
}

export interface DimensionScoreSource {
  mode: DataSourceKind;
  summary: string;
  inputs: string[];
}

export interface TerritoryMetrics {
  renewablePlants: number;
  solarPlants: number;
  windPlants: number;
  biomassPlants: number;
  hydroPlants: number;
  thermalPlants: number;
  renewableCapacityMw: number;
  solarCapacityMw: number;
  windCapacityMw: number;
  biomassCapacityMw: number;
  hydroCapacityMw: number;
  thermalCapacityMw: number;
  totalCapacityMw: number;
  population: number;
  gdpCurrentMillionBRL: number;
  industrialValueAddedMillionBRL: number;
  industrialParticipationPct: number;
  areaKm2: number;
  populationDensity: number;
  renewableSharePct: number;
}

export interface MunicipalitySourceMeta {
  sourceType: "demonstrative";
  ibgeMunicipalityYear: string;
  ibgeGeometrySource: string;
  proxyMethod: string;
  notes: string[];
  referenceDate: string;
}

export interface MunicipalityMetricsProxy {
  population: number;
  areaKm2: number;
  populationDensity: number;
  economicScale: number;
}

export interface MunicipalityRecord {
  id: string;
  name: string;
  uf: string;
  state: string;
  region: string;
  geometry: GeoJsonGeometry;
  bbox: [number, number, number, number];
  centroid: [number, number];
  dataStatus: DataStatus;
  imteProxy: number;
  classification: string;
  scoresProxy: Scores;
  assetsProxy: TerritoryAssets;
  sourceMeta: MunicipalitySourceMeta;
  metricsProxy: MunicipalityMetricsProxy;
  strengths: string[];
  bottlenecks: string[];
  recommendations: string[];
  explanation: string;
  rankInState: number;
}
