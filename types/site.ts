export interface MaterialInputs {
  concrete: string;
  steel: string;
  glass: string;
  wood: string;
}

export interface SiteFormValues {
  name: string;
  location: string;
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

export interface SiteRecord {
  id: string;
  name: string;
  location: string;
  createdAt: string;
  updatedAt: string;
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
