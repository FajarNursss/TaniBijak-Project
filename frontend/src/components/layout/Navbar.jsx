import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'
import { Menu, Bell, Info, AlertTriangle, AlertCircle, ChevronRight } from 'lucide-react'

const notifIcon = { info: Info, warning: AlertTriangle, danger: AlertCircle }
const notifColor = { info: 'text-blue-500', warning: 'text-yellow-500', danger: 'text-red-500' }
const notifBg = { info: 'bg-blue-50/70', warning: 'bg-yellow-50/70', danger: 'bg-red-50/70' }

const Navbar = ({ onMenuToggle, title = 'Beranda' }) => {
  const { user } = useAuth()
  const { notifications, unreadCount, markAsRead, markAllRead } = useNotification()
  const [showNotif, setShowNotif] = useState(false)
  const notifRef = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="bg-white border-b border-gray-100 px-4 lg:px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors">
          <Menu size={22} strokeWidth={1.8} />
        </button>
        <div>
          <h2 className="font-bold text-gray-800 text-lg leading-tight">{title}</h2>
          <p className="text-xs text-gray-400 hidden sm:block">
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Bell */}
        <div className="relative" ref={notifRef}>
          <button onClick={() => setShowNotif(v => !v)}
            className="relative p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-primary-700 transition-colors">
            <Bell size={20} strokeWidth={1.8} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 fade-in overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h3 className="font-bold text-gray-800 text-sm">🔔 Notifikasi</h3>
                <button onClick={markAllRead} className="text-xs text-primary-700 hover:underline font-medium">Tandai semua dibaca</button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-400 text-sm">Tidak ada notifikasi 🎉</div>
                ) : (
                  notifications.slice(0, 5).map(n => {
                    const Icon = notifIcon[n.type] || Info
                    return (
                      <div key={n.id} onClick={() => markAsRead(n.id)}
                        className={`flex gap-3 px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? notifBg[n.type] : ''}`}>
                        <Icon size={18} strokeWidth={1.8} className={`mt-0.5 flex-shrink-0 ${notifColor[n.type]}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm text-gray-800 truncate">{n.title}</p>
                            {!n.read && <div className="w-1.5 h-1.5 bg-primary-500 rounded-full flex-shrink-0" />}
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2">{n.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
              <Link to="/peringatan" onClick={() => setShowNotif(false)}
                className="flex items-center justify-center gap-1 px-4 py-3 text-sm text-primary-700 font-semibold hover:bg-primary-50 transition-colors border-t border-gray-100">
                Lihat Semua <ChevronRight size={14} />
              </Link>
            </div>
          )}
        </div>

        {/* Avatar */}
        <Link to="/profil" className="flex items-center gap-2 hover:bg-gray-100 px-3 py-2 rounded-xl transition-colors">
          <div className="w-8 h-8 bg-primary-800 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <span className="text-sm font-semibold text-gray-700 hidden sm:block truncate max-w-24">{user?.name?.split(' ')[0]}</span>
        </Link>
      </div>
    </header>
  )
}

export default Navbar
