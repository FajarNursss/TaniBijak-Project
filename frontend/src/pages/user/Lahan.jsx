import React, { useEffect, useState } from 'react'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import lahanService from '../../services/lahanService'
import {
  MapPin, Plus, Ruler, Leaf, Sprout, RefreshCcw,
  Navigation, Trash2, CheckCircle2, AlertTriangle,
  XCircle, Eye, Clock, FlaskConical
} from 'lucide-react'

const kondisiConfig = {
  baik:              { type: 'success', label: 'Baik',            Icon: CheckCircle2,   border: 'border-primary-500' },
  perhatian:         { type: 'warning', label: 'Perlu Perhatian', Icon: AlertTriangle,  border: 'border-yellow-500' },
  'perlu-perhatian': { type: 'warning', label: 'Perlu Perhatian', Icon: AlertTriangle,  border: 'border-yellow-500' },
  kritis:            { type: 'danger',  label: 'Kritis',          Icon: XCircle,        border: 'border-red-500' },
}

const emptyForm = { nama:'', luas:'', jenis_tanah:'Sawah', lokasi:'', tanaman:'', kondisi:'baik', catatan:'' }

const Lahan = () => {
  const [lahanList, setLahanList] = useState([])
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [showDelete, setShowDelete] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchLahan = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await lahanService.getMyLahan()
      setLahanList(res.data || [])
    } catch (err) {
      setError(err.message || 'Gagal memuat data lahan dari API.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLahan()
  }, [])

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleCreate = async () => {
    setSaving(true)
    setError('')
    try {
      await lahanService.createLahan({
        ...form,
        luas: Number(form.luas || 0),
      })
      setShowAdd(false)
      setForm(emptyForm)
      await fetchLahan()
    } catch (err) {
      setError(err.message || 'Gagal menyimpan lahan.')
    } finally {
      setSaving(false)
    }
  }

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

  const totalLuas = lahanList.reduce((sum, l) => sum + Number(l.luas || 0), 0).toFixed(1)

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><MapPin size={20} strokeWidth={1.8} className="text-primary-600" /> Lahan Saya</h2>
          <p className="text-sm text-gray-500">Kelola informasi lahan Anda</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setShowAdd(true) }} className="btn-primary flex items-center gap-2"><Plus size={16} /> Tambah Lahan</button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:'Total Lahan',      val:lahanList.length,                                      Icon:MapPin,         color:'bg-primary-50 text-primary-700' },
          { label:'Total Luas',       val:`${totalLuas} Ha`,                                     Icon:Ruler,          color:'bg-blue-50 text-blue-700' },
          { label:'Kondisi Baik',     val:lahanList.filter(l=>l.kondisi==='baik').length,        Icon:CheckCircle2,   color:'bg-green-50 text-green-700' },
          { label:'Perlu Perhatian',  val:lahanList.filter(l=>l.kondisi!=='baik').length,        Icon:AlertTriangle,  color:'bg-yellow-50 text-yellow-700' },
        ].map(({ label, val, Icon, color }, i) => (
          <div key={i} className={`${color.split(' ')[0]} rounded-2xl p-4 flex items-center gap-3`}>
            <Icon size={24} strokeWidth={1.8} className={color.split(' ')[1]} />
            <div><p className="text-xl font-bold text-gray-800">{val}</p><p className="text-xs text-gray-500">{label}</p></div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-10 h-10 border-4 border-primary-300 border-t-primary-800 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {lahanList.map(l => {
            const cfg = kondisiConfig[l.kondisi] || kondisiConfig.baik
            return (
              <div key={l.id} className={`card hover:shadow-md transition-all border-2 ${cfg.border}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{l.nama}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                      <Navigation size={11} className="text-gray-400" /> {l.lokasi || '-'}
                    </p>
                  </div>
                  <Badge type={cfg.type}>{cfg.label}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 my-3">
                  {[
                    { label:'Luas',    value:`${l.luas} Ha`,             Icon:Ruler },
                    { label:'Jenis',   value:l.jenis_tanah || '-',       Icon:MapPin },
                    { label:'Tanaman', value:l.tanaman || '-',           Icon:Sprout },
                    { label:'Status',  value:'Tersimpan',                Icon:RefreshCcw },
                  ].map(({ label, value, Icon }, i) => (
                    <div key={i} className="bg-gray-50 rounded-xl p-2.5">
                      <p className="text-xs text-gray-400 flex items-center gap-1 mb-0.5"><Icon size={11} /> {label}</p>
                      <p className="font-semibold text-sm text-gray-800">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <div className="flex gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><FlaskConical size={12} className="text-gray-400" /> ID: <b className="text-gray-700">{l.id}</b></span>
                    <span className="flex items-center gap-1"><Leaf size={12} className="text-gray-400" /> Tersimpan</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setSelected(l)} className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors" title="Detail"><Eye size={15} strokeWidth={1.8} /></button>
                    <button onClick={() => setShowDelete(l)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus"><Trash2 size={15} strokeWidth={1.8} /></button>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1"><Clock size={11} /> Diperbarui baru saja</p>
              </div>
            )
          })}
        </div>
      )}

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Detail - ${selected?.nama}`} size="lg"
        footer={<><button onClick={() => setShowDelete(selected) || setSelected(null)} className="btn-danger text-sm flex items-center gap-2"><Trash2 size={14}/> Hapus</button><button onClick={() => setSelected(null)} className="btn-outline">Tutup</button></>}>
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label:'Luas',       val:`${selected.luas} Ha`,         Icon:Ruler },
                { label:'Jenis',      val:selected.jenis_tanah || '-',   Icon:MapPin },
                { label:'Tanaman',    val:selected.tanaman || '-',       Icon:Sprout },
                { label:'Kondisi',    val:selected.kondisi,              Icon:RefreshCcw },
                { label:'ID Lahan',   val:selected.id,                   Icon:FlaskConical },
                { label:'Pemilik ID', val:selected.user_id,              Icon:Leaf },
              ].map(({ label, val, Icon }, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 flex items-center gap-1 mb-1"><Icon size={11} /> {label}</p>
                  <p className="font-bold text-gray-800">{val}</p>
                </div>
              ))}
            </div>
            <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
              <p className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2"><Navigation size={14} className="text-primary-600" /> Lokasi</p>
              <p className="text-sm text-gray-600">{selected.lokasi || '-'}</p>
              <p className="text-xs text-gray-400 mt-1">{selected.catatan || 'Tidak ada catatan.'}</p>
            </div>
          </div>
        )}
      </Modal>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Tambah Lahan Baru"
        footer={<><button onClick={() => setShowAdd(false)} className="btn-outline">Batal</button><button disabled={saving} onClick={handleCreate} className="btn-primary flex items-center gap-2"><Plus size={15}/> Simpan Lahan</button></>}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="label">Nama Lahan</label><input name="nama" value={form.nama} onChange={handleChange} className="input-field" placeholder="Sawah Utara" /></div>
            <div><label className="label">Luas (Ha)</label><input name="luas" value={form.luas} onChange={handleChange} className="input-field" placeholder="1.5" type="number" step="0.1" /></div>
          </div>
          <div><label className="label">Jenis Tanah/Lahan</label><input name="jenis_tanah" value={form.jenis_tanah} onChange={handleChange} className="input-field" placeholder="Sawah / Aluvial / Latosol" /></div>
          <div><label className="label">Tanaman</label><input name="tanaman" value={form.tanaman} onChange={handleChange} className="input-field" placeholder="Padi IR64" /></div>
          <div><label className="label">Lokasi / Alamat</label><input name="lokasi" value={form.lokasi} onChange={handleChange} className="input-field" placeholder="Desa, Kecamatan, Kabupaten" /></div>
          <div><label className="label">Catatan</label><textarea name="catatan" value={form.catatan} onChange={handleChange} className="input-field resize-none" rows={3} /></div>
        </div>
      </Modal>

      <Modal isOpen={!!showDelete} onClose={() => setShowDelete(null)} title="Hapus Lahan"
        footer={<><button onClick={() => setShowDelete(null)} className="btn-outline">Batal</button><button disabled={saving} onClick={handleDelete} className="btn-danger flex items-center gap-2"><Trash2 size={15}/> Ya, Hapus</button></>}>
        <p className="text-gray-600">Hapus lahan <strong>{showDelete?.nama}</strong>?</p>
      </Modal>
    </div>
  )
}

export default Lahan
