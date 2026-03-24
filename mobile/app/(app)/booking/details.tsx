import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useQuery } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { MutedText, UIText } from '@/components/ui/text';
import { getTaskerProfile } from '@/features/services/api/get-tasker-profile';
import { useBookingFlowStore } from '@/store/booking-flow-store';
import { ScrollView, TextInput, View } from '@/tw';

export default function BookingDetailsRoute() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const notes = useBookingFlowStore((state) => state.notes);
  const offeringId = useBookingFlowStore((state) => state.offeringId);
  const scheduledFor = useBookingFlowStore((state) => state.scheduledFor);
  const setNotes = useBookingFlowStore((state) => state.setNotes);
  const taskerQuery = useQuery({
    enabled: Boolean(offeringId),
    queryFn: () => getTaskerProfile(Number(offeringId)),
    queryKey: ['tasker-profile', offeringId],
  });

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-white">
        <View
          className="flex-row items-center border-b border-brand-border bg-white px-5 pb-5"
          style={{ paddingTop: insets.top + 8 }}
        >
          <MaterialCommunityIcons
            color="#0A0A0A"
            name="chevron-left"
            onPress={() => router.back()}
            size={36}
          />
          <View className="flex-1 items-center">
            <UIText className="text-[20px] font-semibold">Détails de la task</UIText>
          </View>
          <View className="w-10" />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 pb-8"
          keyboardShouldPersistTaps="handled"
        >
          <View className="mt-8 gap-6">
            <UIText className="text-[22px] font-semibold leading-[34px]">
              Des détails supplémentaires aident votre Tasker à bien se préparer. Vous pourrez aussi
              échanger via le chat une fois la réservation effectuée.
            </UIText>

            {taskerQuery.data ? (
              <MutedText className="text-[16px] leading-7">
                Vous y êtes presque. Partagez des détails utiles avec{' '}
                {taskerQuery.data.provider.full_name} pour qu’il se prépare au mieux.
              </MutedText>
            ) : null}

            <TextInput
              className="min-h-[320px] rounded-[28px] border border-brand-border px-5 py-5 text-[18px] text-brand-ink"
              multiline
              onChangeText={setNotes}
              placeholder="J'ai besoin d'aide pour..."
              placeholderTextColor="#A3A3A3"
              textAlignVertical="top"
              value={notes}
            />

            <MutedText className="text-[15px] leading-7 text-[#5B5BD6]">
              Incluez des informations comme les outils nécessaires, la taille de votre espace et
              les instructions d'accès.
            </MutedText>
          </View>
        </ScrollView>

        <View
          className="border-t border-brand-border bg-white px-5 pt-4"
          style={{ paddingBottom: Math.max(insets.bottom, 24) }}
        >
          <Button
            disabled={!offeringId || !scheduledFor}
            onPress={() => router.push('/booking/confirm')}
          >
            Confirmer la task
          </Button>
        </View>
      </View>
    </>
  );
}
