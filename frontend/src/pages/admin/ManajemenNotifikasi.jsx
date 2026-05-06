import React from 'react'
import { useNotification } from '../../context/NotificationContext'
import NotificationItem from '../../components/ui/NotificationItem'
import { BellRing, CheckCheck, Plus, Info, AlertTriangle, AlertCircle, Inbox } from 'lucide-react'
import { useState } from 'react'
import Modal from '../../components/ui/Modal'

const ManajemenNotifikasi = () => {
  const { notifications, addNotification, deleteNotification, markAsRead, markAllRead } = useNotification()
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ type:'info', title:'', message:'' })

  const handleAdd = async () => {
    if (!form.title || !form.message) return
    await addNotification(form)
    setForm({ type:'info', title:'', message:'' })
    setShowAdd(false)
  }

  const typeOptions = [
    { val:'info',    label:'Info',       Icon: Info,           color:'border-blue-300 bg-blue-50 text-blue-700' },
    { val:'warning', label:'Peringatan', Icon: AlertTriangle,  color:'border-yellow-300 bg-yellow-50 text-yellow-700' },
    { val:'danger',  label:'Bahaya',     Icon: AlertCircle,    color:'border-red-300 bg-red-50 text-red-700' },
  ]

  const summaryStats = [
    { label:'Total',        val:notifications.length,                          Icon:BellRing,     color:'bg-gray-100 text-gray-600' },
    { label:'Belum Dibaca', val:notifications.filter(n=>!n.read).length,       Icon:Inbox,        color:'bg-blue-50 text-blue-600' },
    { label:'Peringatan',   val:notifications.filter(n=>n.type==='warning').length, Icon:AlertTriangle, color:'bg-yellow-50 text-yellow-600' },
    { label:'Bahaya',       val:notifications.filter(n=>n.type==='danger').length,  Icon:AlertCircle,   color:'bg-red-50 text-red-600' },
  ]

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><BellRing size={20} strokeWidth={1.8} className="text-gray-500" /> Manajemen Notifikasi</h2>
          <p className="text-sm text-gray-500">Buat dan kelola notifikasi untuk pengguna</p>
        </div>
        <div className="flex gap-3">
          <button onClick={markAllRead} className="btn-outline text-sm flex items-center gap-2"><CheckCheck size={16} /> Tandai Semua Dibaca</button>
          <button onClick={()=>setShowAdd(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Buat Notifikasi</button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {summaryStats.map(({ label, val, Icon, color }, i) => (
          <div key={i} className={`${color.split(' ')[0]} rounded-2xl p-4 flex items-center gap-3`}>
            <Icon size={24} strokeWidth={1.8} className={color.split(' ')[1]} />
            <div><p className="text-xl font-bold text-gray-800">{val}</p><p className="text-xs text-gray-500">{label}</p></div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="font-bold text-gray-700 mb-3 text-sm">Jenis Notifikasi</h3>
        <div className="grid grid-cols-3 gap-3">
          {typeOptions.map(({ val, label, Icon, color }, i) => (
            <div key={i} className={`p-4 rounded-xl border-2 ${color}`}>
              <p className="font-bold text-sm flex items-center gap-2"><Icon size={16} strokeWidth={1.8} /> {label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <Inbox size={48} strokeWidth={1.2} className="mx-auto text-gray-300 mb-3" />
            <p className="font-semibold">Belum ada notifikasi</p>
          </div>
        ) : (
          notifications.map(n => <NotificationItem key={n.id} notification={n} onRead={markAsRead} onDelete={deleteNotification} />)
        )}
      </div>

      <Modal isOpen={showAdd} onClose={()=>setShowAdd(false)} title="Buat Notifikasi Baru"
        footer={<><button onClick={()=>setShowAdd(false)} className="btn-outline">Batal</button><button onClick={handleAdd} className="btn-primary flex items-center gap-2"><BellRing size={15}/> Kirim</button></>}>
        <div className="space-y-4">
          <div>
            <label className="label">Jenis Notifikasi</label>
            <div className="grid grid-cols-3 gap-3">
              {typeOptions.map(({ val, label, Icon, color }) => (
                <button key={val} type="button" onClick={()=>setForm(p=>({...p,type:val}))}
                  className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all flex items-center justify-center gap-2 ${form.type===val ? color : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                  <Icon size={15} strokeWidth={1.8} /> {label}
                </button>
              ))}
            </div>
          </div>
          <div><label className="label">Judul</label><input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} className="input-field" placeholder="Judul notifikasi" /></div>
          <div><label className="label">Pesan</label><textarea rows={3} value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} className="input-field resize-none" placeholder="Isi pesan..." /></div>
        </div>
      </Modal>
    </div>
  )
}

export default ManajemenNotifikasi
