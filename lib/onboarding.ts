import {
  BusinessAnalysis,
  BusinessInterest,
  BusinessSector,
  DecarbonizationGoalStatus,
  GovernmentIndicator,
  GovernmentObjective,
  GovernmentSphere,
  GovernmentTracking,
  KnowledgeLevel,
  ObjectiveId,
  OnboardingAnswers,
  PreferredFormat,
  PrimaryUserProfile,
  ProfileId,
  ResearchArea,
  ResearchNeed,
  TechnicalLevel,
  TrackingTheme,
  UserClassification
} from "@/lib/types";

export const brazilStates = [
  "Acre",
  "Alagoas",
  "Amapa",
  "Amazonas",
  "Bahia",
  "Ceara",
  "Distrito Federal",
  "Espirito Santo",
  "Goias",
  "Maranhao",
  "Mato Grosso",
  "Mato Grosso do Sul",
  "Minas Gerais",
  "Para",
  "Paraiba",
  "Parana",
  "Pernambuco",
  "Piaui",
  "Rio de Janeiro",
  "Rio Grande do Norte",
  "Rio Grande do Sul",
  "Rondonia",
  "Roraima",
  "Santa Catarina",
  "Sao Paulo",
  "Sergipe",
  "Tocantins"
] as const;

export interface LabeledOption<T extends string> {
  value: T;
  label: string;
}

export const userTypeOptions: LabeledOption<UserClassification>[] = [
  { value: "individual", label: "Pessoa Fisica" },
  { value: "company", label: "Pessoa Juridica" }
];

export const primaryProfileOptions: Array<{ value: PrimaryUserProfile; label: string; icon: string; description: string }> = [
  {
    value: "business",
    label: "Empresarial",
    icon: "🏢",
    description: "Para empresas e times focados em investimento, ESG, energia e viabilidade de projetos."
  },
  {
    value: "government",
    label: "Governamental",
    icon: "🏛️",
    description: "Para agentes publicos que precisam planejar territorio, politicas climaticas e desenvolvimento regional."
  },
  {
    value: "research",
    label: "Pesquisador / Academico",
    icon: "🔬",
    description: "Para pesquisa, comparabilidade de dados, visualizacao analitica e exploracao metodologica."
  }
];

export const governmentSphereOptions: LabeledOption<GovernmentSphere>[] = [
  { value: "municipal", label: "Municipal" },
  { value: "state", label: "Estadual" },
  { value: "federal", label: "Federal" },
  { value: "regional-agency", label: "Agencia regional / Consorcio" }
];

export const governmentObjectiveOptions: LabeledOption<GovernmentObjective>[] = [
  { value: "territorial-planning", label: "Planejamento territorial" },
  { value: "public-policy", label: "Criacao de politicas publicas" },
  { value: "climate-monitoring", label: "Monitoramento climatico" },
  { value: "regional-development", label: "Desenvolvimento regional" },
  { value: "green-investment", label: "Captacao de investimento verde" },
  { value: "energy-management", label: "Gestao energetica" }
];

export const governmentIndicatorOptions: LabeledOption<GovernmentIndicator>[] = [
  { value: "carbon-emissions", label: "Emissoes de carbono" },
  { value: "land-use", label: "Uso do solo" },
  { value: "renewable-energy", label: "Energia renovavel" },
  { value: "urban-mobility", label: "Mobilidade urbana" },
  { value: "climate-vulnerability", label: "Vulnerabilidade climatica" },
  { value: "green-jobs", label: "Empregos verdes" },
  { value: "air-quality", label: "Qualidade do ar" },
  { value: "energy-security", label: "Seguranca energetica" }
];

export const governmentTrackingOptions: LabeledOption<GovernmentTracking>[] = [
  { value: "climate-goals", label: "Metas climaticas" },
  { value: "territorial-esg", label: "Indicadores ESG territoriais" },
  { value: "decarbonization-scenarios", label: "Cenarios de descarbonizacao" },
  { value: "public-policies", label: "Politicas publicas" },
  { value: "climate-alerts", label: "Alertas climaticos" },
  { value: "public-financing", label: "Financiamentos publicos" }
];

