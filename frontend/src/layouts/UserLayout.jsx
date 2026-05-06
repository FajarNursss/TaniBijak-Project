import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'
import ChatbotToggle from '../components/common/ChatbotToggle'

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/rekomendasi': 'Rekomendasi Tanam',
  '/kalender': 'Kalender Tanam',
  '/cuaca': 'Cuaca & Iklim',
  '/peringatan': 'Peringatan Risiko',
  '/lahan': 'Lahan Saya',
  '/kearifan-lokal': 'Kearifan Lokal',
  '/riwayat': 'Riwayat Tanam',
  '/profil': 'Profil Saya',
}

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'TaniBijak'

  return (
    <div className="flex h-screen bg-app-bg overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuToggle={() => setSidebarOpen(v => !v)} title={title} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
      <ChatbotToggle />
    </div>
  )
}

export default UserLayout
