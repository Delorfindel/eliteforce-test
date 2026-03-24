export function formatHourlyRate(amount: number) {
  return new Intl.NumberFormat('fr-FR', {
    currency: 'EUR',
    style: 'currency',
  }).format(amount);
}

export function formatHourlyRateLabel(amount: number) {
  return `${formatHourlyRate(amount)} / h`;
}

export function formatBookingDateTime(value: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'long',
  }).format(new Date(value));
}

export function formatBookingDate(value: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    weekday: 'short',
  }).format(new Date(value));
}

export function formatBookingTime(value: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

export function formatCompactAvailability(value: string | null) {
  if (!value) {
    return 'Flexible';
  }

  return `Disponible ${formatBookingDateTime(value)}`;
}

export function formatJoinDate(value: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

export function formatReviewDate(value: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}
