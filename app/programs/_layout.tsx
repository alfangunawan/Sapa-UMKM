import { Stack } from 'expo-router/stack';

export default function ProgramsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="kur" />
      <Stack.Screen name="umi" />
      <Stack.Screen name="lpdb" />
      <Stack.Screen name="inkubasi" />
    </Stack>
  );
}
