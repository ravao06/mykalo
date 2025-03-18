import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import MusicNotification from '@/components/MusicNotification';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+not-found" />
      <MusicNotification />
      </Stack>
      <StatusBar style="auto" />

      {/* Intégration de MusicNotification */}
    </>
  );
}