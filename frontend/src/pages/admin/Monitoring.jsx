import React, { useEffect, useState } from 'react'
import Table from '../../components/ui/Table'
import Badge from '../../components/ui/Badge'
import activityService from '../../services/activityService'
import { Activity, CheckCircle2, XCircle, Users, Search, Download, BarChart2 } from 'lucide-react'

const columns = [
  { key:'user', label:'Pengguna', render:(v,row)=>(
    <div>
      <p className="font-semibold text-gray-800 text-sm">{v}</p>
      <Badge type={row.role==='admin'?'admin':'user'} className="mt-0.5">{row.role}</Badge>
    </div>
  )},
  { key:'action', label:'Aktivitas' },
  { key:'ip',     label:'IP Address', render:v=><span className="font-mono text-xs text-gray-600">{v}</span> },
  { key:'time',   label:'Waktu' },
  { key:'status', label:'Status', render:v=><Badge type={v==='sukses'?'success':'danger'}>{v}</Badge> },
]

const Monitoring = () => {
  const [filter, setFilter] = useState('semua')
  const [search, setSearch] = useState('')
  const [items, setItems] = useState([])

  useEffect(() => {
    let active = true
    const load = async () => {
      const res = await activityService.getAll()
      if (active) setItems(res.data || [])
    }
    load()
    return () => { active = false }
  }, [])

  const filtered = items.filter(a =>
    (filter==='semua' || a.status===filter) &&
    (a.user.toLowerCase().includes(search.toLowerCase()) || a.action.toLowerCase().includes(search.toLowerCase()))
  )

  const hourlyData = [8, 15, 22, 18, 12, 30, 25, 42, 35, 28, 20, 15]

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Activity size={20} strokeWidth={1.8} className="text-gray-500" /> Monitoring Aktivitas</h2>
        <p className="text-sm text-gray-500">Data aktivitas dari tabel `activity_logs`</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:'Total Aktivitas',    val:items.length,                                Icon:Activity,     color:'bg-gray-100 text-gray-600' },
          { label:'Sukses',             val:items.filter(a=>a.status==='sukses').length,  Icon:CheckCircle2, color:'bg-green-50 text-green-700' },
          { label:'Gagal / Error',      val:items.filter(a=>a.status==='gagal').length,   Icon:XCircle,      color:'bg-red-50 text-red-700' },
          { label:'User Aktif Hari Ini',val:new Set(items.map(a=>a.user)).size,           Icon:Users,        color:'bg-blue-50 text-blue-700' },
        ].map(({ label, val, Icon, color }, i) => (
          <div key={i} className={`${color.split(' ')[0]} rounded-2xl p-4 flex items-center gap-3`}>
            <Icon size={24} strokeWidth={1.8} className={color.split(' ')[1]} />
            <div><p className="text-xl font-bold text-gray-800">{val}</p><p className="text-xs text-gray-500">{label}</p></div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><BarChart2 size={18} strokeWidth={1.8} className="text-blue-500" /> Aktivitas Per Jam (Hari Ini)</h3>
        <div className="flex items-end gap-1 h-20">
          {hourlyData.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors" style={{ height:`${(v/42)*100}%` }} />
              <span className="text-xs text-gray-400">{i+7}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">Jam (07:00 - 18:00)</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari pengguna atau aktivitas..." className="input-field pl-9 max-w-xs" />
          </div>
          <div className="flex gap-2">
            {['semua','sukses','gagal'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${filter===f ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {f==='semua' ? 'Semua' : f.charAt(0).toUpperCase()+f.slice(1)}
              </button>
            ))}
          </div>
          <button className="ml-auto text-sm text-primary-700 font-semibold hover:underline flex items-center gap-1.5">
            <Download size={15} strokeWidth={1.8} /> Export Log
          </button>
        </div>
        <Table columns={columns} data={filtered} loading={false} emptyMessage="Tidak ada aktivitas" />
      </div>
    </div>
  )
}

export default Monitoring
