import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import notificationService from '../services/notificationService'

const NotificationContext = createContext(null)

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, token, loading: authLoading } = useAuth()

  useEffect(() => {
    if (authLoading) return
    if (!token || !user) {
      setNotifications([])
      setLoading(false)
      return
    }

    let active = true
    const load = async () => {
      try {
        const res = await notificationService.getAll()
        if (active) setNotifications(res.data || [])
      } catch {
        if (active) setNotifications([])
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [authLoading, token, user])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = async (id) => {
    await notificationService.markAsRead(id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllRead = async () => {
    await notificationService.markAllRead()
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const addNotification = async (notif) => {
    const res = await notificationService.create(notif)
    setNotifications(prev => [res.data, ...prev])
  }

  const deleteNotification = async (id) => {
    await notificationService.delete(id)
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, loading, markAsRead, markAllRead, addNotification, deleteNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider')
  return ctx
}

export default NotificationContext
