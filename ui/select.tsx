import { ChevronDown } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { theme } from '@/constants/theme';
import { AppModal } from '@/ui/modal';

interface SelectOption {
  label: string;
  value: string;
}

const DEFAULT_MAX_VISIBLE_OPTIONS = 5;
const OPTION_HEIGHT = 44;
const OPTION_GAP = 8;

export function SelectField({
  label,
  value,
  options,
  onChange,
  placeholder = 'Sélectionner',
  searchable = false,
  maxVisibleOptions = DEFAULT_MAX_VISIBLE_OPTIONS,
}: {
  label: string;
  value?: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  maxVisibleOptions?: number;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selectedLabel = useMemo(() => options.find((option) => option.value === value)?.label ?? placeholder, [options, placeholder, value]);

  const filteredOptions = useMemo(() => {
    if (!searchable) return options;
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query, searchable]);

  const displayedOptions = useMemo(() => {
    if (!searchable) return filteredOptions;
    const q = query.trim().toLowerCase();
    if (q) return filteredOptions;
    const sliced = filteredOptions.slice(0, maxVisibleOptions);
    if (value && !sliced.some((o) => o.value === value)) {
      const selected = filteredOptions.find((o) => o.value === value);
      if (selected) return [selected, ...filteredOptions.filter((o) => o.value !== value).slice(0, maxVisibleOptions - 1)];
    }
    return sliced;
  }, [filteredOptions, query, searchable, maxVisibleOptions, value]);

  const optionsScrollHeight = OPTION_HEIGHT * maxVisibleOptions + OPTION_GAP * (maxVisibleOptions - 1);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.field} onPress={() => setOpen(true)}>
        <Text style={[styles.value, !value ? styles.placeholder : undefined]}>{selectedLabel}</Text>
        <ChevronDown color={theme.colors.textMuted} size={18} />
      </Pressable>

      <AppModal
        visible={open}
        title={label}
        onClose={() => {
          setOpen(false);
          setQuery('');
        }}
      >
        {searchable ? (
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Rechercher dans la liste complète…"
            placeholderTextColor={theme.colors.textMuted}
            style={styles.search}
            autoCapitalize="none"
            autoCorrect={false}
          />
        ) : null}
        <ScrollView
          style={[styles.optionsScroll, { maxHeight: optionsScrollHeight }]}
          contentContainerStyle={styles.options}
          nestedScrollEnabled
          showsVerticalScrollIndicator
        >
          {displayedOptions.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => {
                onChange(option.value);
                setOpen(false);
                setQuery('');
              }}
              style={[styles.option, value === option.value ? styles.optionActive : undefined]}
            >
              <Text style={[styles.optionText, value === option.value ? styles.optionTextActive : undefined]}>{option.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
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
  optionsScroll: {},
  options: {
    gap: OPTION_GAP,
    paddingBottom: 8,
  },
  search: {
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceMuted,
    paddingHorizontal: 12,
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
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
