import { territories } from "@/data/territories";
import { compareTerritories, rankTerritories } from "@/lib/ranking";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const ranking = rankTerritories(territories, body.objective, body.profile, body.weights);
  const comparison = compareTerritories(ranking, body.ufs ?? []);
  return NextResponse.json({ comparison });
}
