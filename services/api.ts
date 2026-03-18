import type { SiteHistoryPoint } from '@/types/site';

const DEFAULT_API_URL = 'http://localhost:8080/api';

function getApiBaseUrl() {
  return process.env.EXPO_PUBLIC_API_URL?.trim() || DEFAULT_API_URL;
}

function buildHeaders(token?: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API ${response.status}: ${text || response.statusText}`);
  }

  return (await response.json()) as T;
}

function buildUrl(path: string) {
  const baseUrl = getApiBaseUrl().replace(/\/+$/, '');
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

export interface AuthApiResponse {
  token: string;
  email: string;
  role: string;
}

export interface SiteApiResponse {
  id: number;
  name: string;
  location: string | null;
  surface: number | null;
  parkingSpaces: number | null;
  employees: number | null;
  energyConsumption: number | null;
  createdAt: string | null;
  createdBy: string | null;
}

export interface MaterialApiResponse {
  id: number;
  name: string;
  emissionFactor: number;
  unit?: string;
}

export interface SiteMaterialApiResponse {
  id: number;
  siteId: number;
  material: MaterialApiResponse;
  quantity: number;
  calculatedEmission: number;
}

export interface CarbonResultApiResponse {
  id: number;
  siteId: number;
  constructionEmission: number;
  exploitationEmission: number;
  totalEmission: number;
  co2PerM2: number;
  co2PerEmployee: number;
  calculatedAt: string;
}

export interface SiteCreatePayload {
  name: string;
  location: string;
  surface: number;
  parkingSpaces: number;
  employees: number;
  energyConsumption: number;
}

export async function login(payload: { email: string; password: string }) {
  const response = await fetch(buildUrl('/auth/login'), {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });

  return parseResponse<AuthApiResponse>(response);
}

export async function register(payload: { email: string; password: string }) {
  const response = await fetch(buildUrl('/auth/register'), {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });

  return parseResponse<AuthApiResponse>(response);
}

export async function getCurrentUser(token: string) {
  const response = await fetch(buildUrl('/auth/me'), {
    method: 'GET',
    headers: buildHeaders(token),
  });

  return parseResponse<{ id: number; email: string; role: string; createdAt: string }>(response);
}

export async function listSites(token: string) {
  const response = await fetch(buildUrl('/sites'), {
    method: 'GET',
    headers: buildHeaders(token),
  });

  return parseResponse<SiteApiResponse[]>(response);
}

export async function createSite(token: string, payload: SiteCreatePayload) {
  const response = await fetch(buildUrl('/sites'), {
    method: 'POST',
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
  });

  return parseResponse<SiteApiResponse>(response);
}

export async function updateSite(token: string, siteId: number, payload: SiteCreatePayload) {
  const response = await fetch(buildUrl(`/sites/${siteId}`), {
    method: 'PUT',
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
  });

  return parseResponse<SiteApiResponse>(response);
}

export async function deleteSite(token: string, siteId: number) {
  const response = await fetch(buildUrl(`/sites/${siteId}`), {
    method: 'DELETE',
    headers: buildHeaders(token),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API ${response.status}: ${text || response.statusText}`);
  }
}

export async function listMaterials(token: string) {
  const response = await fetch(buildUrl('/materials'), {
    method: 'GET',
    headers: buildHeaders(token),
  });

  return parseResponse<MaterialApiResponse[]>(response);
}

export async function createMaterial(
  token: string,
  payload: { name: string; emissionFactor: number; unit: string }
) {
  const response = await fetch(buildUrl('/materials'), {
    method: 'POST',
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
  });

  return parseResponse<MaterialApiResponse>(response);
}

export async function addSiteMaterial(
  token: string,
  siteId: number,
  payload: { materialId: number; quantity: number }
) {
  const response = await fetch(buildUrl(`/sites/${siteId}/materials`), {
    method: 'POST',
    headers: buildHeaders(token),
    body: JSON.stringify(payload),
  });

  return parseResponse<SiteMaterialApiResponse>(response);
}

export async function getSiteMaterials(token: string, siteId: number) {
  const response = await fetch(buildUrl(`/sites/${siteId}/materials`), {
    method: 'GET',
    headers: buildHeaders(token),
  });

  return parseResponse<SiteMaterialApiResponse[]>(response);
}

export async function removeSiteMaterial(token: string, siteId: number, siteMaterialId: number) {
  const response = await fetch(buildUrl(`/sites/${siteId}/materials/${siteMaterialId}`), {
    method: 'DELETE',
    headers: buildHeaders(token),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API ${response.status}: ${text || response.statusText}`);
  }
}

export async function calculateSite(token: string, siteId: number) {
  const response = await fetch(buildUrl(`/sites/${siteId}/calculate`), {
    method: 'POST',
    headers: buildHeaders(token),
  });

  return parseResponse<CarbonResultApiResponse>(response);
}

export async function getSiteReport(token: string, siteId: number) {
  const response = await fetch(buildUrl(`/sites/${siteId}/report`), {
    method: 'GET',
    headers: buildHeaders(token),
  });

  return parseResponse<CarbonResultApiResponse>(response);
}

export async function getSiteHistory(token: string, siteId: number) {
  const response = await fetch(buildUrl(`/sites/${siteId}/history`), {
    method: 'GET',
    headers: buildHeaders(token),
  });

  return parseResponse<SiteHistoryPoint[]>(response);
}
