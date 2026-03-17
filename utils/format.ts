export function formatNumber(value: number, maximumFractionDigits: number = 0) {
  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits,
    minimumFractionDigits: maximumFractionDigits > 0 ? 1 : 0,
  }).format(value);
}

export function formatTonnes(value: number) {
  return `${formatNumber(value, 1)} tCO₂e`;
}

export function formatKg(value: number) {
  return `${formatNumber(value, 0)} kgCO₂e`;
}

export function formatDate(dateIso: string) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateIso));
}

/**
 * Extrait le prénom de l'email pour l'affichage.
 * Ex: adama.barry@capgemini.com => "Adama"
 */
export function getDisplayNameFromEmail(email: string): string {
  if (!email?.trim()) return '';
  const localPart = email.split('@')[0]?.trim() || '';
  const firstSegment = localPart.split(/[._-]/)[0] || '';
  if (!firstSegment) return '';
  return firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1).toLowerCase();
}
