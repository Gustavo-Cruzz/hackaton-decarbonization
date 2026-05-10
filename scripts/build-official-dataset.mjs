import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const rawDir = path.join(root, "data", "raw");
const processedDir = path.join(root, "data", "processed");
const aneelLocalPath = path.join(root, "siga-empreendimentos-geracao.json");
const curatedSignalsPath = path.join(root, "data", "curated", "state-signals.json");

const objectiveHints = {
  renewable: "Hidrogenio verde",
  biomass: "Biometano",
  industrial: "Industria de baixo carbono",
  export: "Logistica energetica"
};

const fuelBuckets = {
  Solar: "solar",
  "Radiação solar": "solar",
  Eólica: "eolica",
  Vento: "eolica",
  Biomassa: "biomassa",
  Bagaço: "biomassa",
  Biogás: "biomassa",
  Biometano: "biomassa",
  Hídrica: "hidrica",
  "Potencial hidráulico": "hidrica",
  Fóssil: "termica",
  Petróleo: "termica",
  "Óleo Diesel": "termica",
  "Gás Natural": "termica",
  "Carvão mineral": "termica"
};

function toNumber(raw) {
  if (raw === null || raw === undefined) return 0;
  const cleaned = String(raw).trim().replace(/\./g, "").replace(",", ".");
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : 0;
}

function scoreFromRange(value, min, max) {
  if (max <= min) return 50;
  const normalized = ((value - min) / (max - min)) * 100;
  return Math.max(0, Math.min(100, Math.round(normalized)));
}

function invertScoreFromRange(value, min, max) {
  return 100 - scoreFromRange(value, min, max);
}

function average(...values) {
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function diversityScore(values) {
  const nonZero = values.filter((value) => value > 0).length;
  return Math.round((nonZero / values.length) * 100);
}

function flattenCoordinates(geometry) {
  const polygons = [];
  if (geometry.type === "Polygon") {
    polygons.push(geometry.coordinates[0]);
    return polygons;
  }
  if (geometry.type === "MultiPolygon") {
    for (const polygon of geometry.coordinates) {
      polygons.push(polygon[0]);
    }
  }
  return polygons;
}

function computeBounds(features) {
  let minLon = Infinity;
  let minLat = Infinity;
  let maxLon = -Infinity;
  let maxLat = -Infinity;

  for (const feature of features) {
    for (const polygon of feature.geometry.coordinates) {
      for (const [lon, lat] of polygon) {
        minLon = Math.min(minLon, lon);
        maxLon = Math.max(maxLon, lon);
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
      }
    }
  }

  return { minLon, maxLon, minLat, maxLat };
}

function projectPoint(lon, lat, bounds) {
  const width = 470;
  const height = 600;
  const paddingX = 25;
  const paddingY = 20;
  const x = paddingX + ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon || 1)) * (width - paddingX * 2);
  const y = paddingY + (1 - (lat - bounds.minLat) / (bounds.maxLat - bounds.minLat || 1)) * (height - paddingY * 2);
  return [Number(x.toFixed(2)), Number(y.toFixed(2))];
}

function buildMarkerCoords(geometry) {
  const [minX, minY, maxX, maxY] = geometry.bbox;
  const [cx, cy] = geometry.centroid;
  return [
    [minX + 12, minY + 12],
    [maxX - 14, minY + 18],
    [cx + 16, cy - 22],
    [cx + 10, cy + 10],
    [cx - 18, cy + 18],
    [minX + (maxX - minX) * 0.35, maxY - 18]
  ].map(([x, y]) => [Number(x.toFixed(2)), Number(y.toFixed(2))]);
}

function getBucket(record) {
  const candidates = [record.NomFonteCombustivel, record.DscFonteCombustivel, record.DscOrigemCombustivel];
  for (const candidate of candidates) {
    if (candidate && fuelBuckets[candidate]) {
      return fuelBuckets[candidate];
    }
  }
  if (record.SigTipoGeracao === "UFV") return "solar";
  if (record.SigTipoGeracao === "EOL") return "eolica";
  if (record.SigTipoGeracao === "UTE") return "termica";
  if (record.SigTipoGeracao === "UHE" || record.SigTipoGeracao === "CGH" || record.SigTipoGeracao === "PCH") return "hidrica";
  return "termica";
}

