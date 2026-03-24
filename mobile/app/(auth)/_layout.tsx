import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#0A0A0A',
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ title: "S'inscrire", headerBackTitle: 'Retour' }} />
      <Stack.Screen
        name="forgot-password"
        options={{ title: 'Mot de passe oublié', headerBackTitle: 'Retour' }}
      />
      <Stack.Screen
        name="update-password"
        options={{ title: 'Mot de passe oublié', headerBackTitle: 'Retour' }}
      />
    </Stack>
  );
}
