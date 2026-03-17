export interface MaterialInputs {
  concrete: string;
  steel: string;
  glass: string;
  wood: string;
}

/** Valeur spéciale pour l'option "Autre" (matériau personnalisé) */
export const MATERIAL_OTHER = 'autre';

/** Entrée matériau pour le formulaire de création (liste dynamique) */
export interface MaterialFormEntry {
  id: string;
  materialId: string;
  quantityKg: string;
  /** Nom du matériau personnalisé (quand materialId === MATERIAL_OTHER) */
  customMaterialName?: string;
  /** Facteur d'émission kgCO₂e/kg (Base Carbone) pour matériau personnalisé */
  customEmissionFactor?: string;
}

/** Valeurs du formulaire de création de site (nouvelle structure maquette) */
export interface NewSiteFormValues {
  name: string;
  address: string;
  postalCode: string;
  city: string;
  surfaceM2: string;
  workstations: string;
  energyKwhAn: string;
  parkingSpaces: string;
  employees: string;
  materials: MaterialFormEntry[];
}

export interface SiteFormValues {
  name: string;
  address: string;
  postalCode: string;
  city: string;
  areaM2: string;
  parkingSpaces: string;
  annualEnergyMwh: string;
  employees: string;
  workstations: string;
  materials: MaterialInputs;
}

export interface SiteMetrics {
  totalKgCo2e: number;
  totalTonnesCo2e: number;
  constructionKgCo2e: number;
  operationKgCo2e: number;
  co2PerM2: number;
  co2PerEmployee: number;
  co2PerWorkstation: number;
}

export interface SiteHistoryPoint {
  id: number;
  siteId: number;
  year: number;
  energyConsumption: number;
  employees: number;
  totalEmission: number;
}

export interface SiteMaterialRecord {
  materialId: number;
  materialName: string;
  quantity: number;
}

export interface SiteRecord {
  id: string;
  name: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  siteMaterials: SiteMaterialRecord[];
  input: {
    areaM2: number;
    parkingSpaces: number;
    annualEnergyMwh: number;
    employees: number;
    workstations: number;
    materials: {
      concrete: number;
      steel: number;
      glass: number;
      wood: number;
    };
  };
  metrics: SiteMetrics;
  history: SiteHistoryPoint[];
}

export interface SessionUser {
  email: string;
  token: string;
  organization: string;
  role: string;
}
