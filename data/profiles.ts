import { ProfileConfig } from "@/lib/types";

export const profiles: ProfileConfig[] = [
  {
    id: "gestor-publico",
    label: "Gestor publico",
    tone: "foco em desenvolvimento regional, infraestrutura critica, empregos e politicas habilitadoras",
    suggestedObjective: "politica-publica",
    summary: "Ideal para quem quer ler o territorio como politica industrial e infraestrutura publica, com foco em impacto regional e empregos.",
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
    summary: "Ideal para teses de entrada, velocidade e risco, priorizando atratividade economica, logistica e maturidade do territorio.",
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
    summary: "Ideal para analisar viabilidade tecnica, energia disponivel, transmissao e restricoes operacionais antes da escala.",
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
    summary: "Ideal para leituras metodologicas, comparabilidade de dados e rastreabilidade dos sinais que compoem o ranking.",
    suggestedQuestions: [
      "Quais dimensoes puxam o ranking deste objetivo?",
      "Onde a base hibrida mostra maior incerteza metodologica?",
      "Como o IMTE muda quando alteramos os pesos?"
    ],
    insightCards: ["Metodologia", "Dados", "Incertezas"]
  }
];
