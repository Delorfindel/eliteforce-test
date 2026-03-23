import React from "react";

import { UIText } from "@/components/ui/text";
import { View } from "@/tw";

type AuthErrorBannerProps = {
  message?: string;
};

export function AuthErrorBanner({ message }: AuthErrorBannerProps) {
  if (!message) {
    return null;
  }

  return (
    <View className="rounded-[20px] border border-brand-danger/20 bg-[#fef3f2] px-4 py-3">
      <UIText className="text-sm text-brand-danger">{message}</UIText>
    </View>
  );
}
