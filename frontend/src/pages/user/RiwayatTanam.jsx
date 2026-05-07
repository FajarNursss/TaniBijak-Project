import React, { useEffect, useState } from 'react'
import Badge from '../../components/ui/Badge'
import Table from '../../components/ui/Table'
import Modal from '../../components/ui/Modal'
import historyService from '../../services/historyService'
import lahanService from '../../services/lahanService'
import {
  ClipboardList, CheckCircle2, Wheat,
  Eye, Plus, BarChart2, Edit, Save, Trash2
} from 'lucide-react'

const statusStyle = { panen: 'success', gagal: 'danger', 'sedang tanam': 'info' }
const emptyForm = {
  tanaman: '',
  lahan_id: '',
  started_at: '',
  finished_at: '',
  yield_amount: '',
  yield_unit: 'ton',
  status: 'sedang tanam',
  note: '',
}

const RiwayatTanam = () => {
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('semua')
  const [items, setItems] = useState([])
  const [lahanList, setLahanList] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [showDelete, setShowDelete] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      const [historyRes, lahanRes] = await Promise.all([
        historyService.getAll(),
        lahanService.getMyLahan(),
      ])
      setItems(historyRes.data || [])
      setLahanList(lahanRes.data || [])
    } catch (err) {
      setError(err.message || 'Gagal memuat riwayat tanam.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const [historyRes, lahanRes] = await Promise.all([
          historyService.getAll(),
          lahanService.getMyLahan(),
        ])
        if (!active) return
        setItems(historyRes.data || [])
        setLahanList(lahanRes.data || [])
      } catch (err) {
        if (active) setError(err.message || 'Gagal memuat riwayat tanam.')
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = (row) => {
    setSelected(null)
    setEditing(row)
    setForm({
      tanaman: row.tanaman || '',
      lahan_id: row.lahan_id || '',
      started_at: row.started_at || '',
      finished_at: row.finished_at || '',
      yield_amount: row.yield_amount ?? '',
      yield_unit: row.yield_unit || 'ton',
      status: row.status || 'sedang tanam',
      note: row.note || row.catatan || '',
    })
    setShowForm(true)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const payload = () => ({
    ...form,
    lahan_id: form.lahan_id ? Number(form.lahan_id) : null,
    finished_at: form.finished_at || null,
    yield_amount: form.yield_amount === '' ? null : Number(form.yield_amount),
    yield_unit: form.yield_unit || 'ton',
    note: form.note || null,
  })

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      if (editing) {
        await historyService.update(editing.id, payload())
      } else {
        await historyService.create(payload())
      }
      setShowForm(false)
      setEditing(null)
      setForm(emptyForm)
      await fetchData()
    } catch (err) {
      setError(err.message || 'Gagal menyimpan riwayat tanam.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setSaving(true)
    setError('')
    try {
      await historyService.delete(showDelete.id)
      setShowDelete(null)
      setSelected(null)
      await fetchData()
    } catch (err) {
      setError(err.message || 'Gagal menghapus riwayat tanam.')
    } finally {
      setSaving(false)
    }
  }

  const filtered = filter === 'semua' ? items : items.filter(r => r.status === filter)
  const totalPanen = items.filter(r => r.status === 'panen').length
  const totalHasil = items.reduce((sum, r) => sum + Number(r.yield_amount || 0), 0)
  const produktivitas = items.filter(r => Number(r.yield_amount || 0) > 0)
  const maxHasil = Math.max(...produktivitas.map(r => Number(r.yield_amount || 0)), 1)

  const columns = [
    { key: 'tanaman', label: 'Tanaman', render: v => <span className="font-semibold text-gray-800">{v}</span> },
    { key: 'lahan', label: 'Lahan', render: v => v || '-' },
    { key: 'mulai', label: 'Tgl Tanam' },
    { key: 'selesai', label: 'Tgl Selesai' },
    { key: 'hasil', label: 'Hasil Panen' },
    { key: 'status', label: 'Status', render: v => <Badge type={statusStyle[v]}>{v}</Badge> },
    { key: 'id', label: 'Aksi', render: (_, row) => (
      <div className="flex items-center gap-3">
        <button onClick={() => setSelected(row)} className="flex items-center gap-1 text-xs text-primary-700 font-semibold hover:underline">
          <Eye size={13} /> Detail
        </button>
        <button onClick={() => openEdit(row)} className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline">
          <Edit size={13} /> Edit
        </button>
      </div>
    )},
  ]

  const summaryStats = [
    { label: 'Total Musim', val: items.length, Icon: ClipboardList },
    { label: 'Berhasil Panen', val: totalPanen, Icon: CheckCircle2 },
    { label: 'Total Produksi', val: `${totalHasil.toFixed(1)} ton`, Icon: Wheat },
  ]

  return (
    <div className="space-y-6 fade-in">
      <div className="bg-gradient-to-r from-teal-600 to-primary-700 rounded-2xl p-6 text-white shadow-lg">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ClipboardList size={22} strokeWidth={2} /> Riwayat Tanam
        </h2>
        <p className="text-teal-100 text-sm mt-1">Rekam jejak musim tanam, hasil panen, dan catatan lahan</p>
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

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

      <div className="flex gap-3 flex-wrap items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {[
            { key: 'semua', label: 'Semua' },
            { key: 'sedang tanam', label: 'Sedang Tanam' },
            { key: 'panen', label: 'Panen' },
            { key: 'gagal', label: 'Gagal' },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter===f.key ? 'bg-primary-800 text-white shadow' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
              {f.label}
            </button>
          ))}
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus size={16}/> Tambah Riwayat</button>
      </div>

      <div className="card">
        <Table columns={columns} data={filtered} loading={loading} emptyMessage="Belum ada riwayat tanam" />
      </div>

      <div className="card">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart2 size={18} strokeWidth={1.8} className="text-primary-600"/> Produktivitas per Musim
        </h3>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-10 h-10 border-4 border-primary-300 border-t-primary-800 rounded-full animate-spin" />
          </div>
        ) : produktivitas.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Belum ada data hasil panen.</p>
        ) : (
          <div className="space-y-3">
            {produktivitas.map((r, i) => {
              const val = Number(r.yield_amount || 0)
              return (
                <div key={r.id || i} className="flex items-center gap-4">
                  <p className="text-sm text-gray-600 w-32 flex-shrink-0 truncate">{r.tanaman}</p>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div className={`h-4 rounded-full transition-all ${r.status==='panen' ? 'bg-primary-500' : 'bg-red-400'}`}
                      style={{ width:`${Math.min((val / maxHasil) * 100, 100)}%` }} />
                  </div>
                  <span className="text-sm font-bold text-gray-700 w-20 text-right">{r.hasil}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Riwayat Tanam' : 'Tambah Riwayat Tanam'} size="lg"
        footer={<><button onClick={() => setShowForm(false)} className="btn-outline">Batal</button><button disabled={saving || !form.tanaman || !form.started_at} onClick={handleSave} className="btn-primary flex items-center gap-2"><Save size={15}/> Simpan</button></>}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Tanaman</label>
              <input name="tanaman" value={form.tanaman} onChange={handleChange} className="input-field" placeholder="Padi IR64" />
            </div>
            <div>
              <label className="label">Lahan</label>
              <select name="lahan_id" value={form.lahan_id} onChange={handleChange} className="input-field">
                <option value="">Tanpa lahan</option>
                {lahanList.map(lahan => <option key={lahan.id} value={lahan.id}>{lahan.nama}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Tanggal Tanam</label>
              <input type="date" name="started_at" value={form.started_at} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Tanggal Selesai</label>
              <input type="date" name="finished_at" value={form.finished_at} onChange={handleChange} className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="input-field">
                <option value="sedang tanam">Sedang Tanam</option>
                <option value="panen">Panen</option>
                <option value="gagal">Gagal</option>
              </select>
            </div>
            <div>
              <label className="label">Hasil Panen</label>
              <input type="number" min="0" step="0.1" name="yield_amount" value={form.yield_amount} onChange={handleChange} className="input-field" placeholder="2.5" />
            </div>
            <div>
              <label className="label">Satuan</label>
              <input name="yield_unit" value={form.yield_unit} onChange={handleChange} className="input-field" placeholder="ton" />
            </div>
          </div>
          <div>
            <label className="label">Catatan</label>
            <textarea name="note" value={form.note} onChange={handleChange} className="input-field resize-none" rows={3} placeholder="Catatan kondisi lahan, pupuk, hama, atau hasil panen" />
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Detail: ${selected?.tanaman}`}
        footer={<><button onClick={() => setShowDelete(selected)} className="btn-danger flex items-center gap-2"><Trash2 size={14}/> Hapus</button><button onClick={() => openEdit(selected)} className="btn-outline flex items-center gap-2"><Edit size={14}/> Edit</button><button onClick={() => setSelected(null)} className="btn-primary">Tutup</button></>}>
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Lahan', val: selected.lahan || '-' },
                { label: 'Status', val: selected.status },
                { label: 'Mulai Tanam', val: selected.mulai },
                { label: 'Selesai', val: selected.selesai },
                { label: 'Hasil Panen', val: selected.hasil },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400">{item.label}</p>
                  <p className="font-bold text-gray-800 mt-0.5">{item.val}</p>
                </div>
              ))}
            </div>
            <div>
              <h4 className="font-bold text-gray-700 mb-2">Catatan</h4>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-4 leading-relaxed">{selected.catatan || 'Tidak ada catatan.'}</p>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={!!showDelete} onClose={() => setShowDelete(null)} title="Hapus Riwayat Tanam"
        footer={<><button onClick={() => setShowDelete(null)} className="btn-outline">Batal</button><button disabled={saving} onClick={handleDelete} className="btn-danger flex items-center gap-2"><Trash2 size={15}/> Ya, Hapus</button></>}>
        <p className="text-gray-600">Hapus riwayat tanam <strong>{showDelete?.tanaman}</strong>?</p>
      </Modal>
    </div>
  )
}

export default RiwayatTanam
