import { router } from 'expo-router';
import { UserPlus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AlertBanner, InputField, PremiumCard, PrimaryButton, ScreenBackground } from '@/ui';
import { theme } from '@/constants/theme';
import { useAppState } from '@/providers/app-provider';

export default function RegisterScreen() {
  const { isHydrated, isLoading, register, sessionUser } = useAppState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isHydrated && sessionUser) {
      router.replace('/');
    }
  }, [isHydrated, sessionUser]);

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Veuillez renseigner un email et un mot de passe.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await register(email.trim(), password);
      router.replace('/');
    } catch (error) {
      console.log('[RegisterScreen] Register failed', error);
      setErrorMessage('Inscription impossible. L’email est peut-être déjà utilisé ou l’API est indisponible.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenBackground>
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} testID="register-scroll">
            <View style={styles.hero}>
              <View style={styles.heroBadge}>
                <UserPlus color={theme.colors.textOnDark} size={22} />
              </View>
              <Text style={styles.eyebrow}>CarbonMonitor</Text>
              <Text style={styles.title}>Inscription</Text>
              <Text style={styles.subtitle}>
                Créez votre compte pour accéder aux diagnostics carbone et piloter vos sites.
              </Text>
            </View>

            <PremiumCard testId="register-card">
              <View style={styles.cardHeader}>
                <View style={styles.cardIcon}>
                  <UserPlus color={theme.colors.primaryStrong} size={20} />
                </View>
                <View style={styles.cardTextWrap}>
                  <Text style={styles.cardTitle}>Nouveau compte</Text>
                  <Text style={styles.cardText}>Mot de passe minimum 6 caractères.</Text>
                </View>
              </View>

              {errorMessage ? <AlertBanner title="Action requise" description={errorMessage} tone="danger" /> : null}

              <View style={styles.form}>
                <InputField
                  label="Email professionnel"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  placeholder="prenom.nom@entreprise.com"
                  testId="email-input"
                />
                <InputField
                  label="Mot de passe"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Minimum 6 caractères"
                  testId="password-input"
                  secureTextEntry
                />
                <InputField
                  label="Confirmer le mot de passe"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Répétez le mot de passe"
                  testId="confirm-password-input"
                  secureTextEntry
                />
              </View>

              <PrimaryButton
                label={isSubmitting || isLoading ? 'Inscription…' : 'Créer mon compte'}
                onPress={() => void handleRegister()}
                icon="arrow"
                testId="register-button"
              />

              <View style={styles.footer}>
                <Text style={styles.footerText}>Déjà un compte ? </Text>
                <Pressable onPress={() => router.back()} testID="link-login">
                  <Text style={styles.footerLink}>Se connecter</Text>
                </Pressable>
              </View>
            </PremiumCard>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1 },
  content: {
    padding: 20,
    paddingTop: 32,
    gap: 20,
    justifyContent: 'center',
    flexGrow: 1,
  },
  hero: { gap: 14 },
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
    fontSize: 32,
    lineHeight: 38,
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
  cardTextWrap: { flex: 1, gap: 4 },
  cardTitle: { color: theme.colors.text, fontSize: 20, fontWeight: '800' },
  cardText: { color: theme.colors.textMuted, fontSize: 14, lineHeight: 20 },
  form: { gap: 14, marginBottom: 20, marginTop: 12 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 4,
  },
  footerText: { color: theme.colors.textMuted, fontSize: 14 },
  footerLink: { color: theme.colors.primaryStrong, fontSize: 14, fontWeight: '700' },
});
