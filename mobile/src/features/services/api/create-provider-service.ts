import type {
  ProviderServiceFormValues,
  ProviderServiceListItem
} from "@/features/services/types";
import { supabase } from "@/lib/supabase";
import {
  createProviderServiceInsert,
  mapProviderServiceListItem,
  providerServiceListSelect,
  type ProviderServiceListRow
} from "@/features/services/api/shared";

export async function createProviderService(
  providerId: string,
  input: ProviderServiceFormValues
): Promise<ProviderServiceListItem> {
  const { data, error } = await supabase
    .from("provider_services")
    .insert(createProviderServiceInsert(input, providerId))
    .select(providerServiceListSelect)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("La creation de la prestation a echoue.");
  }

  return mapProviderServiceListItem(data as ProviderServiceListRow);
}
