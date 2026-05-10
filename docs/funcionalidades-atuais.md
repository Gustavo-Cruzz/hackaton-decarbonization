# Funcionalidades Atuais do PID MVP

## 1. Visão geral

O `PID MVP` é uma aplicação de pitch para demonstrar uma experiência de decisão territorial para transição energética e descarbonização industrial no Brasil.

O produto combina:

- mapa territorial por `UF`;
- `IMTE` com metodologia híbrida;
- ranking e comparação entre estados;
- objetivos com pesos customizáveis;
- perfis de usuário;
- chatbot contextualizado pelos dados locais do MVP.

Na versão atual, o MVP não opera mais só com dados simulados. Ele usa uma base híbrida:

- `ANEEL SIGA` para usinas, fontes e potência instalada;
- `IBGE` para malha oficial por `UF`, população e indicadores econômicos;
- sinais curados temporários para `logística`, `portos`, `hubs` e parte de `infraestrutura`.

## 2. Funcionalidades visíveis

### 2.1. Mapa territorial

O mapa principal:

- renderiza as `27 UFs`;
- usa geometria oficial simplificada do `IBGE`;
- permite clique por estado;
- destaca visualmente o território selecionado;
- sincroniza seleção com painel, ranking e comparação.

Camadas disponíveis:

- `solar`
- `eólica`
- `biomassa`
- `portos`
- `indústrias`
- `hubs`
- `IMTE`

### 2.2. Painel territorial

Ao selecionar um estado, o painel lateral exibe:

- nome do território e região;
- `IMTE` geral;
- classificação de maturidade;
- barras por dimensão;
- forças;
- gargalos;
- recomendação principal;
- resumo `Por que este território agora`;
- base usada no recorte atual;
- bloco `Como o IMTE foi montado`.

### 2.3. IMTE

O `IMTE` continua operando de `0 a 100` com fórmula-base:

```txt
30% Energia limpa
25% Infraestrutura
20% Base industrial
15% Logística
10% Socioambiental
```

Objetivos específicos podem recalcular o ranking com pesos próprios.

Estado metodológico atual:

- `energia limpa`: oficial;
- `infraestrutura`: híbrida;
- `base industrial`: híbrida;
- `logística`: curada temporariamente;
- `socioambiental`: derivada.

### 2.4. Ranking e comparação

O usuário consegue:

- ver ranking territorial por `IMTE`;
- recalcular ranking por objetivo ou pesos ativos;
- destacar `Top 3`;
- clicar no ranking para navegar para o estado;
- comparar até `3 estados`;
- ver diferenças de `IMTE`, forças e gargalos.

### 2.5. Índice personalizável

O MVP permite:

- escolher objetivo;
- carregar pesos padrão;
- editar pesos por dimensão;
- restaurar pesos do objetivo;
- recalcular o ranking imediatamente.

Objetivos atuais:

- `Hidrogênio verde`
- `SAF`
- `Biometano`
- `Indústria de baixo carbono`
- `Política pública`

### 2.6. Perfis de usuário

Perfis implementados:

- `Gestor público`
- `Investidor`
- `Engenheiro`
- `Pesquisador`

Cada perfil altera:

- linguagem do resumo e da recomendação;
- perguntas sugeridas para o chatbot;
- objetivo sugerido;
- pesos padrão complementares;
- cards de insight.

### 2.7. Chatbot contextual

O chatbot responde usando:

- `estado selecionado`;
- `perfil atual`;
- `objetivo atual`;
- `pesos ativos`;
- `ranking recalculado`;
- dataset local híbrido.

As respostas incluem:

- resposta direta;
- critérios usados;
- recomendação;
- ressalva do MVP.

### 2.8. Persistência da demo

O estado da demonstração é salvo em `localStorage`, incluindo:

- perfil;
- objetivo;
- pesos;
- estado selecionado;
- estados comparados;
- camadas ativas;
- abertura do chatbot;
- última pergunta.

### 2.9. Disclaimer

O MVP mostra aviso explícito de que:

- a base é híbrida;
- há sinais curados temporários;
- a leitura serve para pitch e exploração comparativa;
- não deve ser usada para decisão final sem validação complementar.

## 3. Sustentação técnica

Stack atual:

- `Next.js 15`
- `React 19`
- `TypeScript`
- `Tailwind CSS 4`
- `Vitest`
- `Playwright`

Organização principal:

- `app/`: UI e rotas internas `/api`;
- `components/`: blocos da tela principal;
- `data/raw/`: snapshots oficiais e curados versionados;
- `data/processed/`: dataset territorial processado;
- `lib/`: IMTE, ranking, chatbot e estado da demo;
- `scripts/`: pipeline offline de ingestão;
- `tests/`: testes unitários, de contrato e E2E.

## 4. APIs e contratos atuais

Rotas internas disponíveis:

- `GET /api/territories`
- `GET /api/territories/:uf`
- `POST /api/ranking`
- `POST /api/compare`
- `POST /api/chat`

Contratos relevantes:

- `TerritoryRecord`
- `RankedTerritory`
- `ComparisonEntry`
- `ChatRequest`
- `ChatResponse`
- `DemoState`

O `TerritoryRecord` atual já inclui:

- `scores`;
- `assets`;
- `geometry`;
- `metrics`;
- `sourceMeta`;
- `scoreSources`.

## 5. Evidências e testes

Cobertura atual:

- cálculo do `IMTE`;
- ranking;
- pesos customizados;
- engine do chatbot;
- persistência de estado;
- contratos das rotas `/api`;
- dataset oficial/híbrido;
- fluxo E2E principal de pitch.

Comandos de validação:

```bash
npm run build:data
npm run test:unit
npm run test:e2e
npm run build
```

## 6. Limitações atuais

Ainda não existe:

- atualização automática em runtime;
- banco geoespacial;
- autenticação;
- persistência backend de análises;
- ingestão automática de APIs externas;
- drill-down municipal;
- LLM de produção com retrieval controlado.

Limitações metodológicas atuais:

- `logística` ainda é um score curado por `UF`;
- parte de `infraestrutura` ainda depende de sinal curado;
- a leitura socioambiental ainda usa proxies simplificados;
- o MVP continua orientado a demonstração, não a decisão regulatória ou investimento real sem aprofundamento.
