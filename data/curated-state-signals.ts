import curatedSignals from "@/data/curated/state-signals.json";

export interface CuratedStateSignal {
  portos: number;
  industrias: number;
  hubs: number;
  infraestruturaBase: number;
  logisticaBase: number;
}

export const curatedStateSignals: Record<string, CuratedStateSignal> = curatedSignals.states;
