/**
 * Liste de secours des 10 matériaux Base Carbone® ADEME
 * (https://data.ademe.fr/datasets/base-carboner/full)
 * Utilisée quand l'API ne renvoie aucun matériau.
 */
import type { MaterialApiResponse } from '@/services/api';

export const FALLBACK_MATERIALS: MaterialApiResponse[] = [
  { id: -1, name: 'Béton', emissionFactor: 0.13, unit: 'kg' },
  { id: -2, name: 'Acier', emissionFactor: 1.37, unit: 'kg' },
  { id: -3, name: 'Verre', emissionFactor: 0.85, unit: 'kg' },
  { id: -4, name: 'Bois', emissionFactor: 0.04, unit: 'kg' },
  { id: -5, name: 'Aluminium', emissionFactor: 6.73, unit: 'kg' },
  { id: -6, name: 'Cuivre', emissionFactor: 3.81, unit: 'kg' },
  { id: -7, name: 'PVC', emissionFactor: 2.73, unit: 'kg' },
  { id: -8, name: 'Plâtre', emissionFactor: 0.12, unit: 'kg' },
  { id: -9, name: 'Terre cuite', emissionFactor: 0.23, unit: 'kg' },
  { id: -10, name: 'Chanvre', emissionFactor: 0.15, unit: 'kg' },
];
