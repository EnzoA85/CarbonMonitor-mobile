import { router, useLocalSearchParams } from 'expo-router';
import { Building2, Zap } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';
import { genMaterialId, MaterialsSection, useMaterialCatalog } from '@/components/site-materials-form';
import { useAppState } from '@/providers/app-provider';
import { type MaterialFormEntry, type NewSiteFormValues } from '@/types/site';
import { calculateNewSiteMetrics, siteRecordToNewSiteFormValues } from '@/utils/calculations';
import { formatTonnes } from '@/utils/format';
import { AlertBanner, InputField, PremiumCard, PrimaryButton, ScreenBackground, SectionTitle } from '@/ui';

export default function EditSiteScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const { isHydrated, sessionUser, sites, updateSiteFromNewForm } = useAppState();
  const site = sites.find((s) => s.id === params.id) ?? null;

  const [form, setForm] = useState<NewSiteFormValues | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { availableMaterials, materialOptions } = useMaterialCatalog(sessionUser?.token);

  useEffect(() => {
    if (isHydrated && !sessionUser) {
      router.replace('/login');
    }
  }, [isHydrated, sessionUser]);

  useEffect(() => {
    if (site) {
      setForm(siteRecordToNewSiteFormValues(site));
    }
  }, [site]);

  const previewMetrics = useMemo(
    () => (form ? calculateNewSiteMetrics(form, availableMaterials) : null),
    [form, availableMaterials]
  );

  const setField = useCallback((key: keyof NewSiteFormValues, value: string) => {
    setForm((c) => (c ? { ...c, [key]: value } : c));
  }, []);

  const setMaterialEntry = useCallback(
    (entryId: string, field: keyof MaterialFormEntry, value: string) => {
      setForm((c) =>
        c
          ? {
              ...c,
              materials: c.materials.map((e) =>
                e.id === entryId ? { ...e, [field]: value } : e
              ),
            }
          : c
      );
    },
    []
  );

  const addMaterial = useCallback(() => {
    setForm((c) =>
      c ? { ...c, materials: [...c.materials, { id: genMaterialId(), materialId: '', quantityKg: '' }] } : c
    );
  }, []);

  const removeMaterial = useCallback((entryId: string) => {
    setForm((c) =>
      c ? { ...c, materials: c.materials.filter((e) => e.id !== entryId) } : c
    );
  }, []);

  const handleSubmit = async () => {
    if (!form?.name.trim() || !params.id) {
      Alert.alert('Nom requis', 'Ajoutez le nom du site pour enregistrer.');
      return;
    }
    try {
      setIsSubmitting(true);
      await updateSiteFromNewForm(params.id, form);
      router.replace('/sites');
    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible de mettre à jour le site.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!site || !form) {
    return null;
  }

  return (
    <ScreenBackground>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} testID="edit-site-scroll">
          <SectionTitle eyebrow="Modification" title={`Modifier ${site.name}`} />

          <PremiumCard dark testId="preview-card">
            <View style={styles.previewHeader}>
              <View style={styles.previewIcon}>
                <Zap color={theme.colors.textOnDark} size={18} />
              </View>
              <View style={styles.previewTextWrap}>
                <Text style={styles.previewTitle}>Projection instantanée</Text>
                <Text style={styles.previewText}>Le résultat est estimé en temps réel.</Text>
              </View>
            </View>
            <Text style={styles.previewValue}>
              {previewMetrics ? formatTonnes(previewMetrics.totalTonnesCo2e) : '—'}
            </Text>
            <Text style={styles.previewFoot}>
              Construction {previewMetrics ? formatTonnes(previewMetrics.constructionKgCo2e / 1000) : '—'} • Exploitation{' '}
              {previewMetrics ? formatTonnes(previewMetrics.operationKgCo2e / 1000) : '—'}
            </Text>
          </PremiumCard>

          <PremiumCard testId="general-card">
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Building2 color={theme.colors.primaryStrong} size={18} />
              </View>
              <Text style={styles.cardTitle}>Informations générales</Text>
            </View>
            <AlertBanner
              title="Bonnes pratiques"
              description="Renseignez les données annuelles les plus récentes pour obtenir des KPI fiables."
              tone="warning"
            />
            <View style={styles.formGroup}>
              <InputField
                label="Nom du site *"
                value={form.name}
                onChangeText={(v) => setField('name', v)}
                placeholder="Ex. Mon site"
                testId="site-name-input"
              />
              <InputField
                label="Adresse"
                value={form.address}
                onChangeText={(v) => setField('address', v)}
                placeholder="Ex. 123 rue de la Paix"
                testId="site-address-input"
              />
              <View style={styles.row}>
                <View style={styles.half}>
                  <InputField
                    label="Code postal"
                    value={form.postalCode}
                    onChangeText={(v) => setField('postalCode', v)}
                    keyboardType="numeric"
                    placeholder="35000"
                    testId="site-postal-code-input"
                  />
                </View>
                <View style={styles.half}>
                  <InputField
                    label="Ville"
                    value={form.city}
                    onChangeText={(v) => setField('city', v)}
                    placeholder="Ex. Rennes"
                    testId="site-city-input"
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.half}>
                  <InputField
                    label="Surface (m²) *"
                    value={form.surfaceM2}
                    onChangeText={(v) => setField('surfaceM2', v)}
                    keyboardType="numeric"
                    placeholder="11771"
                    testId="site-surface-input"
                  />
                </View>
                <View style={styles.half}>
                  <InputField
                    label="Postes de travail"
                    value={form.workstations}
                    onChangeText={(v) => setField('workstations', v)}
                    keyboardType="numeric"
                    placeholder="1037"
                    testId="site-workstations-input"
                  />
                </View>
              </View>
            </View>
          </PremiumCard>

          <PremiumCard testId="energy-card">
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIcon}>
                <Zap color={theme.colors.primaryStrong} size={18} />
              </View>
              <Text style={styles.cardTitle}>Énergie & Transport</Text>
            </View>
            <View style={styles.formGroup}>
              <InputField
                label="Conso. énergétique (kWh/an) *"
                value={form.energyKwhAn}
                onChangeText={(v) => setField('energyKwhAn', v)}
                keyboardType="numeric"
                placeholder="1840000"
                testId="site-energy-input"
              />
              <View style={styles.row}>
                <View style={styles.half}>
                  <InputField
                    label="Places de parking *"
                    value={form.parkingSpaces}
                    onChangeText={(v) => setField('parkingSpaces', v)}
                    keyboardType="numeric"
                    placeholder="200"
                    testId="site-parking-input"
                  />
                </View>
                <View style={styles.half}>
                  <InputField
                    label="Employés *"
                    value={form.employees}
                    onChangeText={(v) => setField('employees', v)}
                    keyboardType="numeric"
                    placeholder="1800"
                    testId="site-employees-input"
                  />
                </View>
              </View>
            </View>
          </PremiumCard>

          <PremiumCard testId="materials-card">
            <MaterialsSection
              materials={form.materials}
              materialOptions={materialOptions}
              onMaterialEntryChange={setMaterialEntry}
              onAddMaterial={addMaterial}
              onRemoveMaterial={removeMaterial}
            />
          </PremiumCard>

          <PrimaryButton
            label={isSubmitting ? 'Enregistrement…' : 'Enregistrer les modifications'}
            onPress={() => void handleSubmit()}
            icon="arrow"
            testId="save-site-button"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    padding: 20,
    gap: 18,
    paddingBottom: 120,
  },
  previewHeader: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    marginBottom: 18,
  },
  previewIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewTextWrap: { flex: 1, gap: 4 },
  previewTitle: {
    color: theme.colors.textOnDark,
    fontSize: 18,
    fontWeight: '800',
  },
  previewText: {
    color: 'rgba(246,243,236,0.74)',
    fontSize: 13,
  },
  previewValue: {
    color: theme.colors.textOnDark,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '800',
    marginBottom: 8,
  },
  previewFoot: {
    color: 'rgba(246,243,236,0.74)',
    fontSize: 13,
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
});
