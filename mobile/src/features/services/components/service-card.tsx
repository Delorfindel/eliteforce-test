import React from "react";

import { MutedText, UIText } from "@/components/ui/text";
import { Image } from "@/tw/image";
import { Pressable, View } from "@/tw";
import type { MarketplaceServiceCard } from "@/features/services/types";

type ServiceCardProps = {
  onPress?: () => void;
  service: MarketplaceServiceCard;
  variant?: "featured" | "list";
};

export const ServiceCard = React.memo(function ServiceCard({
  onPress,
  service,
  variant = "featured"
}: ServiceCardProps) {
  return (
    <Pressable
      accessibilityLabel={`Ouvrir ${service.title}`}
      className={`overflow-hidden rounded-[28px] bg-brand-card shadow-[0_12px_32px_rgba(24,35,40,0.08)] ${
        variant === "featured" ? "w-[280px]" : "w-full"
      }`}
      disabled={!onPress}
      onPress={onPress}
    >
      <Image
        cachePolicy="memory-disk"
        className={`w-full ${
          variant === "featured" ? "h-40" : "h-44"
        }`}
        contentFit="cover"
        recyclingKey={String(service.id)}
        source={
          service.cover_image_url ??
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
        }
        transition={200}
      />
      <View className="gap-3 p-5">
        <View className="gap-2">
          <View className="flex-row items-center justify-between gap-3">
            <MutedText className="text-xs uppercase tracking-[1.5px] text-brand-clay">
              {service.category.name}
            </MutedText>
            <MutedText className="text-xs">
              {service.rating.toFixed(1)} ({service.review_count})
            </MutedText>
          </View>
          <UIText className="text-lg font-semibold text-brand-ink">
            {service.title}
          </UIText>
          <MutedText className="text-sm leading-6" numberOfLines={2}>
            {service.short_description}
          </MutedText>
          <MutedText className="text-sm">
            Par {service.provider.full_name}
          </MutedText>
        </View>
        <View className="flex-row items-center justify-between">
          <UIText className="text-base font-semibold text-brand-clay">
            {service.hourly_rate.toFixed(2)} MAD / h
          </UIText>
          <UIText className="text-sm text-brand-ink-soft">Voir le detail</UIText>
        </View>
      </View>
    </Pressable>
  );
});
