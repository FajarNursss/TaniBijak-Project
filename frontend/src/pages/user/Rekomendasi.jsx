import React, { useEffect, useState } from 'react'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import recommendationService from '../../services/recommendationService'
import { Sprout, Leaf, Droplets, Thermometer, CloudSun, Star, ChevronRight, Filter, Search } from 'lucide-react'

const skorWarna = (skor) => {
  if (skor >= 90) return { bar: 'bg-primary-500', text: 'text-primary-700', bg: 'bg-primary-50' }
  if (skor >= 80) return { bar: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50' }
  if (skor >= 70) return { bar: 'bg-yellow-500', text: 'text-yellow-700', bg: 'bg-yellow-50' }
  return { bar: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50' }
}

const Rekomendasi = () => {
  const [selected, setSelected] = useState(null)
  const [filterKat, setFilterKat] = useState('Semua')
  const [search, setSearch] = useState('')
  const [items, setItems] = useState([])

  useEffect(() => {
    let active = true
    const load = async () => {
      const res = await recommendationService.getAll()
      if (active) setItems(res.data || [])
    }
    load()
    return () => { active = false }
  }, [])

  const kats = ['Semua', ...new Set(items.map(r => r.kategori).filter(Boolean))]
  const filtered = items.filter(r =>
    (filterKat === 'Semua' || r.kategori === filterKat) &&
    r.tanaman.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 fade-in">
      <div className="bg-gradient-to-r from-primary-800 to-primary-600 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Sprout size={22} strokeWidth={2} /> Rekomendasi Tanam Cerdas
        </h2>
        <p className="text-primary-200 text-sm mt-1">Dapatkan rekomendasi terbaik berdasarkan cuaca di lokasi Anda</p>
      </div>

      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari tanaman..." className="input-field pl-9" />
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          <Filter size={14} className="text-gray-500" />
          {kats.map(k => (
            <button key={k} onClick={() => setFilterKat(k)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filterKat === k ? 'bg-primary-800 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {k}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map(r => {
          const warna = skorWarna(r.skor)
          return (
            <div key={r.id} className="card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
              onClick={() => setSelected(r)}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center border border-primary-100 group-hover:scale-110 transition-transform">
                    <Leaf size={24} strokeWidth={1.8} className="text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{r.tanaman}</h3>
                    <span className="text-xs text-gray-500">{r.kategori} · {r.musim}</span>
                  </div>
                </div>
                <div className={`text-right ${warna.text}`}>
                  <p className="text-2xl font-bold">{r.skor}</p>
                  <p className="text-xs">/ 100</p>
                </div>
              </div>

              <div className="bg-gray-100 rounded-full h-2.5 mb-3 overflow-hidden">
                <div className={`h-2.5 rounded-full ${warna.bar} transition-all`} style={{ width: `${r.skor}%` }} />
              </div>

              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{r.alasan}</p>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Thermometer size={12} /> {r.suhu}</span>
                  <span className="flex items-center gap-1"><Droplets size={12} /> {r.curah_hujan}</span>
                </div>
                <span className="flex items-center gap-1 text-primary-700 font-semibold">
                  Detail <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} size="lg"
        title={selected?.tanaman || ''}
        footer={<button onClick={() => setSelected(null)} className="btn-primary">Tutup</button>}>
        {selected && (() => {
          const warna = skorWarna(selected.skor)
          return (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className={`flex-1 rounded-xl p-3 ${warna.bg}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-gray-600">Skor Kesesuaian</span>
                    <span className={`text-2xl font-bold ${warna.text}`}>{selected.skor}/100</span>
                  </div>
                  <div className="bg-white/60 rounded-full h-2 overflow-hidden">
                    <div className={`h-2 rounded-full ${warna.bar}`} style={{ width: `${selected.skor}%` }} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'Musim', val: selected.musim, Icon: CloudSun },
                  { label: 'Suhu Optimal', val: selected.suhu, Icon: Thermometer },
                  { label: 'Curah Hujan', val: selected.curah_hujan, Icon: Droplets },
                  { label: 'Jenis Tanah', val: selected.jenis_tanah, Icon: Leaf },
                  { label: 'pH Tanah', val: selected.ph, Icon: Sprout },
                  { label: 'Kategori', val: selected.kategori, Icon: Star },
                ].map(({ label, val, Icon }, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                      {React.createElement(Icon, { size: 11 })} {label}
                    </p>
                    <p className="font-semibold text-sm text-gray-800">{val}</p>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                  <Leaf size={15} className="text-amber-600" /> Tips Budidaya
                </h4>
                <p className="text-sm text-amber-700">{selected.tips}</p>
              </div>

              <div className="bg-primary-50 border border-primary-100 rounded-xl p-4">
                <h4 className="font-bold text-primary-800 mb-2">Alasan Rekomendasi</h4>
                <p className="text-sm text-primary-700">{selected.alasan}</p>
              </div>
            </div>
          )
        })()}
      </Modal>
    </div>
  )
}

export default Rekomendasi
