import type { SiteMetrics, SiteRecord } from '@/types/site';
import type { CarbonResultApiResponse, SiteApiResponse, SiteMaterialApiResponse } from '@/services/api';

function round(value: number, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function pickMaterialQuantity(materials: SiteMaterialApiResponse[], aliases: string[]) {
  const aliasSet = new Set(aliases.map((alias) => alias.toLowerCase()));
  const entry = materials.find((item) => aliasSet.has(item.material.name.toLowerCase()));
  return entry?.quantity ?? 0;
}

function inferWorkstations(employees: number) {
  return Math.max(0, Math.round(employees * 0.58));
}

export function toSiteRecord({
  site,
  siteMaterials,
  result,
  history,
}: {
  site: SiteApiResponse;
  siteMaterials: SiteMaterialApiResponse[];
  result: CarbonResultApiResponse | null;
  history: SiteRecord['history'];
}): SiteRecord {
  const construction = result?.constructionEmission ?? siteMaterials.reduce((acc, item) => acc + item.calculatedEmission, 0);
  const operation = result?.exploitationEmission ?? 0;
  const total = result?.totalEmission ?? construction + operation;
  const surface = site.surface ?? 0;
  const employees = site.employees ?? 0;
  const workstations = inferWorkstations(employees);

  const metrics: SiteMetrics = {
    totalKgCo2e: total,
    totalTonnesCo2e: total / 1000,
    constructionKgCo2e: construction,
    operationKgCo2e: operation,
    co2PerM2: result?.co2PerM2 ?? (surface > 0 ? total / surface : 0),
    co2PerEmployee: result?.co2PerEmployee ?? (employees > 0 ? total / employees : 0),
    co2PerWorkstation: workstations > 0 ? total / workstations : 0,
  };

  return {
    id: String(site.id),
    name: site.name,
    location: site.location ?? 'Non renseigné',
    createdAt: site.createdAt ?? new Date().toISOString(),
    updatedAt: result?.calculatedAt ?? site.createdAt ?? new Date().toISOString(),
    input: {
      areaM2: round(surface, 2),
      parkingSpaces: site.parkingSpaces ?? 0,
      annualEnergyMwh: round(site.energyConsumption ?? 0, 2),
      employees,
      workstations,
      materials: {
        concrete: round(pickMaterialQuantity(siteMaterials, ['beton', 'béton', 'concrete']), 2),
        steel: round(pickMaterialQuantity(siteMaterials, ['acier', 'steel', 'metal']), 2),
        glass: round(pickMaterialQuantity(siteMaterials, ['verre', 'glass']), 2),
        wood: round(pickMaterialQuantity(siteMaterials, ['bois', 'wood']), 2),
      },
    },
    metrics,
    history: history ?? [],
  };
}

export function toSiteCreatePayload(values: {
  name: string;
  location: string;
  areaM2: string;
  parkingSpaces: string;
  annualEnergyMwh: string;
  employees: string;
}) {
  const parseNumber = (raw: string) => {
    const parsed = Number(raw.replace(',', '.').trim());
    return Number.isFinite(parsed) ? parsed : 0;
  };

  return {
    name: values.name.trim() || 'Site sans nom',
    location: values.location.trim() || 'Non renseigné',
    surface: parseNumber(values.areaM2),
    parkingSpaces: Math.max(0, Math.round(parseNumber(values.parkingSpaces))),
    employees: Math.max(0, Math.round(parseNumber(values.employees))),
    energyConsumption: parseNumber(values.annualEnergyMwh),
  };
}
