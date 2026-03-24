import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import { BootstrapScreen } from '@/components/ui/bootstrap-screen';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';

export default function TabsLayout() {
  const { isAuthenticated, isProfileLoading, profile } = useAuthSession();
  const isProvider = profile?.role === 'provider';

  if (isAuthenticated && isProfileLoading) {
    return <BootstrapScreen />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#0A0A0A',
        sceneStyle: {
          backgroundColor: '#FFFFFF',
        },
        tabBarActiveTintColor: '#0E7051',
        tabBarInactiveTintColor: '#A3A3A3',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E5E5',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: isProvider ? null : undefined,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons color={color} name="home-variant" size={size} />
          ),
          title: 'Accueil',
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          href: isProvider ? null : undefined,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons color={color} name="magnify" size={size} />
          ),
          title: 'Recherche',
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons color={color} name="calendar-clock" size={size} />
          ),
          title: 'Réservations',
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          href: isProvider ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons color={color} name="briefcase-outline" size={size} />
          ),
          title: 'Services',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons color={color} name="account-circle" size={size} />
          ),
          title: 'Profil',
        }}
      />
    </Tabs>
  );
}
