type Environment = {
  appName: string;
  appScheme: string;
  supabaseUrl: string;
  supabasePublishableKey: string;
  resetPasswordRedirectUrl: string;
};

function requireStaticEnv(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const appScheme = requireStaticEnv(process.env.EXPO_PUBLIC_APP_SCHEME, 'EXPO_PUBLIC_APP_SCHEME');
const supabaseUrl = requireStaticEnv(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  'EXPO_PUBLIC_SUPABASE_URL',
);
const supabasePublishableKey = requireStaticEnv(
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  'EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
);

export const env: Environment = {
  appName: process.env.EXPO_PUBLIC_APP_NAME ?? 'EliteForce Multiservices',
  appScheme,
  supabaseUrl,
  supabasePublishableKey,
  resetPasswordRedirectUrl: `${appScheme}://update-password`,
};
