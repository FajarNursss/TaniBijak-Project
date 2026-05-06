import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary-300 border-t-primary-800 animate-spin"></div>
          <p className="text-primary-800 font-semibold">Memuat TaniBijak...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  if (role === 'admin' && !isAdmin()) {
    return <Navigate to="/dashboard" replace />
  }

  if (role === 'user' && isAdmin()) {
    return <Navigate to="/admin/dashboard" replace />
  }

  return children
}

export default ProtectedRoute