export const businessSectorOptions: LabeledOption<BusinessSector>[] = [
  { value: "energy", label: "Energia" },
  { value: "agro", label: "Agro" },
  { value: "logistics", label: "Logistica" },
  { value: "industry", label: "Industria" },
  { value: "financial", label: "Financeiro" },
  { value: "technology", label: "Tecnologia" },
  { value: "construction", label: "Construcao" },
  { value: "other", label: "Outro" }
];

export const businessInterestOptions: LabeledOption<BusinessInterest>[] = [
  { value: "investment-viability", label: "Viabilidade de investimento" },
  { value: "emissions-reduction", label: "Reducao de emissoes" },
  { value: "carbon-market", label: "Mercado de carbono" },
  { value: "esg-compliance", label: "ESG e compliance" },
  { value: "renewable-energy", label: "Energia renovavel" },
  { value: "energy-efficiency", label: "Eficiencia energetica" },
  { value: "sustainable-supply-chain", label: "Cadeia sustentavel" }
];

export const businessAnalysisOptions: LabeledOption<BusinessAnalysis>[] = [
  { value: "green-roi", label: "ROI de projetos verdes" },
  { value: "esg-benchmark", label: "Benchmark ESG" },
  { value: "tax-incentives", label: "Incentivos fiscais" },
  { value: "climate-risk", label: "Risco climatico" },
  { value: "energy-scenarios", label: "Cenarios energeticos" },
  { value: "regional-opportunities", label: "Oportunidades regionais" },
  { value: "energy-costs", label: "Custos energeticos" }
];

export const decarbonizationGoalOptions: LabeledOption<DecarbonizationGoalStatus>[] = [
  { value: "yes", label: "Sim" },
  { value: "in-progress", label: "Em desenvolvimento" },
  { value: "no", label: "Nao" },
  { value: "unknown", label: "Nao sei informar" }
];

export const researchAreaOptions: LabeledOption<ResearchArea>[] = [
  { value: "climate", label: "Clima" },
  { value: "energy", label: "Energia" },
  { value: "mobility", label: "Mobilidade" },
  { value: "land-use", label: "Uso do solo" },
  { value: "green-economy", label: "Economia verde" },
  { value: "public-policy", label: "Politicas publicas" },
  { value: "sustainability-ai", label: "IA aplicada a sustentabilidade" }
];

export const researchNeedOptions: LabeledOption<ResearchNeed>[] = [
  { value: "datasets", label: "Bases de dados" },
  { value: "apis", label: "APIs" },
  { value: "historical-series", label: "Series historicas" },
  { value: "visualizations", label: "Visualizacoes" },
  { value: "predictive-models", label: "Modelos preditivos" },
  { value: "comparative-studies", label: "Estudos comparativos" },
  { value: "data-export", label: "Exportacao de dados" }
];

export const technicalLevelOptions: LabeledOption<TechnicalLevel>[] = [
  { value: "simplified", label: "Simplificado" },
  { value: "technical", label: "Tecnico" },
  { value: "scientific", label: "Cientifico / avancado" }
];

export const preferredFormatOptions: LabeledOption<PreferredFormat>[] = [
  { value: "dashboards", label: "Dashboards" },
  { value: "interactive-maps", label: "Mapas interativos" },
  { value: "analytic-charts", label: "Graficos analiticos" },
  { value: "automated-reports", label: "Relatorios automaticos" },
  { value: "raw-data", label: "Dados brutos" },
  { value: "simulations", label: "Simulacoes" }
];

export const trackingThemeOptions: LabeledOption<TrackingTheme>[] = [
  { value: "solar-energy", label: "Energia solar" },
  { value: "wind-energy", label: "Energia eolica" },
  { value: "green-hydrogen", label: "Hidrogenio verde" },
  { value: "carbon-market", label: "Mercado de carbono" },
  { value: "electric-mobility", label: "Mobilidade eletrica" },
  { value: "esg", label: "ESG" },
  { value: "energy-efficiency", label: "Eficiencia energetica" },
  { value: "climate-change", label: "Mudancas climaticas" },
  { value: "biofuels", label: "Biocombustiveis" },
  { value: "other", label: "Outro" }
];

export const knowledgeLevelOptions: LabeledOption<KnowledgeLevel>[] = [
  { value: "beginner", label: "Iniciante" },
  { value: "intermediate", label: "Intermediario" },
  { value: "advanced", label: "Avancado" },
  { value: "expert", label: "Especialista" }
];

