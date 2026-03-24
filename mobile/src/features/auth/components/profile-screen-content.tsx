import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useMutation } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MutedText, UIText } from '@/components/ui/text';
import { useAuthSession } from '@/features/auth/hooks/use-auth-session';
import { ProviderServicesManager } from '@/features/services/components/provider-services-manager';
import { supabase } from '@/lib/supabase';
import { Pressable, ScrollView, View } from '@/tw';

type ProfileScreenContentProps = {
  onSignedOut: () => void;
};

type ProfileRowProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
};

function ProfileRow({ icon, label, value }: ProfileRowProps) {
  return (
    <View className="flex-row items-center gap-4 py-3">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-brand-sand-strong">
        <MaterialCommunityIcons color="#525252" name={icon} size={18} />
      </View>
      <View className="flex-1 gap-0.5">
        <MutedText className="text-xs">{label}</MutedText>
        <UIText className="text-sm font-semibold">{value}</UIText>
      </View>
    </View>
  );
}

type MenuItemProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress?: () => void;
  destructive?: boolean;
};

function MenuItem({ icon, label, onPress, destructive }: MenuItemProps) {
  return (
    <Pressable className="flex-row items-center gap-4 py-3.5" onPress={onPress}>
      <View
        className={`h-10 w-10 items-center justify-center rounded-full ${
          destructive ? 'bg-[#fef3f2]' : 'bg-brand-sand-strong'
        }`}
      >
        <MaterialCommunityIcons color={destructive ? '#DC2626' : '#525252'} name={icon} size={18} />
      </View>
      <UIText
        className={`flex-1 text-sm font-semibold ${
          destructive ? 'text-brand-danger' : 'text-brand-ink'
        }`}
      >
        {label}
      </UIText>
      {!destructive ? (
        <MaterialCommunityIcons color="#A3A3A3" name="chevron-right" size={20} />
      ) : null}
    </Pressable>
  );
}

export function ProfileScreenContent({ onSignedOut }: ProfileScreenContentProps) {
  const insets = useSafeAreaInsets();
  const { profile, user } = useAuthSession();
  const isProvider = profile?.role === 'provider';

  const signOutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: onSignedOut,
  });

  const initials = profile ? `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}` : '?';

  return (
    <ScrollView
      className="flex-1 bg-brand-sand"
      contentContainerClassName="gap-6 px-5 pb-10"
      contentContainerStyle={{ paddingTop: insets.top + 24 }}
    >
      <View className="items-center gap-3">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-brand-clay">
          <UIText className="text-2xl font-bold text-white">{initials}</UIText>
        </View>
        <View className="items-center gap-0.5">
          <UIText className="text-xl font-semibold">
            {profile ? `${profile.first_name} ${profile.last_name}` : 'Chargement...'}
          </UIText>
          {profile?.role === 'provider' ? (
            <View className="mt-1 rounded-full bg-brand-accent-light px-3 py-1">
              <UIText className="text-xs font-semibold text-brand-clay">Prestataire</UIText>
            </View>
          ) : null}
        </View>
      </View>

      <View className="rounded-2xl bg-white shadow-sm">
        <View className="px-5">
          <ProfileRow
            icon="email-outline"
            label="Email"
            value={profile?.email ?? user?.email ?? 'Non renseigné'}
          />
          <View className="h-px bg-brand-border" />
          <ProfileRow
            icon="phone-outline"
            label="Téléphone"
            value={profile?.phone ?? 'Non renseigné'}
          />
          <View className="h-px bg-brand-border" />
          <ProfileRow
            icon="shield-account-outline"
            label="Rôle"
            value={profile?.role === 'provider' ? 'Prestataire' : 'Client'}
          />
        </View>
      </View>

      {isProvider && profile ? <ProviderServicesManager providerId={profile.id} /> : null}

      <View className="rounded-2xl bg-white shadow-sm">
        <View className="px-5">
          <MenuItem icon="cog-outline" label="Paramètres" />
          <View className="h-px bg-brand-border" />
          <MenuItem icon="help-circle-outline" label="Aide & support" />
          <View className="h-px bg-brand-border" />
          <MenuItem icon="information-outline" label="À propos" />
        </View>
      </View>

      <View className="rounded-2xl bg-white shadow-sm">
        <View className="px-5">
          <MenuItem
            destructive
            icon="logout"
            label={signOutMutation.isPending ? 'Déconnexion...' : 'Se déconnecter'}
            onPress={() => signOutMutation.mutate()}
          />
        </View>
      </View>
    </ScrollView>
  );
}
