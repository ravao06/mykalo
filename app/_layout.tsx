import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

export default function Layout() {
  return (
    <>
    <View style={{ flex: 1, paddingTop: 30 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        {/* <Stack.Screen name="other-screen" /> */}
      </Stack>
    </View>
    <StatusBar style="auto" />
  </>
  );
}