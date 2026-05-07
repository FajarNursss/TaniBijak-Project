import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotification } from '../../context/NotificationContext'
import dashboardService from '../../services/dashboardService'
import { StatCard } from '../../components/ui/Card'
import {
  MapPin, Sprout, BellRing, ClipboardList,
  CloudSun, Droplets, Wind, CloudRain, ArrowRight,
  Info, AlertTriangle, AlertCircle
} from 'lucide-react'

const notifIcon = { info: Info, warning: AlertTriangle, danger: AlertCircle }
const notifBg = { info: 'bg-blue-50 text-blue-500', warning: 'bg-yellow-50 text-yellow-500', danger: 'bg-red-50 text-red-500' }

const scoreColor = (score) => {
  const value = Number(score)
  if (value >= 80) return 'text-primary-700'
  if (value >= 50) return 'text-blue-600'
  return 'text-yellow-600'
}

const UserDashboard = () => {
  const { user } = useAuth()
  const { notifications, unreadCount } = useNotification()
  const [dashboard, setDashboard] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const res = await dashboardService.getUserDashboard()
        if (active) setDashboard(res.data || null)
      } catch (err) {
        if (active) setError(err.message || 'Gagal memuat beranda.')
      }
    }

    load()
    return () => { active = false }
  }, [])

  const weatherData = dashboard?.weather || null
  const recommendations = dashboard?.recommendations || []
  const totalLahan = dashboard?.total_luas ? `${dashboard.total_luas} Ha` : '0 Ha'
  const totalHistory = dashboard?.riwayat_tanam || 0
  const isLocationIncomplete = !user?.location || !user.location.includes(', ')

  return (
    <div className="space-y-6 fade-in">
      <div className="bg-gradient-to-r from-primary-800 to-primary-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-primary-200 text-sm font-medium">Selamat datang kembali,</p>
            <h2 className="text-2xl font-bold mt-1">{user?.name || 'Petani'}</h2>
            <p className="text-primary-100 text-sm mt-2">Pantau kondisi lahan, cuaca, dan rekomendasi tanam Anda.</p>
          </div>
          <div className="bg-white/20 rounded-2xl p-4 text-center min-w-[120px]">
            <p className="text-3xl font-bold">{weatherData ? `${weatherData.temp} C` : '-'}</p>
            <p className="text-sm text-primary-100 flex items-center justify-center gap-1.5 mt-1">
              <CloudSun size={16} /> {weatherData?.condition || 'Cuaca belum tersedia'}
            </p>
            <p className="text-xs text-primary-200 mt-1">{weatherData ? `Hujan ${weatherData.rain}` : 'Lengkapi lokasi profil'}</p>
          </div>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

      {isLocationIncomplete && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-5 py-4 rounded-2xl text-sm flex items-start gap-3 shadow-sm">
          <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
          <div>
            <strong className="block mb-1 text-base">Lengkapi Profil Lokasi Anda</strong>
            <p className="text-amber-700/80 mb-2">Data provinsi dan kota/kabupaten dibutuhkan untuk menghitung rekomendasi tanam.</p>
            <Link to="/profil" className="inline-block bg-amber-100 hover:bg-amber-200 text-amber-800 font-semibold px-4 py-1.5 rounded-lg transition-colors">
              Lengkapi Sekarang
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={MapPin} label="Total Lahan" value={totalLahan} trend="10%" trendUp color="primary" />
        <StatCard icon={Sprout} label="Tanaman Aktif" value={dashboard?.tanaman_aktif || 0} trend="1" trendUp color="info" />
        <StatCard icon={BellRing} label="Peringatan" value={unreadCount} color="warning" />
        <StatCard icon={ClipboardList} label="Riwayat Tanam" value={totalHistory} trend="3" trendUp color="accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              <div key={r.id || i} className="flex items-center gap-4 p-4 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors">
                <div className="w-12 h-12 bg-primary-800 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {r.rank || i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800">{r.tanaman}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{r.alasan || 'Rekomendasi dihitung dari data cuaca dan dataset tanaman.'}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-lg font-bold ${scoreColor(r.skor)}`}>{r.skor}%</div>
                  <p className="text-xs text-gray-400">Skor</p>
                </div>
              </div>
            ))}

            {recommendations.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <Sprout size={36} strokeWidth={1.5} className="text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-500">Rekomendasi tanam belum tersedia.</p>
                <p className="text-xs text-gray-400 mt-1">Lengkapi lokasi profil atau jalankan layanan prediksi.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <CloudSun size={18} strokeWidth={1.8} className="text-blue-500" /> Cuaca Sekarang
            </h3>
            <Link to="/cuaca" className="text-sm text-primary-700 font-semibold hover:underline">Detail</Link>
          </div>
          <div className="text-center py-4">
            <CloudSun size={64} strokeWidth={1.2} className="text-blue-400 mx-auto" />
            <p className="text-4xl font-bold text-gray-800 mt-2">{weatherData ? `${weatherData.temp} C` : '-'}</p>
            <p className="text-gray-500 mt-1 text-sm">{weatherData?.condition || 'Cuaca belum tersedia'}</p>
          </div>
          {[
            { label: 'Kelembaban', value: weatherData ? `${weatherData.humidity}%` : '-', Icon: Droplets, color: 'text-blue-400' },
            { label: 'Kecepatan Angin', value: weatherData ? `${weatherData.windSpeed} km/h` : '-', Icon: Wind, color: 'text-gray-400' },
            { label: 'Risiko Hujan', value: weatherData?.rain || '-', Icon: CloudRain, color: 'text-blue-500' },
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

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
              <BellRing size={20} strokeWidth={1.8} className="text-gray-500" /> Notifikasi Terbaru
            </h3>
            <Link to="/peringatan" className="text-sm text-primary-700 font-semibold hover:underline flex items-center gap-1">
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notifications.slice(0, 4).map(n => {
              const Icon = notifIcon[n.type] || Info
              const cls = notifBg[n.type] || 'bg-gray-50 text-gray-500'
              return (
                <div key={n.id} className={`flex gap-4 p-4 rounded-2xl transition-all ${!n.read ? cls.split(' ')[0] : 'bg-gray-50'}`}>
                  <Icon size={20} strokeWidth={1.8} className={`mt-0.5 flex-shrink-0 ${cls.split(' ')[1]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-sm text-gray-800 truncate">{n.title}</p>
                      {!n.read && <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-1" />}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{n.message}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {notifications.length === 0 && (
            <div className="text-center py-10">
              <p className="text-sm text-gray-400 font-medium">Tidak ada notifikasi terbaru.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
