import { expect, test } from "@playwright/test";

test("critical pitch flow works end-to-end", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByText("Configure sua experiencia em quatro etapas")).toBeVisible();
  await page.getByLabel(/Nome completo/i).fill("Maria da Silva");
  await page.getByLabel(/E-mail/i).fill("maria@example.com");
  await page.getByLabel(/Organizacao/i).fill("Empresa Verde");
  await page.getByLabel(/Estado de atuacao/i).fill("Bahia");
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("button", { name: "Pessoa Juridica" }).click();
  await page.getByRole("button", { name: /Empresarial/i }).click();
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByLabel(/Qual setor da empresa/i).selectOption("energy");
  await page.getByLabel(/Qual seu principal interesse/i).selectOption("investment-viability");
  await page.getByRole("button", { name: "ROI de projetos verdes" }).click();
  await page.getByRole("button", { name: "Sim" }).click();
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("button", { name: "Hidrogenio verde" }).click();
  await page.getByRole("button", { name: "Avancado" }).click();
  await page.getByRole("button", { name: "Sim" }).last().click();
  await page.getByRole("button", { name: "Entrar na plataforma" }).click();
  await expect(page.getByText("Copiloto territorial para transicao energetica e descarbonizacao")).toBeVisible();
  await expect(page.getByText(/drill-down municipal usa proxy demonstrativo local/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /Pitch rapido/i })).toBeVisible();

  await page.getByLabel("Objetivo").selectOption("hidrogenio-verde");

  await page.getByTestId("map-state-BA").click();
  await expect(page.getByRole("heading", { name: "Bahia" })).toBeVisible();
  await expect(page.getByText("Legenda IMTE")).toBeVisible();
  await expect(page.getByText("Mapa analitico Brasil → UF → municipios")).toBeVisible();

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
  expect(download.suggestedFilename()).toContain("BA");

  await page.getByRole("button", { name: "Resetar visao" }).click();
  await expect(page.getByRole("heading", { name: "Bahia" })).toBeVisible();
  await expect(page).toHaveURL(/selectedUf=BA/);
  await expect(page).toHaveURL(/mapLevel=national/);

  await page.getByRole("button", { name: "Abrir chatbot" }).click();
  const chatbotInput = page.getByLabel("Pergunta para o chatbot");
  await chatbotInput.fill("O que esse estado sugere?");
  await page.getByRole("button", { name: /^Perguntar$/ }).click();

  await expect(page.getByText("Resposta direta")).toBeVisible();
  await expect(page.getByText(/Bahia tem IMTE/i)).toBeVisible();
  await expect(page.getByText("Contexto territorial")).toBeVisible();
  await expect(page.getByText(/Contexto atual: Bahia \(BA\)/i)).toBeVisible();

  await page.reload();
  await expect(page).toHaveURL(/selectedUf=BA/);
  await expect(page.getByRole("heading", { name: "Bahia" })).toBeVisible();
});
