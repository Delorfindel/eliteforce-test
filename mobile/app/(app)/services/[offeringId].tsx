import { Redirect, useLocalSearchParams } from 'expo-router';

import { ProviderServiceEditorScreen } from '@/features/services/components/provider-service-editor-screen';

export default function ProviderServiceDetailRoute() {
  const { offeringId } = useLocalSearchParams<{ offeringId: string }>();
  const parsedOfferingId = Number.parseInt(offeringId ?? '', 10);

  if (!Number.isFinite(parsedOfferingId)) {
    return <Redirect href="/services" />;
  }

  return <ProviderServiceEditorScreen offeringId={parsedOfferingId} />;
}
