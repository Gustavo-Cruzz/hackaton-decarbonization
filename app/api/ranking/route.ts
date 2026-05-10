import { territories } from "@/data/territories";
import { isErrorPayload, readJsonBody, validateRankingPayload } from "@/lib/request-validation";
import { rankTerritories } from "@/lib/ranking";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const rawBody = await readJsonBody(request);
    if (isErrorPayload(rawBody)) {
      return NextResponse.json(rawBody, { status: 400 });
    }

    const body = validateRankingPayload(rawBody);
    if (!body) {
      return NextResponse.json({ error: "Invalid ranking payload" }, { status: 400 });
    }

    const ranking = rankTerritories(territories, body.objective, body.profile, body.weights);
    return NextResponse.json({ ranking });
  } catch (error) {
    console.error("Ranking route failure", error);
    return NextResponse.json({ error: "Ranking service failure" }, { status: 500 });
  }
}
