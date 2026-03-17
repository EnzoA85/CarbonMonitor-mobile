import { router } from 'expo-router';
import { Building2, ChevronRight, Pencil, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  ConfirmModal,
  EmptyState,
  PremiumCard,
  PrimaryButton,
  ScreenBackground,
  SiteMetaRow,
} from '@/ui';
import { theme } from '@/constants/theme';
import { useAppState } from '@/providers/app-provider';
import { formatDate, formatTonnes } from '@/utils/format';

export default function SitesScreen() {
  const { sites, deleteSite } = useAppState();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteModalSite, setDeleteModalSite] = useState<{ id: string; name: string } | null>(null);

  const handleDeletePress = (siteId: string, siteName: string) => {
    setDeleteModalSite({ id: siteId, name: siteName });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalSite) return;
    try {
      setDeletingId(deleteModalSite.id);
      await deleteSite(deleteModalSite.id);
      setDeleteModalSite(null);
    } catch (e) {
      console.error(e);
      Alert.alert('Erreur', 'Impossible de supprimer le site.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <ScreenBackground>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} testID="sites-scroll">
          <View style={styles.header}>
            <View style={styles.headerTextWrap}>
              <Text style={styles.eyebrow}>Portefeuille</Text>
              <Text style={styles.title}>Sites enregistrés</Text>
              <Text style={styles.subtitle}>
                Créez, consultez, modifiez ou supprimez vos diagnostics carbone.
              </Text>
            </View>
            <PrimaryButton
              label="Nouveau site"
              onPress={() => router.push('/site/new')}
              icon="plus"
              testId="new-site-button"
            />
          </View>

          {sites.length === 0 ? (
            <PremiumCard testId="sites-empty">
              <EmptyState />
              <PrimaryButton
                label="Créer un premier site"
                onPress={() => router.push('/site/new')}
                icon="plus"
                testId="create-first-site"
              />
            </PremiumCard>
          ) : (
            <View style={styles.listWrap}>
              {sites.map((site) => (
                <PremiumCard key={site.id} testId={`site-card-${site.id}`}>
                  <Pressable
                    onPress={() => router.push(`/site/${site.id}` as const)}
                    style={styles.cardPressable}
                  >
                    <View style={styles.listCardTop}>
                      <View style={styles.listIcon}>
                        <Building2 color={theme.colors.primaryStrong} size={18} />
                      </View>
                      <View style={styles.listCardBody}>
                        <Text style={styles.listTitle}>{site.name}</Text>
                        <SiteMetaRow date={formatDate(site.updatedAt)} location={site.location} />
                        <Text style={styles.listSubtitle}>
                          {formatTonnes(site.metrics.totalTonnesCo2e)} • {site.input.areaM2} m²
                        </Text>
                      </View>
                      <ChevronRight color={theme.colors.textMuted} size={18} />
                    </View>
                  </Pressable>
                  <View style={styles.actions}>
                    <PrimaryButton
                      label="Voir"
                      onPress={() => router.push(`/site/${site.id}` as const)}
                      variant="secondary"
                      testId={`open-site-${site.id}`}
                    />
                    <Pressable
                      onPress={() => router.push(`/site/edit/${site.id}` as const)}
                      style={styles.iconBtn}
                    >
                      <Pencil color={theme.colors.primaryStrong} size={18} />
                    </Pressable>
                    <Pressable
                      onPress={() => handleDeletePress(site.id, site.name)}
                      disabled={deletingId === site.id}
                      style={styles.iconBtn}
                    >
                      <Trash2 color={theme.colors.danger} size={18} />
                    </Pressable>
                  </View>
                </PremiumCard>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      {deleteModalSite && (
        <ConfirmModal
          visible={!!deleteModalSite}
          title="Supprimer le site"
          message={`Êtes-vous sûr de vouloir supprimer « ${deleteModalSite.name} » ? Cette action est irréversible.`}
          confirmLabel="Supprimer"
          cancelLabel="Annuler"
          loadingLabel="Suppression…"
          destructive
          loading={deletingId === deleteModalSite.id}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteModalSite(null)}
        />
      )}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  content: {
    padding: 20,
    gap: 18,
    paddingBottom: 120,
  },
  header: {
    gap: 14,
  },
  headerTextWrap: {
    gap: 8,
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: theme.colors.text,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 340,
  },
  listWrap: {
    gap: 12,
  },
  cardPressable: {
    marginBottom: 12,
  },
  listCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  listIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listCardBody: {
    flex: 1,
    gap: 4,
  },
  listTitle: {
    color: theme.colors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  listSubtitle: {
    color: theme.colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
