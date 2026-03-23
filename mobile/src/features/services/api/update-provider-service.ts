import type {
  ProviderServiceFormValues,
  ProviderServiceListItem
} from "@/features/services/types";
import { supabase } from "@/lib/supabase";
import {
  createProviderServiceUpdate,
  mapProviderServiceListItem,
  providerServiceListSelect,
  type ProviderServiceListRow
} from "@/features/services/api/shared";

export async function updateProviderService(
  serviceId: number,
  input: ProviderServiceFormValues
): Promise<ProviderServiceListItem> {
  const { data, error } = await supabase
    .from("provider_services")
    .update(createProviderServiceUpdate(input))
    .eq("id", serviceId)
    .select(providerServiceListSelect)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("La mise a jour de la prestation a echoue.");
  }

  return mapProviderServiceListItem(data as ProviderServiceListRow);
}
