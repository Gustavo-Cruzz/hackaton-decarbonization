import officialTerritories from "@/data/processed/territories-official.json";
import { TerritoryRecord } from "@/lib/types";

export const territories: TerritoryRecord[] = officialTerritories as TerritoryRecord[];
