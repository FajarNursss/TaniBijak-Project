import { useAuth } from '../context/AuthContext'

export const useAuthHook = () => {
  const { user, token, loading, login, logout, isAuthenticated, isAdmin } = useAuth()
  return { user, token, loading, login, logout, isAuthenticated, isAdmin }
}

export default useAuthHook
