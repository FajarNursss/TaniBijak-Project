import React, { useEffect, useState } from 'react'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import wisdomService from '../../services/wisdomService'
import { BookHeart, Star, MapPin, Filter, ChevronRight, BookOpen, Lightbulb } from 'lucide-react'

const kategoriWarna = {
  'Musim':        'bg-blue-100 text-blue-700',
  'Irigasi':      'bg-cyan-100 text-cyan-700',
  'Teknik Tanam': 'bg-green-100 text-green-700',
  'Rotasi':       'bg-purple-100 text-purple-700',
  'Konservasi':   'bg-teal-100 text-teal-700',
  'Varietas':     'bg-amber-100 text-amber-700',
}

const KearifanLokal = () => {
  const [selected, setSelected] = useState(null)
  const [filterKat, setFilterKat] = useState('Semua')
  const [search, setSearch] = useState('')
  const [items, setItems] = useState([])

  useEffect(() => {
    let active = true
    const load = async () => {
      const res = await wisdomService.getUserAll()
      if (active) setItems(res.data || [])
    }
    load()
    return () => { active = false }
  }, [])

  const kategoris = ['Semua', ...new Set(items.map(k => k.kategori).filter(Boolean))]

  const filtered = items.filter(k =>
    (filterKat === 'Semua' || k.kategori === filterKat) &&
    (k.judul.toLowerCase().includes(search.toLowerCase()) || k.daerah.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6 fade-in">
      <div className="bg-gradient-to-r from-amber-600 to-yellow-500 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BookHeart size={22} strokeWidth={2} /> Kearifan Lokal Pertanian
            </h2>
            <p className="text-yellow-100 text-sm mt-1">Data diambil dari tabel `local_wisdoms`</p>
          </div>
          <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
            <p className="text-2xl font-bold">{items.length}</p>
            <p className="text-xs text-yellow-100">Entri Kearifan</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <BookOpen size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari kearifan lokal..."
            className="input-field pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="flex items-center gap-1 text-sm text-gray-500">
            <Filter size={14} /> Kategori:
          </span>
          {kategoris.map(k => (
            <button key={k} onClick={() => setFilterKat(k)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filterKat===k ? 'bg-amber-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {k}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(k => (
          <div key={k.id} onClick={() => setSelected(k)}
            className="card cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl border border-amber-100 group-hover:scale-110 transition-transform">
                {k.icon || '🌿'}
              </div>
              <div className="flex items-center gap-1.5">
                <Star size={13} className={k.relevansi==='Tinggi' ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                <span className={`text-xs font-semibold ${k.relevansi==='Tinggi' ? 'text-yellow-600' : 'text-gray-400'}`}>{k.relevansi}</span>
              </div>
            </div>

            <h3 className="font-bold text-gray-800 text-lg">{k.judul}</h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">{k.deskripsi}</p>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${kategoriWarna[k.kategori] || 'bg-gray-100 text-gray-600'}`}>
                  {k.kategori}
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-0.5">
                  <MapPin size={11} /> {k.daerah}
                </span>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <BookHeart size={48} strokeWidth={1.2} className="mx-auto text-gray-300 mb-3" />
          <p className="font-semibold">Tidak ada kearifan lokal ditemukan</p>
        </div>
      )}

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} size="lg"
        title={selected ? `${selected.icon || '🌿'} ${selected.judul}` : ''}
        footer={<button onClick={() => setSelected(null)} className="btn-primary">Tutup</button>}>
        {selected && (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <span className={`text-xs font-semibold px-3 py-1.5 rounded-xl ${kategoriWarna[selected.kategori] || 'bg-gray-100 text-gray-600'}`}>{selected.kategori}</span>
              <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-xl">
                <MapPin size={11} /> {selected.daerah}
              </span>
              <span className="text-xs text-yellow-600 flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-xl font-semibold">
                <Star size={11} className="fill-yellow-400 text-yellow-400" /> {selected.relevansi}
              </span>
            </div>

            <div>
              <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                <BookOpen size={16} className="text-amber-600" /> Deskripsi
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed bg-amber-50 rounded-xl p-4">{selected.deskripsi}</p>
            </div>

            <div>
              <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                <Lightbulb size={16} className="text-yellow-500" /> Manfaat
              </h4>
              <ul className="space-y-2">
                {(selected.manfaat || []).map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i+1}</span>
                    {m}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                <BookHeart size={16} className="text-amber-600" /> Cocok untuk Tanaman
              </h4>
              <div className="flex flex-wrap gap-2">
                {(selected.tanaman || []).map((t, i) => (
                  <span key={i} className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-semibold">{t}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default KearifanLokal
