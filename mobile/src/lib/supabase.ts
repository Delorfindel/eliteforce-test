import 'expo-sqlite/localStorage/install';
import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';

import { env } from '@/lib/env';
import { uiStorage } from '@/lib/storage';
import type { Database } from '@/types/database.types';

export const supabase = createClient<Database>(env.supabaseUrl, env.supabasePublishableKey, {
  auth: {
    storage: uiStorage.driver,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
