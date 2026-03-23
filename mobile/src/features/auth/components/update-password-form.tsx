import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { Alert } from "react-native";
import { Controller, useForm } from "react-hook-form";

import { BootstrapScreen } from "@/components/ui/bootstrap-screen";
import { UIText } from "@/components/ui/text";
import { updatePassword } from "@/features/auth/api/update-password";
import { AuthErrorBanner } from "@/features/auth/components/auth-error-banner";
import { AuthPasswordField } from "@/features/auth/components/auth-password-field";
import { AuthSubmitButton } from "@/features/auth/components/auth-submit-button";
import { useAuthSession } from "@/features/auth/hooks/use-auth-session";
import { establishRecoverySession } from "@/features/auth/utils/recovery-session";
import { passwordConfirmationSchema } from "@/features/auth/schemas/password-schema";
import { supabase } from "@/lib/supabase";
import { View } from "@/tw";

type RecoveryParams = {
  access_token?: string;
  refresh_token?: string;
  token_hash?: string;
  type?: string;
};

type UpdatePasswordFormProps = {
  onSuccess: () => void;
  recoveryParams: RecoveryParams;
};

type UpdatePasswordValues = {
  confirmPassword: string;
  password: string;
};

export function UpdatePasswordForm({
  onSuccess,
  recoveryParams
}: UpdatePasswordFormProps) {
  const { isAuthenticated } = useAuthSession();
  const [isPreparing, setIsPreparing] = React.useState(true);
  const [recoveryError, setRecoveryError] = React.useState<string>();

  const form = useForm<UpdatePasswordValues>({
    defaultValues: {
      confirmPassword: "",
      password: ""
    },
    mode: "onChange",
    resolver: zodResolver(passwordConfirmationSchema)
  });

  React.useEffect(() => {
    let active = true;

    async function prepareRecovery() {
      try {
        await establishRecoverySession({
          auth: supabase.auth,
          isAuthenticated,
          recoveryParams
        });
      } catch (error) {
        if (active) {
          setRecoveryError(
            error instanceof Error
              ? error.message
              : "This reset link is invalid or has expired."
          );
        }
      } finally {
        if (active) {
          setIsPreparing(false);
        }
      }
    }

    prepareRecovery();

    return () => {
      active = false;
    };
  }, [
    isAuthenticated,
    recoveryParams,
    recoveryParams.access_token,
    recoveryParams.refresh_token,
    recoveryParams.token_hash,
    recoveryParams.type
  ]);

  const mutation = useMutation({
    mutationFn: ({ password }: UpdatePasswordValues) => updatePassword(password),
    onError: (error) => {
      setRecoveryError(
        error instanceof Error ? error.message : "Unable to update your password."
      );
    },
    onSuccess: async () => {
      await supabase.auth.signOut();
      Alert.alert("Password updated", "Please sign in with your new password.");
      onSuccess();
    }
  });

  if (isPreparing) {
    return <BootstrapScreen />;
  }

  return (
    <View className="gap-4">
      <AuthErrorBanner message={recoveryError} />

      <Controller
        control={form.control}
        name="password"
        render={({ field, fieldState }) => (
          <AuthPasswordField
            autoCapitalize="none"
            error={fieldState.error?.message}
            label="New password"
            onBlur={field.onBlur}
            onChangeText={(value) => {
              setRecoveryError(undefined);
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
            label="Confirm new password"
            onBlur={field.onBlur}
            onChangeText={(value) => {
              setRecoveryError(undefined);
              field.onChange(value);
            }}
            placeholder="Repeat your new password"
            value={field.value}
          />
        )}
      />

      <AuthSubmitButton
        disabled={!form.formState.isValid || mutation.isPending}
        label="Update password"
        loading={mutation.isPending}
        onPress={form.handleSubmit((values) => mutation.mutate(values))}
      />

      <UIText className="text-sm text-brand-ink-soft">
        After the password update completes, the app signs you out and returns
        you to the login screen.
      </UIText>
    </View>
  );
}
