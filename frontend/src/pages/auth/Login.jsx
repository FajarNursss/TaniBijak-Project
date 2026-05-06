import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import authService from '../../services/authService'
import { User, Lock, Loader2, AlertTriangle } from 'lucide-react'
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

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
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
    setLoading(true)
    try {
      const res = await authService.login(form)
      login(res.user, res.token)
      navigate(res.user.role === 'admin' ? '/admin/dashboard' : '/dashboard')
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa kembali email dan password Anda.')
    } finally {
      setLoading(false)
    }
  }

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

      {/* Left Column - Illustration & Shape */}
      <div className="relative hidden lg:flex lg:w-[55%] items-center justify-center bg-white z-0">
        {/* Abstract Green Wave */}
        <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden">
          <svg viewBox="0 0 200 1000" preserveAspectRatio="none" className="w-full h-full text-primary-600">
            <path fill="currentColor" d="M0,0 L160,0 C100,250 250,500 160,750 C100,900 180,1000 200,1000 L0,1000 Z" />
          </svg>
        </div>
        
        {/* Illustration */}
        <img src={heroImg} alt="Illustration" className="relative z-10 w-[80%] max-w-[600px] object-contain drop-shadow-2xl fade-in pr-10" style={{ animationDelay: '0.2s' }} />
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-sm flex flex-col items-center fade-in" style={{ animationDelay: '0.3s' }}>
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <img src={logoImg} alt="TaniBijak Logo" className="w-32 h-32 object-contain mb-4" />
            <h1 className="text-4xl font-bold text-gray-800 tracking-wide uppercase">TaniBijak</h1>
          </div>

          {error && (
            <div className="w-full bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-6 flex items-center gap-2">
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <FloatingInput
              label="Email Address"
              name="email"
              type="email"
              icon={User}
              value={form.email}
              onChange={handleChange}
            />

            <FloatingInput
              label="Password"
              name="password"
              type="password"
              icon={Lock}
              value={form.password}
              onChange={handleChange}
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-700 hover:bg-primary-800 text-white rounded-full py-4 mt-8 text-lg font-bold tracking-wider transition-all shadow-lg hover:shadow-primary-700/40 flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 size={24} className="animate-spin" /> : "LOGIN"}
            </button>
          </form>

          {/* Additional Links/Info */}
          <div className="w-full mt-8 text-center">
            <Link to="/register" className="text-sm text-gray-500 hover:text-primary-700 font-medium transition-colors">
              Belum punya akun? Register
            </Link>
          </div>

          {/* <div className="mt-8 p-4 w-full bg-amber-50 rounded-xl text-xs text-amber-800 border border-amber-100 text-center">
            <p className="font-bold mb-1">Demo Login:</p>
            <p>Admin: admin@tanibijak.id / admin123</p>
            <p>User: budi@tanibijak.id / user123</p>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default Login
