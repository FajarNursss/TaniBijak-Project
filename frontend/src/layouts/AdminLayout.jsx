import React, { useState } from 'react'
import { Outlet, useLocation, Link } from 'react-router-dom'
import AdminSidebar from '../components/layout/AdminSidebar'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { Menu, Bell } from 'lucide-react'

const adminPageTitles = {
  '/admin/dashboard':  'Dashboard Admin',
  '/admin/users':      'Manajemen User',
  '/admin/lahan':      'Manajemen Lahan',
  '/admin/kearifan':   'Manajemen Kearifan Lokal',
  '/admin/notifikasi': 'Manajemen Notifikasi',
  '/admin/monitoring': 'Monitoring Aktivitas',
  '/admin/pengaturan': 'Pengaturan Sistem',
}

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { user } = useAuth()
  const { unreadCount } = useNotification()
  const title = adminPageTitles[location.pathname] || 'Admin Panel'

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(v => !v)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors">
              <Menu size={22} strokeWidth={1.8} />
            </button>
            <div>
              <h2 className="font-bold text-gray-800 text-lg">{title}</h2>
              <p className="text-xs text-gray-400 hidden sm:block">
                {new Date().toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin/notifikasi" className="relative p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-primary-700 transition-colors">
              <Bell size={20} strokeWidth={1.8} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </Link>
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-xl">
              <div className="w-8 h-8 bg-primary-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <span className="text-sm font-semibold text-gray-700 hidden sm:block">{user?.name?.split(' ')[0]}</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
