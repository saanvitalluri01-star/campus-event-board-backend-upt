import { format, formatDistanceToNow, isPast, isToday } from 'date-fns'

export const formatDate = (date) => format(new Date(date), 'MMM d, yyyy')
export const formatDateTime = (date) => format(new Date(date), 'MMM d, yyyy • h:mm a')
export const formatRelative = (date) => formatDistanceToNow(new Date(date), { addSuffix: true })
export const isEventPast = (date) => isPast(new Date(date))
export const isEventToday = (date) => isToday(new Date(date))

export const truncate = (str, n = 120) =>
  str?.length > n ? str.slice(0, n) + '…' : str

export const categoryColors = {
  tech:      'bg-blue-100 text-blue-700',
  cultural:  'bg-purple-100 text-purple-700',
  sports:    'bg-green-100 text-green-700',
  academic:  'bg-yellow-100 text-yellow-700',
  social:    'bg-pink-100 text-pink-700',
  other:     'bg-gray-100 text-gray-700',
}

export const statusColors = {
  upcoming:  'bg-emerald-100 text-emerald-700',
  ongoing:   'bg-blue-100 text-blue-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
}

export const CATEGORIES = ['academic', 'cultural', 'sports', 'tech', 'social', 'other']
export const STATUSES   = ['upcoming', 'ongoing', 'completed', 'cancelled']

export const getErrorMessage = (err) =>
  err?.response?.data?.message ||
  err?.response?.data?.errors?.[0]?.message ||
  err?.message ||
  'Something went wrong'
