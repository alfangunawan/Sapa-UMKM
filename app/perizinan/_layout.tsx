import { Stack } from 'expo-router/stack';

export default function PerizinanLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="nib" />
      <Stack.Screen name="merek" />
      <Stack.Screen name="sertifikasi" />
    </Stack>
  );
}
