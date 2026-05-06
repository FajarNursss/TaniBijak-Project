import React, { useEffect, useState } from 'react'
import Badge from '../../components/ui/Badge'
import Table from '../../components/ui/Table'
import Modal from '../../components/ui/Modal'
import historyService from '../../services/historyService'
import {
  ClipboardList, CheckCircle2, Wheat,
  Eye, Plus, BarChart2
} from 'lucide-react'

const statusStyle = { panen: 'success', gagal: 'danger', 'sedang tanam': 'info' }

const RiwayatTanam = () => {
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('semua')
  const [items, setItems] = useState([])

  useEffect(() => {
    let active = true
    const load = async () => {
      const res = await historyService.getAll()
      if (active) setItems(res.data || [])
    }
    load()
    return () => { active = false }
  }, [])

  const filtered = filter === 'semua' ? items : items.filter(r => r.status === filter)
  const totalPanen = items.filter(r => r.status === 'panen').length
  const totalHasil = items.filter(r => r.hasil !== '—').reduce((sum, r) => sum + parseFloat(r.hasil), 0)

  const columns = [
    { key: 'tanaman',  label: 'Tanaman', render: v => <span className="font-semibold text-gray-800">{v}</span> },
    { key: 'lahan',    label: 'Lahan' },
    { key: 'mulai',    label: 'Tgl Tanam' },
    { key: 'selesai',  label: 'Tgl Selesai' },
    { key: 'hasil',    label: 'Hasil Panen' },
    { key: 'status',   label: 'Status', render: v => <Badge type={statusStyle[v]}>{v}</Badge> },
    { key: 'id',       label: 'Aksi', render: (_, row) => (
      <button onClick={() => setSelected(row)} className="flex items-center gap-1 text-xs text-primary-700 font-semibold hover:underline">
        <Eye size={13} /> Detail
      </button>
    )},
  ]

  const summaryStats = [
    { label: 'Total Musim',    val: items.length,            Icon: ClipboardList, color: 'bg-gray-100 text-gray-600' },
    { label: 'Berhasil Panen',  val: totalPanen,             Icon: CheckCircle2,  color: 'bg-green-50 text-green-700' },
    { label: 'Total Produksi',  val: `${totalHasil.toFixed(1)} ton`, Icon: Wheat, color: 'bg-amber-50 text-amber-700' },
  ]

  return (
    <div className="space-y-6 fade-in">
      <div className="bg-gradient-to-r from-teal-600 to-primary-700 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ClipboardList size={22} strokeWidth={2} /> Riwayat Tanam
        </h2>
        <p className="text-teal-100 text-sm mt-1">Rekam jejak pertanian dari tabel `crop_histories`</p>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {summaryStats.map(({ label, val, Icon }, i) => (
            <div key={i} className="bg-white/20 rounded-xl p-3 text-center">
              {React.createElement(Icon, { size: 24, strokeWidth: 1.8, className: 'mx-auto text-white/80' })}
              <p className="font-bold text-xl mt-1">{val}</p>
              <p className="text-xs text-teal-100">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 flex-wrap items-center justify-between">
        <div className="flex gap-2">
          {[{ key:'semua',label:'Semua'},{key:'panen',label:'Panen'},{key:'gagal',label:'Gagal'}].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter===f.key ? 'bg-primary-800 text-white shadow' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
              {f.label}
            </button>
          ))}
        </div>
        <button className="btn-primary flex items-center gap-2"><Plus size={16}/> Tambah Riwayat</button>
      </div>

      <div className="card">
        <Table columns={columns} data={filtered} loading={false} emptyMessage="Belum ada riwayat tanam" />
      </div>

      <div className="card">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart2 size={18} strokeWidth={1.8} className="text-primary-600"/> Produktivitas per Musim
        </h3>
        <div className="space-y-3">
          {items.filter(r => r.hasil !== '—').map((r, i) => {
            const val = parseFloat(r.hasil)
            const max = 5
            return (
              <div key={i} className="flex items-center gap-4">
                <p className="text-sm text-gray-600 w-32 flex-shrink-0 truncate">{r.tanaman}</p>
                <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                  <div className={`h-4 rounded-full transition-all ${r.status==='panen' ? 'bg-primary-500' : 'bg-red-400'}`}
                    style={{ width:`${(val/max)*100}%` }} />
                </div>
                <span className="text-sm font-bold text-gray-700 w-16 text-right">{r.hasil}</span>
              </div>
            )
          })}
        </div>
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Detail: ${selected?.tanaman}`}
        footer={<button onClick={() => setSelected(null)} className="btn-primary">Tutup</button>}>
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label:'Lahan',       val:selected.lahan },
                { label:'Status',      val:selected.status },
                { label:'Mulai Tanam', val:selected.mulai },
                { label:'Selesai',     val:selected.selesai },
                { label:'Hasil Panen', val:selected.hasil },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="font-bold text-gray-800 mt-0.5">{item.val}</p>
                </div>
              ))}
            </div>
            <div>
              <h4 className="font-bold text-gray-700 mb-2">Catatan</h4>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4 leading-relaxed">{selected.catatan}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default RiwayatTanam
