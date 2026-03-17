import {
  EMPLOYEE_FACTOR,
  ENERGY_EMISSION_FACTORS,
  MATERIAL_EMISSION_FACTORS,
  PARKING_SPACE_FACTOR,
  SURFACE_FACTOR,
  WORKSTATION_FACTOR,
} from '@/constants/emission-factors';
import type { SiteFormValues, SiteMetrics, SiteRecord } from '@/types/site';

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

export function buildSiteRecord(values: SiteFormValues): SiteRecord {
  const now = new Date().toISOString();
  const metrics = calculateSiteMetrics(values);

  return {
    id: `${Date.now()}`,
    name: values.name.trim() || 'Site sans nom',
    location: values.location.trim() || 'France',
    createdAt: now,
    updatedAt: now,
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
    name: 'Capgemini Rennes',
    location: 'Rennes',
    areaM2: '11771',
    parkingSpaces: '220',
    annualEnergyMwh: '1840',
    employees: '1800',
    workstations: '1037',
    materials: {
      concrete: '6200',
      steel: '740',
      glass: '310',
      wood: '120',
    },
  };
}

export function getShare(value: number, total: number) {
  if (total <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(1, value / total));
}
