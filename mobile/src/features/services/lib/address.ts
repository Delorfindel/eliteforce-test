import type { Database } from '@/types/database.types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export function getSavedAddress(profile: ProfileRow | null) {
  if (!profile?.default_address) {
    return null;
  }

  return {
    details: profile.default_address_details ?? '',
    label: profile.default_address,
  };
}

export function getAddressHeadline(address: string | null | undefined) {
  if (!address) {
    return 'Ajouter une adresse';
  }

  const segments = address
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (segments.length >= 2) {
    return segments[segments.length - 2] ?? address;
  }

  return address;
}

export function formatAddressWithDetails(address: string, details?: string | null) {
  if (!details?.trim()) {
    return address;
  }

  return `${address} · ${details.trim()}`;
}
