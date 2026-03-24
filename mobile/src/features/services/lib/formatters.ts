export function formatHourlyRate(amount: number) {
  return `${amount.toFixed(2)} MAD / h`;
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
