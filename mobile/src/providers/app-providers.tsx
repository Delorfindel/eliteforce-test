import type { Session, User } from '@supabase/supabase-js';
import { focusManager, onlineManager, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { queryClient } from '@/lib/query-client';
import { supabase } from '@/lib/supabase';
import { useUIStore } from '@/store/ui-store';

type AuthContextValue = {
  isHydrating: boolean;
  session: Session | null;
  user: User | null;
};

const AuthSessionContext = React.createContext<AuthContextValue | undefined>(undefined);

type AppProvidersProps = {
  children: React.ReactNode;
};

function handleAppStateChange(status: AppStateStatus) {
  const isActive = status === 'active';
  focusManager.setFocused(isActive);
  onlineManager.setOnline(isActive);
}

export function AppProviders({ children }: AppProvidersProps) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [isHydrating, setIsHydrating] = React.useState(true);
  const setAuthHydrated = useUIStore((state) => state.setAuthHydrated);

  React.useEffect(() => {
    let active = true;
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    void supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) {
          return;
        }

        setSession(data.session);
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setSession(null);
      })
      .finally(() => {
        if (!active) {
          return;
        }

        setIsHydrating(false);
        setAuthHydrated(true);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsHydrating(false);
      setAuthHydrated(true);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
      appStateSubscription.remove();
    };
  }, [setAuthHydrated]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthSessionContext.Provider
        value={{
          isHydrating,
          session,
          user: session?.user ?? null,
        }}
      >
        {children}
      </AuthSessionContext.Provider>
    </QueryClientProvider>
  );
}

export function useAuthContext() {
  const context = React.useContext(AuthSessionContext);

  if (!context) {
    throw new Error('useAuthContext must be used within AppProviders.');
  }

  return context;
}
