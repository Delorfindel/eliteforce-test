import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, Redirect, useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

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
    <AuthScreenShell
      description="Sign in to manage bookings, browse services, and continue where you left off."
      footerHref="/register"
      footerLabel="Create one"
      footerText="Need an account?"
      title="Welcome back"
    >
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
              label="Email"
              onBlur={field.onBlur}
              onChangeText={(value) => {
                setFormError(undefined);
                field.onChange(value);
              }}
              placeholder="you@example.com"
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
              label="Password"
              onBlur={field.onBlur}
              onChangeText={(value) => {
                setFormError(undefined);
                field.onChange(value);
              }}
              placeholder="Enter your password"
              value={field.value}
            />
          )}
        />

        <Link href="/forgot-password">
          <UIText className="text-right text-sm font-semibold text-brand-clay">
            Forgot your password?
          </UIText>
        </Link>

        <AuthSubmitButton
          disabled={!form.formState.isValid || mutation.isPending}
          label="Sign in"
          loading={mutation.isPending}
          onPress={form.handleSubmit((values) => {
            setFormError(undefined);
            mutation.mutate(values);
          })}
        />

        <Link asChild href="/register">
          <Button variant="ghost">Create a new account</Button>
        </Link>
      </View>
    </AuthScreenShell>
  );
}
