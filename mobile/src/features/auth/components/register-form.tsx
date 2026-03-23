import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { Controller, useForm } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { UIText } from "@/components/ui/text";
import { signUp } from "@/features/auth/api/sign-up";
import { AuthErrorBanner } from "@/features/auth/components/auth-error-banner";
import { AuthPasswordField } from "@/features/auth/components/auth-password-field";
import { AuthSubmitButton } from "@/features/auth/components/auth-submit-button";
import { AuthTextField } from "@/features/auth/components/auth-text-field";
import {
  registerSchema,
  type RegisterFormValues
} from "@/features/auth/schemas/register-schema";
import { View } from "@/tw";

type RegisterFormProps = {
  onSuccess: () => void;
};

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [formError, setFormError] = React.useState<string>();

  const form = useForm<RegisterFormValues>({
    defaultValues: {
      acceptedTerms: false,
      confirmPassword: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      phone: ""
    },
    mode: "onChange",
    resolver: zodResolver(registerSchema)
  });

  const mutation = useMutation({
    mutationFn: signUp,
    onError: (error) => {
      setFormError(
        error instanceof Error ? error.message : "Unable to create your account."
      );
    },
    onSuccess
  });

  return (
    <View className="gap-4">
      <AuthErrorBanner message={formError} />

      <Controller
        control={form.control}
        name="firstName"
        render={({ field, fieldState }) => (
          <AuthTextField
            error={fieldState.error?.message}
            label="First name"
            onBlur={field.onBlur}
            onChangeText={(value) => {
              setFormError(undefined);
              field.onChange(value);
            }}
            placeholder="Amina"
            value={field.value}
          />
        )}
      />

      <Controller
        control={form.control}
        name="lastName"
        render={({ field, fieldState }) => (
          <AuthTextField
            error={fieldState.error?.message}
            label="Last name"
            onBlur={field.onBlur}
            onChangeText={(value) => {
              setFormError(undefined);
              field.onChange(value);
            }}
            placeholder="Bennani"
            value={field.value}
          />
        )}
      />

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
        name="phone"
        render={({ field, fieldState }) => (
          <AuthTextField
            error={fieldState.error?.message}
            keyboardType="phone-pad"
            label="Phone number"
            onBlur={field.onBlur}
            onChangeText={(value) => {
              setFormError(undefined);
              field.onChange(value);
            }}
            placeholder="+212612345678"
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
            placeholder="At least 8 characters"
            value={field.value}
          />
        )}
      />

      <Controller
        control={form.control}
        name="confirmPassword"
        render={({ field, fieldState }) => (
          <AuthPasswordField
            autoCapitalize="none"
            error={fieldState.error?.message}
            label="Confirm password"
            onBlur={field.onBlur}
            onChangeText={(value) => {
              setFormError(undefined);
              field.onChange(value);
            }}
            placeholder="Repeat your password"
            value={field.value}
          />
        )}
      />

      <Controller
        control={form.control}
        name="acceptedTerms"
        render={({ field, fieldState }) => (
          <View className="gap-2">
            <Checkbox
              checked={field.value}
              label="I agree to the EliteForce terms of service and the handling of my account data."
              onChange={(value) => {
                setFormError(undefined);
                field.onChange(value);
              }}
            />
            {fieldState.error?.message ? (
              <UIText className="text-sm text-brand-danger">
                {fieldState.error.message}
              </UIText>
            ) : null}
          </View>
        )}
      />

      <AuthSubmitButton
        disabled={!form.formState.isValid || mutation.isPending}
        label="Create account"
        loading={mutation.isPending}
        onPress={form.handleSubmit((values) => {
          setFormError(undefined);
          mutation.mutate(values);
        })}
      />
    </View>
  );
}
