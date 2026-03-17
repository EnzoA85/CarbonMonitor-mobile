import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';

import * as api from '@/services/api';
import {
  newSiteFormToCreatePayload,
  newSiteFormToCustomMaterialEntries,
  newSiteFormToFallbackMaterialEntries,
  newSiteFormToMaterialPayloads,
  toSiteCreatePayload,
  toSiteRecord,
} from '@/services/site-mapper';
import type { NewSiteFormValues, SessionUser, SiteFormValues, SiteHistoryPoint, SiteRecord } from '@/types/site';
import { getDefaultSiteValues } from '@/utils/calculations';

const SESSION_STORAGE_KEY = 'carbosite-session';

async function readStoredSession(): Promise<SessionUser | null> {
  const sessionRaw = await AsyncStorage.getItem(SESSION_STORAGE_KEY);
  return sessionRaw ? (JSON.parse(sessionRaw) as SessionUser) : null;
}

function toMaterialMap(values: SiteFormValues) {
  const map = new Map<string, number>();
  map.set('beton', Number(values.materials.concrete.replace(',', '.')) || 0);
  map.set('concrete', Number(values.materials.concrete.replace(',', '.')) || 0);
  map.set('acier', Number(values.materials.steel.replace(',', '.')) || 0);
  map.set('steel', Number(values.materials.steel.replace(',', '.')) || 0);
  map.set('metal', Number(values.materials.steel.replace(',', '.')) || 0);
  map.set('verre', Number(values.materials.glass.replace(',', '.')) || 0);
  map.set('glass', Number(values.materials.glass.replace(',', '.')) || 0);
  map.set('bois', Number(values.materials.wood.replace(',', '.')) || 0);
  map.set('wood', Number(values.materials.wood.replace(',', '.')) || 0);
  return map;
}

