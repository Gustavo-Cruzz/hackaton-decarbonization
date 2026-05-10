import { ProfileConfig } from "@/lib/types";

export const profiles: ProfileConfig[] = [
  {
    id: "gestor-publico",
    label: "Gestor publico",
    tone: "foco em desenvolvimento regional, infraestrutura critica, empregos e politicas habilitadoras",
    suggestedObjective: "politica-publica",
    suggestedQuestions: [
      "Quais gargalos publicos mais afetam a competitividade do territorio?",
      "Onde uma politica de infraestrutura traria maior impacto regional?",
      "Qual estado combina maturidade e oportunidade de emprego verde?"
    ],
    insightCards: [
      "Desenvolvimento regional",
      "Infraestrutura habilitadora",
      "Empregos verdes"
    ]
  },
  {
    id: "investidor",
    label: "Investidor",
    tone: "foco em atratividade, risco, logistica, maturidade energetica e velocidade de entrada",
    suggestedObjective: "hidrogenio-verde",
    suggestedQuestions: [
      "Quais estados lideram para hidrogenio verde?",
      "Onde o risco logistico e menor para exportacao?",
      "Qual territorio combina IMTE alto e base industrial utilizavel?"
    ],
    insightCards: ["Atratividade", "Risco", "Setores promissores"]
  },
  {
    id: "engenheiro",
    label: "Engenheiro",
    tone: "foco em viabilidade tecnica, energia, transmissao, infraestrutura e restricoes operacionais",
    suggestedObjective: "industria-baixo-carbono",
    suggestedQuestions: [
      "Quais estados tem melhor combinacao tecnica para eletrolise?",
      "Onde transmissao e infraestrutura ja suportam expansao?",
      "Quais gargalos operacionais exigem mitigacao antes da escala?"
    ],
    insightCards: ["Viabilidade tecnica", "Transmissao", "Restricoes operacionais"]
  },
  {
    id: "pesquisador",
    label: "Pesquisador",
    tone: "foco em metodologia, incerteza, comparabilidade, dados e rastreabilidade dos criterios",
    suggestedObjective: "biometano",
    suggestedQuestions: [
      "Quais dimensoes puxam o ranking deste objetivo?",
      "Onde a base hibrida mostra maior incerteza metodologica?",
      "Como o IMTE muda quando alteramos os pesos?"
    ],
    insightCards: ["Metodologia", "Dados", "Incertezas"]
  }
];
