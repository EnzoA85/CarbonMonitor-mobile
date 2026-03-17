import { router } from 'expo-router';
import { BarChart3, ShieldCheck } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Accordion,
  AlertBanner,
  AppBadgeRow,
  EmptyState,
  MetricCard,
  PremiumCard,
  PrimaryButton,
  ScreenBackground,
  SectionTitle,
  SimpleBarChart,
  SiteMetaRow,
} from '@/ui';
import { theme } from '@/constants/theme';
import { useAppState } from '@/providers/app-provider';
import { formatDate, formatKg, formatTonnes } from '@/utils/format';

export default function HomeScreen() {
  const { latestSite, sessionUser, totals } = useAppState();

  const constructionKg = totals.totalConstructionKg;
  const operationKg = totals.totalOperationKg;
  const chartSegments = [
    { label: 'Construction', value: constructionKg, color: theme.colors.chartA },
    { label: 'Exploitation', value: operationKg, color: theme.colors.chartB },
  ];

  return (
    <ScreenBackground>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} testID="home-scroll">
          <View style={styles.header}>
            <View style={styles.headerTextWrap}>
              <Text style={styles.eyebrow}>Accueil</Text>
              <Text style={styles.title}>Tableau de bord carbone</Text>
              <Text style={styles.subtitle}>
                Vue d’ensemble des KPI, répartition construction/exploitation et dernier diagnostic.
              </Text>
            </View>
          </View>

          <AppBadgeRow />

          <PremiumCard dark testId="hero-card">
            <View style={styles.heroTopRow}>
              <View style={styles.heroIdentity}>
                <View style={styles.heroIcon}><ShieldCheck color={theme.colors.textOnDark} size={20} /></View>
                <View>
                  <Text style={styles.heroLabel}>Session active</Text>
                  <Text style={styles.heroValue}>{sessionUser?.organization || sessionUser?.email || '—'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.metricRow}>
              <MetricCard
                dark
                detail="Volume consolidé de tous les diagnostics"
                label="CO₂ total"
                testId="metric-total"
                value={formatTonnes(totals.totalKg / 1000)}
              />
              <MetricCard
                dark
                detail="Construction cumulée"
                label="Construction"
                testId="metric-construction"
                value={formatTonnes(totals.totalConstructionKg / 1000)}
              />
            </View>

            <View style={styles.chartSection}>
              <View style={styles.chartHeader}>
                <BarChart3 color="rgba(246,243,236,0.9)" size={18} />
                <Text style={styles.chartTitle}>Répartition des émissions</Text>
              </View>
              <SimpleBarChart segments={chartSegments} />
            </View>
          </PremiumCard>

          <SectionTitle eyebrow="Dernier diagnostic" title="Indicateurs clés" actionLabel="Voir les sites" href="/sites" />

          <AlertBanner
            title="Conseil du jour"
            description="Commencez par les sites à forte consommation énergétique pour obtenir les gains les plus rapides."
            tone="info"
          />

          {latestSite ? (
            <PremiumCard testId="latest-site-card">
              <View style={styles.latestHeader}>
                <View>
                  <Text style={styles.siteName}>{latestSite.name}</Text>
                  <SiteMetaRow date={formatDate(latestSite.updatedAt)} location={latestSite.location} />
                </View>
                <PrimaryButton label="Voir" onPress={() => router.push(`/site/${latestSite.id}` as const)} variant="secondary" testId="latest-site-open" />
              </View>

              <View style={styles.metricRow}>
                <MetricCard
                  detail="Empreinte globale calculée"
                  label="Total"
                  testId="latest-total"
                  value={formatTonnes(latestSite.metrics.totalTonnesCo2e)}
                />
                <MetricCard
                  detail="Intensité surfacique"
                  label="CO₂ / m²"
                  testId="latest-co2-m2"
                  value={formatKg(latestSite.metrics.co2PerM2)}
                />
              </View>
              <View style={styles.metricRow}>
                <MetricCard
                  detail="Intensité par collaborateur"
                  label="CO₂ / employé"
                  testId="latest-co2-employee"
                  value={formatKg(latestSite.metrics.co2PerEmployee)}
                />
                <MetricCard
                  detail="Répartition exploitation"
                  label="Exploitation"
                  testId="latest-operation"
                  value={formatTonnes(latestSite.metrics.operationKgCo2e / 1000)}
                />
              </View>
            </PremiumCard>
          ) : (
            <PremiumCard testId="empty-latest">
              <EmptyState />
            </PremiumCard>
          )}

          <Accordion
            title="Méthodologie de calcul"
            subtitle="Résumé des indicateurs affichés"
          >
            <Text style={styles.helpText}>CO₂ total = construction + exploitation</Text>
            <Text style={styles.helpText}>Construction = Σ (quantité matériau × facteur émission Base Carbone®)</Text>
            <Text style={styles.helpText}>Exploitation = énergie + parking + employés + postes de travail + surface</Text>
            <Text style={styles.helpText}>CO₂ / m² = CO₂ total ÷ surface du site (m²) — intensité surfacique</Text>
            <Text style={styles.helpText}>CO₂ / employé = CO₂ total ÷ nombre employés — intensité humaine pour comparer les sites</Text>
            <Text style={styles.helpText}>CO₂ / poste de travail = CO₂ total ÷ nombre de postes de travail</Text>
          </Accordion>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: {
    padding: 20,
    gap: 18,
    paddingBottom: 120,
  },
  header: { gap: 14 },
  headerTextWrap: { gap: 8 },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
  },
  title: {
    color: theme.colors.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 340,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  heroIdentity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroLabel: {
    color: 'rgba(246,243,236,0.72)',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroValue: {
    color: theme.colors.textOnDark,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 2,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  chartSection: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    gap: 12,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chartTitle: {
    color: 'rgba(246,243,236,0.9)',
    fontSize: 14,
    fontWeight: '700',
  },
  latestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 18,
  },
  siteName: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  helpText: {
    color: theme.colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
});
