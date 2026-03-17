/**
 * Calculs locaux utilisés uniquement pour la PRÉVISUALISATION en temps réel
 * (formulaires site/new et site/edit). Les KPI affichés sur le dashboard,
 * le détail des sites et l'historique proviennent du backend via
 * getSiteReport, getSiteMaterials et CarbonResultResponse.
 */
import type { MaterialApiResponse } from '@/services/api';
import { MATERIAL_OTHER } from '@/types/site';
import {
  EMPLOYEE_FACTOR,
  ENERGY_EMISSION_FACTORS,
  MATERIAL_EMISSION_FACTORS,
  PARKING_SPACE_FACTOR,
  SURFACE_FACTOR,
  WORKSTATION_FACTOR,
} from '@/constants/emission-factors';
import type { MaterialFormEntry, NewSiteFormValues, SiteFormValues, SiteMetrics, SiteRecord } from '@/types/site';

function parseNumber(value: string) {
  const normalized = value.replace(',', '.').trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function calculateSiteMetrics(values: SiteFormValues): SiteMetrics {
  const areaM2 = parseNumber(values.areaM2);
  const parkingSpaces = parseNumber(values.parkingSpaces);
  const annualEnergyMwh = parseNumber(values.annualEnergyMwh);
  const employees = parseNumber(values.employees);
  const workstations = parseNumber(values.workstations);
  const concrete = parseNumber(values.materials.concrete);
  const steel = parseNumber(values.materials.steel);
  const glass = parseNumber(values.materials.glass);
  const wood = parseNumber(values.materials.wood);

  const constructionKgCo2e =
    concrete * MATERIAL_EMISSION_FACTORS.concrete * 1000 +
    steel * MATERIAL_EMISSION_FACTORS.steel * 1000 +
    glass * MATERIAL_EMISSION_FACTORS.glass * 1000 +
    wood * MATERIAL_EMISSION_FACTORS.wood * 1000;

  const operationKgCo2e =
    annualEnergyMwh * 1000 * ENERGY_EMISSION_FACTORS.electricityKwh +
    parkingSpaces * 1000 * PARKING_SPACE_FACTOR +
    employees * 1000 * EMPLOYEE_FACTOR +
    workstations * 1000 * WORKSTATION_FACTOR +
    areaM2 * 1000 * SURFACE_FACTOR;

  const totalKgCo2e = constructionKgCo2e + operationKgCo2e;
  const totalTonnesCo2e = totalKgCo2e / 1000;

  return {
    totalKgCo2e,
    totalTonnesCo2e,
    constructionKgCo2e,
    operationKgCo2e,
    co2PerM2: areaM2 > 0 ? totalKgCo2e / areaM2 : 0,
    co2PerEmployee: employees > 0 ? totalKgCo2e / employees : 0,
    co2PerWorkstation: workstations > 0 ? totalKgCo2e / workstations : 0,
  };
}

function buildLocationFromParts(address: string, postalCode: string, city: string): string {
  const parts: string[] = [];
  if (address?.trim()) parts.push(address.trim());
  if (postalCode?.trim() && city?.trim()) parts.push(`${postalCode.trim()} ${city.trim()}`);
  else if (postalCode?.trim()) parts.push(postalCode.trim());
  else if (city?.trim()) parts.push(city.trim());
  return parts.join(', ') || 'Non renseigné';
}

export function buildSiteRecord(values: SiteFormValues): SiteRecord {
  const now = new Date().toISOString();
  const metrics = calculateSiteMetrics(values);

  return {
    id: `${Date.now()}`,
    name: values.name.trim() || 'Site sans nom',
    location: buildLocationFromParts(values.address, values.postalCode, values.city),
    createdAt: now,
    updatedAt: now,
    siteMaterials: [],
    input: {
      areaM2: parseNumber(values.areaM2),
      parkingSpaces: parseNumber(values.parkingSpaces),
      annualEnergyMwh: parseNumber(values.annualEnergyMwh),
      employees: parseNumber(values.employees),
      workstations: parseNumber(values.workstations),
      materials: {
        concrete: parseNumber(values.materials.concrete),
        steel: parseNumber(values.materials.steel),
        glass: parseNumber(values.materials.glass),
        wood: parseNumber(values.materials.wood),
      },
    },
    metrics,
    history: [],
  };
}

export function getDefaultSiteValues(): SiteFormValues {
  return {
    name: '',
    address: '',
    postalCode: '',
    city: '',
    areaM2: '',
    parkingSpaces: '',
    annualEnergyMwh: '',
    employees: '',
    workstations: '',
    materials: {
      concrete: '',
      steel: '',
      glass: '',
      wood: '',
    },
  };
}

export function calculateNewSiteMetrics(
  values: NewSiteFormValues,
  catalog: MaterialApiResponse[]
): SiteMetrics {
  const surfaceM2 = parseNumber(values.surfaceM2);
  const parkingSpaces = parseNumber(values.parkingSpaces);
  const energyKwhAn = parseNumber(values.energyKwhAn);
  const employees = parseNumber(values.employees);
  const workstations = parseNumber(values.workstations);

  const materialMap = new Map(catalog.map((m) => [m.id, m.emissionFactor]));
  const constructionKgCo2e = values.materials.reduce((acc, e) => {
    const qty = parseNumber(e.quantityKg);
    let factor: number;
    if (e.materialId === MATERIAL_OTHER && e.customEmissionFactor != null) {
      factor = parseNumber(e.customEmissionFactor);
    } else {
      factor = materialMap.get(Number(e.materialId)) ?? 0;
    }
    return acc + qty * factor;
  }, 0);

  const annualEnergyMwh = energyKwhAn / 1000;
  const operationKgCo2e =
    annualEnergyMwh * 1000 * ENERGY_EMISSION_FACTORS.electricityKwh +
    parkingSpaces * 1000 * PARKING_SPACE_FACTOR +
    employees * 1000 * EMPLOYEE_FACTOR +
    workstations * 1000 * WORKSTATION_FACTOR +
    surfaceM2 * 1000 * SURFACE_FACTOR;

  const totalKgCo2e = constructionKgCo2e + operationKgCo2e;
  const totalTonnesCo2e = totalKgCo2e / 1000;

  return {
    totalKgCo2e,
    totalTonnesCo2e,
    constructionKgCo2e,
    operationKgCo2e,
    co2PerM2: surfaceM2 > 0 ? totalKgCo2e / surfaceM2 : 0,
    co2PerEmployee: employees > 0 ? totalKgCo2e / employees : 0,
    co2PerWorkstation: workstations > 0 ? totalKgCo2e / workstations : 0,
  };
}

export function getDefaultNewSiteValues(): NewSiteFormValues {
  return {
    name: '',
    address: '',
    postalCode: '',
    city: '',
    surfaceM2: '',
    workstations: '',
    energyKwhAn: '',
    parkingSpaces: '',
    employees: '',
    materials: [{ id: `m-${Date.now()}-${Math.random().toString(36).slice(2)}`, materialId: '', quantityKg: '' }],
  };
}

export function getShare(value: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(1, value / total));
}

