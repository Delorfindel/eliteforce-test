import React from "react";

import { MutedText, UIText } from "@/components/ui/text";
import { View } from "@/tw";

type FormControlProps = {
  children: React.ReactNode;
  error?: string;
  helperText?: string;
  label: string;
};

export function FormControl({
  children,
  error,
  helperText,
  label
}: FormControlProps) {
  return (
    <View className="gap-2">
      <UIText className="text-sm font-medium text-brand-ink">{label}</UIText>
      {children}
      {error ? (
        <UIText className="text-sm text-brand-danger">{error}</UIText>
      ) : helperText ? (
        <MutedText className="text-sm">{helperText}</MutedText>
      ) : null}
    </View>
  );
}
