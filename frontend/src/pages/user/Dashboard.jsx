import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'
import dashboardService from '../../services/dashboardService'
import { StatCard } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import {
  MapPin, Sprout, BellRing, ClipboardList,
  CloudSun, Droplets, Wind, CloudRain, ArrowRight,
  Info, AlertTriangle, AlertCircle
} from 'lucide-react'

const statusStyle = { selesai: 'success', terjadwal: 'info', gagal: 'danger' }
const notifIcon  = { info: Info, warning: AlertTriangle, danger: AlertCircle }
const notifBg    = { info: 'bg-blue-50 text-blue-500', warning: 'bg-yellow-50 text-yellow-500', danger: 'bg-red-50 text-red-500' }

const UserDashboard = () => {
  const { user } = useAuth()
  const { notifications, unreadCount } = useNotification()
  const [dashboard, setDashboard] = useState(null)

  useEffect(() => {
    let active = true
    const load = async () => {
      const res = await dashboardService.getUserDashboard()
      if (active) setDashboard(res.data || null)
    }
    load()
    return () => { active = false }
  }, [])

  const weatherData = dashboard?.weather || { temp: 28, humidity: 72, windSpeed: 12, condition: 'Berawan Sebagian', rain: '20%' }
  const activities = dashboard?.activities || []
  const recommendations = dashboard?.recommendations || []
  const totalLahan = dashboard?.total_luas ? `${dashboard.total_luas} Ha` : '0 Ha'
  const totalHistory = dashboard?.riwayat_tanam || 0

  const isLocationIncomplete = !user?.location || !user.location.includes(', ')

  return (
    <div className="space-y-6 fade-in">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary-800 to-primary-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-primary-200 text-sm font-medium">Selamat datang kembali,</p>
            <h2 className="text-2xl font-bold mt-1">{user?.name || 'Petani'} 👋</h2>
            <p className="text-primary-100 text-sm mt-2">Musim tanam berlangsung dengan baik. Yuk pantau lahan Anda!</p>
          </div>
          <div className="bg-white/20 rounded-2xl p-4 text-center min-w-[120px]">
            <p className="text-3xl font-bold">{weatherData.temp}°C</p>
            <p className="text-sm text-primary-100 flex items-center justify-center gap-1.5 mt-1">
              <CloudSun size={16} /> {weatherData.condition}
            </p>
            <p className="text-xs text-primary-200 mt-1">Hujan {weatherData.rain}</p>
          </div>
        </div>
      </div>

      {/* Incomplete Profile Warning */}
      {isLocationIncomplete && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-5 py-4 rounded-2xl text-sm flex items-start gap-3 shadow-sm">
          <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" /> 
          <div>
            <strong className="block mb-1 text-base">Lengkapi Profil Lokasi Anda</strong>
            <p className="text-amber-700/80 mb-2">Data Provinsi dan Kota/Kabupaten belum lengkap. Sistem membutuhkan data ini untuk memberikan prediksi cuaca dan rekomendasi yang lebih akurat.</p>
            <Link to="/profil" className="inline-block bg-amber-100 hover:bg-amber-200 text-amber-800 font-semibold px-4 py-1.5 rounded-lg transition-colors">
              Lengkapi Sekarang
            </Link>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={MapPin}      label="Total Lahan"    value={totalLahan} trend="10%" trendUp color="primary" />
        <StatCard icon={Sprout}      label="Tanaman Aktif"  value={dashboard?.tanaman_aktif || 0}         trend="1"   trendUp color="info" />
        <StatCard icon={BellRing}    label="Peringatan"     value={unreadCount}            color="warning" />
        <StatCard icon={ClipboardList} label="Riwayat Tanam" value={totalHistory}      trend="3"   trendUp color="accent" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommendations */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Sprout size={18} strokeWidth={1.8} className="text-primary-600" />
              Rekomendasi Tanam Hari Ini
            </h3>
            <Link to="/rekomendasi" className="text-sm text-primary-700 font-semibold hover:underline flex items-center gap-1">
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-3">
            {recommendations.map((r, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors">
                <div className="w-12 h-12 bg-primary-800 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800">{r.tanaman}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{r.alasan}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-lg font-bold ${r.skor >= 90 ? 'text-primary-700' : r.skor >= 80 ? 'text-blue-600' : 'text-yellow-600'}`}>
                    {r.skor}%
                  </div>
                  <p className="text-xs text-gray-400">Skor</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weather */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <CloudSun size={18} strokeWidth={1.8} className="text-blue-500" /> Cuaca Sekarang
            </h3>
            <Link to="/cuaca" className="text-sm text-primary-700 font-semibold hover:underline">Detail</Link>
          </div>
          <div className="text-center py-4">
            <CloudSun size={64} strokeWidth={1.2} className="text-blue-400 mx-auto" />
            <p className="text-4xl font-bold text-gray-800 mt-2">{weatherData.temp}°</p>
            <p className="text-gray-500 mt-1 text-sm">{weatherData.condition}</p>
          </div>
          {[
            { label: 'Kelembaban',       value: `${weatherData.humidity}%`,   Icon: Droplets,  color: 'text-blue-400' },
            { label: 'Kecepatan Angin',  value: `${weatherData.windSpeed} km/h`, Icon: Wind,   color: 'text-gray-400' },
            { label: 'Risiko Hujan',     value: weatherData.rain,             Icon: CloudRain, color: 'text-blue-500' },
          ].map(({ label, value, Icon, color }, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <Icon size={15} strokeWidth={1.8} className={color} /> {label}
              </span>
              <span className="font-semibold text-gray-800 text-sm">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Activities & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <ClipboardList size={18} strokeWidth={1.8} className="text-gray-500" /> Aktivitas Terkini
            </h3>
            <Link to="/riwayat" className="text-sm text-primary-700 font-semibold hover:underline">Semua</Link>
          </div>
          <div className="space-y-3">
            {activities.map(a => (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-800 truncate">{a.action}</p>
                  <p className="text-xs text-gray-400">{a.lahan} · {a.date}</p>
                </div>
                <Badge type={statusStyle[a.status]}>{a.status}</Badge>
              </div>
            ))}
            {activities.length === 0 && <p className="text-sm text-gray-400">Tidak ada aktivitas terbaru.</p>}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <BellRing size={18} strokeWidth={1.8} className="text-gray-500" /> Notifikasi Terbaru
            </h3>
            <Link to="/peringatan" className="text-sm text-primary-700 font-semibold hover:underline">Semua</Link>
          </div>
          <div className="space-y-3">
            {notifications.slice(0, 4).map(n => {
              const Icon = notifIcon[n.type] || Info
              const cls  = notifBg[n.type] || 'bg-gray-50 text-gray-500'
              return (
                <div key={n.id} className={`flex gap-3 p-3 rounded-xl ${!n.read ? cls.split(' ')[0] : 'bg-gray-50'}`}>
                  <Icon size={18} strokeWidth={1.8} className={`mt-0.5 flex-shrink-0 ${cls.split(' ')[1]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800 truncate">{n.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{n.message}</p>
                  </div>
                  {!n.read && <div className="w-1.5 h-1.5 bg-primary-600 rounded-full flex-shrink-0 mt-1" />}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
