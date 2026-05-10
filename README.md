# PID MVP

## Visão geral

O `PID MVP` é um MVP de pitch para uma plataforma territorial de transição energética e descarbonização industrial no Brasil.

Hoje a experiência principal combina:

- onboarding inteligente por perfil;
- `Mapa interativo com bot` com `react-leaflet`;
- `IMTE` híbrido com ranking, comparação e editor de pesos;
- chatbot contextual com fallback `Gemini -> engine local`;
- experiência paralela `Projetos ANP e ANEEL` via embed de `Power BI`.

O produto não é um sistema de produção regulatória. Ele é uma experiência de demonstração para exploração territorial, narrativa de pitch e validação de UX/produto.

## Estado atual do produto

Funcionalidades já entregues:

- [x] onboarding multi-etapas com perfis `Empresarial`, `Governamental` e `Pesquisador / Acadêmico`
- [x] mapa geoespacial com `react-leaflet`
- [x] basemap online com fallback local
- [x] drill-down `Brasil -> UF -> município`
- [x] chunk municipal demonstrativo local da `Bahia`
- [x] painel territorial com `IMTE`, dimensões, forças, gargalos e recomendação
- [x] ranking estadual e comparação entre territórios
- [x] índice personalizável próximo do mapa
- [x] chatbot flutuante com histórico simples de conversa
- [x] URL compartilhável da visão atual
- [x] download JSON do território selecionado
- [x] embed `Power BI` na mesma aplicação
- [x] fallback local do chat quando `Gemini` não responde
- [x] testes unitários e E2E

Ainda não existe:

- [ ] cobertura municipal nacional gerada pelo pipeline
- [ ] dados em tempo real no runtime
- [ ] banco geoespacial
- [ ] persistência backend de análises ou conversas
- [ ] metodologia oficial de `IMTE` municipal

## Fluxo principal

1. O usuário entra no onboarding e escolhe seu perfil.
2. A aplicação abre no modo `Mapa interativo com bot`.
3. O usuário navega entre `Brasil`, `UF` e, quando disponível, `município`.
4. O painel territorial e o ranking refletem objetivo, pesos e tema do mapa.
5. O editor de `IMTE` recalcula a leitura em tempo real.
6. O chatbot flutuante responde com base no território em foco, objetivo, layers ativas e contexto do onboarding.
7. O usuário pode alternar para `Projetos ANP e ANEEL` para abrir o `Power BI` embutido.

## Perfis e personalização

O onboarding usa três perfis principais de UX:

- `Empresarial`
- `Governamental`
- `Pesquisador / Acadêmico`

Internamente, o motor atual ainda mapeia esses perfis para a taxonomia legada do ranking/chat:

- `Empresarial -> investidor`
- `Governamental -> gestor-publico`
- `Pesquisador / Acadêmico -> pesquisador`

Esse mapeamento é um detalhe de compatibilidade interna. A interface principal do produto deve ser lida a partir da taxonomia nova do onboarding.

## Stack

- `Next.js 15`
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`
- `react-leaflet`
- `@google/genai`
- `Vitest`
- `Playwright`

## Como rodar

```bash
npm install
npm run build:data
npm run dev
```

Abra `http://localhost:3000`.

## Configuração do Gemini

O chat pode usar `Gemini` no backend para gerar respostas reais, com fallback automático para a engine local quando a chave não estiver configurada ou a API falhar.

Crie um arquivo `.env.local` na raiz do projeto com:

```bash
GEMINI_API_KEY=sua_chave_aqui
GEMINI_MODEL=gemini-2.5-flash
```

O arquivo `.env.example` mostra esse formato.

## Dados e metodologia

O MVP usa uma base híbrida local. As fontes centrais hoje são:

- `ANEEL SIGA` para ativos de geração e capacidade instalada;
- `IBGE Localidades` para estados e regiões;
- `IBGE Malhas v3` para geometrias estaduais e municipais simplificadas;
- `IBGE` para população, área e sinais econômicos usados no pipeline atual;
- sinais curados temporários para `logística` e parte de `infraestrutura`;
- proxy municipal demonstrativo para o chunk local da `Bahia`.

Documentação recomendada:

- [docs/funcionalidades-atuais.md](docs/funcionalidades-atuais.md)
- [docs/imte-metodologia-v2.md](docs/imte-metodologia-v2.md)
- [docs/bases-de-dados.md](docs/bases-de-dados.md)

Arquivos-chave de dados:

```txt
data/raw/aneel/siga-empreendimentos-geracao.json
data/raw/ibge/estados.json
data/raw/ibge/estados-malha.geojson.json
data/raw/ibge/populacao-estados.json
data/raw/ibge/pib-industria-estados.json
data/raw/curated/state-signals.json
data/processed/territories-official.json
data/processed/municipalities/BA.json
```

## Limitações metodológicas

- o score estadual é `híbrido`, não regulatório;
- `logística` ainda depende de sinais curados temporários;
- parte de `infraestrutura` ainda depende de sinal curado;
- o drill-down municipal atual é `demonstrativo`, não oficial;
- o chunk municipal versionado hoje é local e restrito à `Bahia`;
- o chatbot responde com base no dataset local do MVP e não substitui análise técnica.

## Testes

Comandos atuais:

```bash
npm run build:data
npm run test:unit
npm run test:e2e
npm run build
```

Cobertura atual inclui:

- cálculo do `IMTE`;
- ranking, comparação e pesos customizados;
- estado persistido da demo;
- contratos principais das rotas `/api`;
- fluxo E2E do onboarding, mapa, chat e painéis analíticos.

## Estrutura do projeto

```txt
app/         UI e rotas internas /api
components/  blocos visuais da experiência
data/        objetivos, perfis, sinais curados, snapshots e datasets processados
docs/        documentação de produto, metodologia e dados
lib/         cálculo IMTE, ranking, chatbot, onboarding e estado da demo
scripts/     pipeline offline de ingestão ANEEL/IBGE
tests/       testes unitários, de contrato e E2E
```
