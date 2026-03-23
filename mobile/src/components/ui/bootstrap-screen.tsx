import React from "react";

import { Heading, MutedText } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";
import { View } from "@/tw";

export function BootstrapScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-brand-sand px-8">
      <View className="w-full max-w-sm rounded-[32px] bg-brand-card p-8 shadow-[0_12px_32px_rgba(24,35,40,0.08)]">
        <View className="gap-4">
          <Spinner size="large" />
          <Heading className="text-center text-2xl">Preparing your workspace</Heading>
          <MutedText className="text-center text-base">
            Restoring your session and syncing the latest service catalog.
          </MutedText>
        </View>
      </View>
    </View>
  );
}
