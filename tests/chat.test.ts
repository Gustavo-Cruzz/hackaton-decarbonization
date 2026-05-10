import { territories } from "@/data/territories";
import { answerChat } from "@/lib/chat";
import { describe, expect, it } from "vitest";

describe("chat engine", () => {
  it("answers with local context for hydrogen", () => {
    const response = answerChat(
      {
        message: "Qual estado e melhor para hidrogenio verde?",
        selectedUf: "BA",
        objective: "hidrogenio-verde",
        profile: "investidor"
      },
      territories
    );

    expect(response.answer).toContain("Bahia");
    expect(response.criteriaUsed).toContain("energia limpa");
    expect(response.mvpDisclaimer).toContain("ANEEL SIGA");
    expect(response.territorialContext).toContain("Bahia");
  });

  it("compares mentioned territories", () => {
    const response = answerChat(
      {
        message: "Compare Bahia e Ceara",
        objective: "hidrogenio-verde",
        profile: "investidor"
      },
      territories
    );

    expect(response.answer).toContain("Bahia");
    expect(response.answer).toContain("Ceará");
  });

  it("answers about bottlenecks with local context", () => {
    const response = answerChat(
      {
        message: "Quais sao os principais gargalos do Espirito Santo?",
        objective: "hidrogenio-verde",
        profile: "investidor"
      },
      territories
    );

    expect(response.answer).toContain("Espírito Santo");
    expect(response.answer).toContain("gargalos");
    expect(response.criteriaUsed).toContain("leitura hibrida");
  });

  it("suggests layers for biometano analysis", () => {
    const response = answerChat(
      {
        message: "Que camadas devo ligar para analisar biometano?",
        objective: "biometano",
        profile: "pesquisador"
      },
      territories
    );

    expect(response.answer).toContain("biometano");
    expect(response.answer).toContain("biomassa");
    expect(response.criteriaUsed).toContain("biometano");
  });

  it("explains methodology when asked why a territory is well positioned", () => {
    const response = answerChat(
      {
        message: "Por que a Bahia tem IMTE alto?",
        selectedUf: "BA",
        objective: "hidrogenio-verde",
        profile: "investidor"
      },
      territories
    );

    expect(response.answer).toContain("Bahia");
    expect(response.criteriaUsed).toContain("composicao metodologica");
    expect(response.criteriaUsed).toContain("energia limpa");
  });

  it("preserves municipal context when the map is in drill-down mode", () => {
    const response = answerChat(
      {
        message: "O que esse municipio sugere?",
        selectedUf: "BA",
        selectedMunicipalityId: "2927408",
        selectedMunicipalityName: "Salvador",
        mapLevel: "municipal",
        activeLayers: ["imte", "solar", "portos"],
        drillDownEnabled: true,
        objective: "hidrogenio-verde",
        profile: "investidor"
      },
      territories
    );

    expect(response.answer).toContain("Salvador");
    expect(response.territorialContext).toContain("nivel municipal");
    expect(response.territorialContext).toContain("solar");
  });
});
