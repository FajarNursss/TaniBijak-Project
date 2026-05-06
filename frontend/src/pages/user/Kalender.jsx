import React, { useEffect, useState } from 'react'
import {
  CalendarDays, ChevronLeft, ChevronRight, Sprout,
  CheckCircle2, Clock, Wheat, Plus, Info
} from 'lucide-react'
import calendarService from '../../services/calendarService'

const HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
const BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']

const jenisStyle = {
  tanam:   { color: 'bg-primary-500', text: 'text-primary-700', bg: 'bg-primary-50',  Icon: Sprout },
  pupuk:   { color: 'bg-blue-500',    text: 'text-blue-700',    bg: 'bg-blue-50',     Icon: Sprout },
  hama:    { color: 'bg-yellow-500',  text: 'text-yellow-700',  bg: 'bg-yellow-50',   Icon: Info },
  irigasi: { color: 'bg-cyan-500',    text: 'text-cyan-700',    bg: 'bg-cyan-50',     Icon: CheckCircle2 },
  panen:   { color: 'bg-amber-500',   text: 'text-amber-700',   bg: 'bg-amber-50',    Icon: Wheat },
}

const Kalender = () => {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1))
  const [selectedDay, setSelectedDay] = useState(null)
  const [events, setEvents] = useState([])

  useEffect(() => {
    let active = true
    const load = async () => {
      const res = await calendarService.getAll()
      if (active) setEvents(res.data || [])
    }
    load()
    return () => { active = false }
  }, [])

  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()

  const prevMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  const nextMonth = () => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))

  const getEventsForDay = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth()+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    return events.filter(e => e.date === dateStr)
  }

  const selectedEvents = selectedDay ? getEventsForDay(selectedDay) : []

  const upcomingEvents = events
    .filter(e => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 4)

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <CalendarDays size={20} strokeWidth={1.8} className="text-primary-600" /> Kalender Tanam
          </h2>
          <p className="text-sm text-gray-500">Jadwal diambil dari tabel `calendar_events`</p>
        </div>
        <button className="btn-primary flex items-center gap-2"><Plus size={16} /> Tambah Jadwal</button>
      </div>

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
                      return <div key={ei} className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : style.color}`} />
                    })}
                  </div>
                </button>
              )
            })}
          </div>

          {selectedDay && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="font-bold text-gray-800 mb-3 text-sm">
                {selectedDay} {BULAN[currentDate.getMonth()]} — {selectedEvents.length > 0 ? `${selectedEvents.length} kegiatan` : 'Tidak ada kegiatan'}
              </p>
              {selectedEvents.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">Tidak ada jadwal untuk hari ini</p>
              ) : (
                <div className="space-y-2">
                  {selectedEvents.map((ev, i) => {
                    const style = jenisStyle[ev.jenis] || jenisStyle.tanam
                    return (
                      <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${style.bg}`}>
                        {React.createElement(style.Icon, { size: 16, strokeWidth: 1.8, className: style.text })}
                        <div>
                          <p className={`font-semibold text-sm ${style.text}`}>{ev.label}</p>
                          <p className="text-xs text-gray-500">{ev.lahan}</p>
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
                const d = new Date(ev.date)
                return (
                  <div key={i} className={`flex gap-3 p-3 rounded-xl ${style.bg}`}>
                    <div className="text-center min-w-[36px]">
                      <p className="text-xs text-gray-500">{BULAN[d.getMonth()].slice(0,3)}</p>
                      <p className={`text-xl font-bold ${style.text}`}>{d.getDate()}</p>
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${style.text}`}>{ev.label}</p>
                      <p className="text-xs text-gray-500">{ev.lahan}</p>
                    </div>
                  </div>
                )
              })}
              {upcomingEvents.length === 0 && <p className="text-sm text-gray-400">Belum ada jadwal.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Kalender
