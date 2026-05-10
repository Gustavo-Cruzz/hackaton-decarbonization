import fs from "node:fs/promises";
import path from "node:path";
import { territories } from "@/data/territories";
import { normalizeUfParam } from "@/lib/request-validation";
import { NextResponse } from "next/server";

function normalizeMunicipalityChunk(value: unknown) {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as { municipalities?: unknown; meta?: unknown };
  if (!Array.isArray(candidate.municipalities)) {
    return null;
  }

  return {
    municipalities: candidate.municipalities.filter((item) => Boolean(item && typeof item === "object")),
    meta: candidate.meta ?? null
  };
}

async function loadMunicipalityChunk(uf: string) {
  const filePath = path.join(process.cwd(), "data", "processed", "municipalities", `${uf}.json`);
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return normalizeMunicipalityChunk(JSON.parse(raw));
  } catch (error) {
    console.error("Municipality chunk load failure", uf, error);
    return null;
  }
}

export async function GET(request: Request, context: { params: Promise<{ uf: string }> }) {
  try {
    const { uf } = await context.params;
    const normalizedUf = normalizeUfParam(uf);
    const level = new URL(request.url).searchParams.get("level");
    if (!normalizedUf) {
      return NextResponse.json({ error: "Invalid UF parameter" }, { status: 400 });
    }
    const territory = territories.find((item) => item.uf === normalizedUf);
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
  } catch (error) {
    console.error("Territory route failure", error);
    return NextResponse.json({ error: "Territory service failure" }, { status: 500 });
  }
}
