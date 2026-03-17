import { router } from 'expo-router';
import { LockKeyhole, ShieldCheck } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AlertBanner, AppBadgeRow, InputField, PremiumCard, PrimaryButton, ScreenBackground } from '@/ui';
import { theme } from '@/constants/theme';
import { useAppState } from '@/providers/app-provider';

export default function LoginScreen() {
  const { isHydrated, isLoading, login, sessionUser } = useAppState();
  const [email, setEmail] = useState<string>('chefprojet@capgemini.com');
  const [password, setPassword] = useState<string>('demo12345');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isHydrated && sessionUser) {
      router.replace('/');
    }
  }, [isHydrated, sessionUser]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Veuillez renseigner un email et un mot de passe.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await login(email.trim(), password);
      router.replace('/');
    } catch (error) {
      console.log('[LoginScreen] Login failed', error);
      setErrorMessage('Connexion impossible. Vérifiez vos identifiants ou la disponibilité de l’API.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenBackground>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} testID="login-scroll">
            <View style={styles.hero}>
              <View style={styles.heroBadge}>
                <ShieldCheck color={theme.colors.textOnDark} size={22} />
              </View>
              <Text style={styles.eyebrow}>CapCarbon Mobile</Text>
              <Text style={styles.title}>Pilotage carbone terrain</Text>
              <Text style={styles.subtitle}>
                Connectez-vous pour créer des diagnostics, suivre vos KPI et piloter vos émissions avec une interface claire et moderne.
              </Text>
              <AppBadgeRow />
            </View>

            <PremiumCard testId="login-card">
              <View style={styles.cardHeader}>
                <View style={styles.cardIcon}><LockKeyhole color={theme.colors.primaryStrong} size={20} /></View>
                <View style={styles.cardTextWrap}>
                  <Text style={styles.cardTitle}>Authentification sécurisée</Text>
                  <Text style={styles.cardText}>Session JWT active pour accéder à vos sites et indicateurs.</Text>
                </View>
              </View>

              {errorMessage ? <AlertBanner title="Action requise" description={errorMessage} tone="danger" /> : null}

              <View style={styles.form}>
                <InputField label="Email professionnel" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="prenom.nom@entreprise.com" testId="email-input" />
                <InputField label="Mot de passe" value={password} onChangeText={setPassword} placeholder="Votre mot de passe" testId="password-input" secureTextEntry />
              </View>

              <PrimaryButton label={isSubmitting || isLoading ? 'Connexion en cours…' : 'Accéder au tableau de bord'} onPress={() => void handleLogin()} icon="arrow" testId="login-button" />
            </PremiumCard>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 32,
    gap: 20,
    justifyContent: 'center',
    flexGrow: 1,
  },
  hero: {
    gap: 14,
  },
  heroBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primaryStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  title: {
    color: theme.colors.text,
    fontSize: 38,
    lineHeight: 42,
    fontWeight: '800',
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 360,
  },
  cardHeader: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'center',
    marginBottom: 18,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextWrap: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    color: theme.colors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  cardText: {
    color: theme.colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  form: {
    gap: 14,
    marginBottom: 20,
    marginTop: 12,
  },
});
