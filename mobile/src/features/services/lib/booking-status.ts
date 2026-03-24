const BOOKING_STATUS_LABELS = {
  cancelled: 'Annulée',
  completed: 'Terminée',
  confirmed: 'Confirmée',
} as const;

type BookingBadge = {
  containerClassName: string;
  label: string;
  textClassName: string;
};

export function isBookingPast(scheduledFor: string, now = Date.now()) {
  return new Date(scheduledFor).getTime() < now;
}

export function getBookingTimelineLabel(scheduledFor: string, now = Date.now()) {
  return isBookingPast(scheduledFor, now) ? 'Passée' : 'À venir';
}

export function getBookingStatusLabel(status: string) {
  return BOOKING_STATUS_LABELS[status as keyof typeof BOOKING_STATUS_LABELS] ?? status;
}

export function getBookingBadge(
  status: string,
  scheduledFor: string,
  now = Date.now(),
): BookingBadge {
  if (status === 'cancelled') {
    return {
      containerClassName: 'bg-brand-sand-strong',
      label: 'Annulée',
      textClassName: 'text-brand-danger',
    };
  }

  if (isBookingPast(scheduledFor, now)) {
    return {
      containerClassName: 'bg-brand-sand-strong',
      label: 'Passée',
      textClassName: 'text-brand-ink-soft',
    };
  }

  return {
    containerClassName: 'bg-brand-accent-light',
    label: 'À venir',
    textClassName: 'text-brand-clay',
  };
}
