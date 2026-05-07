import React, { useEffect, useState } from 'react'
import {
  CalendarDays, ChevronLeft, ChevronRight, Sprout,
  CheckCircle2, Clock, Wheat, Plus, Info, Save
} from 'lucide-react'
import Modal from '../../components/ui/Modal'
import calendarService from '../../services/calendarService'
import lahanService from '../../services/lahanService'

const HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
const BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']

const jenisStyle = {
  tanam:   { color: 'bg-primary-500', text: 'text-primary-700', bg: 'bg-primary-50',  Icon: Sprout },
  pupuk:   { color: 'bg-blue-500',    text: 'text-blue-700',    bg: 'bg-blue-50',     Icon: Sprout },
  hama:    { color: 'bg-yellow-500',  text: 'text-yellow-700',  bg: 'bg-yellow-50',   Icon: Info },
  irigasi: { color: 'bg-cyan-500',    text: 'text-cyan-700',    bg: 'bg-cyan-50',     Icon: CheckCircle2 },
  panen:   { color: 'bg-amber-500',   text: 'text-amber-700',   bg: 'bg-amber-50',    Icon: Wheat },
}

const emptyForm = {
  event_date: '',
  kind: 'tanam',
  label: '',
  lahan_id: '',
  status: 'terjadwal',
}

