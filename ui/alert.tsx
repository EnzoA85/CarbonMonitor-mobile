import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

type AlertTone = 'info' | 'success' | 'warning' | 'danger';

export function AlertBanner({
  title,
  description,
  tone = 'info',
}: {
  title: string;
  description?: string;
  tone?: AlertTone;
}) {
  const toneColor = stylesByTone[tone];
  const Icon = toneIcon[tone];

  return (
    <View style={[styles.container, { borderColor: toneColor.border, backgroundColor: toneColor.background }]}>
      <View style={[styles.iconWrap, { backgroundColor: toneColor.iconBg }]}>
        <Icon color={toneColor.iconColor} size={16} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
    </View>
  );
}

const toneIcon = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  danger: AlertCircle,
} as const;

const stylesByTone = {
  info: {
    background: '#edf5f2',
    border: '#cbe0d8',
    iconBg: '#d4ece3',
    iconColor: theme.colors.primaryStrong,
  },
  success: {
    background: '#eaf7ef',
    border: '#c8e6d2',
    iconBg: '#d9f0e1',
    iconColor: theme.colors.success,
  },
  warning: {
    background: '#fff7e8',
    border: '#f0ddba',
    iconBg: '#f8e8cc',
    iconColor: theme.colors.accent,
  },
  danger: {
    background: '#fff0ee',
    border: '#f2cbc5',
    iconBg: '#f8ddd8',
    iconColor: theme.colors.danger,
  },
} as const;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  textWrap: {
    flex: 1,
    gap: 2,
  },
  title: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  description: {
    color: theme.colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
});
