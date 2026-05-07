import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import authService from '../../services/authService'
import { User, Mail, MapPin, Lock, Loader2, AlertTriangle, ChevronRight } from 'lucide-react'
import heroImg from '../../assets/hero.png'
import logoImg from '../../assets/logo_tanibijak.png'

const FloatingInput = ({ label, icon: Icon, name, type = "text", value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false)
  const isFilled = value && value.toString().length > 0
  const hasFocus = isFocused || isFilled

  return (
    <div className="relative border-b-2 border-gray-200 after:content-[''] after:absolute after:bottom-[-2px] after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-0 focus-within:after:w-full after:bg-primary-600 after:transition-all after:duration-400 pb-1 pt-5 flex items-center group">

      <div className={`mr-3 transition-colors duration-300 ${hasFocus ? 'text-primary-600' : 'text-gray-400'}`}>
        <Icon size={18} />
      </div>

      <div className="relative w-full flex items-center">
        <label
          className={`absolute left-0 transition-all duration-300 pointer-events-none font-medium ${hasFocus
              ? '-top-6 text-xs text-primary-600'
              : 'top-1 text-sm text-gray-400'
            }`}
        >
          {label}
        </label>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required
          className="w-full bg-transparent border-none outline-none text-gray-700 font-medium py-1"
        />
      </div>
    </div>
  )
}

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', location: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) { setError('Password dan konfirmasi password tidak cocok.'); return }
    if (form.password.length < 6) { setError('Password minimal 6 karakter.'); return }
    setLoading(true)
    try {
      const res = await authService.register(form)
      login(res.user, res.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Registrasi gagal. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { name: 'name', type: 'text', Icon: User, label: 'Nama Lengkap' },
    { name: 'email', type: 'email', Icon: Mail, label: 'Email Address' },
    // { name: 'location',        type: 'text',     Icon: MapPin, label: 'Lokasi (Kab/Kota)' },
    { name: 'password', type: 'password', Icon: Lock, label: 'Password' },
    { name: 'confirmPassword', type: 'password', Icon: Lock, label: 'Konfirmasi Password' },
  ]

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-white z-[99999] flex flex-col justify-center items-center fade-in">
        <img src={logoImg} alt="Loading..." className="w-32 h-32 object-contain animate-bounce" />
        <div className="mt-4 flex items-center gap-2 text-primary-700 font-semibold">
          <Loader2 size={20} className="animate-spin" />
          Memuat...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-white font-sans text-gray-800 fade-in">

      {/* Left Column - Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 sm:p-12 z-10">
        <div className="w-full max-w-sm flex flex-col items-center fade-in" style={{ animationDelay: '0.3s' }}>

          <div className="flex flex-col items-center mb-6">
            <img src={logoImg} alt="TaniBijak Logo" className="w-24 h-24 object-contain mb-3" />
            <h1 className="text-3xl font-bold text-gray-800 tracking-wide uppercase">TaniBijak</h1>
            <p className="text-gray-500 mt-1 text-sm font-medium">Buat akun baru</p>
          </div>

          {error && (
            <div className="w-full bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-6 flex items-center gap-2">
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-3">
            {fields.map(({ name, type, Icon, label }) => (
              <FloatingInput
                key={name}
                label={label}
                name={name}
                type={type}
                icon={Icon}
                value={form[name]}
                onChange={handleChange}
              />
            ))}

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-700 hover:bg-primary-800 text-white rounded-full py-3 mt-2 text-base font-bold tracking-wider transition-all shadow-lg hover:shadow-primary-700/40 flex justify-center items-center gap-2 uppercase"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : "Register"}
              </button>
            </div>
          </form>

          <div className="mt-6 w-full text-center">
            <Link to="/login" className="text-sm text-gray-500 font-medium">
              Sudah punya akun? <span className="text-blue-600 hover:text-blue-700 transition-colors font-bold">Masuk</span>
            </Link>
          </div>

          {/* <div className="mt-8 p-3 w-full bg-primary-50 rounded-xl text-xs text-primary-700 text-center">
            <p className="font-semibold flex items-center justify-center gap-1">
              <ChevronRight size={14} /> Dengan mendaftar, Anda menyetujui syarat & ketentuan.
            </p>
          </div> */}
        </div>
      </div>

      {/* Right Column - Illustration & Shape */}
      <div className="relative hidden lg:flex lg:w-[55%] items-center justify-center bg-white z-0">
        {/* Abstract Green Wave (Mirrored) */}
        <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden">
          <svg viewBox="0 0 200 1000" preserveAspectRatio="none" className="w-full h-full text-primary-600 scale-x-[-1]">
            <path fill="currentColor" d="M0,0 L160,0 C100,250 250,500 160,750 C100,900 180,1000 200,1000 L0,1000 Z" />
          </svg>
        </div>

        {/* Illustration */}
        <img src={heroImg} alt="Illustration" className="relative z-10 w-[80%] max-w-[600px] object-contain drop-shadow-2xl fade-in pl-10" style={{ animationDelay: '0.2s' }} />
      </div>

    </div>
  )
}

export default Register
