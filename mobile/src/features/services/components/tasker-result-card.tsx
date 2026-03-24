import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';

import { MutedText, UIText } from '@/components/ui/text';
import {
  formatCompactAvailability,
  formatHourlyRateLabel,
} from '@/features/services/lib/formatters';
import type { TaskerSearchResult } from '@/features/services/types';
import { Pressable, View } from '@/tw';
import { Image } from '@/tw/image';

type TaskerResultCardProps = {
  onPress: () => void;
  result: TaskerSearchResult;
};

export const TaskerResultCard = React.memo(function TaskerResultCard({
  onPress,
  result,
}: TaskerResultCardProps) {
  return (
    <Pressable className="border-b border-brand-border pb-6" onPress={onPress}>
      <View className="flex-row items-start gap-4">
        <Image
          className="h-20 w-20 rounded-full bg-brand-sand-strong"
          contentFit="cover"
          source={
            result.provider.avatar_url ??
            'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
          }
        />

        <View className="flex-1 gap-2">
          <View className="flex-row items-start justify-between gap-4">
            <View className="flex-1 gap-1">
              <UIText className="text-[21px] font-semibold">{result.provider.full_name}</UIText>
              {result.provider.is_elite ? (
                <View className="self-start rounded-xl bg-[#E7E6FF] px-3 py-1">
                  <UIText className="text-xs font-semibold text-[#5B5BD6]">ELITE</UIText>
                </View>
              ) : null}
            </View>

            <UIText className="text-[18px] font-semibold">
              {formatHourlyRateLabel(result.hourly_rate)}
            </UIText>
          </View>

          <View className="flex-row items-center gap-2">
            <MaterialCommunityIcons color="#111827" name="star" size={18} />
            <UIText className="text-sm font-semibold">
              {result.provider.rating.toFixed(1)} ({result.provider.review_count} avis)
            </UIText>
          </View>

          <View className="flex-row items-start gap-2">
            <MaterialCommunityIcons color="#111827" name="check-decagram" size={18} />
            <View className="flex-1 flex-row flex-wrap items-center gap-1">
              <UIText className="text-sm font-semibold">{result.category.name}</UIText>
              <MutedText className="text-sm leading-5">
                : {result.completed_task_count} tasks
              </MutedText>
            </View>
          </View>

          <MutedText className="text-sm leading-5" numberOfLines={3}>
            {result.provider.bio}
          </MutedText>

          <View className="flex-row items-center justify-between">
            <MutedText className="text-sm text-brand-clay">
              {formatCompactAvailability(result.next_available_at)}
            </MutedText>
            <UIText className="text-sm font-semibold text-brand-clay">Voir le profil</UIText>
          </View>
        </View>
      </View>
    </Pressable>
  );
});