function deriveStrengths(territory) {
  const strengths = [];
  if (territory.metrics.renewableSharePct >= 75) strengths.push("Alta participacao de ativos renovaveis na matriz estadual");
  if (territory.metrics.windCapacityMw >= 800) strengths.push("Escala relevante em eolica para rotas de hidrogenio e eletrificacao");
  if (territory.metrics.solarCapacityMw >= 800) strengths.push("Base solar robusta para expansao de energia limpa");
  if (territory.metrics.biomassCapacityMw >= 250) strengths.push("Presenca de biomassa util para SAF e biometano");
  if (territory.assets.portos >= 2) strengths.push("Boa conexao portuaria para cadeias industriais e exportadoras");
  if (territory.metrics.industrialParticipationPct >= 25) strengths.push("Base industrial capaz de ancorar demanda de baixo carbono");
  if (territory.metrics.gdpCurrentMillionBRL >= 400000) strengths.push("Escala economica suficiente para projetos estruturantes");

  return strengths.slice(0, 3);
}

function deriveBottlenecks(territory) {
  const bottlenecks = [];
  if (territory.assets.portos === 0) bottlenecks.push("Dependencia de corredores logisticos externos");
  if (territory.metrics.windCapacityMw < 50 && territory.metrics.solarCapacityMw < 50) {
    bottlenecks.push("Base renovavel ainda pequena para projetos eletrointensivos");
  }
  if (territory.metrics.industrialParticipationPct < 12) bottlenecks.push("Baixa densidade industrial para tracionar demanda ancora");
  if (territory.metrics.populationDensity > 120) bottlenecks.push("Pressao territorial maior e necessidade de ordenamento mais cuidadoso");
  if (territory.scores.infraestrutura < 58) bottlenecks.push("Infraestrutura energetica e conexoes territoriais ainda exigem reforco");

  return bottlenecks.slice(0, 3);
}

function deriveRecommendations(territory) {
  const recommendations = [];
  if (territory.metrics.windCapacityMw + territory.metrics.solarCapacityMw > 1500) {
    recommendations.push("Priorizar corredores que convertam escala renovavel em oferta industrial e exportadora");
  }
  if (territory.metrics.biomassCapacityMw > 200) {
    recommendations.push("Conectar biomassa e agroindustria a rotas de SAF e biometano");
  }
  if (territory.metrics.industrialParticipationPct > 20) {
    recommendations.push("Aproveitar a base industrial local para acelerar offtake de baixo carbono");
  }
  if (territory.assets.portos === 0) {
    recommendations.push("Estruturar parcerias logisticas interestaduais antes de escalar projetos exportadores");
  }

  return recommendations.slice(0, 2);
}

function derivePromisingSectors(territory) {
  const sectors = [];
  if (territory.metrics.windCapacityMw + territory.metrics.solarCapacityMw > 1200) sectors.push(objectiveHints.renewable);
  if (territory.metrics.biomassCapacityMw > 200) sectors.push(objectiveHints.biomass);
  if (territory.metrics.industrialParticipationPct > 20) sectors.push(objectiveHints.industrial);
  if (territory.assets.portos >= 2) sectors.push(objectiveHints.export);
  return Array.from(new Set(sectors)).slice(0, 3);
}

