import React, { useState } from 'react'
import { Settings, Globe, Plug, Bell, Database, ToggleLeft, ToggleRight, Save, AlertTriangle, Trash2, Download, RefreshCcw } from 'lucide-react'

const Pengaturan = () => {
  const [settings, setSettings] = useState({
    siteName: 'TaniBijak Platform',
    siteDesc: 'Sistem Pendukung Keputusan Pertanian Berbasis Cuaca dan Kearifan Lokal',
    apiBaseUrl: 'http://localhost:8000/api',
    weatherApiKey: '••••••••••••••••',
    maxLahanPerUser: 10,
    notifEnabled: true,
    maintenanceMode: false,
    autoRekomendasi: true,
    dataRetentionDays: 365,
    emailNotif: true,
  })
  const [saved, setSaved] = useState(false)
  const [activeSection, setActiveSection] = useState('umum')

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000) }
  const toggle = (key) => setSettings(p => ({ ...p, [key]: !p[key] }))

  const ToggleSwitch = ({ label, desc, settingKey }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
      <div>
        <p className="font-semibold text-sm text-gray-800">{label}</p>
        {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
      </div>
      <button onClick={() => toggle(settingKey)} className="transition-all">
        {settings[settingKey]
          ? <ToggleRight size={36} strokeWidth={1.5} className="text-primary-600" />
          : <ToggleLeft size={36} strokeWidth={1.5} className="text-gray-300" />
        }
      </button>
    </div>
  )

  const sections = [
    { key:'umum',       label:'Umum',          Icon: Globe   },
    { key:'api',        label:'API & Integrasi', Icon: Plug   },
    { key:'notifikasi', label:'Notifikasi',     Icon: Bell    },
    { key:'sistem',     label:'Sistem',         Icon: Database },
  ]

  return (
    <div className="space-y-6 fade-in max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Settings size={20} strokeWidth={1.8} className="text-gray-500" /> Pengaturan Sistem</h2>
        <p className="text-sm text-gray-500">Konfigurasi platform TaniBijak</p>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <Save size={15} /> Pengaturan berhasil disimpan!
        </div>
      )}

      <div className="flex gap-2 flex-wrap">
        {sections.map(({ key, label, Icon }) => (
          <button key={key} onClick={() => setActiveSection(key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${activeSection===key ? 'bg-gray-800 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            <Icon size={15} strokeWidth={1.8} /> {label}
          </button>
        ))}
      </div>

      {activeSection === 'umum' && (
        <div className="card space-y-5">
          <h3 className="font-bold text-gray-800 flex items-center gap-2"><Globe size={16} strokeWidth={1.8} className="text-gray-500" /> Pengaturan Umum</h3>
          <div><label className="label">Nama Platform</label><input value={settings.siteName} onChange={e => setSettings(p=>({...p,siteName:e.target.value}))} className="input-field" /></div>
          <div><label className="label">Deskripsi Platform</label><textarea rows={3} value={settings.siteDesc} onChange={e => setSettings(p=>({...p,siteDesc:e.target.value}))} className="input-field resize-none" /></div>
          <div><label className="label">Maksimal Lahan per Pengguna</label><input type="number" value={settings.maxLahanPerUser} onChange={e => setSettings(p=>({...p,maxLahanPerUser:parseInt(e.target.value)}))} className="input-field max-w-xs" /></div>
          <div><label className="label">Retensi Data (hari)</label><input type="number" value={settings.dataRetentionDays} onChange={e => setSettings(p=>({...p,dataRetentionDays:parseInt(e.target.value)}))} className="input-field max-w-xs" /></div>
        </div>
      )}

      {activeSection === 'api' && (
        <div className="card space-y-5">
          <h3 className="font-bold text-gray-800 flex items-center gap-2"><Plug size={16} strokeWidth={1.8} className="text-gray-500" /> Konfigurasi API</h3>
          <div><label className="label">Base URL Backend API</label><input value={settings.apiBaseUrl} onChange={e => setSettings(p=>({...p,apiBaseUrl:e.target.value}))} className="input-field font-mono text-sm" /></div>
          <div><label className="label">Weather API Key</label><input type="password" value={settings.weatherApiKey} onChange={e => setSettings(p=>({...p,weatherApiKey:e.target.value}))} className="input-field font-mono text-sm" /></div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-blue-700 mb-2 flex items-center gap-2"><Plug size={14} /> Status Koneksi API</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full" /><span className="text-xs text-gray-600">Backend API: <span className="font-semibold text-green-700">Terhubung</span></span></div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 bg-yellow-500 rounded-full" /><span className="text-xs text-gray-600">Weather API: <span className="font-semibold text-yellow-700">Mode Demo</span></span></div>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'notifikasi' && (
        <div className="card space-y-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2"><Bell size={16} strokeWidth={1.8} className="text-gray-500" /> Pengaturan Notifikasi</h3>
          <ToggleSwitch label="Aktifkan Notifikasi" desc="Tampilkan notifikasi ke pengguna" settingKey="notifEnabled" />
          <ToggleSwitch label="Notifikasi Email" desc="Kirim notifikasi melalui email" settingKey="emailNotif" />
          <ToggleSwitch label="Rekomendasi Otomatis" desc="Buat rekomendasi tanam otomatis berdasarkan data cuaca" settingKey="autoRekomendasi" />
        </div>
      )}

      {activeSection === 'sistem' && (
        <div className="card space-y-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2"><Database size={16} strokeWidth={1.8} className="text-gray-500" /> Pengaturan Sistem</h3>
          <ToggleSwitch label="Mode Maintenance" desc="Nonaktifkan akses pengguna sementara" settingKey="maintenanceMode" />
          {settings.maintenanceMode && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-yellow-800 flex items-center gap-2"><AlertTriangle size={15} /> Mode Maintenance Aktif</p>
              <p className="text-xs text-yellow-700 mt-1">Pengguna tidak dapat mengakses platform. Hanya admin yang bisa login.</p>
            </div>
          )}
          <div className="pt-2 border-t border-gray-100 space-y-3">
            <h4 className="font-semibold text-gray-700 text-sm">Tindakan Sistem</h4>
            <div className="flex gap-3 flex-wrap">
              <button className="btn-outline text-sm flex items-center gap-2"><RefreshCcw size={14} /> Bersihkan Cache</button>
              <button className="btn-outline text-sm flex items-center gap-2"><Download size={14} /> Export Data</button>
              <button className="text-sm px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 font-semibold transition-all flex items-center gap-2">
                <AlertTriangle size={14} /> Reset Database
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button onClick={handleSave} className="btn-primary px-8 flex items-center gap-2"><Save size={16} /> Simpan Pengaturan</button>
      </div>
    </div>
  )
}

export default Pengaturan
