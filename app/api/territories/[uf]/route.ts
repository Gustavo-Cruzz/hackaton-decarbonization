import fs from "node:fs/promises";
import path from "node:path";
import { territories } from "@/data/territories";
import { NextResponse } from "next/server";

async function loadMunicipalityChunk(uf: string) {
  const filePath = path.join(process.cwd(), "data", "processed", "municipalities", `${uf}.json`);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function GET(request: Request, context: { params: Promise<{ uf: string }> }) {
  const { uf } = await context.params;
  const level = new URL(request.url).searchParams.get("level");
  const territory = territories.find((item) => item.uf === uf.toUpperCase());
  if (!territory) {
    return NextResponse.json({ error: "Territory not found" }, { status: 404 });
  }

  if (level === "municipal") {
    const chunk = await loadMunicipalityChunk(territory.uf);
    return NextResponse.json({
      territory,
      municipalities: chunk?.municipalities ?? [],
      municipalityStatus: chunk ? "available" : "unavailable",
      chunkMeta: chunk?.meta ?? null
    });
  }

  return NextResponse.json({ territory, municipalityStatus: "unknown" });
}
