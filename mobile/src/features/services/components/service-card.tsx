import React from "react";

import { MutedText, UIText } from "@/components/ui/text";
import { Image } from "@/tw/image";
import { View } from "@/tw";
import type { ServiceRecord } from "@/features/services/types";

type ServiceCardProps = {
  service: ServiceRecord;
  variant?: "featured" | "list";
};

export const ServiceCard = React.memo(function ServiceCard({
  service,
  variant = "featured"
}: ServiceCardProps) {
  return (
    <View
      className={`overflow-hidden rounded-[28px] bg-brand-card shadow-[0_12px_32px_rgba(24,35,40,0.08)] ${
        variant === "featured" ? "w-[280px]" : "w-full"
      }`}
    >
      <Image
        cachePolicy="memory-disk"
        className={`w-full ${
          variant === "featured" ? "h-40" : "h-44"
        }`}
        contentFit="cover"
        recyclingKey={String(service.id)}
        source={
          service.image_url ??
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
        }
        transition={200}
      />
      <View className="gap-3 p-5">
        <View className="gap-1">
          <UIText className="text-lg font-semibold text-brand-ink">
            {service.name}
          </UIText>
          <MutedText className="text-sm leading-6">
            {service.short_description}
          </MutedText>
        </View>
        <View className="flex-row items-center justify-between">
          <UIText className="text-base font-semibold text-brand-clay">
            {service.base_price.toFixed(2)} MAD
          </UIText>
          <UIText className="text-sm text-brand-ink-soft">
            {service.rating.toFixed(1)} stars
          </UIText>
        </View>
      </View>
    </View>
  );
});
