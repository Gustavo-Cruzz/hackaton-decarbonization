# Bases de Dados do PID MVP

## Resumo

O `PID MVP` opera com uma base local híbrida, composta por snapshots oficiais, sinais curados temporários e um recorte municipal demonstrativo.

Este documento é a fonte de verdade para:

- origem das bases;
- papel de cada base no produto;
- artefatos locais versionados;
- status metodológico de cada camada;
- limites conhecidos do conjunto de dados atual.

## Taxonomia usada na documentação

- `oficial`: dado vindo diretamente de fonte institucional pública.
- `híbrido`: combinação de dado oficial com regra derivada ou sinal complementar curado.
- `curado`: sinal temporário criado para o MVP e ainda não substituído por fonte oficial estruturada.
- `demonstrativo`: artefato exploratório usado para UX, pitch ou drill-down, sem status metodológico oficial.

## Inventário das fontes

| Fonte | Tipo | Papel no produto | Nível territorial | Artefatos locais principais |
| --- | --- | --- | --- | --- |
| `ANEEL SIGA` | oficial | geração, fontes, capacidade instalada, participação renovável | estadual | `data/raw/aneel/siga-empreendimentos-geracao.json` |
| `IBGE Localidades` | oficial | estados, regiões e metadados territoriais | estadual | `data/raw/ibge/estados.json` |
| `IBGE Malhas v3` | oficial | geometria simplificada de estados e municípios | estadual e municipal | `data/raw/ibge/estados-malha.geojson.json`, geometrias derivadas nos processados |
| `IBGE` população | oficial | população e proxies socioeconômicos | estadual | `data/raw/ibge/populacao-estados.json` |
| `IBGE` indicadores econômicos | oficial | base industrial e escala econômica | estadual | `data/raw/ibge/pib-industria-estados.json` |
| sinais curados do MVP | curado | logística, hubs, portos e parte da infraestrutura | estadual | `data/curated/state-signals.json`, `data/raw/curated/state-signals.json` |
| proxy municipal do MVP | demonstrativo | exploração municipal e narrativa geoespacial | municipal | `data/processed/municipalities/BA.json` |
| `Power BI` externo | externo | experiência complementar de projetos | não aplicável | embed em `components/PowerBiPanel.tsx` |

## Bases por artefato local

### 1. `data/raw/aneel/siga-empreendimentos-geracao.json`

- origem: snapshot local do `ANEEL SIGA`
- tipo: `oficial`
- uso:
  - capacidade solar, eólica e biomassa em operação
  - participação renovável
  - diversidade de fontes
  - parte da leitura de infraestrutura energética
- entra principalmente em:
  - `Energia limpa`
  - parte de `Infraestrutura`
  - parte de `Socioambiental`

### 2. `data/raw/ibge/estados.json`

- origem: `IBGE Localidades`
- tipo: `oficial`
- uso:
  - cadastro de estados e regiões
  - metadados territoriais básicos do pipeline estadual

### 3. `data/raw/ibge/estados-malha.geojson.json`

- origem: `IBGE Malhas v3`
- tipo: `oficial`
- uso:
  - geometria oficial simplificada por `UF`
  - centroides, área e shape usados na experiência geoespacial estadual

### 4. `data/raw/ibge/populacao-estados.json`

- origem: `IBGE`
- tipo: `oficial`
- uso:
  - população estadual
  - parte dos proxies socioambientais
  - parte dos cálculos de densidade e escala territorial

### 5. `data/raw/ibge/pib-industria-estados.json`

- origem: `IBGE`
- tipo: `oficial`
- uso:
  - valor adicionado bruto da indústria
  - participação industrial
  - escala econômica usada na dimensão industrial

### 6. `data/curated/state-signals.json`

- origem: curadoria interna do MVP
- tipo: `curado`
- uso:
  - `logisticaBase`
  - sinais de `portos`
  - sinais de `hubs`
  - parte complementar de `infraestrutura`
- observação:
  - esse arquivo representa uma camada temporária de produto
  - deve ser tratado como transição até substituição por fonte oficial estruturada

