import { router } from 'expo-router';
import { BarChart3, Building2, ChevronRight, ShieldCheck } from 'lucide-react-native';
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
  SiteMetaRow,
} from '@/ui';
import { theme } from '@/constants/theme';
import { useAppState } from '@/providers/app-provider';
import { formatDate, formatKg, formatTonnes } from '@/utils/format';

export default function DashboardScreen() {
  const { latestSite, sessionUser, sites, totals } = useAppState();

  return (
    <ScreenBackground>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} testID="dashboard-scroll">
          <View style={styles.header}>
            <View style={styles.headerTextWrap}>
              <Text style={styles.eyebrow}>Pilotage carbone</Text>
              <Text style={styles.title}>Tableau de bord environnemental</Text>
              <Text style={styles.subtitle}>
                Visualisez l’empreinte CO2 de vos sites, identifiez les leviers et priorisez vos actions de réduction.
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
                  <Text style={styles.heroValue}>{sessionUser?.organization ?? 'Mode démo'}</Text>
                </View>
              </View>
              <View style={styles.heroPill}>
                <Text style={styles.heroPillText}>JWT sécurisé</Text>
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
          </PremiumCard>

          <SectionTitle eyebrow="Dernier diagnostic" title="Indicateurs clés" actionLabel="Nouveau" href="/site/new" />

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
                <PrimaryButton label="Voir" onPress={() => router.push(`/site/${latestSite.id}`)} variant="secondary" testId="latest-site-open" />
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

          <SectionTitle eyebrow="Portefeuille" title="Sites enregistrés" actionLabel="Historique" href="/history" />

          <View style={styles.listWrap}>
            {sites.map((site) => (
              <PremiumCard key={site.id} testId={`site-card-${site.id}`}>
                <View style={styles.listCardTop}>
                  <View style={styles.listIcon}><Building2 color={theme.colors.primaryStrong} size={18} /></View>
                  <View style={styles.listCardBody}>
                    <Text style={styles.listTitle}>{site.name}</Text>
                    <Text style={styles.listSubtitle}>{formatTonnes(site.metrics.totalTonnesCo2e)} • {site.input.areaM2} m²</Text>
                  </View>
                  <ChevronRight color={theme.colors.textMuted} size={18} />
                </View>
                <View style={styles.listActions}>
                  <PrimaryButton label="Consulter" onPress={() => router.push(`/site/${site.id}`)} variant="secondary" testId={`open-site-${site.id}`} />
                </View>
              </PremiumCard>
            ))}
          </View>

          <PremiumCard testId="cta-card">
            <View style={styles.ctaRow}>
              <View style={styles.ctaIcon}><BarChart3 color={theme.colors.textOnDark} size={20} /></View>
              <View style={styles.ctaTextWrap}>
                <Text style={styles.ctaTitle}>Créer un nouveau diagnostic terrain</Text>
                <Text style={styles.ctaText}>Ajoutez un site, renseignez ses consommations et visualisez les KPI immédiatement.</Text>
              </View>
            </View>
            <PrimaryButton label="Ajouter un site" onPress={() => router.push('/site/new')} icon="plus" testId="new-site-button" />
          </PremiumCard>

          <Accordion
            title="Méthodologie de calcul"
            subtitle="Résumé des indicateurs affichés"
          >
            <Text style={styles.helpText}>CO2 total = construction + exploitation.</Text>
            <Text style={styles.helpText}>CO2 / m2 = intensité surfacique du site.</Text>
            <Text style={styles.helpText}>CO2 / employé = intensité humaine pour comparer les sites.</Text>
          </Accordion>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 18,
    paddingBottom: 120,
  },
  header: {
    gap: 14,
  },
  headerTextWrap: {
    gap: 8,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.3,
    textTransform: 'uppercase',
  },
  title: {
    color: theme.colors.text,
    fontSize: 32,
    lineHeight: 38,
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
  heroPill: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  heroPillText: {
    color: theme.colors.textOnDark,
    fontSize: 12,
    fontWeight: '700',
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
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
  listWrap: {
    gap: 12,
  },
  listCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  listIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listCardBody: {
    flex: 1,
    gap: 4,
  },
  listTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  listSubtitle: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  listActions: {
    marginTop: 16,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 18,
  },
  ctaIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primaryStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaTextWrap: {
    flex: 1,
    gap: 6,
  },
  ctaTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  ctaText: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  helpText: {
    color: theme.colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
});
