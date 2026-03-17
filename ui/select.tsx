import { ChevronDown } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';
import { AppModal } from '@/ui/modal';

interface SelectOption {
  label: string;
  value: string;
}

export function SelectField({
  label,
  value,
  options,
  onChange,
  placeholder = 'Sélectionner',
}: {
  label: string;
  value?: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(() => options.find((option) => option.value === value)?.label ?? placeholder, [options, placeholder, value]);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.field} onPress={() => setOpen(true)}>
        <Text style={[styles.value, !value ? styles.placeholder : undefined]}>{selectedLabel}</Text>
        <ChevronDown color={theme.colors.textMuted} size={18} />
      </Pressable>

      <AppModal visible={open} title={label} onClose={() => setOpen(false)}>
        <View style={styles.options}>
          {options.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => {
                onChange(option.value);
                setOpen(false);
              }}
              style={[styles.option, value === option.value ? styles.optionActive : undefined]}
            >
              <Text style={[styles.optionText, value === option.value ? styles.optionTextActive : undefined]}>{option.label}</Text>
            </Pressable>
          ))}
        </View>
      </AppModal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  field: {
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: theme.colors.surfaceMuted,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  value: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  placeholder: {
    color: theme.colors.textMuted,
    fontWeight: '500',
  },
  options: {
    gap: 8,
  },
  option: {
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceMuted,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  optionActive: {
    backgroundColor: '#e8f2ee',
    borderColor: '#bdd8cc',
  },
  optionText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  optionTextActive: {
    color: theme.colors.primaryStrong,
  },
});
