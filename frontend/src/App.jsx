import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/common/ProtectedRoute'
import UserLayout from './layouts/UserLayout'
import AdminLayout from './layouts/AdminLayout'

// Auth
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// User Pages
import UserDashboard from './pages/user/Dashboard'
import Rekomendasi from './pages/user/Rekomendasi'
import Kalender from './pages/user/Kalender'
import Cuaca from './pages/user/Cuaca'
import Peringatan from './pages/user/Peringatan'
import Lahan from './pages/user/Lahan'
import KearifanLokal from './pages/user/KearifanLokal'
import RiwayatTanam from './pages/user/RiwayatTanam'
import Profil from './pages/user/Profil'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import ManajemenUser from './pages/admin/ManajemenUser'
import ManajemenLahan from './pages/admin/ManajemenLahan'
import ManajemenKearifan from './pages/admin/ManajemenKearifan'
import ManajemenNotifikasi from './pages/admin/ManajemenNotifikasi'
import Monitoring from './pages/admin/Monitoring'
import Pengaturan from './pages/admin/Pengaturan'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User Routes */}
      <Route path="/" element={<ProtectedRoute role="user"><UserLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="rekomendasi" element={<Rekomendasi />} />
        <Route path="kalender" element={<Kalender />} />
        <Route path="cuaca" element={<Cuaca />} />
        <Route path="peringatan" element={<Peringatan />} />
        <Route path="lahan" element={<Lahan />} />
        <Route path="kearifan-lokal" element={<KearifanLokal />} />
        <Route path="riwayat" element={<RiwayatTanam />} />
        <Route path="profil" element={<Profil />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<ManajemenUser />} />
        <Route path="lahan" element={<ManajemenLahan />} />
        <Route path="kearifan" element={<ManajemenKearifan />} />
        <Route path="notifikasi" element={<ManajemenNotifikasi />} />
        <Route path="monitoring" element={<Monitoring />} />
        <Route path="pengaturan" element={<Pengaturan />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
