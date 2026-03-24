import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { UIText } from '@/components/ui/text';
import { requestPasswordReset } from '@/features/auth/api/request-password-reset';
import { AuthErrorBanner } from '@/features/auth/components/auth-error-banner';
import { AuthScreenShell } from '@/features/auth/components/auth-screen-shell';
import { AuthSubmitButton } from '@/features/auth/components/auth-submit-button';
import { AuthTextField } from '@/features/auth/components/auth-text-field';
import { View } from '@/tw';

const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Veuillez entrer une adresse e-mail valide.'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordRoute() {
  const router = useRouter();
  const [formError, setFormError] = React.useState<string>();

  const form = useForm<ForgotPasswordValues>({
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
    resolver: zodResolver(forgotPasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: ({ email }: ForgotPasswordValues) => requestPasswordReset(email),
    onError: () => {
      setFormError('Une erreur est survenue lors de la demande. Veuillez réessayer.');
    },
  });

  if (mutation.isSuccess) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-6 gap-6">
        <View className="w-16 h-16 rounded-full bg-brand-clay flex items-center justify-center">
          <UIText className="text-white text-3xl font-bold">✓</UIText>
        </View>

        <View className="items-center gap-3 w-full">
          <UIText className="text-2xl font-bold text-brand-ink text-center">E-mail envoyé !</UIText>
          <UIText className="text-center text-base text-brand-ink-soft leading-6">
            Si cette adresse est associée à un compte, vous recevrez un lien pour réinitialiser
            votre mot de passe.
          </UIText>
        </View>

        <View className="w-full mt-4">
          <AuthSubmitButton
            label="Retour à la connexion"
            onPress={() => router.replace('/login')}
          />
        </View>
      </View>
    );
  }

  return (
    <AuthScreenShell
      description="Entrez votre adresse e-mail et nous vous enverrons un lien sécurisé pour réinitialiser votre mot de passe."
      footerHref="/login"
      footerLabel="Retour à la connexion"
      footerText="Vous avez retrouvé votre mot de passe ?"
      title="Réinitialisation"
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
              label="E-mail"
              onBlur={field.onBlur}
              onChangeText={(value) => {
                setFormError(undefined);
                field.onChange(value);
              }}
              placeholder="vous@exemple.com"
              value={field.value}
            />
          )}
        />

        <AuthSubmitButton
          disabled={!form.formState.isValid || mutation.isPending}
          label="Envoyer le lien"
          loading={mutation.isPending}
          onPress={form.handleSubmit((values) => mutation.mutate(values))}
        />
      </View>
    </AuthScreenShell>
  );
}