function parseLocation(location: string): { address: string; postalCode: string; city: string } {
  if (!location?.trim()) return { address: '', postalCode: '', city: '' };
  const m = location.match(/^(.+),\s*(\d{5})\s+(.+)$/);
  if (m) return { address: m[1].trim(), postalCode: m[2], city: m[3].trim() };
  const m2 = location.match(/^(\d{5})\s+(.+)$/);
  if (m2) return { address: '', postalCode: m2[1], city: m2[2].trim() };
  return { address: location.trim(), postalCode: '', city: '' };
}

function genId() {
  return `m-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function siteRecordToNewSiteFormValues(site: SiteRecord): NewSiteFormValues {
  const { address, postalCode, city } = parseLocation(site.location);
  const energyKwhAn = site.input.annualEnergyMwh ? String(Number(site.input.annualEnergyMwh) * 1000) : '';
  const materials: MaterialFormEntry[] =
    site.siteMaterials?.length > 0
      ? site.siteMaterials.map((sm) => ({
          id: genId(),
          materialId: String(sm.materialId),
          quantityKg: String(sm.quantity),
        }))
      : [{ id: genId(), materialId: '', quantityKg: '' }];
  return {
    name: site.name,
    address,
    postalCode,
    city,
    surfaceM2: String(site.input.areaM2),
    workstations: String(site.input.workstations),
    energyKwhAn,
    parkingSpaces: String(site.input.parkingSpaces),
    employees: String(site.input.employees),
    materials,
  };
}

export function siteRecordToFormValues(site: SiteRecord): SiteFormValues {
  const { address, postalCode, city } = parseLocation(site.location);
  return {
    name: site.name,
    address,
    postalCode,
    city,
    areaM2: String(site.input.areaM2),
    parkingSpaces: String(site.input.parkingSpaces),
    annualEnergyMwh: String(site.input.annualEnergyMwh),
    employees: String(site.input.employees),
    workstations: String(site.input.workstations),
    materials: {
      concrete: String(site.input.materials.concrete),
      steel: String(site.input.materials.steel),
      glass: String(site.input.materials.glass),
      wood: String(site.input.materials.wood),
    },
  };
}
