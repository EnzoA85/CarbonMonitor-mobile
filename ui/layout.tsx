import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { theme } from '@/constants/theme';

export function ScreenBackground({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.screen}>
      <LinearGradient colors={[theme.colors.backgroundStrong, theme.colors.background]} style={styles.gradient} />
      <View style={styles.patternA} />
      <View style={styles.patternB} />
      {children}
    </View>
  );
}

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
    top: -50,
    right: -40,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(31,107,79,0.10)',
  },
  patternB: {
    position: 'absolute',
    bottom: 80,
    left: -40,
    width: 180,
    height: 180,
    borderRadius: 36,
    backgroundColor: 'rgba(179,139,77,0.10)',
    transform: [{ rotate: '16deg' }],
  },
});
