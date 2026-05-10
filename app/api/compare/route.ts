import { territories } from "@/data/territories";
import { isErrorPayload, readJsonBody, validateComparePayload } from "@/lib/request-validation";
import { compareTerritories, rankTerritories } from "@/lib/ranking";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const rawBody = await readJsonBody(request);
    if (isErrorPayload(rawBody)) {
      return NextResponse.json(rawBody, { status: 400 });
    }

    const body = validateComparePayload(rawBody);
    if (!body) {
      return NextResponse.json({ error: "Invalid comparison payload" }, { status: 400 });
    }

    const ranking = rankTerritories(territories, body.objective, body.profile, body.weights);
    const comparison = compareTerritories(ranking, body.ufs);
    return NextResponse.json({ comparison });
  } catch (error) {
    console.error("Compare route failure", error);
    return NextResponse.json({ error: "Comparison service failure" }, { status: 500 });
  }
}
