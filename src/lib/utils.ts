export function cn(...inputs: string[]) {
  return inputs.filter(Boolean).join(' ')
}

export function generateSlug(title: string): string {
  const azMap: Record<string, string> = {
    'ə': 'e', 'ı': 'i', 'ö': 'o', 'ü': 'u', 'ğ': 'g', 'ş': 's', 'ç': 'c',
    'Ə': 'e', 'I': 'i', 'Ö': 'o', 'Ü': 'u', 'Ğ': 'g', 'Ş': 's', 'Ç': 'c'
  }
  
  return title
    .toLowerCase()
    .split('')
    .map(char => azMap[char] || char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('az-AZ', {
    style: 'currency',
    currency: 'AZN',
    minimumFractionDigits: 0,
  }).format(price)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('az-AZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function calculateDays(checkIn: Date, checkOut: Date): number {
  const diff = checkOut.getTime() - checkIn.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function getPropertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    VILLA: 'Villa',
    APARTMENT: 'Mənzil',
    HOUSE: 'Ev',
    PENTHOUSE: 'Penthouse',
    COTTAGE: 'Bağ Evi',
  }
  return labels[type] || type
}
