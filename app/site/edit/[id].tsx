import { router, useLocalSearchParams } from 'expo-router';
import { Layers3, Zap } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Accordion, AlertBanner, InputField, PremiumCard, PrimaryButton, ScreenBackground, SectionTitle, SelectField } from '@/ui';
import { theme } from '@/constants/theme';
import { useAppState } from '@/providers/app-provider';
import type { SiteFormValues } from '@/types/site';
import { calculateSiteMetrics, siteRecordToFormValues } from '@/utils/calculations';
import { formatTonnes } from '@/utils/format';

export default function EditSiteScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const { isHydrated, sessionUser, sites, updateSite } = useAppState();
  const site = sites.find((s) => s.id === params.id) ?? null;

  const [form, setForm] = useState<SiteFormValues | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [siteType, setSiteType] = useState('campus');

  const previewMetrics = useMemo(() => (form ? calculateSiteMetrics(form) : null), [form]);

  useEffect(() => {
    if (isHydrated && !sessionUser) {
      router.replace('/login');
    }
  }, [isHydrated, sessionUser]);

  useEffect(() => {
    if (site) {
      setForm(siteRecordToFormValues(site));
    }
  }, [site]);

  const setField = (key: keyof SiteFormValues, value: string) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const setMaterial = (key: keyof SiteFormValues['materials'], value: string) => {
    setForm((prev) =>
      prev
        ? {
            ...prev,
            materials: {
              ...prev.materials,
              [key]: value,
            },
          }
        : prev
    );
  };

  const handleSubmit = async () => {
    if (!form?.name.trim() || !params.id) {
      Alert.alert('Nom requis', 'Ajoutez le nom du site pour enregistrer.');
      return;
    }

    try {
      setIsSubmitting(true);
      await updateSite(params.id, form);
      router.replace(`/site/${params.id}`);
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
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <SectionTitle eyebrow="Modification" title={`Modifier ${site.name}`} />

          <PremiumCard dark testId="preview-card">
            <View style={styles.previewHeader}>
              <View style={styles.previewIcon}><Zap color={theme.colors.textOnDark} size={18} /></View>
              <View style={styles.previewTextWrap}>
                <Text style={styles.previewTitle}>Projection instantanée</Text>
                <Text style={styles.previewText}>Le résultat est estimé en temps réel.</Text>
              </View>
            </View>
            <Text style={styles.previewValue}>{previewMetrics ? formatTonnes(previewMetrics.totalTonnesCo2e) : '—'}</Text>
            <Text style={styles.previewFoot}>
              Construction {previewMetrics ? formatTonnes(previewMetrics.constructionKgCo2e / 1000) : '—'} • Exploitation {previewMetrics ? formatTonnes(previewMetrics.operationKgCo2e / 1000) : '—'}
            </Text>
          </PremiumCard>

          <PremiumCard testId="identity-card">
            <Text style={styles.cardTitle}>Informations du site</Text>
            <AlertBanner title="Bonnes pratiques" description="Renseignez les données annuelles les plus récentes." tone="warning" />
            <View style={styles.formGroup}>
              <SelectField
                label="Type de site"
                value={siteType}
                onChange={setSiteType}
                options={[
                  { label: 'Campus tertiaire', value: 'campus' },
                  { label: 'Site industriel', value: 'industry' },
                  { label: 'Agence locale', value: 'branch' },
                ]}
              />
              <InputField label="Nom du site" value={form.name} onChangeText={(v) => setField('name', v)} placeholder="Capgemini Rennes" testId="site-name-input" />
              <InputField label="Localisation" value={form.location} onChangeText={(v) => setField('location', v)} placeholder="Rennes" testId="site-location-input" />
              <InputField label="Surface totale (m²)" value={form.areaM2} onChangeText={(v) => setField('areaM2', v)} keyboardType="numeric" placeholder="11771" testId="site-area-input" />
              <InputField label="Places de parking" value={form.parkingSpaces} onChangeText={(v) => setField('parkingSpaces', v)} keyboardType="numeric" placeholder="220" testId="site-parking-input" />
              <InputField label="Consommation énergétique annuelle (MWh)" value={form.annualEnergyMwh} onChangeText={(v) => setField('annualEnergyMwh', v)} keyboardType="numeric" placeholder="1840" testId="site-energy-input" />
              <InputField label="Nombre d'employés" value={form.employees} onChangeText={(v) => setField('employees', v)} keyboardType="numeric" placeholder="1800" testId="site-employees-input" />
              <InputField label="Postes de travail" value={form.workstations} onChangeText={(v) => setField('workstations', v)} keyboardType="numeric" placeholder="1037" testId="site-workstations-input" />
            </View>
          </PremiumCard>

          <PremiumCard testId="materials-card">
            <View style={styles.materialsHeader}>
              <View style={styles.materialsIcon}><Layers3 color={theme.colors.primaryStrong} size={18} /></View>
              <Text style={styles.cardTitle}>Matériaux de construction</Text>
            </View>
            <Accordion title="Éditer les quantités" subtitle="Béton, acier, verre, bois" defaultOpen>
              <View style={styles.formGroup}>
                <InputField label="Béton (tonnes)" value={form.materials.concrete} onChangeText={(v) => setMaterial('concrete', v)} keyboardType="numeric" placeholder="6200" testId="material-concrete-input" />
                <InputField label="Acier (tonnes)" value={form.materials.steel} onChangeText={(v) => setMaterial('steel', v)} keyboardType="numeric" placeholder="740" testId="material-steel-input" />
                <InputField label="Verre (tonnes)" value={form.materials.glass} onChangeText={(v) => setMaterial('glass', v)} keyboardType="numeric" placeholder="310" testId="material-glass-input" />
                <InputField label="Bois (tonnes)" value={form.materials.wood} onChangeText={(v) => setMaterial('wood', v)} keyboardType="numeric" placeholder="120" testId="material-wood-input" />
              </View>
            </Accordion>
          </PremiumCard>

          <PrimaryButton label={isSubmitting ? 'Enregistrement…' : 'Enregistrer les modifications'} onPress={() => void handleSubmit()} icon="arrow" testId="save-site-button" />
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
  previewTitle: { color: theme.colors.textOnDark, fontSize: 18, fontWeight: '800' },
  previewText: { color: 'rgba(246,243,236,0.74)', fontSize: 13 },
  previewValue: { color: theme.colors.textOnDark, fontSize: 34, lineHeight: 38, fontWeight: '800', marginBottom: 8 },
  previewFoot: { color: 'rgba(246,243,236,0.74)', fontSize: 13, lineHeight: 20 },
  cardTitle: { color: theme.colors.text, fontSize: 20, fontWeight: '800', marginBottom: 16 },
  formGroup: { gap: 14 },
  materialsHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  materialsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
});
