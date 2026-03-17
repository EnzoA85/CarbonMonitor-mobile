import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppProvider } from '@/providers/app-provider';

void SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: 'Retour',
        headerShadowVisible: false,
        headerShown: true,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: 'Connexion', headerShown: true }} />
      <Stack.Screen name="register" options={{ title: 'Inscription', headerShown: true }} />
      <Stack.Screen name="site/new" options={{ title: 'Nouveau diagnostic', headerShown: true }} />
      <Stack.Screen name="site/edit/[id]" options={{ title: 'Modifier le site', headerShown: true }} />
      <Stack.Screen name="site/[id]" options={{ title: 'Détail du site', headerShown: true }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    void SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppProvider>
          <RootLayoutNav />
        </AppProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