const toDateInput = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const Kalender = () => {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDay, setSelectedDay] = useState(null)
  const [events, setEvents] = useState([])
  const [lahanList, setLahanList] = useState([])
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchEvents = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await calendarService.getAll()
      setEvents(res.data || [])
    } catch (err) {
      setError(err.message || 'Gagal memuat kalender tanam.')
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
        const [eventsRes, lahanRes] = await Promise.all([
          calendarService.getAll(),
          lahanService.getMyLahan(),
        ])

        if (!active) return
        setEvents(eventsRes.data || [])
        setLahanList(lahanRes.data || [])
      } catch (err) {
        if (active) setError(err.message || 'Gagal memuat kalender tanam.')
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => { active = false }
  }, [])

  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()

  const prevMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  const nextMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))

  const selectedDate = selectedDay
    ? toDateInput(new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay))
    : toDateInput(today)

  const getEventsForDay = (day) => {
    const dateStr = toDateInput(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))
    return events.filter(e => e.date === dateStr)
  }

  const openAddModal = (date = selectedDate) => {
    setForm({
      ...emptyForm,
      event_date: date,
    })
    setShowAdd(true)
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleCreate = async () => {
    setSaving(true)
    setError('')
    try {
      await calendarService.create({
        ...form,
        lahan_id: form.lahan_id ? Number(form.lahan_id) : null,
      })

      const savedDate = new Date(`${form.event_date}T00:00:00`)
      setShowAdd(false)
      setForm(emptyForm)
      await fetchEvents()
      setCurrentDate(new Date(savedDate.getFullYear(), savedDate.getMonth(), 1))
      setSelectedDay(savedDate.getDate())
    } catch (err) {
      setError(err.message || 'Gagal menyimpan jadwal tanam.')
    } finally {
      setSaving(false)
    }
  }

  const selectedEvents = selectedDay ? getEventsForDay(selectedDay) : []

  const upcomingEvents = events
    .filter(e => new Date(`${e.date}T00:00:00`) >= new Date(toDateInput(today)))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 4)

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <CalendarDays size={20} strokeWidth={1.8} className="text-primary-600" /> Kalender Tanam
          </h2>
          <p className="text-sm text-gray-500">Kelola jadwal tanam dan panen Anda</p>
        </div>
        <button onClick={() => openAddModal()} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Tambah Jadwal
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <ChevronLeft size={20} strokeWidth={2} className="text-gray-600" />
            </button>
            <h3 className="font-bold text-gray-800 text-lg">
              {BULAN[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <ChevronRight size={20} strokeWidth={2} className="text-gray-600" />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {HARI.map(h => <div key={h} className="text-center text-xs font-bold text-gray-400 py-1">{h}</div>)}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-primary-300 border-t-primary-800 rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }, (_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1
                const dayEvents = getEventsForDay(day)
                const isToday = today.getDate()===day && today.getMonth()===currentDate.getMonth() && today.getFullYear()===currentDate.getFullYear()
                const isSelected = selectedDay === day
                return (
                  <button key={day} onClick={() => setSelectedDay(isSelected ? null : day)}
                    className={`relative flex flex-col items-center justify-start p-1.5 rounded-xl min-h-[52px] text-sm transition-all hover:bg-primary-50
                      ${isSelected ? 'bg-primary-800 text-white' : isToday ? 'bg-primary-100 text-primary-800 font-bold' : 'text-gray-700'}`}>
                    <span className="font-semibold">{day}</span>
                    <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                      {dayEvents.slice(0, 3).map((ev, ei) => {
                        const style = jenisStyle[ev.jenis] || jenisStyle.tanam
                        return <div key={ev.id || ei} className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : style.color}`} />
                      })}
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {selectedDay && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between gap-3 mb-3">
                <p className="font-bold text-gray-800 text-sm">
                  {selectedDay} {BULAN[currentDate.getMonth()]} - {selectedEvents.length > 0 ? `${selectedEvents.length} kegiatan` : 'Tidak ada kegiatan'}
                </p>
                <button onClick={() => openAddModal(selectedDate)} className="btn-outline text-sm flex items-center gap-2">
                  <Plus size={14} /> Tambah
                </button>
              </div>
              {selectedEvents.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">Tidak ada jadwal untuk hari ini</p>
              ) : (
                <div className="space-y-2">
                  {selectedEvents.map((ev, i) => {
                    const style = jenisStyle[ev.jenis] || jenisStyle.tanam
                    return (
                      <div key={ev.id || i} className={`flex items-center gap-3 p-3 rounded-xl ${style.bg}`}>
                        {React.createElement(style.Icon, { size: 16, strokeWidth: 1.8, className: style.text })}
                        <div>
                          <p className={`font-semibold text-sm ${style.text}`}>{ev.label}</p>
                          <p className="text-xs text-gray-500">{ev.lahan || 'Tanpa lahan'} {ev.status ? `- ${ev.status}` : ''}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">Legenda Kegiatan</h3>
            <div className="space-y-2">
              {Object.entries(jenisStyle).map(([key, style]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${style.color}`} />
                  <span className="text-sm text-gray-600 capitalize">{key === 'hama' ? 'Pengendalian Hama' : key.charAt(0).toUpperCase()+key.slice(1)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Clock size={16} strokeWidth={1.8} className="text-gray-500" /> Jadwal Mendatang
            </h3>
            <div className="space-y-3">
              {upcomingEvents.map((ev, i) => {
                const style = jenisStyle[ev.jenis] || jenisStyle.tanam
                const d = new Date(`${ev.date}T00:00:00`)
                return (
                  <div key={ev.id || i} className={`flex gap-3 p-3 rounded-xl ${style.bg}`}>
                    <div className="text-center min-w-[36px]">
                      <p className="text-xs text-gray-500">{BULAN[d.getMonth()].slice(0,3)}</p>
                      <p className={`text-xl font-bold ${style.text}`}>{d.getDate()}</p>
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${style.text}`}>{ev.label}</p>
                      <p className="text-xs text-gray-500">{ev.lahan || 'Tanpa lahan'} {ev.status ? `- ${ev.status}` : ''}</p>
                    </div>
                  </div>
                )
              })}
              {upcomingEvents.length === 0 && <p className="text-sm text-gray-400">Belum ada jadwal.</p>}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        title="Tambah Jadwal Tanam"
        footer={
          <>
            <button onClick={() => setShowAdd(false)} className="btn-outline">Batal</button>
            <button disabled={saving || !form.event_date || !form.label} onClick={handleCreate} className="btn-primary flex items-center gap-2">
              <Save size={15} /> Simpan Jadwal
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Tanggal</label>
              <input type="date" name="event_date" value={form.event_date} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="label">Jenis Kegiatan</label>
              <select name="kind" value={form.kind} onChange={handleChange} className="input-field">
                <option value="tanam">Tanam</option>
                <option value="pupuk">Pemupukan</option>
                <option value="hama">Pengendalian Hama</option>
                <option value="irigasi">Irigasi</option>
                <option value="panen">Panen</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Nama Jadwal</label>
            <input name="label" value={form.label} onChange={handleChange} className="input-field" placeholder="Contoh: Tanam padi musim hujan" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Lahan</label>
              <select name="lahan_id" value={form.lahan_id} onChange={handleChange} className="input-field">
                <option value="">Tanpa lahan</option>
                {lahanList.map(lahan => (
                  <option key={lahan.id} value={lahan.id}>{lahan.nama}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="input-field">
                <option value="terjadwal">Terjadwal</option>
                <option value="berjalan">Berjalan</option>
                <option value="selesai">Selesai</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Kalender
