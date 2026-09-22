export function formatPrice(amount: number, currency: string = 'Rs.'): string {
  return `${currency} ${amount.toLocaleString()}`;
}

export function formatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }) + ', ' + date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return isoString;
  }
}

export function getRelativeTime(isoString: string): string {
  try {
    const ms = Date.now() - new Date(isoString).getTime();
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${Math.max(1, seconds)}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  } catch {
    return '';
  }
}
