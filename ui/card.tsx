import { router, type Href } from 'expo-router';
import { Building2, Factory, History, Leaf, MapPin, PieChart } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

export function PremiumCard({ children, dark = false, testId }: { children: React.ReactNode; dark?: boolean; testId: string }) {
  return <View style={[styles.card, dark ? styles.cardDark : undefined]} testID={testId}>{children}</View>;
}

export function MetricCard({
  label,
  value,
  detail,
  dark = false,
  testId,
}: {
  label: string;
  value: string;
  detail: string;
  dark?: boolean;
  testId: string;
}) {
  return (
    <View style={[styles.metricCard, dark ? styles.metricCardDark : undefined]} testID={testId}>
      <Text style={[styles.metricLabel, dark ? styles.metricLabelDark : undefined]}>{label}</Text>
      <Text style={[styles.metricValue, dark ? styles.metricValueDark : undefined]}>{value}</Text>
      <Text style={[styles.metricDetail, dark ? styles.metricDetailDark : undefined]}>{detail}</Text>
    </View>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  actionLabel,
  href,
}: {
  eyebrow: string;
  title: string;
  actionLabel?: string;
  href?: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionWrap}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      {actionLabel && href ? (
        <Pressable onPress={() => router.push(href as Href)} testID={`link-${actionLabel}`}>
          <Text style={styles.link}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function SiteMetaRow({ location, date }: { location: string; date: string }) {
  return (
    <View style={styles.metaRow}>
      <View style={styles.metaItem}>
        <MapPin color={theme.colors.textMuted} size={14} />
        <Text style={styles.metaText} numberOfLines={1} ellipsizeMode="tail">{location}</Text>
      </View>
      <View style={styles.metaItem}>
        <History color={theme.colors.textMuted} size={14} />
        <Text style={styles.metaText}>{date}</Text>
      </View>
    </View>
  );
}

export function AppBadgeRow() {
  return (
    <View style={styles.badgeRow}>
      <View style={styles.badge}><Building2 color={theme.colors.primaryStrong} size={16} /><Text style={styles.badgeText}>Sites</Text></View>
      <View style={styles.badge}><Leaf color={theme.colors.primaryStrong} size={16} /><Text style={styles.badgeText}>ADEME</Text></View>
      <View style={styles.badge}><Factory color={theme.colors.primaryStrong} size={16} /><Text style={styles.badgeText}>Exploitation</Text></View>
    </View>
  );
}

export function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <PieChart color={theme.colors.primaryStrong} size={24} />
      <Text style={styles.emptyTitle}>Aucun diagnostic disponible</Text>
      <Text style={styles.emptyText}>Créez un premier site pour démarrer votre suivi carbone.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(216,209,197,0.9)',
    shadowColor: '#0f271e',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  cardDark: {
    backgroundColor: theme.colors.card,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  metricCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: 18,
    padding: 14,
    gap: 8,
  },
  metricCardDark: {
    backgroundColor: theme.colors.cardSecondary,
  },
  metricLabel: {
    color: theme.colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  metricLabelDark: {
    color: 'rgba(246,243,236,0.75)',
  },
  metricValue: {
    color: theme.colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  metricValueDark: {
    color: theme.colors.textOnDark,
  },
  metricDetail: {
    color: theme.colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  metricDetailDark: {
    color: 'rgba(246,243,236,0.75)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 16,
  },
  sectionWrap: {
    gap: 4,
    flex: 1,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '700',
  },
  title: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  link: {
    color: theme.colors.primaryStrong,
    fontSize: 14,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'column',
    gap: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,253,248,0.9)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(216,209,197,0.9)',
  },
  badgeText: {
    color: theme.colors.primaryStrong,
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  emptyText: {
    color: theme.colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
