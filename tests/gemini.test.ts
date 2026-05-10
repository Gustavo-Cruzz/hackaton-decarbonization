import { territories } from "@/data/territories";
import { geminiInternal } from "@/lib/gemini";
import { describe, expect, it } from "vitest";

describe("Gemini integration helpers", () => {
  it("builds grounded chat context", () => {
    const context = geminiInternal.buildChatContext(
      {
        message: "Qual estado e melhor para hidrogenio verde?",
        selectedUf: "BA",
        objective: "hidrogenio-verde",
        profile: "investidor"
      },
      territories
    );

    expect(context.selected?.uf).toBe("BA");
    expect(context.objective?.label).toBe("Hidrogenio verde");
    expect(context.profile?.label).toBe("Investidor");
    expect(context.topThree).toHaveLength(3);
  });

  it("parses structured JSON returned by Gemini", () => {
    const parsed = geminiInternal.normalizeGeminiJson(`{
      "answer": "Bahia lidera.",
      "criteriaUsed": "Energia limpa e logistica.",
      "recommendation": "Comece por Bahia.",
      "mvpDisclaimer": "Base hibrida do MVP."
    }`);

    expect(parsed?.answer).toContain("Bahia");
    expect(parsed?.criteriaUsed).toContain("Energia limpa");
  });

  it("normalizes a valid Gemini draft into ChatResponse", () => {
    const response = geminiInternal.toChatResponse(
      {
        answer: "Bahia lidera.",
        criteriaUsed: "Energia limpa e logistica.",
        recommendation: "Comece por Bahia.",
        mvpDisclaimer: "Base hibrida do MVP."
      },
      ["BA", "CE"]
    );

    expect(response?.answer).toContain("Bahia");
    expect(response?.referencedTerritories).toEqual(["BA", "CE"]);
  });
});
