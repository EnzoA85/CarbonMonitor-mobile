import { router } from 'expo-router';
import { LogOut, Mail, ShieldCheck, User } from 'lucide-react-native';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PremiumCard, PrimaryButton, ScreenBackground } from '@/ui';
import { theme } from '@/constants/theme';
import { useAppState } from '@/providers/app-provider';

export default function ProfileScreen() {
  const { logout, sessionUser } = useAppState();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <ScreenBackground>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} testID="profile-scroll">
          <View style={styles.header}>
            <Text style={styles.eyebrow}>Mon compte</Text>
            <Text style={styles.title}>Profil utilisateur</Text>
            <Text style={styles.subtitle}>
              Gérez votre session et consultez les informations de votre compte.
            </Text>
          </View>

          <PremiumCard dark testId="profile-card">
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <User color={theme.colors.textOnDark} size={28} />
              </View>
            </View>
            <View style={styles.infoRow}>
              <Mail color="rgba(246,243,236,0.8)" size={18} />
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{sessionUser?.email ?? '—'}</Text>
            </View>
            <View style={styles.infoRow}>
              <ShieldCheck color="rgba(246,243,236,0.8)" size={18} />
              <Text style={styles.infoLabel}>Organisation</Text>
              <Text style={styles.infoValue}>{sessionUser?.organization ?? '—'}</Text>
            </View>
          </PremiumCard>

          <PremiumCard testId="profile-actions">
            <Text style={styles.cardTitle}>Session</Text>
            <PrimaryButton
              label="Se déconnecter"
              onPress={() => void handleLogout()}
              variant="secondary"
              testId="logout-button"
            />
            <View style={styles.logoutHint}>
              <LogOut color={theme.colors.textMuted} size={14} />
              <Text style={styles.logoutHintText}>Vous serez redirigé vers l’écran de connexion.</Text>
            </View>
          </PremiumCard>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 18,
    paddingBottom: 120,
  },
  header: {
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
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 340,
  },
  avatarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    color: theme.colors.textOnDark,
    fontSize: 12,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  infoLabel: {
    color: 'rgba(246,243,236,0.75)',
    fontSize: 14,
    fontWeight: '600',
    width: 110,
  },
  infoValue: {
    color: theme.colors.textOnDark,
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  cardTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 14,
  },
  logoutHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  logoutHintText: {
    color: theme.colors.textMuted,
    fontSize: 13,
  },
});
