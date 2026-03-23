import type { ServiceRecord } from "@/features/services/types";
import { supabase } from "@/lib/supabase";

export async function listFeaturedServices(): Promise<ServiceRecord[]> {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("featured_rank", { ascending: true, nullsFirst: false })
    .limit(6);

  if (error) {
    throw error;
  }

  return data as ServiceRecord[];
}
