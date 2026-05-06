import React from 'react'
import { Info, AlertTriangle, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react'

const notifStyles = {
  info:    { wrapper: 'bg-blue-50 border-blue-200',   Icon: Info,          iconColor: 'text-blue-500',   title: 'text-blue-800' },
  warning: { wrapper: 'bg-yellow-50 border-yellow-200', Icon: AlertTriangle, iconColor: 'text-yellow-500', title: 'text-yellow-800' },
  danger:  { wrapper: 'bg-red-50 border-red-200',     Icon: AlertCircle,   iconColor: 'text-red-500',    title: 'text-red-800' },
}

const NotificationItem = ({ notification, onRead, onDelete }) => {
  const style = notifStyles[notification.type] || notifStyles.info
  const { Icon } = style

  return (
    <div className={`flex gap-4 p-4 rounded-2xl border transition-all duration-200 ${style.wrapper} ${!notification.read ? 'shadow-sm' : 'opacity-80'}`}>
      <Icon size={22} strokeWidth={1.8} className={`mt-0.5 flex-shrink-0 ${style.iconColor}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className={`font-bold text-sm ${style.title}`}>{notification.title}</h4>
          {!notification.read && <div className={`w-2 h-2 rounded-full flex-shrink-0 ${style.iconColor.replace('text-', 'bg-')}`} />}
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{notification.message}</p>
        <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
      </div>
      <div className="flex flex-col gap-2 flex-shrink-0">
        {!notification.read && (
          <button onClick={() => onRead(notification.id)}
            className={`flex items-center gap-1 text-xs font-medium hover:underline whitespace-nowrap ${style.iconColor}`}>
            <CheckCircle2 size={13} /> Tandai dibaca
          </button>
        )}
        {onDelete && (
          <button onClick={() => onDelete(notification.id)}
            className="flex items-center gap-1 text-xs text-red-400 hover:underline font-medium">
            <Trash2 size={13} /> Hapus
          </button>
        )}
      </div>
    </div>
  )
}

export default NotificationItem
