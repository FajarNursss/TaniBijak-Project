import { useEffect, useState } from 'react'
import { StatCard } from '../../components/ui/Card'
import cuacaService from '../../services/cuacaService'
import {
  CloudSun, Cloud, CloudRain, Sun, Droplets,
  Wind, Thermometer, MapPin, CalendarDays, RefreshCcw
} from 'lucide-react'

const WeatherIcon = ({ condition, ...props }) => {
  const c = String(condition || '').toLowerCase()
  if (c.includes('hujan')) return <CloudRain {...props} />
  if (c.includes('cerah')) return <Sun {...props} />
  if (c.includes('mendung') || c.includes('berawan')) return <Cloud {...props} />
  return <CloudSun {...props} />
}

const Cuaca = () => {
  const [aktifHari, setAktifHari] = useState(0)
  const [current, setCurrent] = useState(null)
  const [forecast, setForecast] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const [cur, fc] = await Promise.all([
          cuacaService.getCurrentWeather(),
          cuacaService.getForecast(7),
        ])

        if (!active) return
        setCurrent(cur.data || null)
        setForecast(fc.data || [])
      } catch (err) {
        if (active) setError(err.message || 'Gagal memuat data cuaca BMKG.')
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => { active = false }
  }, [])

  const selected = forecast[aktifHari] || null
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-primary-300 border-t-primary-800 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 fade-in">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

      {!current && !error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm">
          Data cuaca belum tersedia. Pastikan lokasi profil sudah diisi dan service BMKG aktif.
        </div>
      )}

      {current && (
        <>
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <p className="text-sky-200 text-sm flex items-center gap-1.5">
                  <MapPin size={14} /> {current.location}
                </p>
                <h2 className="text-4xl font-bold mt-2">{current.temp} C</h2>
                <p className="text-sky-100 text-lg mt-1 flex items-center gap-2">
                  <WeatherIcon condition={current.condition} size={20} /> {current.condition}
                </p>
                <p className="text-sky-200 text-xs mt-2 flex items-center gap-1.5">
                  <RefreshCcw size={11} /> {current.lastUpdate} - BMKG
                </p>
              </div>
              <div className="text-center">
                <WeatherIcon condition={current.condition} size={80} strokeWidth={1} className="text-white/80" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard icon={Droplets}    label="Kelembaban"     value={`${current.humidity}%`} color="info" />
            <StatCard icon={Wind}        label="Kec. Angin"     value={`${current.windSpeed} km/h`} color="primary" />
            <StatCard icon={Thermometer} label="Suhu"           value={`${current.temp} C`} color="warning" />
            <StatCard icon={CloudRain}   label="Curah Hujan"    value={current.rain} color="accent" />
          </div>
        </>
      )}

      <div className="card">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <CalendarDays size={18} strokeWidth={1.8} className="text-gray-500" /> Prakiraan BMKG
        </h3>

        {forecast.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Prakiraan belum tersedia untuk lokasi profil.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {forecast.map((p, i) => {
                return (
                  <button key={p.date || i} onClick={() => setAktifHari(i)}
                    className={`flex flex-col items-center p-2 rounded-2xl transition-all ${aktifHari===i ? 'bg-sky-500 text-white shadow-md' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'}`}>
                    <span className="text-xs font-bold mb-1">{p.day || p.date?.slice(5, 10)}</span>
                    <WeatherIcon condition={p.condition} size={22} strokeWidth={1.5} className={aktifHari===i ? 'text-white' : 'text-sky-400'} />
                    <span className="text-xs font-bold mt-1">{p.temp_max} C</span>
                    <span className={`text-xs ${aktifHari===i ? 'text-sky-200' : 'text-gray-400'}`}>{p.temp_min} C</span>
                  </button>
                )
              })}
            </div>

            {selected && (
              <div className="mt-4 p-4 bg-sky-50 rounded-xl border border-sky-100">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="font-bold text-gray-800">{selected.condition}</p>
                    <p className="text-sm text-gray-500">Curah hujan estimasi: {selected.rainfall} mm</p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-red-500 font-bold">Max {selected.temp_max} C</span>
                    <span className="text-blue-500 font-bold">Min {selected.temp_min} C</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Cuaca
