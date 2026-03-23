import type { ConfigContext, ExpoConfig } from "@expo/config";

const appName =
  process.env.EXPO_PUBLIC_APP_NAME ?? "EliteForce Multiservices";
const appScheme = process.env.EXPO_PUBLIC_APP_SCHEME ?? "eliteforce";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: appName,
  slug: "eliteforce-multiservices",
  scheme: appScheme,
  orientation: "portrait",
  userInterfaceStyle: "light",
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.eliteforce.multiservices"
  },
  android: {
    package: "com.eliteforce.multiservices"
  },
  web: {
    bundler: "metro"
  },
  plugins: ["expo-router"],
  experiments: {
    typedRoutes: true
  },
  extra: {
    appName,
    appScheme
  }
});
