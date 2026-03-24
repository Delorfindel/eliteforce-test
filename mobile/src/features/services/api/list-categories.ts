import type { ServiceCategory } from '@/features/services/types';
import { supabase } from '@/lib/supabase';

export async function listCategories(): Promise<ServiceCategory[]> {
  const { data, error } = await supabase
    .from('service_categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    throw error;
  }

  return data as ServiceCategory[];
}
