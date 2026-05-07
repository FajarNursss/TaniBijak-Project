import React, { useEffect, useState } from 'react'
import { StatCard } from '../../components/ui/Card'
import cuacaService from '../../services/cuacaService'
import {
  CloudSun, Cloud, CloudRain, Sun, Droplets,
  Wind, Thermometer, Eye, Gauge, MapPin, CalendarDays, RefreshCcw
} from 'lucide-react'

const getIcon = (condition = '') => {
  const c = condition.toLowerCase()
  if (c.includes('hujan')) return CloudRain
  if (c.includes('cerah')) return Sun
  if (c.includes('mendung')) return Cloud
  return CloudSun
}

const Cuaca = () => {
  const [aktifHari, setAktifHari] = useState(0)
  const [current, setCurrent] = useState(null)
  const [forecast, setForecast] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const [cur, fc] = await Promise.all([
          cuacaService.getCurrentWeather('Kab. Semarang, Jawa Tengah'),
          cuacaService.getForecast('Kab. Semarang, Jawa Tengah', 7),
        ])
        if (!active) return
        setCurrent(cur.data)
        setForecast(fc.data || [])
      } catch (err) {
        if (active) setError(err.message || 'Gagal memuat data cuaca.')
      }
    }
    load()
    return () => { active = false }
  }, [])

  const now = current || { location: 'Kab. Semarang, Jawa Tengah', temp: 28, feelsLike: 30, humidity: 72, windSpeed: 12, visibility: 10, pressure: 1013, condition: 'Berawan Sebagian', rain: '20%', lastUpdate: 'Mode demo' }
  const selected = forecast[aktifHari] || { condition: now.condition, rain_chance: 20, temp_max: now.temp + 2, temp_min: now.temp - 4 }
  const CurrentIcon = getIcon(now.condition)

  return (
    <div className="space-y-6 fade-in">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

      <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <p className="text-sky-200 text-sm flex items-center gap-1.5">
              <MapPin size={14} /> {now.location}
            </p>
            <h2 className="text-4xl font-bold mt-2">{now.temp}°C</h2>
            <p className="text-sky-100 text-lg mt-1 flex items-center gap-2">
              <CurrentIcon size={20} /> {now.condition}
            </p>
            <p className="text-sky-200 text-xs mt-2 flex items-center gap-1.5">
              <RefreshCcw size={11} /> {now.lastUpdate}
            </p>
          </div>
          <div className="text-center">
            <CurrentIcon size={80} strokeWidth={1} className="text-white/80" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={Droplets}    label="Kelembaban"     value={`${now.humidity}%`} color="info" />
        <StatCard icon={Wind}        label="Kec. Angin"     value={`${now.windSpeed} km/h`} color="primary" />
        <StatCard icon={Thermometer} label="Terasa Seperti" value={`${now.feelsLike || now.temp}°C`} color="warning" />
        <StatCard icon={Gauge}       label="Tekanan Udara"  value={`${now.pressure || 0} hPa`} color="accent" />
      </div>

      {/* <div className="grid grid-cols-2 gap-4"> */}
        {/* <div className="card">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Eye size={18} strokeWidth={1.8} className="text-blue-500" /> Detail Cuaca
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Jarak Pandang', val: `${now.visibility || 0} km`, Icon: Eye },
              { label: 'Risiko Hujan',  val: `${now.rain || selected.rain_chance}%`, Icon: CloudRain },
              { label: 'Tekanan Udara', val: `${now.pressure || 0} hPa`, Icon: Gauge },
            ].map(({ label, val, Icon }, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-500 flex items-center gap-2">
                  {React.createElement(Icon, { size: 14, strokeWidth: 1.8, className: 'text-blue-400' })} {label}
                </span>
                <span className="font-bold text-gray-800 text-sm">{val}</span>
              </div>
            ))}
          </div>
        </div> */}

        {/* <div className="card">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CloudSun size={18} strokeWidth={1.8} className="text-sky-500" /> Kondisi Lahan
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Kondisi Tanam',    val: 'Sangat Baik', color: 'text-green-600' },
              { label: 'Risiko Hama',      val: 'Rendah',      color: 'text-green-600' },
              { label: 'Evapotranspirasi', val: '4.2 mm/hari', color: 'text-blue-600' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-500">{item.label}</span>
                <span className={`font-bold text-sm ${item.color}`}>{item.val}</span>
              </div>
            ))}
          </div>
        </div> */}
      {/* </div> */}

      <div className="card">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <CalendarDays size={18} strokeWidth={1.8} className="text-gray-500" /> Prakiraan 7 Hari
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {forecast.map((p, i) => {
            const Icon = getIcon(p.condition)
            return (
              <button key={i} onClick={() => setAktifHari(i)}
                className={`flex flex-col items-center p-2 rounded-2xl transition-all ${aktifHari===i ? 'bg-sky-500 text-white shadow-md' : 'bg-gray-50 hover:bg-gray-100 text-gray-700'}`}>
                <span className="text-xs font-bold mb-1">{p.day || p.date?.slice(5, 10)}</span>
                <Icon size={22} strokeWidth={1.5} className={aktifHari===i ? 'text-white' : 'text-sky-400'} />
                <span className="text-xs font-bold mt-1">{p.temp_max}°</span>
                <span className={`text-xs ${aktifHari===i ? 'text-sky-200' : 'text-gray-400'}`}>{p.temp_min}°</span>
              </button>
            )
          })}
        </div>
        {selected && (
          <div className="mt-4 p-4 bg-sky-50 rounded-xl border border-sky-100">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="font-bold text-gray-800">{selected.condition}</p>
                <p className="text-sm text-gray-500">Hujan: {selected.rain_chance}%</p>
              </div>
              <div className="flex gap-4 text-sm">
                <span className="text-red-500 font-bold">↑ {selected.temp_max}°C</span>
                <span className="text-blue-500 font-bold">↓ {selected.temp_min}°C</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* <div className="card">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Droplets size={18} strokeWidth={1.8} className="text-sky-500" /> Rekomendasi Berdasarkan Cuaca
        </h3>
        <div className="space-y-3">
          {[
            { kondisi: 'Siram pagi hari', desc: 'Kelembaban sedang, siram tanaman sebelum jam 9 pagi', level: 'info' },
            { kondisi: 'Waspada hujan lebat', desc: 'Selasa-Rabu berpotensi hujan lebat. Periksa drainase lahan.', level: 'warning' },
            { kondisi: 'Cuaca ideal untuk penyemprotan', desc: 'Senin-Kamis kondisi angin ringan, ideal untuk pestisida.', level: 'success' },
          ].map((r, i) => (
            <div key={i} className={`p-4 rounded-xl border ${r.level==='info' ? 'bg-blue-50 border-blue-200 text-blue-800' : r.level==='warning' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
              <p className="font-bold text-sm">{r.kondisi}</p>
              <p className="text-xs mt-1 opacity-80">{r.desc}</p>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  )
}

export default Cuaca
