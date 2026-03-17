import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

interface BarSegment {
  label: string;
  value: number;
  color: string;
}

export function SimpleBarChart({
  segments,
  totalLabel = 'Total',
}: {
  segments: BarSegment[];
  totalLabel?: string;
}) {
  const total = segments.reduce((acc, s) => acc + s.value, 0);
  const maxVal = Math.max(total, 1);

  return (
    <View style={styles.container}>
      <View style={styles.barWrap}>
        {segments.map((seg, i) => (
          <View
            key={i}
            style={[
              styles.segment,
              {
                flex: seg.value / maxVal,
                backgroundColor: seg.color,
              },
            ]}
          />
        ))}
      </View>
      <View style={styles.legend}>
        {segments.map((seg, i) => (
          <View key={i} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: seg.color }]} />
            <Text style={styles.legendLabel}>{seg.label}</Text>
            <Text style={styles.legendValue}>
              {total > 0 ? Math.round((seg.value / total) * 100) : 0}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  barWrap: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: theme.colors.surfaceMuted,
  },
  segment: {
    minWidth: 4,
  },
  legend: {
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  legendValue: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: '800',
  },
});
