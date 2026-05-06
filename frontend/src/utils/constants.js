// API Constants
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

// Role Constants
export const ROLES = { USER: 'user', ADMIN: 'admin' }

// Notification Types
export const NOTIF_TYPES = { INFO: 'info', WARNING: 'warning', DANGER: 'danger' }

// Land Types
export const JENIS_LAHAN = ['Sawah', 'Kebun', 'Ladang', 'Perkebunan', 'Tegal']

// Nitrogen Levels
export const NITROGEN_LEVELS = ['Rendah', 'Sedang', 'Tinggi']

// Seasons
export const MUSIM = ['Hujan', 'Kemarau', 'Pancaroba']

// Kearifan Lokal Categories
export const KEARIFAN_KATEGORI = ['Musim', 'Irigasi', 'Teknik Tanam', 'Rotasi', 'Varietas', 'Konservasi']

// Pagination
export const DEFAULT_PAGE_SIZE = 10

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'tanibijak_token',
  USER: 'tanibijak_user',
}
