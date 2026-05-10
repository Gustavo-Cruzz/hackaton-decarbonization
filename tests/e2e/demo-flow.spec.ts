import { expect, test } from "@playwright/test";

test("critical pitch flow works end-to-end with municipal drill-down", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Copiloto territorial para transicao energetica e descarbonizacao")).toBeVisible();
  await expect(page.getByText(/drill-down municipal usa proxy demonstrativo local/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /Pitch rapido/i })).toBeVisible();

  await page.getByLabel("Perfil").selectOption("investidor");
  await page.getByLabel("Objetivo").selectOption("hidrogenio-verde");

  await page.getByTestId("map-state-BA").click();
  await expect(page.getByRole("heading", { name: "Bahia" })).toBeVisible();
  await expect(page.getByText("Legenda IMTE")).toBeVisible();
  await expect(page.getByText("Mapa analitico Brasil → UF → municipios")).toBeVisible();

  await page.getByRole("button", { name: "Ver municipios" }).click();
  await expect(page.getByRole("heading", { name: "Salvador" })).toBeVisible();
  await expect(page.getByText("Municipio • BA • leitura demonstrativa")).toBeVisible();

  await page.getByRole("button", { name: /^Energia$/ }).click();
  await page.getByRole("button", { name: /Desligar camada Parques solares|Ligar camada Parques solares/ }).click();
  await page.getByRole("button", { name: /^Infraestrutura$/ }).click();
  await page.getByRole("button", { name: /Desligar camada Hubs estrategicos|Ligar camada Hubs estrategicos/ }).click();
  await page.getByRole("button", { name: /^Industria$/ }).click();
  await page.getByRole("button", { name: /Desligar camada Ativos industriais|Ligar camada Ativos industriais/ }).click();
  await page.getByRole("button", { name: /^Logistica$/ }).click();
  await page.getByRole("button", { name: /Desligar camada Portos e escoamento|Ligar camada Portos e escoamento/ }).click();
  await page.getByRole("button", { name: /^Indicadores$/ }).click();
  await expect(page.getByText("Legenda IMTE")).toBeVisible();
  await page.getByRole("button", { name: /Comparacao guiada/i }).first().click();
  await expect(page.getByText("Territorios escolhidos")).toBeVisible();
  await page.getByRole("button", { name: /Ranking territorial/i }).first().click();
  await page.getByRole("button", { name: /Indice personalizavel/i }).first().click();
  await expect(page.getByLabel("Peso energia limpa")).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Baixar JSON" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain("2927408");

  await page.getByRole("button", { name: "Resetar visao" }).click();
  await expect(page.getByRole("heading", { name: "Bahia" })).toBeVisible();

  await page.getByRole("button", { name: "Ver municipios" }).click();
  await expect(page.getByRole("heading", { name: "Salvador" })).toBeVisible();
  await expect(page).toHaveURL(/selectedUf=BA/);
  await expect(page).toHaveURL(/mapLevel=municipal/);

  const chatbotInput = page.getByLabel("Pergunta para o chatbot");
  await chatbotInput.fill("O que esse municipio sugere?");
  await page.getByRole("button", { name: /^Perguntar$/ }).click();

  await expect(page.getByText("Resposta direta")).toBeVisible();
  await expect(page.getByText(/Salvador esta em leitura municipal demonstrativa/i)).toBeVisible();
  await expect(page.getByText("Contexto territorial")).toBeVisible();
  await expect(page.getByText(/Salvador \(BA\) em nivel municipal demonstrativo/i)).toBeVisible();

  await page.reload();
  await expect(page).toHaveURL(/mapLevel=municipal/);
  await expect(page.getByRole("heading", { name: "Salvador" })).toBeVisible();
});
