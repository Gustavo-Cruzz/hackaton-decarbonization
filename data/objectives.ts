import { ObjectivePreset } from "@/lib/types";

export const objectivePresets: ObjectivePreset[] = [
  {
    id: "hidrogenio-verde",
    label: "Hidrogenio verde",
    weights: {
      energiaLimpa: 0.35,
      infraestrutura: 0.25,
      logistica: 0.2,
      industria: 0.15,
      socioambiental: 0.05
    },
    criteriaSummary: "Renovaveis, infraestrutura, logistica portuaria e base industrial."
  },
  {
    id: "saf",
    label: "SAF",
    weights: {
      energiaLimpa: 0.2,
      infraestrutura: 0.2,
      logistica: 0.15,
      industria: 0.2,
      socioambiental: 0.25
    },
    criteriaSummary: "Biomassa, integracao industrial, logistica e requisitos socioambientais."
  },
  {
    id: "biometano",
    label: "Biometano",
    weights: {
      energiaLimpa: 0.15,
      infraestrutura: 0.2,
      logistica: 0.1,
      industria: 0.25,
      socioambiental: 0.3
    },
    criteriaSummary: "Oferta de residuos, infraestrutura local, industria e ambiente regulatorio."
  },
  {
    id: "industria-baixo-carbono",
    label: "Industria de baixo carbono",
    weights: {
      energiaLimpa: 0.2,
      infraestrutura: 0.25,
      logistica: 0.15,
      industria: 0.3,
      socioambiental: 0.1
    },
    criteriaSummary: "Base industrial, energia limpa firme, infraestrutura e acesso logistico."
  },
  {
    id: "politica-publica",
    label: "Politica publica",
    weights: {
      energiaLimpa: 0.2,
      infraestrutura: 0.25,
      logistica: 0.1,
      industria: 0.2,
      socioambiental: 0.25
    },
    criteriaSummary: "Impacto regional, infraestrutura, equidade socioambiental e articulacao produtiva."
  }
];

export const defaultWeights = {
  energiaLimpa: 0.3,
  infraestrutura: 0.25,
  industria: 0.2,
  logistica: 0.15,
  socioambiental: 0.1
} as const;
