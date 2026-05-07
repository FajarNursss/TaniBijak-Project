import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Sprout, CalendarDays, CloudSun,
  BellRing, MapPin, BookHeart, History, UserRound,
  LogOut, X
} from 'lucide-react'

const userMenu = [
  { path: '/dashboard',     icon: LayoutDashboard, label: 'Beranda' },
  { path: '/rekomendasi',   icon: Sprout,           label: 'Rekomendasi Tanam' },
  { path: '/kalender',      icon: CalendarDays,     label: 'Kalender Tanam' },
  { path: '/cuaca',         icon: CloudSun,         label: 'Cuaca & Iklim' },
  { path: '/peringatan',    icon: BellRing,         label: 'Peringatan Risiko' },
  { path: '/lahan',         icon: MapPin,           label: 'Lahan Saya' },
  { path: '/kearifan-lokal',icon: BookHeart,        label: 'Kearifan Lokal' },
  { path: '/riwayat',       icon: History,          label: 'Riwayat Tanam' },
  { path: '/profil',        icon: UserRound,        label: 'Profil' },
]

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={onClose} />
      )}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-30 flex flex-col transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>

        {/* Logo */}
        <div className="p-5 border-b border-gray-100 flex items-center gap-3">
          <img src="/src/assets/logo_tanibijak.png" alt="TaniBijak Logo" className="w-10 h-10 object-contain" />
          {/* <div className="w-10 h-10 bg-primary-800 rounded-xl flex items-center justify-center shadow-md">
            <Wheat size={20} className="text-white" strokeWidth={2} />
          </div> */}
          <div>
            <h1 className="font-bold text-primary-800 text-lg leading-tight">TaniBijak</h1>
            <p className="text-xs text-gray-400">Smart Farming Platform</p>
          </div>
          <button onClick={onClose} className="ml-auto lg:hidden text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {/* User Info */}
        <div className="px-4 py-3 bg-primary-50 mx-3 mt-3 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-800 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-gray-800 truncate">{user?.name || 'Pengguna'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {userMenu.map(({ path, icon: Icon, label }) => (
            <NavLink key={path} to={path} onClick={onClose}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Icon size={18} strokeWidth={1.8} />
              <span className="text-sm">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 font-medium transition-all duration-200">
            <LogOut size={18} strokeWidth={1.8} />
            <span className="text-sm">Keluar</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
