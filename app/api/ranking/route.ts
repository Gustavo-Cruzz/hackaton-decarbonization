import { territories } from "@/data/territories";
import { rankTerritories } from "@/lib/ranking";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const ranking = rankTerritories(territories, body.objective, body.profile, body.weights);
  return NextResponse.json({ ranking });
}
