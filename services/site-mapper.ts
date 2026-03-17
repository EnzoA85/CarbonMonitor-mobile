import { FALLBACK_MATERIALS } from '@/constants/base-carbone-materials';
import type { NewSiteFormValues, SiteMetrics, SiteRecord } from '@/types/site';
import { MATERIAL_OTHER } from '@/types/site';
import type { CarbonResultApiResponse, MaterialApiResponse, SiteApiResponse, SiteMaterialApiResponse } from '@/services/api';

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
  siteMaterials: siteMaterialsRaw,
  result,
  history,
}: {
  site: SiteApiResponse;
  siteMaterials: SiteMaterialApiResponse[];
  result: CarbonResultApiResponse | null;
  history: SiteRecord['history'];
}): SiteRecord {
  const construction = result?.constructionEmission ?? siteMaterialsRaw.reduce((acc, item) => acc + item.calculatedEmission, 0);
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

  const siteMaterials: SiteRecord['siteMaterials'] = siteMaterialsRaw.map((sm) => ({
    materialId: sm.material.id,
    materialName: sm.material.name,
    quantity: sm.quantity,
  }));

  return {
    id: String(site.id),
    name: site.name,
    location: site.location ?? 'Non renseigné',
    createdAt: site.createdAt ?? new Date().toISOString(),
    updatedAt: result?.calculatedAt ?? site.createdAt ?? new Date().toISOString(),
    siteMaterials,
    input: {
      areaM2: round(surface, 2),
      parkingSpaces: site.parkingSpaces ?? 0,
      annualEnergyMwh: round(site.energyConsumption ?? 0, 2),
      employees,
      workstations,
      materials: {
        concrete: round(pickMaterialQuantity(siteMaterialsRaw, ['beton', 'béton', 'concrete']), 2),
        steel: round(pickMaterialQuantity(siteMaterialsRaw, ['acier', 'steel', 'metal']), 2),
        glass: round(pickMaterialQuantity(siteMaterialsRaw, ['verre', 'glass']), 2),
        wood: round(pickMaterialQuantity(siteMaterialsRaw, ['bois', 'wood']), 2),
      },
    },
    metrics,
    history: history ?? [],
  };
}

export function toSiteCreatePayload(values: {
  name: string;
  address: string;
  postalCode: string;
  city: string;
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
    location: buildLocation(values.address, values.postalCode, values.city),
    surface: parseNumber(values.areaM2),
    parkingSpaces: Math.max(0, Math.round(parseNumber(values.parkingSpaces))),
    employees: Math.max(0, Math.round(parseNumber(values.employees))),
    energyConsumption: parseNumber(values.annualEnergyMwh),
  };
}

const parseNum = (raw: string) => {
  const parsed = Number(String(raw).replace(',', '.').trim());
  return Number.isFinite(parsed) ? parsed : 0;
};

function buildLocation(address: string, postalCode: string, city: string): string {
  const parts: string[] = [];
  if (address?.trim()) parts.push(address.trim());
  if (postalCode?.trim() && city?.trim()) parts.push(`${postalCode.trim()} ${city.trim()}`);
  else if (postalCode?.trim()) parts.push(postalCode.trim());
  else if (city?.trim()) parts.push(city.trim());
  return parts.join(', ') || 'Non renseigné';
}

export function newSiteFormToCreatePayload(values: NewSiteFormValues) {
  return {
    name: values.name.trim() || 'Site sans nom',
    location: buildLocation(values.address, values.postalCode, values.city),
    surface: parseNum(values.surfaceM2),
    parkingSpaces: Math.max(0, Math.round(parseNum(values.parkingSpaces))),
    employees: Math.max(0, Math.round(parseNum(values.employees))),
    energyConsumption: parseNum(values.energyKwhAn) / 1000,
  };
}

export function newSiteFormToMaterialPayloads(
  values: NewSiteFormValues,
  catalog: MaterialApiResponse[]
): { materialId: number; quantity: number }[] {
  const catalogIds = new Set(catalog.map((m) => m.id));
  return values.materials
    .filter((e) => e.materialId && e.materialId !== MATERIAL_OTHER && parseNum(e.quantityKg) > 0)
    .map((e) => ({
      materialId: Number(e.materialId),
      quantity: parseNum(e.quantityKg),
    }))
    .filter((p) => Number.isFinite(p.materialId) && catalogIds.has(p.materialId));
}

/** Entrées matériaux de secours (id < 0) à créer via API avant d'ajouter au site */
export function newSiteFormToFallbackMaterialEntries(values: NewSiteFormValues): {
  name: string;
  emissionFactor: number;
  quantity: number;
}[] {
  const fallbackById = new Map(FALLBACK_MATERIALS.map((m) => [m.id, m]));
  return values.materials
    .filter((e) => {
      const id = Number(e.materialId);
      return Number.isFinite(id) && id < 0 && parseNum(e.quantityKg) > 0 && fallbackById.has(id);
    })
    .map((e) => {
      const m = fallbackById.get(Number(e.materialId))!;
      return {
        name: m.name,
        emissionFactor: m.emissionFactor,
        quantity: parseNum(e.quantityKg),
      };
    });
}

/** Entrées "Autre" à créer via API avant d'ajouter au site */
export function newSiteFormToCustomMaterialEntries(values: NewSiteFormValues): {
  name: string;
  emissionFactor: number;
  quantity: number;
}[] {
  return values.materials
    .filter(
      (e) =>
        e.materialId === MATERIAL_OTHER &&
        (e.customMaterialName ?? '').trim() &&
        parseNum(e.customEmissionFactor) > 0 &&
        parseNum(e.quantityKg) > 0
    )
    .map((e) => ({
      name: (e.customMaterialName ?? '').trim(),
      emissionFactor: parseNum(e.customEmissionFactor),
      quantity: parseNum(e.quantityKg),
    }));
}