export const personalizedInsightOptions = [
  { value: "yes", label: "Sim" },
  { value: "no", label: "Nao" }
] as const;

export function mapPrimaryProfileToEngineProfile(profile: PrimaryUserProfile): ProfileId {
  if (profile === "business") return "investidor";
  if (profile === "government") return "gestor-publico";
  return "pesquisador";
}

export function defaultObjectiveForPrimaryProfile(profile: PrimaryUserProfile): ObjectiveId {
  if (profile === "business") return "hidrogenio-verde";
  if (profile === "government") return "politica-publica";
  return "biometano";
}

export function buildOnboardingProfileView(answers: OnboardingAnswers) {
  if (answers.primaryProfile === "business") {
    return {
      label: "Empresarial",
      tone: `Foco em ${labelForValue(businessInterestOptions, answers.business?.primaryInterest) ?? "prioridades de negocio"} e leitura orientada a ${labelForValue(businessSectorOptions, answers.business?.sector) ?? "setor produtivo"}.`,
      insightCards: [
        labelForValue(businessSectorOptions, answers.business?.sector) ?? "Setor",
        labelForValue(businessInterestOptions, answers.business?.primaryInterest) ?? "Interesse principal",
        answers.business?.desiredAnalyses[0] ? labelForValue(businessAnalysisOptions, answers.business.desiredAnalyses[0]) ?? "Analise" : "Descarbonizacao"
      ],
      suggestedQuestions: [
        "Quais territorios combinam velocidade de entrada e menor risco logistico?",
        "Onde a tese de descarbonizacao gera vantagem competitiva mais clara?",
        "Quais oportunidades regionais justificam aprofundar um business case verde?"
      ]
    };
  }

  if (answers.primaryProfile === "government") {
    return {
      label: "Governamental",
      tone: `Foco em ${labelForValue(governmentObjectiveOptions, answers.governmental?.mainObjective) ?? "politica territorial"} com leitura voltada a impacto publico e planejamento.`,
      insightCards: [
        labelForValue(governmentSphereOptions, answers.governmental?.sphere) ?? "Esfera",
        labelForValue(governmentObjectiveOptions, answers.governmental?.mainObjective) ?? "Objetivo principal",
        answers.governmental?.indicators[0] ? labelForValue(governmentIndicatorOptions, answers.governmental.indicators[0]) ?? "Indicador" : "Planejamento"
      ],
      suggestedQuestions: [
        "Quais gargalos territoriais mais afetam a competitividade regional?",
        "Onde uma politica publica verde traria maior impacto no estado de atuacao?",
        "Quais indicadores deveriam entrar primeiro no monitoramento territorial?"
      ]
    };
  }

  return {
    label: "Pesquisador / Academico",
    tone: `Foco em ${labelForValue(researchAreaOptions, answers.research?.area) ?? "pesquisa aplicada"} com leitura orientada a dados, comparabilidade e visualizacao analitica.`,
    insightCards: [
      labelForValue(researchAreaOptions, answers.research?.area) ?? "Area",
      labelForValue(technicalLevelOptions, answers.research?.technicalLevel) ?? "Nivel tecnico",
      answers.research?.preferredFormats[0] ? labelForValue(preferredFormatOptions, answers.research.preferredFormats[0]) ?? "Formato" : "Dados"
    ],
    suggestedQuestions: [
      "Quais dimensoes estao puxando o ranking neste recorte metodologico?",
      "Onde a comparabilidade entre territorios muda quando alteramos o objetivo?",
      "Quais bases ou formatos ajudam a aprofundar a analise tecnica?"
    ]
  };
}

export function buildOnboardingContextSummary(answers: OnboardingAnswers) {
  const base = `${answers.fullName} da organizacao ${answers.organization}, atuando em ${answers.stateOfOperation}, perfil ${buildOnboardingProfileView(answers).label}.`;
  const themes = answers.themes.map((item) => labelForValue(trackingThemeOptions, item) ?? item).join(", ");
  return `${base} Temas de interesse: ${themes}. Nivel: ${labelForValue(knowledgeLevelOptions, answers.knowledgeLevel) ?? answers.knowledgeLevel}.`;
}

export function labelForValue<T extends string>(options: ReadonlyArray<LabeledOption<T>>, value: T | undefined) {
  return options.find((item) => item.value === value)?.label;
}
