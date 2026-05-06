import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('tanibijak_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('tanibijak_user')
    const storedToken = localStorage.getItem('tanibijak_token')
    try {
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser))
        setToken(storedToken)
      }
    } catch {
      localStorage.removeItem('tanibijak_user')
      localStorage.removeItem('tanibijak_token')
      setUser(null)
      setToken(null)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    const handleLogout = () => {
      setUser(null)
      setToken(null)
    }

    window.addEventListener('tanibijak:logout', handleLogout)
    return () => window.removeEventListener('tanibijak:logout', handleLogout)
  }, [])

  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('tanibijak_user', JSON.stringify(userData))
    localStorage.setItem('tanibijak_token', authToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('tanibijak_user')
    localStorage.removeItem('tanibijak_token')
  }

  const isAuthenticated = () => !!token && !!user
  const isAdmin = () => user?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export default AuthContext
