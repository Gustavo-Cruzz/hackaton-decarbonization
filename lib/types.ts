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
export type ExperienceMode = "map" | "powerbi";
export type LegendType = "range" | "symbols";
export type DataStatus = "official" | "hybrid" | "curated" | "demonstrative" | "partial" | "unavailable";
export type PrimaryUserProfile = "business" | "government" | "research";
export type UserClassification = "individual" | "company";
export type GovernmentSphere = "municipal" | "state" | "federal" | "regional-agency";
export type GovernmentObjective =
  | "territorial-planning"
  | "public-policy"
  | "climate-monitoring"
  | "regional-development"
  | "green-investment"
  | "energy-management";
export type GovernmentIndicator =
  | "carbon-emissions"
  | "land-use"
  | "renewable-energy"
  | "urban-mobility"
  | "climate-vulnerability"
  | "green-jobs"
  | "air-quality"
  | "energy-security";
export type GovernmentTracking =
  | "climate-goals"
  | "territorial-esg"
  | "decarbonization-scenarios"
  | "public-policies"
  | "climate-alerts"
  | "public-financing";
export type BusinessSector =
  | "energy"
  | "agro"
  | "logistics"
  | "industry"
  | "financial"
  | "technology"
  | "construction"
  | "other";
export type BusinessInterest =
  | "investment-viability"
  | "emissions-reduction"
  | "carbon-market"
  | "esg-compliance"
  | "renewable-energy"
  | "energy-efficiency"
  | "sustainable-supply-chain";
export type BusinessAnalysis =
  | "green-roi"
  | "esg-benchmark"
  | "tax-incentives"
  | "climate-risk"
  | "energy-scenarios"
  | "regional-opportunities"
  | "energy-costs";
export type DecarbonizationGoalStatus = "yes" | "in-progress" | "no" | "unknown";
export type ResearchArea =
  | "climate"
  | "energy"
  | "mobility"
  | "land-use"
  | "green-economy"
  | "public-policy"
  | "sustainability-ai";
export type ResearchNeed =
  | "datasets"
  | "apis"
  | "historical-series"
  | "visualizations"
  | "predictive-models"
  | "comparative-studies"
  | "data-export";
export type TechnicalLevel = "simplified" | "technical" | "scientific";
export type PreferredFormat =
  | "dashboards"
  | "interactive-maps"
  | "analytic-charts"
  | "automated-reports"
  | "raw-data"
  | "simulations";
export type TrackingTheme =
  | "solar-energy"
  | "wind-energy"
  | "green-hydrogen"
  | "carbon-market"
  | "electric-mobility"
  | "esg"
  | "energy-efficiency"
  | "climate-change"
  | "biofuels"
  | "other";
export type KnowledgeLevel = "beginner" | "intermediate" | "advanced" | "expert";

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
  summary?: string;
  defaultWeights?: Partial<Weights>;
  suggestedQuestions: string[];
  insightCards: string[];
}

export interface GovernmentOnboardingAnswers {
  sphere: GovernmentSphere;
  mainObjective: GovernmentObjective;
  indicators: GovernmentIndicator[];
  tracking: GovernmentTracking[];
}

export interface BusinessOnboardingAnswers {
  sector: BusinessSector;
  primaryInterest: BusinessInterest;
  desiredAnalyses: BusinessAnalysis[];
  hasDecarbonizationGoals: DecarbonizationGoalStatus;
}

export interface ResearchOnboardingAnswers {
  area: ResearchArea;
  needs: ResearchNeed[];
  technicalLevel: TechnicalLevel;
  preferredFormats: PreferredFormat[];
}

export interface OnboardingAnswers {
  fullName: string;
  email: string;
  organization: string;
  stateOfOperation: string;
  userType: UserClassification;
  primaryProfile: PrimaryUserProfile;
  governmental?: GovernmentOnboardingAnswers;
  business?: BusinessOnboardingAnswers;
  research?: ResearchOnboardingAnswers;
  themes: TrackingTheme[];
  knowledgeLevel: KnowledgeLevel;
  wantsPersonalizedInsights: boolean;
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
  onboardingContext?: string;
}

export interface ChatResponse {
  answer: string;
  criteriaUsed: string;
  recommendation: string;
  mvpDisclaimer?: string;
  referencedTerritories: string[];
  territorialContext?: string;
}

export type ChatUiState = "idle" | "loading" | "success" | "error";

export interface ChatHistoryEntry {
  id: string;
  question: string;
  status: "success" | "error";
  response?: ChatResponse;
  errorMessage?: string;
  territorialContextLabel?: string;
}

export interface DemoState {
  hasChosenProfile: boolean;
  profile: ProfileId;
  activeProfileLabel: string;
  objective: ObjectiveId;
  weights: Weights;
  selectedExperience: ExperienceMode;
  onboardingAnswers?: OnboardingAnswers;
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