export const [AppProvider, useAppState] = createContextHook(() => {
  const [sites, setSites] = useState<SiteRecord[]>([]);
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [hasBootstrapped, setHasBootstrapped] = useState(false);

  const bootstrapQuery = useQuery({
    queryKey: ['app-session-bootstrap'],
    queryFn: readStoredSession,
  });

  const loadSites = useCallback(async (token: string) => {
    let siteList: api.SiteApiResponse[];
    try {
      siteList = await api.listSites(token);
    } catch (err) {
      console.warn('[loadSites] API listSites failed:', err);
      setSites([]);
      return [];
    }

    const hydratedSites = await Promise.all(
      siteList.map(async (site) => {
        const [materials, result, history] = await Promise.all([
          api.getSiteMaterials(token, site.id).catch(() => []),
          api.getSiteReport(token, site.id).catch(() => null),
          api.getSiteHistory(token, site.id).catch(() => [] as SiteHistoryPoint[]),
        ]);

        return toSiteRecord({
          site,
          siteMaterials: materials,
          result,
          history,
        });
      })
    );

    hydratedSites.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    setSites(hydratedSites);
    return hydratedSites;
  }, []);

  const persistSessionMutation = useMutation({
    mutationFn: async (nextSession: SessionUser | null) => {
      if (nextSession) {
        await AsyncStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
      } else {
        await AsyncStorage.removeItem(SESSION_STORAGE_KEY);
      }
      return nextSession;
    },
  });

  const hydrateMutation = useMutation({
    mutationFn: async (storedSession: SessionUser | null) => {
      if (!storedSession?.token) {
        setSessionUser(null);
        setSites([]);
        return;
      }

      setSessionUser(storedSession);
      try {
        await loadSites(storedSession.token);
      } catch (err) {
        console.warn('[hydrate] loadSites failed:', err);
      }
    },
  });

  const login = useCallback(
    async (email: string, password: string) => {
      const auth = await api.login({ email, password });
      const profile = await api.getCurrentUser(auth.token);

      const user: SessionUser = {
        email: profile.email,
        token: auth.token,
        organization: profile.email?.includes('@') ? profile.email.split('@')[1] : '',
        role: profile.role,
      };

      setSessionUser(user);
      await persistSessionMutation.mutateAsync(user);
      await loadSites(user.token);
      return user;
    },
    [loadSites, persistSessionMutation]
  );

  const register = useCallback(
    async (email: string, password: string) => {
      const auth = await api.register({ email, password });
      const profile = await api.getCurrentUser(auth.token);

      const user: SessionUser = {
        email: profile.email,
        token: auth.token,
        organization: profile.email?.includes('@') ? profile.email.split('@')[1] : '',
        role: profile.role,
      };

      setSessionUser(user);
      await persistSessionMutation.mutateAsync(user);
      await loadSites(user.token);
      return user;
    },
    [loadSites, persistSessionMutation]
  );

  const logout = useCallback(async () => {
    setSessionUser(null);
    setSites([]);
    await persistSessionMutation.mutateAsync(null);
  }, [persistSessionMutation]);

  const createSite = useCallback(
    async (values: SiteFormValues) => {
      if (!sessionUser?.token) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }

      const createdSite = await api.createSite(sessionUser.token, toSiteCreatePayload(values));
      const catalog = await api.listMaterials(sessionUser.token).catch(() => []);
      const quantitiesByAlias = toMaterialMap(values);

      await Promise.all(
        catalog.map(async (material) => {
          const quantity = quantitiesByAlias.get(material.name.toLowerCase());
          if (!quantity || quantity <= 0) {
            return;
          }
          await api.addSiteMaterial(sessionUser.token, createdSite.id, {
            materialId: material.id,
            quantity,
          });
        })
      );

      await api.calculateSite(sessionUser.token, createdSite.id).catch(() => null);
      const refreshedSites = await loadSites(sessionUser.token);
      return refreshedSites.find((site) => site.id === String(createdSite.id)) ?? refreshedSites[0];
    },
    [loadSites, sessionUser?.token]
  );

  const createSiteFromNewForm = useCallback(
    async (values: NewSiteFormValues) => {
      if (!sessionUser?.token) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }

      const payload = newSiteFormToCreatePayload(values);
      const createdSite = await api.createSite(sessionUser.token, payload);
      const catalog = await api.listMaterials(sessionUser.token).catch(() => []);

      const standardPayloads = newSiteFormToMaterialPayloads(values, catalog);
      const fallbackEntries = newSiteFormToFallbackMaterialEntries(values);
      const customEntries = newSiteFormToCustomMaterialEntries(values);

      for (const p of standardPayloads) {
        await api.addSiteMaterial(sessionUser.token, createdSite.id, {
          materialId: p.materialId,
          quantity: p.quantity,
        });
      }

      for (const fallback of fallbackEntries) {
        const newMaterial = await api.createMaterial(sessionUser.token, {
          name: fallback.name,
          emissionFactor: fallback.emissionFactor,
          unit: 'kg',
        });
        await api.addSiteMaterial(sessionUser.token, createdSite.id, {
          materialId: newMaterial.id,
          quantity: fallback.quantity,
        });
      }

      for (const custom of customEntries) {
        const newMaterial = await api.createMaterial(sessionUser.token, {
          name: custom.name,
          emissionFactor: custom.emissionFactor,
          unit: 'kg',
        });
        await api.addSiteMaterial(sessionUser.token, createdSite.id, {
          materialId: newMaterial.id,
          quantity: custom.quantity,
        });
      }

      await api.calculateSite(sessionUser.token, createdSite.id).catch(() => null);
      const refreshedSites = await loadSites(sessionUser.token);
      return refreshedSites.find((site) => site.id === String(createdSite.id)) ?? refreshedSites[0];
    },
    [loadSites, sessionUser?.token]
  );

  const updateSite = useCallback(
    async (siteId: string, values: SiteFormValues) => {
      if (!sessionUser?.token) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }
      const id = Number(siteId);
      if (!Number.isFinite(id)) throw new Error('ID de site invalide');
      await api.updateSite(sessionUser.token, id, toSiteCreatePayload(values));
      await loadSites(sessionUser.token);
    },
    [loadSites, sessionUser?.token]
  );

  const updateSiteFromNewForm = useCallback(
    async (siteId: string, values: NewSiteFormValues) => {
      if (!sessionUser?.token) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }
      const id = Number(siteId);
      if (!Number.isFinite(id)) throw new Error('ID de site invalide');

      const payload = newSiteFormToCreatePayload(values);
      await api.updateSite(sessionUser.token, id, payload);

      const existingMaterials = await api.getSiteMaterials(sessionUser.token, id).catch(() => []);
      for (const sm of existingMaterials) {
        await api.removeSiteMaterial(sessionUser.token, id, sm.id);
      }

      const catalog = await api.listMaterials(sessionUser.token).catch(() => []);
      const standardPayloads = newSiteFormToMaterialPayloads(values, catalog);
      const fallbackEntries = newSiteFormToFallbackMaterialEntries(values);
      const customEntries = newSiteFormToCustomMaterialEntries(values);

      for (const p of standardPayloads) {
        await api.addSiteMaterial(sessionUser.token, id, { materialId: p.materialId, quantity: p.quantity });
      }
      for (const fallback of fallbackEntries) {
        const newMaterial = await api.createMaterial(sessionUser.token, {
          name: fallback.name,
          emissionFactor: fallback.emissionFactor,
          unit: 'kg',
        });
        await api.addSiteMaterial(sessionUser.token, id, { materialId: newMaterial.id, quantity: fallback.quantity });
      }
      for (const custom of customEntries) {
        const newMaterial = await api.createMaterial(sessionUser.token, {
          name: custom.name,
          emissionFactor: custom.emissionFactor,
          unit: 'kg',
        });
        await api.addSiteMaterial(sessionUser.token, id, { materialId: newMaterial.id, quantity: custom.quantity });
      }

      await api.calculateSite(sessionUser.token, id).catch(() => null);
      await loadSites(sessionUser.token);
    },
    [loadSites, sessionUser?.token]
  );

  const deleteSite = useCallback(
    async (siteId: string) => {
      if (!sessionUser?.token) {
        throw new Error('Session expirée. Veuillez vous reconnecter.');
      }
      const id = Number(siteId);
      if (!Number.isFinite(id)) throw new Error('ID de site invalide');
      await api.deleteSite(sessionUser.token, id);
      await loadSites(sessionUser.token);
    },
    [loadSites, sessionUser?.token]
  );

  const seedDefaultSite = useCallback(async () => {
    if (sites.length > 0) {
      return sites[0];
    }
    return createSite(getDefaultSiteValues());
  }, [createSite, sites]);

  const latestSite = sites[0] ?? null;

  const totals = useMemo(() => {
    return sites.reduce(
      (accumulator, site) => {
        accumulator.totalKg += site.metrics.totalKgCo2e;
        accumulator.totalConstructionKg += site.metrics.constructionKgCo2e;
        accumulator.totalOperationKg += site.metrics.operationKgCo2e;
        return accumulator;
      },
      { totalKg: 0, totalConstructionKg: 0, totalOperationKg: 0 }
    );
  }, [sites]);

  useEffect(() => {
    if (!hasBootstrapped && bootstrapQuery.data !== undefined && !hydrateMutation.isPending) {
      void hydrateMutation.mutateAsync(bootstrapQuery.data);
      setHasBootstrapped(true);
    }
  }, [bootstrapQuery.data, hasBootstrapped, hydrateMutation.isPending, hydrateMutation.mutateAsync]);

  const isHydrated = bootstrapQuery.isSuccess && hasBootstrapped && !hydrateMutation.isPending;
  const isLoading = bootstrapQuery.isLoading || hydrateMutation.isPending;

  return {
    sites,
    latestSite,
    sessionUser,
    isHydrated,
    isLoading,
    login,
    register,
    logout,
    createSite,
    createSiteFromNewForm,
    updateSite,
    updateSiteFromNewForm,
    deleteSite,
    seedDefaultSite,
    totals,
  };
});
