import { router } from 'expo-router';
import { Layers3, Zap } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Accordion, AlertBanner, InputField, PremiumCard, PrimaryButton, ScreenBackground, SectionTitle, SelectField } from '@/ui';
import { theme } from '@/constants/theme';
import { useAppState } from '@/providers/app-provider';
import type { SiteFormValues } from '@/types/site';
import { calculateSiteMetrics, getDefaultSiteValues } from '@/utils/calculations';
import { formatTonnes } from '@/utils/format';

export default function NewSiteScreen() {
  const { createSite, isHydrated, sessionUser } = useAppState();
  const [form, setForm] = useState<SiteFormValues>(getDefaultSiteValues());
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [siteType, setSiteType] = useState<string>('campus');

  const previewMetrics = useMemo(() => calculateSiteMetrics(form), [form]);

  useEffect(() => {
    if (isHydrated && !sessionUser) {
      router.replace('/login');
    }
  }, [isHydrated, sessionUser]);

  const setField = (key: keyof SiteFormValues, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const setMaterial = (key: keyof SiteFormValues['materials'], value: string) => {
    setForm((current) => ({
      ...current,
      materials: {
        ...current.materials,
        [key]: value,
      },
    }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      Alert.alert('Nom requis', 'Ajoutez le nom du site pour enregistrer le diagnostic.');
      return;
    }

    try {
      setIsSubmitting(true);
      const site = await createSite(form);
      router.replace(`/site/${site.id}`);
    } catch (error) {
      console.log('[NewSiteScreen] Site creation failed', error);
      Alert.alert('Enregistrement impossible', 'Le diagnostic n’a pas pu être sauvegardé.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenBackground>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} testID="new-site-scroll">
          <SectionTitle eyebrow="Saisie terrain" title="Nouveau diagnostic carbone" />

          <PremiumCard dark testId="preview-card">
            <View style={styles.previewHeader}>
              <View style={styles.previewIcon}><Zap color={theme.colors.textOnDark} size={18} /></View>
              <View style={styles.previewTextWrap}>
                <Text style={styles.previewTitle}>Projection instantanée</Text>
                <Text style={styles.previewText}>Le résultat est estimé en temps réel pendant la saisie.</Text>
              </View>
            </View>
            <Text style={styles.previewValue}>{formatTonnes(previewMetrics.totalTonnesCo2e)}</Text>
            <Text style={styles.previewFoot}>Construction {formatTonnes(previewMetrics.constructionKgCo2e / 1000)} • Exploitation {formatTonnes(previewMetrics.operationKgCo2e / 1000)}</Text>
          </PremiumCard>

          <PremiumCard testId="identity-card">
            <Text style={styles.cardTitle}>Informations du site</Text>
            <AlertBanner title="Bonnes pratiques" description="Renseignez les données annuelles les plus récentes pour obtenir des KPI fiables." tone="warning" />
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
              <InputField label="Nom du site" value={form.name} onChangeText={(value) => setField('name', value)} placeholder="Capgemini Rennes" testId="site-name-input" />
              <InputField label="Localisation" value={form.location} onChangeText={(value) => setField('location', value)} placeholder="Rennes" testId="site-location-input" />
              <InputField label="Surface totale (m²)" value={form.areaM2} onChangeText={(value) => setField('areaM2', value)} keyboardType="numeric" placeholder="11771" testId="site-area-input" />
              <InputField label="Places de parking" value={form.parkingSpaces} onChangeText={(value) => setField('parkingSpaces', value)} keyboardType="numeric" placeholder="220" testId="site-parking-input" />
              <InputField label="Consommation énergétique annuelle (MWh)" value={form.annualEnergyMwh} onChangeText={(value) => setField('annualEnergyMwh', value)} keyboardType="numeric" placeholder="1840" testId="site-energy-input" />
              <InputField label="Nombre d’employés" value={form.employees} onChangeText={(value) => setField('employees', value)} keyboardType="numeric" placeholder="1800" testId="site-employees-input" />
              <InputField label="Postes de travail" value={form.workstations} onChangeText={(value) => setField('workstations', value)} keyboardType="numeric" placeholder="1037" testId="site-workstations-input" />
            </View>
          </PremiumCard>

          <PremiumCard testId="materials-card">
            <View style={styles.materialsHeader}>
              <View style={styles.materialsIcon}><Layers3 color={theme.colors.primaryStrong} size={18} /></View>
              <Text style={styles.cardTitle}>Matériaux de construction</Text>
            </View>
            <Accordion title="Éditer les quantités" subtitle="Béton, acier, verre, bois" defaultOpen>
              <View style={styles.formGroup}>
                <InputField label="Béton (tonnes)" value={form.materials.concrete} onChangeText={(value) => setMaterial('concrete', value)} keyboardType="numeric" placeholder="6200" testId="material-concrete-input" />
                <InputField label="Acier (tonnes)" value={form.materials.steel} onChangeText={(value) => setMaterial('steel', value)} keyboardType="numeric" placeholder="740" testId="material-steel-input" />
                <InputField label="Verre (tonnes)" value={form.materials.glass} onChangeText={(value) => setMaterial('glass', value)} keyboardType="numeric" placeholder="310" testId="material-glass-input" />
                <InputField label="Bois (tonnes)" value={form.materials.wood} onChangeText={(value) => setMaterial('wood', value)} keyboardType="numeric" placeholder="120" testId="material-wood-input" />
              </View>
            </Accordion>
          </PremiumCard>

          <PrimaryButton label={isSubmitting ? 'Enregistrement…' : 'Calculer et enregistrer'} onPress={() => void handleSubmit()} icon="arrow" testId="save-site-button" />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
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
  previewTextWrap: {
    flex: 1,
    gap: 4,
  },
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
  cardTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
  },
  formGroup: {
    gap: 14,
  },
  materialsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  materialsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
}
);