### 7. `data/processed/territories-official.json`

- origem: artefato processado pelo pipeline offline
- tipo: `híbrido`
- gerado por: `scripts/build-official-dataset.mjs`
- uso:
  - dataset principal do mapa estadual
  - base do ranking
  - base da comparação
  - base do chatbot
  - base do painel territorial
- conteúdo relevante:
  - `scores`
  - `assets`
  - `metrics`
  - `geometry`
  - `sourceMeta`
  - `scoreSources`
  - `strengths`, `bottlenecks`, `recommendations`

### 8. `data/processed/municipalities/BA.json`

- origem: chunk local municipal demonstrativo
- tipo: `demonstrativo`
- uso:
  - drill-down municipal da `Bahia`
  - narrativa de pitch municipal
  - contexto municipal do chatbot
- observações:
  - não representa metodologia oficial de `IMTE` municipal
  - deriva do contexto estadual com ajustes simples de população, densidade e escala econômica
  - hoje é o chunk municipal versionado no repositório

## Bases por dimensão do IMTE

### Energia limpa

- status: `oficial`
- fontes principais:
  - `ANEEL SIGA`
- sinais:
  - capacidade solar
  - capacidade eólica
  - capacidade de biomassa
  - participação renovável
  - diversidade de fontes

### Infraestrutura

- status: `híbrido`
- fontes principais:
  - `ANEEL SIGA`
  - sinais curados do MVP
- sinais:
  - capacidade total instalada
  - escala renovável estratégica
  - complemento curado de infraestrutura por `UF`

### Base industrial

- status: `híbrido`
- fontes principais:
  - `IBGE`
  - complemento curado do MVP
- sinais:
  - valor adicionado bruto da indústria
  - participação industrial
  - intensidade industrial complementar

### Logística

- status: `curado`
- fontes principais:
  - sinais curados do MVP
- sinais:
  - `logisticaBase`
  - presença relativa de `portos`
  - presença relativa de `hubs`

### Socioambiental

- status: `derivado`
- fontes principais:
  - `IBGE`
  - `ANEEL SIGA`
- sinais:
  - densidade populacional
  - escala populacional
  - participação renovável

## Pipeline de geração

### Pipeline estadual

- script principal: `scripts/build-official-dataset.mjs`
- responsabilidades:
  - copiar snapshot local da `ANEEL`
  - baixar estados e malhas do `IBGE`
  - baixar população e indicadores econômicos
  - combinar dados oficiais com sinais curados
  - gerar `data/processed/territories-official.json`

### Pipeline municipal demonstrativo

- implementação principal: `lib/municipalities.ts`
- responsabilidades:
  - derivar `scoresProxy`
  - derivar `assetsProxy`
  - calcular `IMTE proxy`
  - gerar explicação e `sourceMeta` demonstrativa
- artefato atual versionado:
  - `data/processed/municipalities/BA.json`

## Uso das bases no produto

### Mapa e painel territorial

- usam principalmente `data/processed/territories-official.json`
- no drill-down municipal, usam também `data/processed/municipalities/BA.json`

### Ranking e comparação

- usam `data/processed/territories-official.json`
- continuam sendo leitura principal estadual nesta fase

### Chatbot

- usa o dataset territorial local
- recebe contexto de território, layers, objetivo, onboarding e nível territorial
- pode responder com `Gemini` ou fallback local
- não consulta fontes externas em runtime para montar a resposta

### Power BI

- o painel `Projetos ANP e ANEEL` é uma experiência embutida externa
- ele não é gerado pelo mesmo pipeline local do mapa
- deve ser tratado como painel complementar, não como parte do dataset processado do `IMTE`

## Limitações atuais das bases

- o dataset principal continua orientado a `pitch`, não a decisão regulatória ou de investimento final;
- `logística` e parte de `infraestrutura` seguem em camada curada;
- o recorte municipal atual é demonstrativo e não nacional;
- a metodologia municipal ainda não é oficial nem validada setorialmente;
- o `Power BI` embutido não compartilha o mesmo contrato de dados do mapa territorial;
- não há atualização automática em runtime das fontes oficiais.
