import React from 'react'
import { useNotification } from '../../context/NotificationContext'
import NotificationItem from '../../components/ui/NotificationItem'
import { BellRing, AlertCircle, AlertTriangle, Info, CheckCheck, Smile } from 'lucide-react'

const Peringatan = () => {
  const { notifications, markAsRead, markAllRead, deleteNotification, unreadCount } = useNotification()

  const grouped = {
    danger:  notifications.filter(n => n.type === 'danger'),
    warning: notifications.filter(n => n.type === 'warning'),
    info:    notifications.filter(n => n.type === 'info'),
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BellRing size={22} strokeWidth={2} /> Peringatan & Risiko
            </h2>
            <p className="text-orange-100 text-sm mt-1">Monitor risiko pertanian Anda secara real-time</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
              <p className="text-2xl font-bold">{unreadCount}</p>
              <p className="text-xs text-orange-100">Belum dibaca</p>
            </div>
            <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
              <p className="text-2xl font-bold">{notifications.length}</p>
              <p className="text-xs text-orange-100">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary & actions */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          <span className="badge bg-red-100 text-red-700 flex items-center gap-1.5">
            <AlertCircle size={13} strokeWidth={2} /> Bahaya ({grouped.danger.length})
          </span>
          <span className="badge bg-yellow-100 text-yellow-700 flex items-center gap-1.5">
            <AlertTriangle size={13} strokeWidth={2} /> Peringatan ({grouped.warning.length})
          </span>
          <span className="badge bg-blue-100 text-blue-700 flex items-center gap-1.5">
            <Info size={13} strokeWidth={2} /> Info ({grouped.info.length})
          </span>
        </div>
        <button onClick={markAllRead} className="text-sm text-primary-700 font-semibold hover:underline flex items-center gap-1.5">
          <CheckCheck size={16} strokeWidth={2} /> Tandai Semua Dibaca
        </button>
      </div>

      {grouped.danger.length > 0 && (
        <div>
          <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2">
            <AlertCircle size={18} strokeWidth={1.8} /> Peringatan Bahaya
          </h3>
          <div className="space-y-3">{grouped.danger.map(n => <NotificationItem key={n.id} notification={n} onRead={markAsRead} onDelete={deleteNotification} />)}</div>
        </div>
      )}

      {grouped.warning.length > 0 && (
        <div>
          <h3 className="font-bold text-yellow-700 mb-3 flex items-center gap-2">
            <AlertTriangle size={18} strokeWidth={1.8} /> Peringatan Waspada
          </h3>
          <div className="space-y-3">{grouped.warning.map(n => <NotificationItem key={n.id} notification={n} onRead={markAsRead} onDelete={deleteNotification} />)}</div>
        </div>
      )}

      {grouped.info.length > 0 && (
        <div>
          <h3 className="font-bold text-blue-700 mb-3 flex items-center gap-2">
            <Info size={18} strokeWidth={1.8} /> Informasi
          </h3>
          <div className="space-y-3">{grouped.info.map(n => <NotificationItem key={n.id} notification={n} onRead={markAsRead} onDelete={deleteNotification} />)}</div>
        </div>
      )}

      {notifications.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <Smile size={56} strokeWidth={1.2} className="mx-auto text-gray-300 mb-4" />
          <p className="font-semibold text-lg">Tidak ada peringatan aktif</p>
          <p className="text-sm mt-1">Semua lahan Anda dalam kondisi aman 🌿</p>
        </div>
      )}
    </div>
  )
}

export default Peringatan
