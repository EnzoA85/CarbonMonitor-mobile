import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

export function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  loadingLabel,
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loadingLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <Pressable
              onPress={onCancel}
              disabled={loading}
              style={[styles.btn, styles.cancelBtn]}
            >
              <Text style={styles.cancelBtnText}>{cancelLabel}</Text>
            </Pressable>
            <Pressable
              onPress={() => void handleConfirm()}
              disabled={loading}
              style={[
                styles.btn,
                destructive ? styles.destructiveBtn : styles.confirmBtn,
              ]}
            >
              <Text style={destructive ? styles.destructiveBtnText : styles.confirmBtnText}>
                {loading ? (loadingLabel ?? 'Chargement…') : confirmLabel}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(8,16,13,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: theme.colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 20,
    width: '100%',
    maxWidth: 360,
    gap: 16,
  },
  title: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  message: {
    color: theme.colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  btn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: theme.colors.surfaceMuted,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cancelBtnText: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  confirmBtn: {
    backgroundColor: theme.colors.primaryStrong,
  },
  confirmBtnText: {
    color: theme.colors.textOnDark,
    fontSize: 15,
    fontWeight: '700',
  },
  destructiveBtn: {
    backgroundColor: theme.colors.danger,
  },
  destructiveBtnText: {
    color: theme.colors.textOnDark,
    fontSize: 15,
    fontWeight: '700',
  },
});
