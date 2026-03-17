import { router } from 'expo-router';
import { ChevronRight, Clock3, TrendingUp } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState, PremiumCard, PrimaryButton, ScreenBackground, SectionTitle, SiteMetaRow } from '@/ui';
import { theme } from '@/constants/theme';
import { useAppState } from '@/providers/app-provider';
import { formatDate, formatKg, formatTonnes } from '@/utils/format';

export default function HistoryScreen() {
  const { sites } = useAppState();

  return (
    <ScreenBackground>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} testID="history-scroll">
          <SectionTitle eyebrow="Historique" title="Évolution des diagnostics" />
          <PremiumCard dark testId="history-hero">
            <View style={styles.heroRow}>
              <View style={styles.heroIcon}><TrendingUp color={theme.colors.textOnDark} size={20} /></View>
              <View style={styles.heroTextWrap}>
                <Text style={styles.heroTitle}>Traçabilité des performances</Text>
                <Text style={styles.heroText}>Consultez la chronologie des calculs et observez l’évolution de l’intensité carbone.</Text>
              </View>
            </View>
          </PremiumCard>

          {sites.length === 0 ? (
            <PremiumCard testId="history-empty">
              <EmptyState />
            </PremiumCard>
          ) : (
            <View style={styles.timeline}>
              {sites.map((site, index) => (
                <PremiumCard key={site.id} testId={`history-card-${site.id}`}>
                  <View style={styles.timelineRow}>
                    <View style={styles.timelineRail}>
                      <View style={styles.timelineDot} />
                      {index < sites.length - 1 ? <View style={styles.timelineLine} /> : null}
                    </View>
                    <View style={styles.timelineContent}>
                      <View style={styles.cardTop}>
                        <View>
                          <Text style={styles.siteName}>{site.name}</Text>
                          <SiteMetaRow date={formatDate(site.updatedAt)} location={site.location} />
                        </View>
                        <ChevronRight color={theme.colors.textMuted} size={18} />
                      </View>
                      <View style={styles.kpiRow}>
                        <View style={styles.kpiCard}>
                          <Text style={styles.kpiLabel}>CO₂ total</Text>
                          <Text style={styles.kpiValue}>{formatTonnes(site.metrics.totalTonnesCo2e)}</Text>
                        </View>
                        <View style={styles.kpiCard}>
                          <Text style={styles.kpiLabel}>CO₂ / m²</Text>
                          <Text style={styles.kpiValue}>{formatKg(site.metrics.co2PerM2)}</Text>
                        </View>
                      </View>
                      <View style={styles.historyFooter}>
                        <View style={styles.historyBadge}><Clock3 color={theme.colors.primaryStrong} size={14} /><Text style={styles.historyBadgeText}>{site.input.employees} employés</Text></View>
                        <PrimaryButton label="Ouvrir" onPress={() => router.push(`/site/${site.id}`)} variant="secondary" testId={`history-open-${site.id}`} />
                      </View>
                    </View>
                  </View>
                </PremiumCard>
              ))}
            </View>
          )}
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
  heroRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
  },
  heroIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTextWrap: {
    flex: 1,
    gap: 6,
  },
  heroTitle: {
    color: theme.colors.textOnDark,
    fontSize: 18,
    fontWeight: '800',
  },
  heroText: {
    color: 'rgba(246,243,236,0.74)',
    fontSize: 14,
    lineHeight: 20,
  },
  timeline: {
    gap: 12,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 14,
  },
  timelineRail: {
    width: 22,
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primaryStrong,
    marginTop: 10,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: theme.colors.border,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    gap: 16,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  siteName: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  kpiCard: {
    flex: 1,
    minWidth: 120,
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: 18,
    padding: 14,
    gap: 6,
  },
  kpiLabel: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  kpiValue: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  historyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  historyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  historyBadgeText: {
    color: theme.colors.primaryStrong,
    fontSize: 12,
    fontWeight: '700',
  },
});
