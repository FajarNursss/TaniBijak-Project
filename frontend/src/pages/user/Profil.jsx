import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Modal from '../../components/ui/Modal'
import authService from '../../services/authService'
import dashboardService from '../../services/dashboardService'
import {
  Pencil, Lock, BarChart3, Save, LogOut,
  MapPin, Phone, Mail, User, Star, Calendar,
  CheckCircle2, Wheat, AlertTriangle, Key, Eye, EyeOff
} from 'lucide-react'

const Profil = () => {
  const { user, logout, login } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profil')
  const [showLogout, setShowLogout] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showPw, setShowPw] = useState(false)
  const [dashboard, setDashboard] = useState(null)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '081234567890',
    location: user?.location || 'Jawa Tengah',
    bio: 'Petani padi dan palawija dengan pengalaman 10 tahun.',
  })
  const [pw, setPw] = useState({ current_password: '', password: '', password_confirmation: '' })

  useEffect(() => {
    let active = true
    const load = async () => {
      const [profileRes, dashRes] = await Promise.allSettled([
        authService.getProfile(),
        dashboardService.getUserDashboard(),
      ])
      if (!active) return
      if (profileRes.status === 'fulfilled') {
        const p = profileRes.value.user
        setForm(f => ({ ...f, name: p.name, email: p.email, location: p.location || f.location }))
      }
      if (dashRes.status === 'fulfilled') setDashboard(dashRes.value.data || null)
    }
    load()
    return () => { active = false }
  }, [])

  const handleSave = async () => {
    const res = await authService.updateProfile({
      name: form.name,
      email: form.email,
      location: form.location,
    })
    login(res.user, localStorage.getItem('tanibijak_token'))
    setEditMode(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleLogout = () => { logout(); navigate('/login') }

  const stats = [
    { label: 'Total Lahan',        val: `${dashboard?.total_luas || 0} Ha`, Icon: MapPin,        color: 'bg-primary-50 text-primary-700' },
    { label: 'Musim Tanam',        val: `${dashboard?.riwayat_tanam || 0}`, Icon: Calendar,      color: 'bg-blue-50 text-blue-700' },
    { label: 'Panen Sukses',       val: `${dashboard?.kondisi_baik || 0}`,  Icon: CheckCircle2,  color: 'bg-green-50 text-green-700' },
    { label: 'Total Produksi',     val: '28.4 ton',                         Icon: Wheat,         color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Rekomendasi Diikuti', val: '89%',                              Icon: BarChart3,     color: 'bg-purple-50 text-purple-700' },
    { label: 'Hari Aktif',         val: '234',                               Icon: Calendar,      color: 'bg-orange-50 text-orange-700' },
    { label: 'Bergabung',          val: user?.joined || '05 May 2026',      Icon: Calendar,      color: 'bg-pink-50 text-pink-700' },
    { label: 'Level',              val: 'Petani Ahli',                      Icon: Star,          color: 'bg-amber-50 text-amber-700' },
  ]

  const tabs = [
    { key: 'profil', label: 'Data Diri', Icon: User },
    { key: 'keamanan', label: 'Keamanan', Icon: Lock },
    { key: 'statistik', label: 'Statistik', Icon: BarChart3 },
  ]

  const profileFields = [
    { label: 'Nama Lengkap', key: 'name',     type: 'text',  Icon: User    },
    { label: 'Email',        key: 'email',    type: 'email', Icon: Mail    },
    { label: 'No. HP',       key: 'phone',    type: 'tel',   Icon: Phone   },
    { label: 'Lokasi',       key: 'location', type: 'text',  Icon: MapPin  },
  ]

  const handlePassword = async () => {
    await authService.changePassword(pw)
    setPw({ current_password: '', password: '', password_confirmation: '' })
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 fade-in max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-primary-800 to-primary-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-5 flex-wrap">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-4xl font-bold border-2 border-white/30">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{form.name || 'Petani'}</h2>
            <p className="text-primary-200 text-sm mt-1 flex items-center gap-1.5">
              <Mail size={13} /> {form.email}
            </p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-semibold capitalize">{user?.role || 'user'}</span>
              <span className="text-primary-200 text-xs flex items-center gap-1"><MapPin size={12} /> {form.location}</span>
            </div>
          </div>
          <button onClick={() => setEditMode(v => !v)}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2">
            <Pencil size={14} /> {editMode ? 'Batal' : 'Edit Profil'}
          </button>
        </div>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle2 size={16} /> Perubahan berhasil disimpan!
        </div>
      )}

      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map(({ key, label, Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 -mb-px flex items-center gap-2 ${activeTab === key ? 'border-primary-700 text-primary-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <Icon size={15} strokeWidth={1.8} /> {label}
          </button>
        ))}
      </div>

      {activeTab === 'profil' && (
        <div className="card">
          <h3 className="font-bold text-gray-800 mb-5">Data Diri</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {profileFields.map(({ label, key, type, Icon }) => (
              <div key={key}>
                <label className="label flex items-center gap-1.5">
                  <Icon size={13} className="text-gray-400" /> {label}
                </label>
                {editMode
                  ? <input type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} className="input-field" />
                  : <p className="py-3 px-4 bg-gray-50 rounded-lg text-gray-800 font-medium">{form[key] || '—'}</p>
                }
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="label">Bio</label>
              {editMode
                ? <textarea rows={3} value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} className="input-field resize-none" />
                : <p className="py-3 px-4 bg-gray-50 rounded-lg text-gray-600">{form.bio}</p>
              }
            </div>
          </div>
          {editMode && (
            <div className="flex gap-3 mt-6 justify-end">
              <button onClick={() => setEditMode(false)} className="btn-outline">Batal</button>
              <button onClick={handleSave} className="btn-primary flex items-center gap-2"><Save size={16} /> Simpan</button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'keamanan' && (
        <div className="space-y-5">
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2"><Key size={18} strokeWidth={1.8} className="text-gray-500" /> Ganti Password</h3>
            <div className="space-y-4 max-w-md">
              {[
                { label: 'Password Lama', key: 'current_password' },
                { label: 'Password Baru', key: 'password' },
                { label: 'Konfirmasi', key: 'password_confirmation' },
              ].map(f => (
                <div key={f.key}>
                  <label className="label">{f.label}</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type={showPw ? 'text' : 'password'} value={pw[f.key]} onChange={e => setPw(p => ({ ...p, [f.key]: e.target.value }))} className="input-field pl-11 pr-11" placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={handlePassword} className="btn-primary flex items-center gap-2"><Key size={16} /> Perbarui Password</button>
            </div>
          </div>
          <div className="card border-red-100">
            <h3 className="font-bold text-red-700 mb-3 flex items-center gap-2"><AlertTriangle size={18} strokeWidth={1.8} /> Zona Berbahaya</h3>
            <p className="text-sm text-gray-500 mb-4">Tindakan ini tidak dapat dibatalkan.</p>
            <button onClick={() => setShowLogout(true)} className="btn-danger text-sm flex items-center gap-2"><LogOut size={16} /> Keluar dari Akun</button>
          </div>
        </div>
      )}

      {activeTab === 'statistik' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(({ label, val, Icon, color }, i) => (
            <div key={i} className={`${color.split(' ')[0]} rounded-2xl p-4 text-center`}>
              <Icon size={28} strokeWidth={1.5} className={`mx-auto ${color.split(' ')[1]}`} />
              <p className="font-bold text-gray-800 text-lg mt-2">{val}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showLogout} onClose={() => setShowLogout(false)} title="Konfirmasi Keluar"
        footer={<><button onClick={() => setShowLogout(false)} className="btn-outline">Batal</button><button onClick={handleLogout} className="btn-danger flex items-center gap-2"><LogOut size={16} /> Ya, Keluar</button></>}>
        <p className="text-gray-600">Apakah Anda yakin ingin keluar dari TaniBijak?</p>
      </Modal>
    </div>
  )
}

export default Profil
