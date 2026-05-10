import { beforeEach, describe, expect, it, vi } from "vitest";

const geminiMock = vi.hoisted(() => ({
  generateChatWithGemini: vi.fn()
}));

vi.mock("@/lib/gemini", () => geminiMock);

import { POST as chatPost } from "@/app/api/chat/route";
import { POST as rankingPost } from "@/app/api/ranking/route";

describe("api contracts", () => {
  beforeEach(() => {
    geminiMock.generateChatWithGemini.mockReset();
  });

  it("returns ranking payload", async () => {
    const request = new Request("http://localhost/api/ranking", {
      method: "POST",
      body: JSON.stringify({
        objective: "hidrogenio-verde",
        profile: "investidor"
      })
    });

    const response = await rankingPost(request);
    const body = await response.json();

    expect(body.ranking[0].uf).toBe("BA");
    expect(body.ranking[0]).toHaveProperty("imte");
  });

  it("returns Gemini payload when available", async () => {
    geminiMock.generateChatWithGemini.mockResolvedValue({
      answer: "Bahia lidera para hidrogenio verde.",
      criteriaUsed: "Usei energia limpa e logistica.",
      recommendation: "Comece por Bahia.",
      referencedTerritories: ["BA", "CE"]
    });

    const request = new Request("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({
        message: "Qual estado e melhor para hidrogenio verde?",
        selectedUf: "BA",
        objective: "hidrogenio-verde",
        profile: "investidor"
      })
    });

    const response = await chatPost(request);
    const body = await response.json();

    expect(body.answer).toContain("Bahia");
    expect(body.criteriaUsed).toContain("energia limpa");
    expect(geminiMock.generateChatWithGemini).toHaveBeenCalledTimes(1);
  });

  it("falls back to local engine when Gemini is unavailable", async () => {
    geminiMock.generateChatWithGemini.mockResolvedValue(null);

    const request = new Request("http://localhost/api/chat", {
      method: "POST",
      body: JSON.stringify({
        message: "Qual estado e melhor para hidrogenio verde?",
        selectedUf: "BA",
        objective: "hidrogenio-verde",
        profile: "investidor"
      })
    });

    const response = await chatPost(request);
    const body = await response.json();

    expect(body).toHaveProperty("answer");
    expect(body).toHaveProperty("criteriaUsed");
    expect(body).toHaveProperty("recommendation");
    expect(body.referencedTerritories).toContain("BA");
    expect(body).toHaveProperty("territorialContext");
  });
});
