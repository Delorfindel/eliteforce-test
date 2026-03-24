import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'expo-router';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { Checkbox } from '@/components/ui/checkbox';
import { UIText } from '@/components/ui/text';
import { signUp } from '@/features/auth/api/sign-up';
import { AuthErrorBanner } from '@/features/auth/components/auth-error-banner';
import { AuthPasswordField } from '@/features/auth/components/auth-password-field';
import { AuthSubmitButton } from '@/features/auth/components/auth-submit-button';
import { AuthTextField } from '@/features/auth/components/auth-text-field';
import { type RegisterFormValues, registerSchema } from '@/features/auth/schemas/register-schema';
import { View } from '@/tw';

type RegisterFormProps = {
  onSuccess: () => void;
};

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [formError, setFormError] = React.useState<string>();

  const form = useForm<RegisterFormValues>({
    defaultValues: {
      acceptedTerms: false,
      optOutPromotions: false,
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      phone: '',
    },
    mode: 'onChange',
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: signUp,
    onError: (error) => {
      setFormError(error instanceof Error ? error.message : 'Impossible de créer votre compte.');
    },
    onSuccess,
  });

  return (
    <View className="gap-2">
      <AuthErrorBanner message={formError} />

      <View className="flex-row items-start gap-4">
        <View className="flex-1">
          <Controller
            control={form.control}
            name="firstName"
            render={({ field, fieldState }) => (
              <AuthTextField
                error={fieldState.error?.message}
                label="Prénom"
                onBlur={field.onBlur}
                onChangeText={(value) => {
                  setFormError(undefined);
                  field.onChange(value);
                }}
                value={field.value}
              />
            )}
          />
        </View>
        <View className="flex-1">
          <Controller
            control={form.control}
            name="lastName"
            render={({ field, fieldState }) => (
              <AuthTextField
                error={fieldState.error?.message}
                label="Nom"
                onBlur={field.onBlur}
                onChangeText={(value) => {
                  setFormError(undefined);
                  field.onChange(value);
                }}
                value={field.value}
              />
            )}
          />
        </View>
      </View>

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

      <Controller
        control={form.control}
        name="phone"
        render={({ field, fieldState }) => (
          <View className="mb-2">
            <View className="flex-row items-center border-b border-brand-border h-14">
              <View className="flex-row items-center pl-1 pr-3">
                <UIText className="text-xl mr-2">🇲🇦</UIText>
                <UIText className="text-base font-medium text-brand-ink">+212 ‹</UIText>
              </View>
              <View className="flex-1">
                <AuthTextField
                  className="border-b-0"
                  error={fieldState.error?.message}
                  keyboardType="phone-pad"
                  label="N° de téléphone"
                  onBlur={field.onBlur}
                  onChangeText={(value) => {
                    setFormError(undefined);
                    field.onChange(value);
                  }}
                  value={field.value}
                />
              </View>
            </View>
            {fieldState.error?.message && (
              <UIText className="mt-1 text-sm text-brand-danger">{fieldState.error.message}</UIText>
            )}
          </View>
        )}
      />

      <View className="mb-6 mt-2 px-1">
        <UIText className="text-xs text-brand-ink-soft leading-5">
          Votre numéro de téléphone nous permettra de vous mettre en contact avec les meilleurs
          prestataires.
        </UIText>
      </View>

      <AuthSubmitButton
        className={!form.formState.isValid ? 'bg-[#d4d4d4]' : 'bg-[#0E7051]'}
        disabled={!form.formState.isValid || mutation.isPending}
        label="S'inscrire"
        loading={mutation.isPending}
        onPress={form.handleSubmit((values) => {
          setFormError(undefined);
          mutation.mutate(values);
        })}
      />

      <View className="mt-6 gap-5">
        <Controller
          control={form.control}
          name="acceptedTerms"
          render={({ field, fieldState }) => (
            <View className="gap-2">
              <View className="flex-row items-start pl-1 pr-4">
                <View className="mt-1 mr-3">
                  <Checkbox
                    checked={field.value}
                    onChange={(value) => {
                      setFormError(undefined);
                      field.onChange(value);
                    }}
                  />
                </View>
                <UIText className="text-sm text-brand-ink leading-5 flex-1 p-0 m-0 w-full text-wrap">
                  J'accepte les{' '}
                  <UIText className="text-sm text-brand-clay">Conditions générales</UIText> et j'ai
                  pris connaissance de la{' '}
                  <UIText className="text-sm text-brand-clay">Politique de confidentialité</UIText>.
                </UIText>
              </View>
              {fieldState.error?.message ? (
                <UIText className="text-sm text-brand-danger ml-9">
                  {fieldState.error.message}
                </UIText>
              ) : null}
            </View>
          )}
        />

        <Controller
          control={form.control}
          name="optOutPromotions"
          render={({ field, fieldState }) => (
            <View className="flex-row items-start pl-1 pr-4">
              <View className="mt-1 mr-3">
                <Checkbox
                  checked={field.value || false}
                  onChange={(value) => {
                    setFormError(undefined);
                    field.onChange(value);
                  }}
                />
              </View>
              <UIText className="text-sm text-brand-ink leading-5 flex-1 p-0 m-0 w-full text-wrap">
                Je ne souhaite pas recevoir de communications à caractère promotionnel de la part
                d'EliteForce.
              </UIText>
            </View>
          )}
        />
      </View>

      <View className="mt-12 items-center justify-center flex-row flex-wrap">
        <UIText className="text-center text-sm font-bold text-brand-ink">
          Vous avez déjà un compte ?{' '}
        </UIText>
        <Link href="/login">
          <UIText className="text-sm font-bold text-brand-clay">Se connecter</UIText>
        </Link>
      </View>
    </View>
  );
}
