// Format date to Indonesian locale
export const formatDate = (dateStr, options = {}) => {
  if (!dateStr) return '—'
  const defaults = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString('id-ID', { ...defaults, ...options })
}

// Format number to Indonesian
export const formatNumber = (num) => {
  return new Intl.NumberFormat('id-ID').format(num)
}

// Format currency to Rupiah
export const formatRupiah = (amount) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2)
}

// Truncate text
export const truncate = (str, length = 50) => {
  if (!str) return ''
  return str.length > length ? str.substring(0, length) + '...' : str
}

// Get notification color class
export const getNotifColorClass = (type) => {
  const map = {
    info: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    warning: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    danger: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  }
  return map[type] || map.info
}

// Calculate days difference
export const daysDiff = (date1, date2 = new Date()) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return Math.round(Math.abs((d2 - d1) / (1000 * 60 * 60 * 24)))
}

// Debounce function
export const debounce = (func, delay = 300) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => func(...args), delay)
  }
}
