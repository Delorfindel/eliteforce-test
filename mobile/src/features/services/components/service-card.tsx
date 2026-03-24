import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

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
      className={`overflow-hidden rounded-2xl bg-white shadow-sm ${
        variant === "featured" ? "w-[280px]" : "w-full"
      }`}
      disabled={!onPress}
      onPress={onPress}
    >
      <Image
        cachePolicy="memory-disk"
        className={`w-full ${variant === "featured" ? "h-36" : "h-48"}`}
        contentFit="cover"
        recyclingKey={String(service.id)}
        source={
          service.cover_image_url ??
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
        }
        transition={200}
      />
      <View className="gap-2 p-4">
        <View className="flex-row items-center gap-2">
          <View className="rounded-full bg-brand-accent-light px-2.5 py-1">
            <UIText className="text-xs font-semibold text-brand-clay">
              {service.category.name}
            </UIText>
          </View>
          <View className="flex-1" />
          <View className="flex-row items-center gap-1">
            <MaterialCommunityIcons color="#F59E0B" name="star" size={14} />
            <UIText className="text-xs font-semibold text-brand-ink">
              {service.rating.toFixed(1)}
            </UIText>
            <MutedText className="text-xs">
              ({service.review_count})
            </MutedText>
          </View>
        </View>

        <UIText className="text-base font-semibold text-brand-ink" numberOfLines={1}>
          {service.title}
        </UIText>

        {variant === "list" ? (
          <MutedText className="text-sm leading-5" numberOfLines={2}>
            {service.short_description}
          </MutedText>
        ) : null}

        <View className="flex-row items-center justify-between pt-1">
          <UIText className="text-base font-bold text-brand-clay">
            {service.hourly_rate.toFixed(0)} MAD/h
          </UIText>
          <MutedText className="text-xs">
            {service.provider.full_name}
          </MutedText>
        </View>
      </View>
    </Pressable>
  );
});
