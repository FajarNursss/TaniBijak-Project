import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  BarChart3, Users, Map, BookOpen, Bell,
  Activity, Settings, LogOut, Wheat, X, Shield
} from 'lucide-react'

const adminMenu = [
  { path: '/admin/dashboard',  icon: BarChart3,  label: 'Beranda' },
  { path: '/admin/users',      icon: Users,      label: 'Manajemen User' },
  { path: '/admin/lahan',      icon: Map,        label: 'Manajemen Lahan' },
  { path: '/admin/kearifan',   icon: BookOpen,   label: 'Kearifan Lokal' },
  { path: '/admin/notifikasi', icon: Bell,       label: 'Notifikasi' },
  { path: '/admin/monitoring', icon: Activity,   label: 'Monitoring' },
  { path: '/admin/pengaturan', icon: Settings,   label: 'Pengaturan' },
]

const AdminSidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-900 shadow-xl z-30 flex flex-col transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>

        {/* Logo */}
        <div className="p-5 border-b border-gray-700 flex items-center gap-3">
          <img src="/src/assets/logo_tanibijak.png" alt="TaniBijak Logo" className="w-10 h-10 object-contain" />
          {/* <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-md">
            <Wheat size={20} className="text-white" strokeWidth={2} />
          </div> */}
          <div>
            <h1 className="font-bold text-white text-lg leading-tight">TaniBijak</h1>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
          <button onClick={onClose} className="ml-auto lg:hidden text-gray-400 hover:text-white"><X size={18} /></button>
        </div>

        {/* Admin Info */}
        <div className="px-4 py-3 bg-gray-800 mx-3 mt-3 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 font-bold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-white truncate">{user?.name || 'Admin'}</p>
              <span className="flex items-center gap-1 text-xs text-yellow-400 font-semibold mt-0.5">
                <Shield size={11} strokeWidth={2} /> Administrator
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {adminMenu.map(({ path, icon: Icon, label }) => (
            <NavLink key={path} to={path} onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-sm
                ${isActive ? 'bg-primary-700 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`
              }>
              <Icon size={18} strokeWidth={1.8} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-gray-800 font-medium transition-all duration-200">
            <LogOut size={18} strokeWidth={1.8} />
            <span className="text-sm">Keluar</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default AdminSidebar
