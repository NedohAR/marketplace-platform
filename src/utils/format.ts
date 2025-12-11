export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price)
}

export function formatDate(dateString: string, options?: { year?: boolean }): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    ...(options?.year && { year: 'numeric' }),
  })
}

