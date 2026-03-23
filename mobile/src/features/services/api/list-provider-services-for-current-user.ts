import type { ProviderServiceListItem } from "@/features/services/types";
import { supabase } from "@/lib/supabase";
import {
  mapProviderServiceListItem,
  providerServiceListSelect,
  type ProviderServiceListRow
} from "@/features/services/api/shared";

export async function listProviderServicesForCurrentUser(
  providerId: string
): Promise<ProviderServiceListItem[]> {
  const { data, error } = await supabase
    .from("provider_services")
    .select(providerServiceListSelect)
    .eq("provider_id", providerId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((item) =>
    mapProviderServiceListItem(item as ProviderServiceListRow)
  );
}
