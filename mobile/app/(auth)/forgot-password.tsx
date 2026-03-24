import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
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
  email: z.string().trim().email('Enter a valid email address.'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordRoute() {
  const [feedback, setFeedback] = React.useState<string>();

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
      setFeedback('If an account exists for this email, you will receive a reset link.');
    },
    onSuccess: (message) => {
      setFeedback(message);
    },
  });

  return (
    <AuthScreenShell
      description="Enter your email address and we will send an in-app password reset link."
      footerHref="/login"
      footerLabel="Back to login"
      footerText="Remembered your password?"
      title="Reset your password"
    >
      <View className="gap-4">
        <AuthErrorBanner message={feedback} />

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
                setFeedback(undefined);
                field.onChange(value);
              }}
              placeholder="you@example.com"
              value={field.value}
            />
          )}
        />

        <AuthSubmitButton
          disabled={!form.formState.isValid || mutation.isPending}
          label="Send reset link"
          loading={mutation.isPending}
          onPress={form.handleSubmit((values) => mutation.mutate(values))}
        />

        <UIText className="text-sm text-brand-ink-soft">
          The app always shows the same message here to avoid disclosing whether an email address
          already exists in the system.
        </UIText>
      </View>
    </AuthScreenShell>
  );
}
