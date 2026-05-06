import React, { useEffect, useState } from 'react'
import Badge from '../../components/ui/Badge'
import Table from '../../components/ui/Table'
import Modal from '../../components/ui/Modal'
import userService from '../../services/userService'
import {
  Users, UserCheck, UserX, ShieldCheck,
  Plus, Search, Pencil, Trash2
} from 'lucide-react'

const emptyForm = { name: '', email: '', password: '', role: 'user', location: '', status: 'aktif' }

const ManajemenUser = () => {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [showDelete, setShowDelete] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [editForm, setEditForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchUsers = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await userService.getAllUsers()
      setUsers(res.data || [])
    } catch (err) {
      setError(err.message || 'Gagal memuat data user dari API.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const openEdit = (user) => {
    setSelected(user)
    setEditForm({ ...emptyForm, ...user, password: '' })
  }

  const handleCreate = async () => {
    setSaving(true)
    setError('')
    try {
      await userService.createUser(form)
      setShowAdd(false)
      setForm(emptyForm)
      await fetchUsers()
    } catch (err) {
      setError(err.message || 'Gagal menambah user.')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async () => {
    setSaving(true)
    setError('')
    try {
      const payload = { ...editForm }
      if (!payload.password) delete payload.password
      await userService.updateUser(selected.id, payload)
      setSelected(null)
      await fetchUsers()
    } catch (err) {
      setError(err.message || 'Gagal mengubah user.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setSaving(true)
    setError('')
    try {
      await userService.deleteUser(showDelete.id)
      setShowDelete(null)
      await fetchUsers()
    } catch (err) {
      setError(err.message || 'Gagal menghapus user.')
    } finally {
      setSaving(false)
    }
  }

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  const summaryStats = [
    { label:'Total User',  val:users.length,                                Icon:Users,       color:'bg-blue-50 text-blue-700' },
    { label:'Aktif',       val:users.filter(u=>u.status==='aktif').length,  Icon:UserCheck,   color:'bg-green-50 text-green-700' },
    { label:'Non-aktif',   val:users.filter(u=>u.status!=='aktif').length,  Icon:UserX,       color:'bg-yellow-50 text-yellow-700' },
    { label:'Admin',       val:users.filter(u=>u.role==='admin').length,    Icon:ShieldCheck, color:'bg-purple-50 text-purple-700' },
  ]

  const columns = [
    { key:'name', label:'Nama', render:(v)=>(
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary-700 rounded-full flex items-center justify-center text-white text-xs font-bold">{v?.charAt(0)}</div>
        <span className="font-semibold text-gray-800">{v}</span>
      </div>
    )},
    { key:'email', label:'Email' },
    { key:'role', label:'Role', render:v=><Badge type={v==='admin'?'admin':'user'}>{v}</Badge> },
    { key:'location', label:'Lokasi' },
    { key:'lahan', label:'Lahan', render:v=>`${v || 0} data` },
    { key:'status', label:'Status', render:v=><Badge type={v==='aktif'?'success':'default'}>{v}</Badge> },
    { key:'joined', label:'Bergabung' },
    { key:'id', label:'Aksi', render:(_,row)=>(
      <div className="flex gap-2">
        <button onClick={()=>openEdit(row)} className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><Pencil size={15} strokeWidth={1.8} /></button>
        <button onClick={()=>setShowDelete(row)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus"><Trash2 size={15} strokeWidth={1.8} /></button>
      </div>
    )},
  ]

  const input = (state, setState, key) => ({
    value: state[key] || '',
    onChange: e => setState(p => ({ ...p, [key]: e.target.value })),
  })

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Users size={20} strokeWidth={1.8} className="text-gray-500" /> Manajemen User</h2>
          <p className="text-sm text-gray-500">Data diambil dari backend Laravel/MySQL</p>
        </div>
        <button onClick={()=>setShowAdd(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Tambah User</button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {summaryStats.map(({ label, val, Icon, color }, i) => (
          <div key={i} className={`${color.split(' ')[0]} rounded-2xl p-4 flex items-center gap-3`}>
            <Icon size={24} strokeWidth={1.8} className={color.split(' ')[1]} />
            <div><p className="text-xl font-bold text-gray-800">{val}</p><p className="text-xs text-gray-500">{label}</p></div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cari nama atau email..." className="input-field pl-9 max-w-xs" />
          </div>
        </div>
        <Table columns={columns} data={filtered} loading={loading} emptyMessage="Tidak ada pengguna ditemukan" />
      </div>

      <Modal isOpen={!!selected} onClose={()=>setSelected(null)} title="Edit Pengguna"
        footer={<><button onClick={()=>setSelected(null)} className="btn-outline">Batal</button><button disabled={saving} onClick={handleUpdate} className="btn-primary flex items-center gap-2"><Pencil size={15}/> Simpan</button></>}>
        <div className="space-y-4">
          <div><label className="label">Nama</label><input {...input(editForm, setEditForm, 'name')} className="input-field" /></div>
          <div><label className="label">Email</label><input {...input(editForm, setEditForm, 'email')} className="input-field" /></div>
          <div><label className="label">Password Baru</label><input type="password" {...input(editForm, setEditForm, 'password')} className="input-field" placeholder="Kosongkan jika tidak diganti" /></div>
          <div><label className="label">Lokasi</label><input {...input(editForm, setEditForm, 'location')} className="input-field" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Role</label><select {...input(editForm, setEditForm, 'role')} className="input-field"><option value="user">user</option><option value="admin">admin</option></select></div>
            <div><label className="label">Status</label><select {...input(editForm, setEditForm, 'status')} className="input-field"><option value="aktif">aktif</option><option value="nonaktif">nonaktif</option></select></div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showAdd} onClose={()=>setShowAdd(false)} title="Tambah Pengguna Baru"
        footer={<><button onClick={()=>setShowAdd(false)} className="btn-outline">Batal</button><button disabled={saving} onClick={handleCreate} className="btn-primary flex items-center gap-2"><Plus size={15}/> Simpan</button></>}>
        <div className="space-y-4">
          <div><label className="label">Nama</label><input {...input(form, setForm, 'name')} className="input-field" placeholder="Nama lengkap" /></div>
          <div><label className="label">Email</label><input {...input(form, setForm, 'email')} className="input-field" placeholder="email@domain.com" /></div>
          <div><label className="label">Password</label><input type="password" {...input(form, setForm, 'password')} className="input-field" placeholder="Minimal 6 karakter" /></div>
          <div><label className="label">Lokasi</label><input {...input(form, setForm, 'location')} className="input-field" placeholder="Kab/Kota" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Role</label><select {...input(form, setForm, 'role')} className="input-field"><option value="user">user</option><option value="admin">admin</option></select></div>
            <div><label className="label">Status</label><select {...input(form, setForm, 'status')} className="input-field"><option value="aktif">aktif</option><option value="nonaktif">nonaktif</option></select></div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!showDelete} onClose={()=>setShowDelete(null)} title="Hapus Pengguna"
        footer={<><button onClick={()=>setShowDelete(null)} className="btn-outline">Batal</button><button disabled={saving} onClick={handleDelete} className="btn-danger flex items-center gap-2"><Trash2 size={15}/> Hapus</button></>}>
        <p className="text-gray-600">Hapus pengguna <strong>{showDelete?.name}</strong>? Tindakan ini akan menghapus data di MySQL.</p>
      </Modal>
    </div>
  )
}

export default ManajemenUser