function pickLatestSnapshotDate(records) {
  const values = records.map((record) => record.DatGeracaoConjuntoDados).filter(Boolean).sort();
  return values.at(-1) ?? "";
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.status}`);
  return response.json();
}

async function main() {
  await fs.mkdir(path.join(rawDir, "aneel"), { recursive: true });
  await fs.mkdir(path.join(rawDir, "ibge"), { recursive: true });
  await fs.mkdir(path.join(rawDir, "curated"), { recursive: true });
  await fs.mkdir(processedDir, { recursive: true });

  const aneelRaw = JSON.parse(await fs.readFile(aneelLocalPath, "utf8"));
  const curatedSignals = JSON.parse(await fs.readFile(curatedSignalsPath, "utf8"));
  const curatedStateSignals = curatedSignals.states;
  await fs.copyFile(aneelLocalPath, path.join(rawDir, "aneel", "siga-empreendimentos-geracao.json"));
  await fs.copyFile(curatedSignalsPath, path.join(rawDir, "curated", "state-signals.json"));

  const [states, populationRows, gdpRows] = await Promise.all([
    fetchJson("https://servicodados.ibge.gov.br/api/v1/localidades/estados"),
    fetchJson("https://apisidra.ibge.gov.br/values/t/6579/n3/all/v/allxp/p/last/d/v9324%201"),
    fetchJson("https://apisidra.ibge.gov.br/values/t/5938/n3/all/v/37,517,520/p/2021")
  ]);

  await fs.writeFile(path.join(rawDir, "ibge", "estados.json"), JSON.stringify(states, null, 2));
  await fs.writeFile(path.join(rawDir, "ibge", "populacao-estados.json"), JSON.stringify(populationRows, null, 2));
  await fs.writeFile(path.join(rawDir, "ibge", "pib-industria-estados.json"), JSON.stringify(gdpRows, null, 2));

  const geometrySnapshots = [];
  for (const state of states) {
    const [metadata, geometry] = await Promise.all([
      fetchJson(`https://servicodados.ibge.gov.br/api/v3/malhas/estados/${state.sigla}/metadados`),
      fetchJson(`https://servicodados.ibge.gov.br/api/v3/malhas/estados/${state.sigla}?formato=application/vnd.geo+json&qualidade=minima`)
    ]);
    geometrySnapshots.push({
      uf: state.sigla,
      metadata: metadata[0],
      geometry: geometry.features[0].geometry
    });
  }
  await fs.writeFile(path.join(rawDir, "ibge", "estados-malha.geojson.json"), JSON.stringify(geometrySnapshots, null, 2));

  const normalizedGeometry = geometrySnapshots.map((snapshot) => ({
    uf: snapshot.uf,
    areaKm2: Number(snapshot.metadata.area.dimensao),
    centroidLonLat: [snapshot.metadata.centroide.longitude, snapshot.metadata.centroide.latitude],
    geometry: {
      type: snapshot.geometry.type,
      coordinates: flattenCoordinates(snapshot.geometry)
    }
  }));

  const geoBounds = computeBounds(normalizedGeometry);

  const fieldMap = Object.fromEntries(aneelRaw.fields.map((field, index) => [field.id, index]));
  const aneelRecords = aneelRaw.records.map((record) => ({
    DatGeracaoConjuntoDados: record[fieldMap.DatGeracaoConjuntoDados],
    SigUFPrincipal: record[fieldMap.SigUFPrincipal],
    SigTipoGeracao: record[fieldMap.SigTipoGeracao],
    DscFaseUsina: record[fieldMap.DscFaseUsina],
    DscOrigemCombustivel: record[fieldMap.DscOrigemCombustivel],
    DscFonteCombustivel: record[fieldMap.DscFonteCombustivel],
    NomFonteCombustivel: record[fieldMap.NomFonteCombustivel],
    MdaPotenciaFiscalizadaKw: record[fieldMap.MdaPotenciaFiscalizadaKw],
    MdaPotenciaOutorgadaKw: record[fieldMap.MdaPotenciaOutorgadaKw]
  }));

  const aneelSnapshotDate = pickLatestSnapshotDate(aneelRecords);
  const plantsByUf = new Map();

  for (const record of aneelRecords) {
    if (!record.SigUFPrincipal || record.DscFaseUsina !== "Operação") continue;
    const bucket = getBucket(record);
    const powerKw = toNumber(record.MdaPotenciaFiscalizadaKw || record.MdaPotenciaOutorgadaKw);
    if (!plantsByUf.has(record.SigUFPrincipal)) plantsByUf.set(record.SigUFPrincipal, []);
    plantsByUf.get(record.SigUFPrincipal).push({
      bucket,
      powerMw: powerKw / 1000
    });
  }

  const stateCodeToUf = new Map(states.map((state) => [String(state.id), state.sigla]));
  const populationMap = new Map();
  for (const row of populationRows.slice(1)) {
    const uf = stateCodeToUf.get(row.D1C);
    if (!uf) continue;
    populationMap.set(uf, {
      population: Number(row.V),
      year: row.D3N
    });
  }

  const gdpMap = new Map();
  for (const row of gdpRows.slice(1)) {
    const uf = stateCodeToUf.get(row.D1C);
    if (!uf) continue;
    if (!gdpMap.has(uf)) gdpMap.set(uf, { year: row.D3N });
    const current = gdpMap.get(uf);
    if (row.D2C === "37") current.gdpCurrentMillionBRL = Math.round(Number(row.V) / 1000);
    if (row.D2C === "517") current.industrialValueAddedMillionBRL = Math.round(Number(row.V) / 1000);
    if (row.D2C === "520") current.industrialParticipationPct = Number(row.V);
  }

  const stateMetrics = states.map((state) => {
    const plants = plantsByUf.get(state.sigla) ?? [];
    const aggregate = {
      renewablePlants: 0,
      solarPlants: 0,
      windPlants: 0,
      biomassPlants: 0,
      hydroPlants: 0,
      thermalPlants: 0,
      renewableCapacityMw: 0,
      solarCapacityMw: 0,
      windCapacityMw: 0,
      biomassCapacityMw: 0,
      hydroCapacityMw: 0,
      thermalCapacityMw: 0,
      totalCapacityMw: 0
    };

    for (const plant of plants) {
      aggregate.totalCapacityMw += plant.powerMw;
      if (plant.bucket === "solar") {
        aggregate.solarPlants += 1;
        aggregate.solarCapacityMw += plant.powerMw;
      } else if (plant.bucket === "eolica") {
        aggregate.windPlants += 1;
        aggregate.windCapacityMw += plant.powerMw;
      } else if (plant.bucket === "biomassa") {
        aggregate.biomassPlants += 1;
        aggregate.biomassCapacityMw += plant.powerMw;
      } else if (plant.bucket === "hidrica") {
        aggregate.hydroPlants += 1;
        aggregate.hydroCapacityMw += plant.powerMw;
      } else {
        aggregate.thermalPlants += 1;
        aggregate.thermalCapacityMw += plant.powerMw;
      }
    }

    aggregate.renewablePlants =
      aggregate.solarPlants + aggregate.windPlants + aggregate.biomassPlants + aggregate.hydroPlants;
    aggregate.renewableCapacityMw =
      aggregate.solarCapacityMw + aggregate.windCapacityMw + aggregate.biomassCapacityMw + aggregate.hydroCapacityMw;

    const geo = normalizedGeometry.find((feature) => feature.uf === state.sigla);
    const population = populationMap.get(state.sigla);
    const gdp = gdpMap.get(state.sigla);
    const populationDensity = geo && population ? population.population / geo.areaKm2 : 0;
    const renewableSharePct = aggregate.totalCapacityMw > 0 ? (aggregate.renewableCapacityMw / aggregate.totalCapacityMw) * 100 : 0;

    return {
      uf: state.sigla,
      state: state.nome,
      region: state.regiao.nome,
      areaKm2: geo?.areaKm2 ?? 0,
      geometry: geo,
      population: population?.population ?? 0,
      populationYear: population?.year ?? "",
      gdpCurrentMillionBRL: gdp?.gdpCurrentMillionBRL ?? 0,
      industrialValueAddedMillionBRL: gdp?.industrialValueAddedMillionBRL ?? 0,
      industrialParticipationPct: gdp?.industrialParticipationPct ?? 0,
      gdpYear: gdp?.year ?? "",
      populationDensity,
      renewableSharePct,
      ...aggregate
    };
  });

  const energyCapacityValues = stateMetrics.map((item) => item.renewableCapacityMw);
  const renewableShareValues = stateMetrics.map((item) => item.renewableSharePct);
  const strategicRenewableValues = stateMetrics.map(
    (item) => item.solarCapacityMw + item.windCapacityMw + item.biomassCapacityMw * 0.5
  );
  const totalCapacityValues = stateMetrics.map((item) => item.totalCapacityMw);
  const industrialShareValues = stateMetrics.map((item) => item.industrialParticipationPct);
  const industrialValueValues = stateMetrics.map((item) => item.industrialValueAddedMillionBRL);
  const densityValues = stateMetrics.map((item) => item.populationDensity);
  const curatedIndustryValues = Object.values(curatedStateSignals).map((item) => item.industrias);
  const populationValues = stateMetrics.map((item) => item.population);

  const ranges = {
    energyCapacity: [Math.min(...energyCapacityValues), Math.max(...energyCapacityValues)],
    renewableShare: [Math.min(...renewableShareValues), Math.max(...renewableShareValues)],
    strategicRenewables: [Math.min(...strategicRenewableValues), Math.max(...strategicRenewableValues)],
    totalCapacity: [Math.min(...totalCapacityValues), Math.max(...totalCapacityValues)],
    industrialShare: [Math.min(...industrialShareValues), Math.max(...industrialShareValues)],
    industrialValue: [Math.min(...industrialValueValues), Math.max(...industrialValueValues)],
    density: [Math.min(...densityValues), Math.max(...densityValues)],
    curatedIndustries: [Math.min(...curatedIndustryValues), Math.max(...curatedIndustryValues)],
    population: [Math.min(...populationValues), Math.max(...populationValues)]
  };

  const territories = stateMetrics.map((stateMetric) => {
    const curated = curatedStateSignals[stateMetric.uf] ?? {
      portos: 0,
      industrias: 8,
      hubs: 0,
      infraestruturaBase: 50,
      logisticaBase: 50
    };
    const strategicRenewablesMw =
      stateMetric.solarCapacityMw + stateMetric.windCapacityMw + stateMetric.biomassCapacityMw * 0.5;

    const energyScore = average(
      scoreFromRange(strategicRenewablesMw, ...ranges.strategicRenewables),
      scoreFromRange(stateMetric.renewableSharePct, ...ranges.renewableShare),
      diversityScore([stateMetric.solarCapacityMw, stateMetric.windCapacityMw, stateMetric.biomassCapacityMw])
    );

    const infrastructureScore = average(
      curated.infraestruturaBase,
      scoreFromRange(stateMetric.totalCapacityMw, ...ranges.totalCapacity),
      scoreFromRange(strategicRenewablesMw, ...ranges.strategicRenewables)
    );

    const industryScore = average(
      scoreFromRange(stateMetric.industrialValueAddedMillionBRL, ...ranges.industrialValue),
      scoreFromRange(stateMetric.industrialParticipationPct, ...ranges.industrialShare),
      scoreFromRange(curated.industrias, ...ranges.curatedIndustries)
    );

    const socioambientalScore = average(
      invertScoreFromRange(stateMetric.populationDensity, ...ranges.density),
      scoreFromRange(stateMetric.renewableSharePct, ...ranges.renewableShare),
      invertScoreFromRange(stateMetric.population, ...ranges.population)
    );

    const polygons = stateMetric.geometry.geometry.coordinates.map((polygon) =>
      polygon.map(([lon, lat]) => projectPoint(lon, lat, geoBounds))
    );

    const allPoints = polygons.flat();
    const xs = allPoints.map(([x]) => x);
    const ys = allPoints.map(([, y]) => y);
    const centroid = projectPoint(stateMetric.geometry.centroidLonLat[0], stateMetric.geometry.centroidLonLat[1], geoBounds);
    const geometry = {
      bbox: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)],
      polygons: polygons.map((points) => ({ points })),
      centroid
    };

    const territory = {
      uf: stateMetric.uf,
      state: stateMetric.state,
      region: stateMetric.region,
      scores: {
        energiaLimpa: energyScore,
        infraestrutura: infrastructureScore,
        industria: industryScore,
        logistica: curated.logisticaBase,
        socioambiental: socioambientalScore
      },
      assets: {
        solar: stateMetric.solarPlants,
        eolica: stateMetric.windPlants,
        biomassa: stateMetric.biomassPlants,
        portos: curated.portos,
        industrias: curated.industrias,
        hubs: curated.hubs
      },
      strengths: [],
      bottlenecks: [],
      recommendations: [],
      promisingSectors: [],
      coords: buildMarkerCoords(geometry),
      geometry,
      sourceMeta: {
        aneelSnapshotDate,
        ibgePopulationYear: stateMetric.populationYear,
        ibgeGdpYear: stateMetric.gdpYear,
        ibgeGeometrySource: "IBGE malhas estados v3",
        curatedSignalsSnapshotDate: curatedSignals.snapshotDate,
        curatedSignalsSource: curatedSignals.source,
        methodVersion: "imte-hibrido-v2.1"
      },
      scoreSources: {
        energiaLimpa: {
          mode: "official",
          summary: "Derivado de capacidade renovavel estrategica, participacao renovavel e diversidade de fontes do SIGA/ANEEL.",
          inputs: [
            "ANEEL SIGA capacidade solar/eolica/biomassa em operacao",
            "ANEEL SIGA participacao renovavel na capacidade instalada",
            "Diversidade de fontes renovaveis por UF"
          ]
        },
        infraestrutura: {
          mode: "hybrid",
          summary: "Combina sinal curado temporario de infraestrutura com escala de capacidade total e renovavel observada na ANEEL.",
          inputs: [
            "Curadoria interna infraestruturaBase por UF",
            "ANEEL SIGA capacidade total instalada",
            "ANEEL SIGA capacidade renovavel estrategica"
          ]
        },
        industria: {
          mode: "hybrid",
          summary: "Combina PIB industrial e participacao industrial do IBGE com intensidade industrial complementar curada para o pitch.",
          inputs: [
            "IBGE valor adicionado bruto da industria",
            "IBGE participacao da industria no valor adicionado",
            "Curadoria interna de industrias por UF"
          ]
        },
        logistica: {
          mode: "curated",
          summary: "Score temporario curado por UF para representar acesso logistico e corredores de escoamento no MVP.",
          inputs: [
            "Curadoria interna logisticaBase por UF",
            "Curadoria interna de portos e hubs"
          ]
        },
        socioambiental: {
          mode: "derived",
          summary: "Derivado de densidade populacional, participacao renovavel e escala populacional como proxy socioambiental estadual.",
          inputs: [
            "IBGE populacao",
            "IBGE area territorial",
            "ANEEL SIGA participacao renovavel"
          ]
        }
      },
      metrics: {
        renewablePlants: stateMetric.renewablePlants,
        solarPlants: stateMetric.solarPlants,
        windPlants: stateMetric.windPlants,
        biomassPlants: stateMetric.biomassPlants,
        hydroPlants: stateMetric.hydroPlants,
        thermalPlants: stateMetric.thermalPlants,
        renewableCapacityMw: Number(stateMetric.renewableCapacityMw.toFixed(2)),
        solarCapacityMw: Number(stateMetric.solarCapacityMw.toFixed(2)),
        windCapacityMw: Number(stateMetric.windCapacityMw.toFixed(2)),
        biomassCapacityMw: Number(stateMetric.biomassCapacityMw.toFixed(2)),
        hydroCapacityMw: Number(stateMetric.hydroCapacityMw.toFixed(2)),
        thermalCapacityMw: Number(stateMetric.thermalCapacityMw.toFixed(2)),
        totalCapacityMw: Number(stateMetric.totalCapacityMw.toFixed(2)),
        population: stateMetric.population,
        gdpCurrentMillionBRL: stateMetric.gdpCurrentMillionBRL,
        industrialValueAddedMillionBRL: stateMetric.industrialValueAddedMillionBRL,
        industrialParticipationPct: Number(stateMetric.industrialParticipationPct.toFixed(2)),
        areaKm2: Number(stateMetric.areaKm2.toFixed(2)),
        populationDensity: Number(stateMetric.populationDensity.toFixed(2)),
        renewableSharePct: Number(stateMetric.renewableSharePct.toFixed(2))
      }
    };

    territory.strengths = deriveStrengths(territory);
    territory.bottlenecks = deriveBottlenecks(territory);
    territory.recommendations = deriveRecommendations(territory);
    territory.promisingSectors = derivePromisingSectors(territory);

    if (territory.strengths.length === 0) territory.strengths = ["Base energetica e economica ainda em consolidacao nesta leitura estadual"];
    if (territory.bottlenecks.length === 0) territory.bottlenecks = ["Necessidade de aprofundar dados territoriais complementares para leitura mais fina"];
    if (territory.recommendations.length === 0) territory.recommendations = ["Usar o estado como referencia exploratoria e aprofundar validacao setorial antes da decisao"];
    if (territory.promisingSectors.length === 0) territory.promisingSectors = ["Politica publica"];

    return territory;
  });

  await fs.writeFile(path.join(processedDir, "territories-official.json"), JSON.stringify(territories, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
