import { Spinner } from '@/components/ui/spinner';
import { Heading, MutedText } from '@/components/ui/text';
import { View } from '@/tw';

export function BootstrapScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-brand-sand px-8">
      <View className="w-full max-w-sm rounded-2xl bg-brand-card p-8 shadow-sm">
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
