import { LinearGradient } from 'expo-linear-gradient';
import { router, type Href } from 'expo-router';
import { ArrowRight, Building2, Factory, History, Leaf, MapPin, PieChart, Plus } from 'lucide-react-native';
import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { theme } from '@/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: 'arrow' | 'plus';
  testId: string;
}

export const ScreenBackground = memo(function ScreenBackground({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.screen}>
      <LinearGradient colors={[theme.colors.backgroundStrong, theme.colors.background]} style={styles.gradient} />
      <View style={styles.patternA} />
      <View style={styles.patternB} />
      {children}
    </View>
  );
});

export const PrimaryButton = memo(function PrimaryButton({ label, onPress, variant = 'primary', icon, testId }: ButtonProps) {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.buttonPrimary : undefined,
        isSecondary ? styles.buttonSecondary : undefined,
        variant === 'ghost' ? styles.buttonGhost : undefined,
        pressed ? styles.buttonPressed : undefined,
      ]}
      testID={testId}
    >
      <Text style={[styles.buttonLabel, !isPrimary ? styles.buttonLabelSecondary : undefined]}>{label}</Text>
      {icon === 'arrow' ? <ArrowRight color={isPrimary ? theme.colors.textOnDark : theme.colors.primaryStrong} size={18} /> : null}
      {icon === 'plus' ? <Plus color={isPrimary ? theme.colors.textOnDark : theme.colors.primaryStrong} size={18} /> : null}
    </Pressable>
  );
});

export const PremiumCard = memo(function PremiumCard({ children, dark = false, testId }: { children: React.ReactNode; dark?: boolean; testId: string }) {
  return <View style={[styles.card, dark ? styles.cardDark : undefined]} testID={testId}>{children}</View>;
});

export const SectionTitle = memo(function SectionTitle({ eyebrow, title, actionLabel, href }: { eyebrow: string; title: string; actionLabel?: string; href?: string }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleWrap}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {actionLabel && href ? (
        <Pressable onPress={() => router.push(href as Href)} testID={`link-${actionLabel}`}>
          <Text style={styles.sectionLink}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
});

export const MetricCard = memo(function MetricCard({ label, value, detail, dark = false, testId }: { label: string; value: string; detail: string; dark?: boolean; testId: string }) {
  return (
    <View style={[styles.metricCard, dark ? styles.metricCardDark : undefined]} testID={testId}>
      <Text style={[styles.metricLabel, dark ? styles.metricLabelDark : undefined]}>{label}</Text>
      <Text style={[styles.metricValue, dark ? styles.metricValueDark : undefined]}>{value}</Text>
      <Text style={[styles.metricDetail, dark ? styles.metricDetailDark : undefined]}>{detail}</Text>
    </View>
  );
});

export const InputField = memo(function InputField({ label, value, onChangeText, keyboardType = 'default', placeholder, testId }: { label: string; value: string; onChangeText: (value: string) => void; keyboardType?: 'default' | 'numeric' | 'email-address'; placeholder: string; testId: string }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        autoCapitalize="none"
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        style={styles.input}
        testID={testId}
        value={value}
      />
    </View>
  );
});

export const AppBadgeRow = memo(function AppBadgeRow() {
  return (
    <View style={styles.badgeRow}>
      <View style={styles.badge}><Building2 color={theme.colors.primaryStrong} size={16} /><Text style={styles.badgeText}>Bâtiments</Text></View>
      <View style={styles.badge}><Leaf color={theme.colors.primaryStrong} size={16} /><Text style={styles.badgeText}>ADEME-ready</Text></View>
      <View style={styles.badge}><Factory color={theme.colors.primaryStrong} size={16} /><Text style={styles.badgeText}>Exploitation</Text></View>
    </View>
  );
});

export const EmptyState = memo(function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <PieChart color={theme.colors.primaryStrong} size={24} />
      <Text style={styles.emptyTitle}>Aucun site analysé</Text>
      <Text style={styles.emptyText}>Créez votre premier diagnostic pour visualiser les indicateurs carbone.</Text>
    </View>
  );
});

export const SiteMetaRow = memo(function SiteMetaRow({ location, date }: { location: string; date: string }) {
  return (
    <View style={styles.metaRow}>
      <View style={styles.metaItem}><MapPin color={theme.colors.textMuted} size={14} /><Text style={styles.metaText}>{location}</Text></View>
      <View style={styles.metaItem}><History color={theme.colors.textMuted} size={14} /><Text style={styles.metaText}>{date}</Text></View>
    </View>
  );
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  patternA: {
    position: 'absolute',
    top: -40,
    right: -20,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(31,107,79,0.10)',
  },
  patternB: {
    position: 'absolute',
    bottom: 120,
    left: -30,
    width: 160,
    height: 160,
    borderRadius: 32,
    backgroundColor: 'rgba(179,139,77,0.08)',
    transform: [{ rotate: '18deg' }],
  },
  button: {
    minHeight: 54,
    borderRadius: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  buttonPrimary: {
    backgroundColor: theme.colors.primaryStrong,
  },
  buttonSecondary: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  buttonLabel: {
    color: theme.colors.textOnDark,
    fontSize: 15,
    fontWeight: '700',
  },
  buttonLabelSecondary: {
    color: theme.colors.primaryStrong,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(216,209,197,0.85)',
    shadowColor: '#102218',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  cardDark: {
    backgroundColor: theme.colors.card,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 16,
  },
  sectionTitleWrap: {
    flex: 1,
    gap: 4,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '700',
  },
  sectionTitle: {
    color: theme.colors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  sectionLink: {
    color: theme.colors.primaryStrong,
    fontSize: 14,
    fontWeight: '700',
  },
  metricCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: 22,
    padding: 16,
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
    color: 'rgba(246,243,236,0.7)',
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
    color: 'rgba(246,243,236,0.7)',
  },
  fieldWrap: {
    gap: 8,
  },
  fieldLabel: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceMuted,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    color: theme.colors.text,
    fontSize: 15,
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
    backgroundColor: 'rgba(255,253,248,0.86)',
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
    paddingVertical: 20,
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
  metaRow: {
    flexDirection: 'row',
    gap: 14,
    flexWrap: 'wrap',
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
});
