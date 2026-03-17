import { ArrowRight, Plus } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { theme } from '@/constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: 'arrow' | 'plus';
  testId: string;
}

export function PrimaryButton({ label, onPress, variant = 'primary', icon, testId }: ButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.buttonPrimary : styles.buttonSecondary,
        variant === 'ghost' ? styles.buttonGhost : undefined,
        pressed ? styles.buttonPressed : undefined,
      ]}
      testID={testId}
    >
      <Text style={[styles.label, !isPrimary ? styles.labelAlt : undefined]}>{label}</Text>
      {icon === 'arrow' ? <ArrowRight color={isPrimary ? theme.colors.textOnDark : theme.colors.primaryStrong} size={18} /> : null}
      {icon === 'plus' ? <Plus color={isPrimary ? theme.colors.textOnDark : theme.colors.primaryStrong} size={18} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: 16,
    paddingHorizontal: 16,
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
    borderWidth: 0,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  label: {
    color: theme.colors.textOnDark,
    fontSize: 15,
    fontWeight: '700',
  },
  labelAlt: {
    color: theme.colors.primaryStrong,
  },
});
