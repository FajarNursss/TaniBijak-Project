import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import dashboardService from '../../services/dashboardService'
import { StatCard } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import {
  Users, Map, Bell, BookOpen, TrendingUp, Zap,
  BarChart3, Activity, Settings, LogIn, MapPin, ArrowRight
} from 'lucide-react'

const quickActions = [
  { label: 'Tambah Notifikasi',     Icon: Bell,     to: '/admin/notifikasi', color: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' },
  { label: 'Tambah Kearifan Lokal', Icon: BookOpen, to: '/admin/kearifan',   color: 'bg-amber-50 text-amber-700 hover:bg-amber-100' },
  { label: 'Lihat Monitoring',      Icon: Activity, to: '/admin/monitoring', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
  { label: 'Pengaturan Sistem',     Icon: Settings, to: '/admin/pengaturan', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
]

const AdminDashboard = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    let active = true
    const load = async () => {
      const res = await dashboardService.getAdminDashboard()
      if (active) setData(res.data || null)
    }
    load()
    return () => { active = false }
  }, [])

  const recentUsers = data?.recent_users || []
  const recentActivity = data?.recent_activity || []

  return (
    <div className="space-y-6 fade-in">
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-gray-400 text-sm flex items-center gap-1.5">
              <BarChart3 size={14} strokeWidth={1.8} /> Admin Panel
            </p>
            <h2 className="text-2xl font-bold mt-1">Dashboard TaniBijak</h2>
            <p className="text-gray-300 text-sm mt-2">Pemantauan Data Pertanian</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-xs">Terakhir update</p>
            <p className="font-bold text-sm">{new Date().toLocaleTimeString('id-ID')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users}    label="Total Pengguna" value={data?.total_user || 0} color="info" />
        <StatCard icon={Map}      label="Total Lahan"    value={`${data?.total_luas || 0} Ha`} color="primary" />
        <StatCard icon={Bell}     label="Notifikasi Aktif" value={data?.notifikasi_aktif || 0} color="warning" />
        <StatCard icon={BookOpen} label="Kearifan Lokal" value={data?.kearifan_lokal || 0} color="accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp size={18} strokeWidth={1.8} className="text-primary-600" /> Tren Registrasi Pengguna
            </h3>
            <span className="text-xs text-gray-400">6 Bulan Terakhir</span>
          </div>
          <div className="flex items-end gap-2 h-32">
            {[45,62,58,78,95,Number(data?.total_user || 0)].map((v,i)=>(
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-gray-700">{v}</span>
                <div className="w-full bg-primary-600 rounded-t-md hover:bg-primary-700 transition-colors" style={{ height:`${(v/Math.max(95, Number(data?.total_user || 0)))*100}%` }} />
                <span className="text-xs text-gray-400">{['Des','Jan','Feb','Mar','Apr','Mei'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Zap size={18} strokeWidth={1.8} className="text-yellow-500" /> Aksi Cepat
          </h3>
          <div className="space-y-3">
            {quickActions.map(({ label, Icon, to, color }, i) => (
              <Link key={i} to={to} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${color}`}>
                <Icon size={16} strokeWidth={1.8} /> {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Users size={18} strokeWidth={1.8} className="text-gray-500" /> Pengguna Terbaru
            </h3>
            <Link to="/admin/users" className="text-sm text-primary-700 font-semibold hover:underline flex items-center gap-1">
              Semua <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentUsers.map((u,i)=>(
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-9 h-9 bg-primary-700 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800 truncate">{u.name}</p>
                  <p className="text-xs text-gray-400 truncate">{u.email}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <Badge type={u.status==='aktif'?'success':'default'}>{u.status}</Badge>
                  <p className="text-xs text-gray-400 mt-1">{u.joined}</p>
                </div>
              </div>
            ))}
            {recentUsers.length === 0 && <p className="text-sm text-gray-400">Belum ada data pengguna.</p>}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Activity size={18} strokeWidth={1.8} className="text-gray-500" /> Aktivitas Terkini
            </h3>
            <Link to="/admin/monitoring" className="text-sm text-primary-700 font-semibold hover:underline flex items-center gap-1">
              Semua <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivity.map(({ user, action, time }, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <LogIn size={16} strokeWidth={1.8} className="text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{user}</p>
                  <p className="text-xs text-gray-500">{action}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{time}</p>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && <p className="text-sm text-gray-400">Belum ada aktivitas.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
