import React, { useEffect, useState } from 'react'
import Badge from '../../components/ui/Badge'
import Table from '../../components/ui/Table'
import Modal from '../../components/ui/Modal'
import lahanService from '../../services/lahanService'
import { Map, Ruler, CheckCircle2, AlertTriangle, Search, Trash2 } from 'lucide-react'

const kondisiStyle = { baik:'success', perhatian:'warning', 'perlu-perhatian':'warning', kritis:'danger' }

const ManajemenLahan = () => {
  const [lahan, setLahan] = useState([])
  const [search, setSearch] = useState('')
  const [showDelete, setShowDelete] = useState(null)
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchLahan = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await lahanService.getAllLahan()
      setLahan(res.data || [])
    } catch (err) {
      setError(err.message || 'Gagal memuat data lahan dari API.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLahan()
  }, [])

  const handleDelete = async () => {
    setSaving(true)
    setError('')
    try {
      await lahanService.deleteLahan(showDelete.id)
      setShowDelete(null)
      await fetchLahan()
    } catch (err) {
      setError(err.message || 'Gagal menghapus lahan.')
    } finally {
      setSaving(false)
    }
  }

  const filtered = lahan.filter(l =>
    l.nama?.toLowerCase().includes(search.toLowerCase()) ||
    l.pemilik?.toLowerCase().includes(search.toLowerCase())
  )

  const totalLuas = lahan.reduce((s,l)=>s+Number(l.luas || 0),0).toFixed(1)

  const columns = [
    { key:'nama',    label:'Nama Lahan', render:(v)=><span className="font-semibold text-gray-800">{v}</span> },
    { key:'pemilik', label:'Pemilik' },
    { key:'luas',    label:'Luas', render:v=>`${v} Ha` },
    { key:'jenis_tanah', label:'Jenis' },
    { key:'lokasi',  label:'Lokasi' },
    { key:'tanaman', label:'Tanaman' },
    { key:'kondisi', label:'Kondisi',  render:v=><Badge type={kondisiStyle[v] || 'default'}>{v}</Badge> },
    { key:'id',      label:'Aksi',     render:(_,row)=>(
      <div className="flex gap-1">
        <button onClick={()=>setSelected(row)} className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors" title="Detail">Detail</button>
        <button onClick={()=>setShowDelete(row)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus"><Trash2 size={15} strokeWidth={1.8} /></button>
      </div>
    )},
  ]

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Map size={20} strokeWidth={1.8} className="text-gray-500" /> Manajemen Lahan</h2>
          <p className="text-sm text-gray-500">Data diambil dari backend Laravel/MySQL</p>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:'Total Lahan',      val:lahan.length,                                      Icon:Map,           color:'bg-primary-50 text-primary-700' },
          { label:'Total Luas',       val:`${totalLuas} Ha`,                                 Icon:Ruler,         color:'bg-blue-50 text-blue-700' },
          { label:'Kondisi Baik',     val:lahan.filter(l=>l.kondisi==='baik').length,        Icon:CheckCircle2,  color:'bg-green-50 text-green-700' },
          { label:'Perlu Perhatian',  val:lahan.filter(l=>l.kondisi!=='baik').length,        Icon:AlertTriangle, color:'bg-yellow-50 text-yellow-700' },
        ].map(({ label, val, Icon, color }, i) => (
          <div key={i} className={`${color.split(' ')[0]} rounded-2xl p-4 flex items-center gap-3`}>
            <Icon size={24} strokeWidth={1.8} className={color.split(' ')[1]} />
            <div><p className="text-xl font-bold text-gray-800">{val}</p><p className="text-xs text-gray-500">{label}</p></div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="mb-4 flex gap-3 flex-wrap">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari lahan atau pemilik..." className="input-field pl-9 max-w-xs" />
          </div>
        </div>
        <Table columns={columns} data={filtered} loading={loading} emptyMessage="Tidak ada data lahan" />
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Detail Lahan"
        footer={<button onClick={() => setSelected(null)} className="btn-outline">Tutup</button>}>
        {selected && (
          <div className="space-y-3 text-sm text-gray-700">
            <p><strong>Nama:</strong> {selected.nama}</p>
            <p><strong>Pemilik:</strong> {selected.pemilik || '-'}</p>
            <p><strong>Luas:</strong> {selected.luas} Ha</p>
            <p><strong>Jenis:</strong> {selected.jenis_tanah || '-'}</p>
            <p><strong>Lokasi:</strong> {selected.lokasi || '-'}</p>
            <p><strong>Tanaman:</strong> {selected.tanaman || '-'}</p>
            <p><strong>Catatan:</strong> {selected.catatan || '-'}</p>
          </div>
        )}
      </Modal>

      <Modal isOpen={!!showDelete} onClose={() => setShowDelete(null)} title="Hapus Lahan"
        footer={<><button onClick={() => setShowDelete(null)} className="btn-outline">Batal</button><button disabled={saving} onClick={handleDelete} className="btn-danger flex items-center gap-2"><Trash2 size={15}/> Hapus</button></>}>
        <p className="text-gray-600">Hapus lahan <strong>{showDelete?.nama}</strong> dari MySQL?</p>
      </Modal>
    </div>
  )
}

export default ManajemenLahan
