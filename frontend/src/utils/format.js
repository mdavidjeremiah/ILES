import { STATUS_LABELS } from '../data/navigation'

export const todayISO = () => new Date().toISOString().slice(0, 10)

export const formatDate = (value) => {
  if (!value) return 'Not set'
  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}

export const formatNumber = (value) => new Intl.NumberFormat().format(value || 0)

export const labelize = (value) => STATUS_LABELS[value] || String(value || '').replaceAll('_', ' ')

export const initials = (name = 'User') =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
