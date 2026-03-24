import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, Redirect, useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { UIText } from '@/components/ui/text';
import { signIn } from '@/features/auth/api/sign-in';
import { AuthErrorBanner } from '@/features/auth/components/auth-error-banner';
import { AuthPasswordField } from '@/features/auth/components/auth-password-field';
import { AuthScreenShell } from '@/features/auth/components/auth-screen-shell';
import { AuthSubmitButton } from '@/features/auth/components/auth-submit-button';
import { AuthTextField } from '@/features/auth/components/auth-text-field';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { type LoginFormValues, loginSchema } from '@/features/auth/schemas/login-schema';
import { View } from '@/tw';

export default function LoginRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isAuthenticated, isHydrating } = useAuthSession();
  const [formError, setFormError] = React.useState<string>();

  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: signIn,
    onError: (error) => {
      setFormError(error instanceof Error ? error.message : 'Unable to sign in.');
    },
    onSuccess: () => {
      router.replace('/(app)/(tabs)');
    },
  });

  if (!isHydrating && isAuthenticated) {
    return <Redirect href="/(app)/(tabs)" />;
  }

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: 'white' }}>
      <AuthScreenShell title="Se connecter" description="Simplifiez-vous la vie !" type="login">
        <View className="gap-4">
          <AuthErrorBanner message={formError} />

          <Controller
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <AuthTextField
                autoCapitalize="none"
                autoCorrect={false}
                error={fieldState.error?.message}
                keyboardType="email-address"
                label="E-mail"
                onBlur={field.onBlur}
                onChangeText={(value) => {
                  setFormError(undefined);
                  field.onChange(value);
                }}
                value={field.value}
              />
            )}
          />

          <Controller
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <AuthPasswordField
                autoCapitalize="none"
                error={fieldState.error?.message}
                label="Mot de passe"
                onBlur={field.onBlur}
                onChangeText={(value) => {
                  setFormError(undefined);
                  field.onChange(value);
                }}
                value={field.value}
              />
            )}
          />

          <AuthSubmitButton
            className="mt-4"
            disabled={!form.formState.isValid || mutation.isPending}
            label="Se connecter"
            loading={mutation.isPending}
            onPress={form.handleSubmit((values) => {
              setFormError(undefined);
              mutation.mutate(values);
            })}
          />

          <View className="mt-2 flex-row flex-wrap items-center justify-center">
            <UIText className="text-sm font-semibold text-brand-ink">Mot de passe oublié ? </UIText>
            <Link href="/forgot-password">
              <UIText className="text-sm font-semibold text-brand-clay">Réinitialiser</UIText>
            </Link>
          </View>

          <View className="mt-20 items-center justify-center">
            <UIText className="text-center text-sm font-semibold text-brand-ink">
              Vous n'avez pas de compte ?
            </UIText>
            <Link href="/register" className="mt-1">
              <UIText className="text-sm font-semibold text-brand-clay">Créer un compte</UIText>
            </Link>
          </View>
        </View>
      </AuthScreenShell>
    </View>
  );
}
