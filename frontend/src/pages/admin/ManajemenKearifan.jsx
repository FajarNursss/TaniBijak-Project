import React, { useEffect, useState } from 'react'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import wisdomService from '../../services/wisdomService'
import { BookOpen, Plus, Pencil, Trash2, Star } from 'lucide-react'

const emptyForm = { title:'', category:'Musim', region:'', relevance:'Sedang', description:'', benefits:[''], crops:[''], status:'aktif', icon:'' }

const ManajemenKearifan = () => {
  const [data, setData] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [showDelete, setShowDelete] = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const kategoriList = ['Musim', 'Irigasi', 'Teknik Tanam', 'Rotasi', 'Varietas', 'Konservasi']

  const load = async () => {
    const res = await wisdomService.getAdminAll()
    setData(res.data || [])
  }

  useEffect(() => { load() }, [])

  const create = async () => {
    await wisdomService.create({
      ...form,
      benefits: form.benefits.filter(Boolean),
      crops: form.crops.filter(Boolean),
    })
    setShowAdd(false)
    setForm(emptyForm)
    await load()
  }

  const update = async () => {
    await wisdomService.update(selected.id, {
      title: selected.judul,
      category: selected.kategori,
      region: selected.daerah,
      relevance: selected.relevansi,
      description: selected.deskripsi,
      benefits: selected.manfaat || [],
      crops: selected.tanaman || [],
      status: selected.status,
      icon: selected.icon || '',
    })
    setSelected(null)
    await load()
  }

  const remove = async () => {
    await wisdomService.delete(showDelete.id)
    setShowDelete(null)
    await load()
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><BookOpen size={20} strokeWidth={1.8} className="text-gray-500" /> Manajemen Kearifan Lokal</h2>
          <p className="text-sm text-gray-500">Data dari tabel `local_wisdoms`</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Tambah Kearifan</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label:'Total Entri', val:data.length,                             Icon:BookOpen, color:'bg-amber-50 text-amber-700' },
          { label:'Aktif',       val:data.filter(d=>d.status==='aktif').length, Icon:Star,  color:'bg-green-50 text-green-700' },
          { label:'Draft',       val:data.filter(d=>d.status==='draft').length, Icon:Pencil, color:'bg-gray-100 text-gray-600' },
        ].map(({ label, val, Icon, color }, i) => (
          <div key={i} className={`${color.split(' ')[0]} rounded-2xl p-4 flex items-center gap-3`}>
            <Icon size={24} strokeWidth={1.8} className={color.split(' ')[1]} />
            <div><p className="text-xl font-bold text-gray-800">{val}</p><p className="text-xs text-gray-500">{label}</p></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {data.map(k => (
          <div key={k.id} className="card hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-gray-800">{k.judul}</h3>
                <div className="flex gap-2 mt-1 flex-wrap items-center">
                  <Badge type="primary">{k.kategori}</Badge>
                  <span className="text-xs text-gray-400 flex items-center gap-0.5">
                    <Star size={11} className="text-yellow-400 fill-yellow-400" /> {k.relevansi}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1">📍 {k.daerah}</p>
              </div>
              <Badge type={k.status === 'aktif' ? 'success' : 'default'}>{k.status}</Badge>
            </div>
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <button onClick={() => setSelected(k)} className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline"><Pencil size={12} /> Edit</button>
              <button onClick={() => setShowDelete(k)} className="flex items-center gap-1 text-xs text-red-500 font-semibold hover:underline"><Trash2 size={12} /> Hapus</button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Tambah Kearifan Lokal" size="lg"
        footer={<><button onClick={() => setShowAdd(false)} className="btn-outline">Batal</button><button onClick={create} className="btn-primary flex items-center gap-2"><Plus size={15}/> Simpan</button></>}>
        <div className="space-y-4">
          <div><label className="label">Judul</label><input value={form.title} onChange={e => setForm(p=>({...p,title:e.target.value}))} className="input-field" placeholder="Nama kearifan lokal" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Kategori</label><select value={form.category} onChange={e => setForm(p=>({...p,category:e.target.value}))} className="input-field">{kategoriList.map(k=><option key={k}>{k}</option>)}</select></div>
            <div><label className="label">Daerah Asal</label><input value={form.region} onChange={e => setForm(p=>({...p,region:e.target.value}))} className="input-field" placeholder="Jawa, Bali, dll" /></div>
          </div>
          <div><label className="label">Deskripsi</label><textarea rows={4} value={form.description} onChange={e => setForm(p=>({...p,description:e.target.value}))} className="input-field resize-none" placeholder="Penjelasan detail..." /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Relevansi</label><select value={form.relevance} onChange={e => setForm(p=>({...p,relevance:e.target.value}))} className="input-field"><option>Tinggi</option><option>Sedang</option><option>Rendah</option></select></div>
            <div><label className="label">Status</label><select value={form.status} onChange={e => setForm(p=>({...p,status:e.target.value}))} className="input-field"><option value="aktif">Aktif</option><option value="draft">Draft</option></select></div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Edit Kearifan Lokal" size="lg"
        footer={<><button onClick={() => setSelected(null)} className="btn-outline">Batal</button><button onClick={update} className="btn-primary flex items-center gap-2"><Pencil size={15}/> Simpan</button></>}>
        {selected && (
          <div className="space-y-4">
            <div><label className="label">Judul</label><input value={selected.judul} onChange={e=>setSelected(p=>({...p,judul:e.target.value}))} className="input-field" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Kategori</label><select value={selected.kategori} onChange={e=>setSelected(p=>({...p,kategori:e.target.value}))} className="input-field">{kategoriList.map(k=><option key={k}>{k}</option>)}</select></div>
              <div><label className="label">Relevansi</label><select value={selected.relevansi} onChange={e=>setSelected(p=>({...p,relevansi:e.target.value}))} className="input-field"><option>Tinggi</option><option>Sedang</option><option>Rendah</option></select></div>
            </div>
            <div><label className="label">Status</label><select value={selected.status} onChange={e=>setSelected(p=>({...p,status:e.target.value}))} className="input-field"><option value="aktif">Aktif</option><option value="draft">Draft</option></select></div>
          </div>
        )}
      </Modal>

      <Modal isOpen={!!showDelete} onClose={() => setShowDelete(null)} title="Hapus Kearifan Lokal"
        footer={<><button onClick={() => setShowDelete(null)} className="btn-outline">Batal</button><button onClick={remove} className="btn-danger flex items-center gap-2"><Trash2 size={15}/> Hapus</button></>}>
        <p className="text-gray-600">Hapus <strong>{showDelete?.judul}</strong>? Tindakan ini permanen.</p>
      </Modal>
    </div>
  )
}

export default ManajemenKearifan
