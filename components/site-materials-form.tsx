/**
 * Composants et logique partagés pour la sélection des matériaux
 * (pages site/new et site/edit - même liste et même fonctionnement)
 */
import { Layers3, Plus, Trash2 } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { FALLBACK_MATERIALS } from '@/constants/base-carbone-materials';
import { theme } from '@/constants/theme';
import * as api from '@/services/api';
import { type MaterialFormEntry } from '@/types/site';
import { InputField, SelectField } from '@/ui';

export function useMaterialCatalog(token: string | undefined) {
  const [materials, setMaterials] = useState<api.MaterialApiResponse[]>([]);

  useEffect(() => {
    if (!token) return;
    api.listMaterials(token).then(setMaterials).catch(() => setMaterials([]));
  }, [token]);

  const availableMaterials = materials.length > 0 ? materials : FALLBACK_MATERIALS;

  const materialById = useMemo(() => {
    return new Map(availableMaterials.map((m) => [String(m.id), m]));
  }, [availableMaterials]);

  const materialOptions = useMemo(
    () => [
      ...availableMaterials.map((m) => ({
        label: `${m.name} (${m.emissionFactor.toFixed(3)} kgCO₂e/${m.unit || 'kg'})`,
        value: String(m.id),
      })),
    ],
    [availableMaterials]
  );

  return { availableMaterials, materialOptions, materialById };
}

export function genMaterialId() {
  return `m-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export interface MaterialRowProps {
  entry: MaterialFormEntry;
  options: { label: string; value: string }[];
  materialById: Map<string, api.MaterialApiResponse>;
  onMaterialChange: (v: string) => void;
  onQuantityChange: (v: string) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function MaterialRow({
  entry,
  options,
  materialById,
  onMaterialChange,
  onQuantityChange,
  onRemove,
  canRemove,
}: MaterialRowProps) {
  const selected = entry.materialId ? materialById.get(entry.materialId) : undefined;
  const quantityUnit = selected?.unit || 'kg';

  return (
    <View style={styles.materialRow}>
      <View style={styles.materialRowFields}>
        <View style={styles.materialSelect}>
          <SelectField
            label="Matériau"
            value={entry.materialId}
            options={options}
            onChange={onMaterialChange}
            placeholder="Sélectionner"
            searchable
            maxVisibleOptions={5}
          />
        </View>
        <View style={styles.materialQty}>
          <InputField
            label={`Quantité (${quantityUnit})`}
            value={entry.quantityKg}
            onChangeText={onQuantityChange}
            keyboardType="numeric"
            placeholder="500000"
            testId={`material-qty-${entry.id}`}
          />
        </View>
      </View>
      {canRemove && (
        <Pressable style={styles.removeBtn} onPress={onRemove}>
          <Trash2 color={theme.colors.textMuted} size={18} />
        </Pressable>
      )}
    </View>
  );
}

export interface MaterialsSectionProps {
  materials: MaterialFormEntry[];
  materialOptions: { label: string; value: string }[];
  materialById: Map<string, api.MaterialApiResponse>;
  onMaterialEntryChange: (entryId: string, field: keyof MaterialFormEntry, value: string) => void;
  onAddMaterial: () => void;
  onRemoveMaterial: (entryId: string) => void;
}

export function MaterialsSection({
  materials,
  materialOptions,
  materialById,
  onMaterialEntryChange,
  onAddMaterial,
  onRemoveMaterial,
}: MaterialsSectionProps) {
  return (
    <>
      <View style={styles.materialsHeader}>
        <View style={[styles.sectionHeader, styles.materialsTitleWrap]}>
          <View style={styles.sectionIcon}>
            <Layers3 color={theme.colors.primaryStrong} size={18} />
          </View>
          <Text style={styles.cardTitle}>Matériaux de construction</Text>
        </View>
        <Pressable style={styles.addBtn} onPress={onAddMaterial} testID="add-material-button">
          <Plus color={theme.colors.primaryStrong} size={18} />
          <Text style={styles.addBtnText}>Ajouter</Text>
        </Pressable>
      </View>
      <View style={styles.formGroup}>
        {materials.map((entry) => (
          <MaterialRow
            key={entry.id}
            entry={entry}
            options={materialOptions}
            materialById={materialById}
            onMaterialChange={(v) => onMaterialEntryChange(entry.id, 'materialId', v)}
            onQuantityChange={(v) => onMaterialEntryChange(entry.id, 'quantityKg', v)}
            onRemove={() => onRemoveMaterial(entry.id)}
            canRemove={materials.length > 1}
          />
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  materialsTitleWrap: {
    flex: 1,
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
  },
  formGroup: { gap: 14 },
  materialsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 8,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: theme.colors.surfaceMuted,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  addBtnText: {
    color: theme.colors.primaryStrong,
    fontSize: 14,
    fontWeight: '700',
  },
  materialRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flexWrap: 'wrap',
  },
  customMaterialFields: {
    width: '100%',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: 12,
  },
  baseCarboneHint: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  materialRowFields: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  materialSelect: { flex: 1 },
  materialQty: { flex: 1 },
  removeBtn: {
    padding: 12,
    marginTop: 24,
  },
});
