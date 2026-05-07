import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Leaf, Sun, CloudRain, Menu, X } from 'lucide-react'
import heroImg from '../assets/hero.png'
import logoImg from '../assets/logo_tanibijak.png'

const Landing = () => {
  const [showSplash, setShowSplash] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('beranda')

  useEffect(() => {
    // Enable smooth scrolling for the landing page
    document.documentElement.classList.add('scroll-smooth')

    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 1000)

    return () => {
      clearTimeout(timer)
      document.documentElement.classList.remove('scroll-smooth')
    }
  }, [])

  useEffect(() => {
    if (!showSplash) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      }, { threshold: 0.5 })

      const sections = ['beranda', 'tentang', 'kontak'].map(id => document.getElementById(id)).filter(Boolean)
      sections.forEach(section => observer.observe(section))

      return () => {
        sections.forEach(section => observer.unobserve(section))
      }
    }
  }, [showSplash])

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-white z-[99999] flex flex-col justify-center items-center fade-in">
        <img src={logoImg} alt="Loading..." className="w-32 h-32 object-contain animate-bounce" />
        <div className="mt-4 flex items-center gap-2 text-primary-700 font-semibold">
          <Leaf size={20} className="animate-spin" />
          Memuat TaniBijak...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-gray-800 fade-in overflow-hidden relative">
      {/* Navbar */}
      <nav className="w-full px-6 md:px-12 py-4 md:py-6 flex justify-between items-center relative z-50 bg-white/80 backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none">
        <div className="flex items-center gap-3">
          <img src={logoImg} alt="TaniBijak" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
          <span className="text-xl md:text-2xl font-bold text-dark-800 uppercase tracking-wide">TaniBijak</span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#beranda" onClick={() => setActiveSection('beranda')} className={`transition-colors text-base ${activeSection === 'beranda' ? 'text-primary-700 font-bold border-b-2 border-primary-700' : 'text-gray-600 font-semibold hover:text-primary-700'}`}>Beranda</a>
          <a href="#tentang" onClick={() => setActiveSection('tentang')} className={`transition-colors text-base ${activeSection === 'tentang' ? 'text-primary-700 font-bold border-b-2 border-primary-700' : 'text-gray-600 font-semibold hover:text-primary-700'}`}>Tentang</a>
          <a href="#kontak" onClick={() => setActiveSection('kontak')} className={`transition-colors text-base ${activeSection === 'kontak' ? 'text-primary-700 font-bold border-b-2 border-primary-700' : 'text-gray-600 font-semibold hover:text-primary-700'}`}>Kontak</a>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/login" className="text-gray-600 hover:text-primary-700 font-semibold transition-colors text-base">Masuk</Link>
          <Link to="/register" className="bg-primary-700 hover:bg-primary-800 text-white px-6 py-2.5 rounded-full font-bold shadow-lg hover:shadow-primary-700/40 transition-all text-base">Daftar</Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-800 hover:text-primary-700 transition-colors p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div className={`fixed inset-0 z-40 bg-white transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'} md:hidden flex flex-col px-6 pt-24 pb-8 shadow-2xl overflow-y-auto`}>
        <div className="flex flex-col gap-6 text-center mt-4">
          <a href="#beranda" onClick={() => { setIsMobileMenuOpen(false); setActiveSection('beranda'); }} className={`text-lg transition-colors border-b border-gray-100 pb-4 ${activeSection === 'beranda' ? 'text-primary-700 font-bold' : 'text-gray-800 font-semibold hover:text-primary-700'}`}>Beranda</a>
          <a href="#tentang" onClick={() => { setIsMobileMenuOpen(false); setActiveSection('tentang'); }} className={`text-lg transition-colors border-b border-gray-100 pb-4 ${activeSection === 'tentang' ? 'text-primary-700 font-bold' : 'text-gray-800 font-semibold hover:text-primary-700'}`}>Tentang</a>
          <a href="#kontak" onClick={() => { setIsMobileMenuOpen(false); setActiveSection('kontak'); }} className={`text-lg transition-colors border-b border-gray-100 pb-4 ${activeSection === 'kontak' ? 'text-primary-700 font-bold' : 'text-gray-800 font-semibold hover:text-primary-700'}`}>Kontak</a>
        </div>
        <div className="mt-8 flex flex-col gap-4">
          <Link to="/login" className="w-full text-center border-2 border-primary-700 text-primary-700 py-3 rounded-full font-bold text-lg hover:bg-primary-50 transition-colors">Masuk</Link>
          <Link to="/register" className="w-full text-center bg-primary-700 hover:bg-primary-800 text-white py-3 rounded-full font-bold shadow-lg transition-colors text-lg">Daftar</Link>
        </div>
      </div>

      {/* Hero Section */}
      <div id="beranda" className="flex-1 flex flex-col-reverse lg:flex-row items-center justify-between px-6 md:px-12 lg:px-24 relative pb-16 lg:pb-0 pt-10">

        {/* Background shapes mimicking the login page */}
        <div className="absolute top-0 right-0 w-full lg:w-[55%] h-full -z-10 overflow-hidden pointer-events-none hidden lg:block">
          <svg viewBox="0 0 200 1000" preserveAspectRatio="none" className="w-full h-full text-primary-600">
            <path fill="currentColor" d="M200,0 L40,0 C100,250 -50,500 40,750 C100,900 20,1000 0,1000 L200,1000 Z" />
          </svg>
        </div>

        {/* Text Content */}
        <div className="w-full lg:w-[45%] flex flex-col justify-center py-8 lg:py-12 z-10 fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="inline-block bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full text-xs md:text-sm font-bold mb-6 w-max border border-primary-100 flex items-center gap-2">
            <Leaf size={16} /> Solusi Pertanian Modern
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Bertani Lebih <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">Cerdas</span><br className="hidden sm:block" /> & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-800">Bijak</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-10 leading-relaxed max-w-lg">
            Platform komprehensif untuk memantau cuaca, mengatur jadwal tanam, dan mendapatkan rekomendasi AI untuk hasil panen yang lebih optimal.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link to="/register" className="bg-primary-700 hover:bg-primary-800 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-primary-700/40 transition-all flex items-center justify-center gap-2 text-base md:text-lg">
              Mulai Sekarang <ArrowRight size={20} />
            </Link>
            <Link to="/login" className="bg-white hover:bg-gray-50 text-primary-700 border-2 border-primary-100 px-8 py-4 rounded-full font-bold shadow-sm transition-all flex items-center justify-center text-base md:text-lg">
              Masuk Akun
            </Link>
          </div>

          {/* <div className="flex gap-6 sm:gap-8 items-center pt-8 border-t border-gray-100">
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-black text-gray-900">10k+</span>
              <span className="text-xs sm:text-sm text-gray-500 font-medium">Petani Aktif</span>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-black text-gray-900">98%</span>
              <span className="text-xs sm:text-sm text-gray-500 font-medium">Panen Sukses</span>
            </div>
          </div> */}
        </div>

        {/* Image/Illustration */}
        <div className="w-full lg:w-[50%] flex justify-center items-center relative z-10 fade-in mt-10 mb-12 lg:mb-0 lg:mt-0" style={{ animationDelay: '0.4s' }}>
          {/* Decorative glowing background */}
          <div className="absolute inset-0 bg-primary-400 blur-[80px] lg:blur-[100px] opacity-20 lg:opacity-30 rounded-full w-3/4 h-3/4 m-auto"></div>
          <img src={heroImg} alt="Smart Farming Illustration" className="w-[85%] max-w-[400px] lg:max-w-[650px] object-contain drop-shadow-2xl relative z-10 animate-float" />

          {/* Floating badges */}
          <div className="absolute top-[5%] lg:top-[20%] left-0 lg:-left-[10%] bg-white p-3 rounded-2xl shadow-xl flex items-center gap-3 animate-float z-20" style={{ animationDelay: '1s' }}>
            <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
              <CloudRain size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Prediksi</p>
              <p className="font-bold text-gray-800 text-sm">Cuaca Akurat</p>
            </div>
          </div>

          <div className="absolute bottom-[0%] lg:bottom-[15%] right-0 lg:-right-[5%] bg-white p-3 rounded-2xl shadow-xl flex items-center gap-3 animate-float z-20" style={{ animationDelay: '2s' }}>
            <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
              <Sun size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Jadwal</p>
              <p className="font-bold text-gray-800 text-sm">Tanam Optimal</p>
            </div>
          </div>

        </div>

      </div>

      {/* Tentang Section */}
      <div id="tentang" className="w-full bg-white px-6 md:px-12 lg:px-24 py-20 relative z-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">Tentang <span className="text-primary-700">TaniBijak</span></h2>
          <p className="text-lg text-gray-600 mb-12 leading-relaxed">
            TaniBijak adalah platform inovatif yang dirancang khusus untuk membantu petani modern di Indonesia.
            Kami menggabungkan kearifan lokal dengan teknologi kecerdasan buatan untuk memberikan rekomendasi pertanian terbaik.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-primary-50 p-6 rounded-2xl border border-primary-100 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-xl text-primary-800 mb-3">Visi</h3>
              <p className="text-gray-600">Mewujudkan ketahanan pangan nasional melalui digitalisasi dan modernisasi pertanian berkelanjutan.</p>
            </div>
            <div className="bg-primary-50 p-6 rounded-2xl border border-primary-100 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-xl text-primary-800 mb-3">Misi</h3>
              <p className="text-gray-600">Memberikan akses teknologi yang mudah digunakan dan meningkatkan kesejahteraan petani.</p>
            </div>
            <div className="bg-primary-50 p-6 rounded-2xl border border-primary-100 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-xl text-primary-800 mb-3">Nilai</h3>
              <p className="text-gray-600">Inovasi tiada henti, gotong royong antar petani, dan kepedulian terhadap lingkungan.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Kontak Section */}
      <div id="kontak" className="w-full bg-gray-50 px-6 md:px-12 lg:px-24 py-20 relative z-20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">Hubungi <span className="text-primary-700">Kami</span></h2>
          <p className="text-lg text-gray-600 mb-12 leading-relaxed">
            Ada pertanyaan atau masukan? Jangan ragu untuk menghubungi tim TaniBijak. Kami siap membantu Anda.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center">
              <div className="bg-primary-100 p-4 rounded-full text-primary-700 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">support@tanibijak.id</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center">
              <div className="bg-primary-100 p-4 rounded-full text-primary-700 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">Telepon</h3>
              <p className="text-gray-600">+62 8157 0014 71</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 flex flex-col items-center">
              <div className="bg-primary-100 p-4 rounded-full text-primary-700 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">Lokasi</h3>
              <p className="text-gray-600">Universitas Nurtanio<br />Jl. Pajajaran No.219, Bandung, Jawa Barat</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-100 py-8 px-6 md:px-12 lg:px-24 relative z-20 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-500 text-sm font-medium">
          &copy; {new Date().getFullYear()} TaniBijak. Siap Ga Siap Dikumpulkan.
        </p>
        <div className="flex items-center gap-3">
          <span className="text-gray-500 text-sm font-medium">Data Cuaca Didukung Oleh:</span>
          <img src="https://www.meteoalor.id/assets/images/logo.png" alt="BMKG Logo" className="h-8 md:h-10 object-contain" />
        </div>
      </footer>

      {/* Mobile background curve fallback */}
      <div className="lg:hidden absolute bottom-0 left-0 w-full h-[15%] bg-primary-600 -z-10" style={{ borderTopLeftRadius: '100px', borderTopRightRadius: '100px' }}></div>
    </div >
  )
}

export default Landing
