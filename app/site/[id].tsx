import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Building2, Factory, HardHat, Ruler, Users } from 'lucide-react-native';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { MetricCard, PremiumCard, ScreenBackground, SectionTitle, SiteMetaRow } from '@/ui';
import { theme } from '@/constants/theme';
import { useAppState } from '@/providers/app-provider';
import { formatDate, formatKg, formatTonnes } from '@/utils/format';

export default function SiteDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const { isHydrated, sessionUser, sites } = useAppState();

  const site = sites.find((item) => item.id === params.id) ?? null;

  useEffect(() => {
    if (isHydrated && !sessionUser) {
      router.replace('/login');
    }
  }, [isHydrated, sessionUser]);

  if (!site) {
    return (
      <ScreenBackground>
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyTitle}>Site introuvable</Text>
          <Text style={styles.emptyText}>Le diagnostic demandé n’existe pas ou n’est plus disponible.</Text>
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <Stack.Screen options={{ title: site.name }} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} testID="site-detail-scroll">
        <SectionTitle eyebrow="Analyse détaillée" title={site.name} />

        <PremiumCard dark testId="site-detail-hero">
          <Text style={styles.heroValue}>{formatTonnes(site.metrics.totalTonnesCo2e)}</Text>
          <Text style={styles.heroText}>Vue consolidée des émissions du site sur la base des données de construction et d’exploitation.</Text>
          <SiteMetaRow date={formatDate(site.updatedAt)} location={site.location} />
        </PremiumCard>

        <View style={styles.metricRow}>
          <MetricCard label="CO₂ / m²" value={formatKg(site.metrics.co2PerM2)} detail="Intensité par surface" testId="detail-co2-m2" />
          <MetricCard label="CO₂ / employé" value={formatKg(site.metrics.co2PerEmployee)} detail="Intensité par collaborateur" testId="detail-co2-employee" />
        </View>

        <View style={styles.metricRow}>
          <MetricCard label="Construction" value={formatTonnes(site.metrics.constructionKgCo2e / 1000)} detail="Matériaux et structure" testId="detail-construction" />
          <MetricCard label="Exploitation" value={formatTonnes(site.metrics.operationKgCo2e / 1000)} detail="Énergie, usage, parking" testId="detail-operation" />
        </View>

        <PremiumCard testId="site-data-card">
          <Text style={styles.cardTitle}>Données d’entrée</Text>
          <View style={styles.dataGrid}>
            <View style={styles.dataItem}><Ruler color={theme.colors.primaryStrong} size={18} /><Text style={styles.dataLabel}>Surface</Text><Text style={styles.dataValue}>{site.input.areaM2} m²</Text></View>
            <View style={styles.dataItem}><Users color={theme.colors.primaryStrong} size={18} /><Text style={styles.dataLabel}>Employés</Text><Text style={styles.dataValue}>{site.input.employees}</Text></View>
            <View style={styles.dataItem}><Factory color={theme.colors.primaryStrong} size={18} /><Text style={styles.dataLabel}>Énergie</Text><Text style={styles.dataValue}>{site.input.annualEnergyMwh} MWh/an</Text></View>
            <View style={styles.dataItem}><Building2 color={theme.colors.primaryStrong} size={18} /><Text style={styles.dataLabel}>Parking</Text><Text style={styles.dataValue}>{site.input.parkingSpaces} places</Text></View>
          </View>
        </PremiumCard>

        <PremiumCard testId="materials-detail-card">
          <View style={styles.materialHeader}><HardHat color={theme.colors.primaryStrong} size={18} /><Text style={styles.cardTitle}>Répartition matériaux</Text></View>
          <View style={styles.materialList}>
            <View style={styles.materialRow}><Text style={styles.materialLabel}>Béton</Text><Text style={styles.materialValue}>{site.input.materials.concrete} t</Text></View>
            <View style={styles.materialRow}><Text style={styles.materialLabel}>Acier</Text><Text style={styles.materialValue}>{site.input.materials.steel} t</Text></View>
            <View style={styles.materialRow}><Text style={styles.materialLabel}>Verre</Text><Text style={styles.materialValue}>{site.input.materials.glass} t</Text></View>
            <View style={styles.materialRow}><Text style={styles.materialLabel}>Bois</Text><Text style={styles.materialValue}>{site.input.materials.wood} t</Text></View>
          </View>
        </PremiumCard>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    gap: 18,
    paddingBottom: 120,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 10,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  heroValue: {
    color: theme.colors.textOnDark,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '800',
    marginBottom: 8,
  },
  heroText: {
    color: 'rgba(246,243,236,0.74)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 14,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  cardTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 16,
  },
  dataGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  dataItem: {
    width: '47%',
    minWidth: 140,
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: 18,
    padding: 14,
    gap: 8,
  },
  dataLabel: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  dataValue: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  materialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  materialList: {
    gap: 12,
  },
  materialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  materialLabel: {
    color: theme.colors.textMuted,
    fontSize: 15,
    fontWeight: '700',
  },
  materialValue: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
});
