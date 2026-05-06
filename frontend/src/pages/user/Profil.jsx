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

const locationData = {
  "Aceh": [
    "Kota Banda Aceh",
    "Kota Sabang",
    "Kota Langsa",
    "Kota Lhokseumawe",
    "Kota Subulussalam",
    "Kabupaten Aceh Besar",
    "Kabupaten Pidie",
    "Kabupaten Bireuen",
    "Kabupaten Aceh Utara",
    "Kabupaten Aceh Timur",
    "Kabupaten Aceh Selatan",
    "Kabupaten Aceh Barat",
    "Kabupaten Aceh Tengah",
    "Kabupaten Aceh Tenggara",
    "Kabupaten Simeulue",
    "Kabupaten Aceh Singkil",
    "Kabupaten Aceh Jaya",
    "Kabupaten Bener Meriah",
    "Kabupaten Pidie Jaya",
    "Kabupaten Gayo Lues",
    "Kabupaten Nagan Raya",
    "Kabupaten Aceh Barat Daya",
    "Kabupaten Aceh Tamiang"
  ],
  "Sumatera Utara": [
    "Kota Medan",
    "Kota Binjai",
    "Kota Tebing Tinggi",
    "Kota Pematangsiantar",
    "Kota Tanjungbalai",
    "Kota Padangsidimpuan",
    "Kota Gunungsitoli",
    "Kabupaten Deli Serdang",
    "Kabupaten Langkat",
    "Kabupaten Asahan",
    "Kabupaten Simalungun",
    "Kabupaten Labuhanbatu",
    "Kabupaten Tapanuli Selatan",
    "Kabupaten Tapanuli Utara",
    "Kabupaten Karo",
    "Kabupaten Dairi",
    "Kabupaten Nias",
    "Kabupaten Mandailing Natal",
    "Kabupaten Pakpak Bharat",
    "Kabupaten Humbang Hasundutan",
    "Kabupaten Samosir",
    "Kabupaten Serdang Bedagai",
    "Kabupaten Batu Bara",
    "Kabupaten Padang Lawas Utara",
    "Kabupaten Padang Lawas",
    "Kabupaten Labuhanbatu Selatan",
    "Kabupaten Labuhanbatu Utara",
    "Kabupaten Nias Utara",
    "Kabupaten Nias Barat",
    "Kabupaten Nias Selatan",
    "Kabupaten Tapanuli Tengah",
    "Kabupaten Toba"
  ],
  "Sumatera Barat": [
    "Kota Padang",
    "Kota Bukittinggi",
    "Kota Payakumbuh",
    "Kota Solok",
    "Kota Sawahlunto",
    "Kota Pariaman",
    "Kota Padang Panjang",
    "Kabupaten Agam",
    "Kabupaten Limapuluh Kota",
    "Kabupaten Tanah Datar",
    "Kabupaten Pesisir Selatan",
    "Kabupaten Padang Pariaman",
    "Kabupaten Solok",
    "Kabupaten Sijunjung",
    "Kabupaten Dharmasraya",
    "Kabupaten Solok Selatan",
    "Kabupaten Pasaman",
    "Kabupaten Pasaman Barat",
    "Kabupaten Kepulauan Mentawai"
  ],
  "Riau": [
    "Kota Pekanbaru",
    "Kota Dumai",
    "Kabupaten Kampar",
    "Kabupaten Indragiri Hulu",
    "Kabupaten Indragiri Hilir",
    "Kabupaten Pelalawan",
    "Kabupaten Rokan Hulu",
    "Kabupaten Rokan Hilir",
    "Kabupaten Siak",
    "Kabupaten Bengkalis",
    "Kabupaten Kepulauan Meranti",
    "Kabupaten Kuantan Singingi"
  ],
  "Kepulauan Riau": [
    "Kota Batam",
    "Kota Tanjungpinang",
    "Kabupaten Bintan",
    "Kabupaten Karimun",
    "Kabupaten Lingga",
    "Kabupaten Natuna",
    "Kabupaten Anambas"
  ],
  "Jambi": [
    "Kota Jambi",
    "Kota Sungaipenuh",
    "Kabupaten Muaro Jambi",
    "Kabupaten Batanghari",
    "Kabupaten Bungo",
    "Kabupaten Tebo",
    "Kabupaten Merangin",
    "Kabupaten Sarolangun",
    "Kabupaten Kerinci",
    "Kabupaten Tanjung Jabung Barat",
    "Kabupaten Tanjung Jabung Timur"
  ],
  "Sumatera Selatan": [
    "Kota Palembang",
    "Kota Prabumulih",
    "Kota Pagar Alam",
    "Kota Lubuklinggau",
    "Kabupaten Musi Banyuasin",
    "Kabupaten Banyuasin",
    "Kabupaten Musi Rawas",
    "Kabupaten Muara Enim",
    "Kabupaten Lahat",
    "Kabupaten Ogan Komering Ulu",
    "Kabupaten Ogan Komering Ilir",
    "Kabupaten Ogan Ilir",
    "Kabupaten Ogan Komering Ulu Selatan",
    "Kabupaten Ogan Komering Ulu Timur",
    "Kabupaten Empat Lawang",
    "Kabupaten Penukal Abab Lematang Ilir",
    "Kabupaten Musi Rawas Utara"
  ],
  "Bangka Belitung": [
    "Kota Pangkal Pinang",
    "Kabupaten Bangka",
    "Kabupaten Bangka Tengah",
    "Kabupaten Bangka Barat",
    "Kabupaten Bangka Selatan",
    "Kabupaten Belitung",
    "Kabupaten Belitung Timur"
  ],
  "Bengkulu": [
    "Kota Bengkulu",
    "Kabupaten Bengkulu Utara",
    "Kabupaten Bengkulu Selatan",
    "Kabupaten Bengkulu Tengah",
    "Kabupaten Rejang Lebong",
    "Kabupaten Lebong",
    "Kabupaten Kepahiang",
    "Kabupaten Kaur",
    "Kabupaten Seluma",
    "Kabupaten Mukomuko"
  ],
  "Lampung": [
    "Kota Bandar Lampung",
    "Kota Metro",
    "Kabupaten Lampung Selatan",
    "Kabupaten Lampung Utara",
    "Kabupaten Lampung Tengah",
    "Kabupaten Lampung Timur",
    "Kabupaten Lampung Barat",
    "Kabupaten Pesawaran",
    "Kabupaten Pringsewu",
    "Kabupaten Tanggamus",
    "Kabupaten Mesuji",
    "Kabupaten Tulang Bawang",
    "Kabupaten Tulang Bawang Barat",
    "Kabupaten Way Kanan",
    "Kabupaten Pesisir Barat"
  ],
  "DKI Jakarta": [
    "Kota Jakarta Pusat",
    "Kota Jakarta Utara",
    "Kota Jakarta Barat",
    "Kota Jakarta Selatan",
    "Kota Jakarta Timur",
    "Kabupaten Kepulauan Seribu"
  ],
  "Banten": [
    "Kota Tangerang",
    "Kota Tangerang Selatan",
    "Kota Serang",
    "Kota Cilegon",
    "Kabupaten Tangerang",
    "Kabupaten Serang",
    "Kabupaten Pandeglang",
    "Kabupaten Lebak"
  ],
  "Jawa Barat": [
    "Kota Bandung",
    "Kota Bekasi",
    "Kota Depok",
    "Kota Bogor",
    "Kota Cimahi",
    "Kota Sukabumi",
    "Kota Cirebon",
    "Kota Tasikmalaya",
    "Kota Banjar",
    "Kabupaten Bandung",
    "Kabupaten Bandung Barat",
    "Kabupaten Bekasi",
    "Kabupaten Bogor",
    "Kabupaten Ciamis",
    "Kabupaten Cianjur",
    "Kabupaten Cirebon",
    "Kabupaten Garut",
    "Kabupaten Indramayu",
    "Kabupaten Karawang",
    "Kabupaten Kuningan",
    "Kabupaten Majalengka",
    "Kabupaten Pangandaran",
    "Kabupaten Purwakarta",
    "Kabupaten Subang",
    "Kabupaten Sukabumi",
    "Kabupaten Sumedang",
    "Kabupaten Tasikmalaya"
  ],
  "Jawa Tengah": [
    "Kota Semarang",
    "Kota Surakarta",
    "Kota Salatiga",
    "Kota Magelang",
    "Kota Pekalongan",
    "Kota Tegal",
    "Kabupaten Semarang",
    "Kabupaten Karanganyar",
    "Kabupaten Boyolali",
    "Kabupaten Klaten",
    "Kabupaten Sukoharjo",
    "Kabupaten Wonogiri",
    "Kabupaten Sragen",
    "Kabupaten Blora",
    "Kabupaten Rembang",
    "Kabupaten Pati",
    "Kabupaten Kudus",
    "Kabupaten Jepara",
    "Kabupaten Demak",
    "Kabupaten Kendal",
    "Kabupaten Batang",
    "Kabupaten Pekalongan",
    "Kabupaten Pemalang",
    "Kabupaten Tegal",
    "Kabupaten Brebes",
    "Kabupaten Magelang",
    "Kabupaten Purworejo",
    "Kabupaten Kebumen",
    "Kabupaten Banyumas",
    "Kabupaten Cilacap",
    "Kabupaten Purbalingga",
    "Kabupaten Banjarnegara",
    "Kabupaten Wonosobo",
    "Kabupaten Temanggung",
    "Kabupaten Grobogan"
  ],
  "DI Yogyakarta": [
    "Kota Yogyakarta",
    "Kabupaten Sleman",
    "Kabupaten Bantul",
    "Kabupaten Gunung Kidul",
    "Kabupaten Kulon Progo"
  ],
  "Jawa Timur": [
    "Kota Surabaya",
    "Kota Malang",
    "Kota Pasuruan",
    "Kota Batu",
    "Kota Blitar",
    "Kota Kediri",
    "Kota Madiun",
    "Kota Mojokerto",
    "Kota Probolinggo",
    "Kabupaten Banyuwangi",
    "Kabupaten Situbondo",
    "Kabupaten Bondowoso",
    "Kabupaten Jember",
    "Kabupaten Lumajang",
    "Kabupaten Malang",
    "Kabupaten Pasuruan",
    "Kabupaten Probolinggo",
    "Kabupaten Sidoarjo",
    "Kabupaten Mojokerto",
    "Kabupaten Jombang",
    "Kabupaten Kediri",
    "Kabupaten Nganjuk",
    "Kabupaten Madiun",
    "Kabupaten Magetan",
    "Kabupaten Ngawi",
    "Kabupaten Ponorogo",
    "Kabupaten Trenggalek",
    "Kabupaten Tulungagung",
    "Kabupaten Blitar",
    "Kabupaten Pacitan",
    "Kabupaten Gresik",
    "Kabupaten Lamongan",
    "Kabupaten Tuban",
    "Kabupaten Bojonegoro",
    "Kabupaten Sampang",
    "Kabupaten Pamekasan",
    "Kabupaten Sumenep",
    "Kabupaten Bangkalan"
  ],
  "Bali": [
    "Kota Denpasar",
    "Kabupaten Badung",
    "Kabupaten Gianyar",
    "Kabupaten Tabanan",
    "Kabupaten Buleleng",
    "Kabupaten Klungkung",
    "Kabupaten Karangasem",
    "Kabupaten Bangli",
    "Kabupaten Jembrana"
  ],
  "Nusa Tenggara Barat": [
    "Kota Mataram",
    "Kota Bima",
    "Kabupaten Lombok Barat",
    "Kabupaten Lombok Tengah",
    "Kabupaten Lombok Timur",
    "Kabupaten Lombok Utara",
    "Kabupaten Sumbawa",
    "Kabupaten Sumbawa Barat",
    "Kabupaten Dompu",
    "Kabupaten Bima"
  ],
  "Nusa Tenggara Timur": [
    "Kota Kupang",
    "Kabupaten Kupang",
    "Kabupaten Timor Tengah Selatan",
    "Kabupaten Timor Tengah Utara",
    "Kabupaten Belu",
    "Kabupaten Alor",
    "Kabupaten Flores Timur",
    "Kabupaten Sikka",
    "Kabupaten Ende",
    "Kabupaten Ngada",
    "Kabupaten Manggarai",
    "Kabupaten Manggarai Barat",
    "Kabupaten Manggarai Timur",
    "Kabupaten Sumba Barat",
    "Kabupaten Sumba Timur",
    "Kabupaten Sumba Tengah",
    "Kabupaten Sumba Barat Daya",
    "Kabupaten Rote Ndao",
    "Kabupaten Sabu Raijua",
    "Kabupaten Nagekeo",
    "Kabupaten Malaka"
  ],
  "Kalimantan Barat": [
    "Kota Pontianak",
    "Kota Singkawang",
    "Kabupaten Kubu Raya",
    "Kabupaten Mempawah",
    "Kabupaten Sambas",
    "Kabupaten Bengkayang",
    "Kabupaten Landak",
    "Kabupaten Sanggau",
    "Kabupaten Sekadau",
    "Kabupaten Melawi",
    "Kabupaten Kapuas Hulu",
    "Kabupaten Sintang",
    "Kabupaten Ketapang",
    "Kabupaten Kayong Utara"
  ],
  "Kalimantan Tengah": [
    "Kota Palangkaraya",
    "Kabupaten Kotawaringin Barat",
    "Kabupaten Kotawaringin Timur",
    "Kabupaten Kapuas",
    "Kabupaten Barito Selatan",
    "Kabupaten Barito Utara",
    "Kabupaten Barito Timur",
    "Kabupaten Murung Raya",
    "Kabupaten Pulang Pisau",
    "Kabupaten Gunung Mas",
    "Kabupaten Katingan",
    "Kabupaten Lamandau",
    "Kabupaten Sukamara",
    "Kabupaten Seruyan"
  ],
  "Kalimantan Selatan": [
    "Kota Banjarmasin",
    "Kota Banjarbaru",
    "Kabupaten Banjar",
    "Kabupaten Barito Kuala",
    "Kabupaten Tapin",
    "Kabupaten Hulu Sungai Selatan",
    "Kabupaten Hulu Sungai Tengah",
    "Kabupaten Hulu Sungai Utara",
    "Kabupaten Balangan",
    "Kabupaten Tabalong",
    "Kabupaten Tanah Laut",
    "Kabupaten Tanah Bumbu",
    "Kabupaten Kotabaru"
  ],
  "Kalimantan Timur": [
    "Kota Samarinda",
    "Kota Balikpapan",
    "Kota Bontang",
    "Kabupaten Kutai Kartanegara",
    "Kabupaten Kutai Barat",
    "Kabupaten Kutai Timur",
    "Kabupaten Berau",
    "Kabupaten Paser",
    "Kabupaten Penajam Paser Utara",
    "Kabupaten Mahakam Ulu"
  ],
  "Kalimantan Utara": [
    "Kota Tarakan",
    "Kabupaten Bulungan",
    "Kabupaten Malinau",
    "Kabupaten Nunukan",
    "Kabupaten Tana Tidung"
  ],
  "Sulawesi Utara": [
    "Kota Manado",
    "Kota Bitung",
    "Kota Tomohon",
    "Kota Kotamobagu",
    "Kabupaten Minahasa",
    "Kabupaten Minahasa Selatan",
    "Kabupaten Minahasa Tenggara",
    "Kabupaten Minahasa Utara",
    "Kabupaten Bolaang Mongondow",
    "Kabupaten Bolaang Mongondow Selatan",
    "Kabupaten Bolaang Mongondow Timur",
    "Kabupaten Bolaang Mongondow Utara",
    "Kabupaten Kepulauan Sangihe",
    "Kabupaten Kepulauan Siau Tagulandang Biaro",
    "Kabupaten Kepulauan Talaud"
  ],
  "Gorontalo": [
    "Kota Gorontalo",
    "Kabupaten Gorontalo",
    "Kabupaten Gorontalo Utara",
    "Kabupaten Bone Bolango",
    "Kabupaten Boalemo",
    "Kabupaten Pohuwato"
  ],
  "Sulawesi Tengah": [
    "Kota Palu",
    "Kabupaten Donggala",
    "Kabupaten Parigi Moutong",
    "Kabupaten Sigi",
    "Kabupaten Poso",
    "Kabupaten Tojo Una-Una",
    "Kabupaten Morowali",
    "Kabupaten Morowali Utara",
    "Kabupaten Banggai",
    "Kabupaten Banggai Kepulauan",
    "Kabupaten Banggai Laut",
    "Kabupaten Buol",
    "Kabupaten Toli-Toli"
  ],
  "Sulawesi Barat": [
    "Kota Mamuju",
    "Kabupaten Mamuju Tengah",
    "Kabupaten Mamuju Utara",
    "Kabupaten Majene",
    "Kabupaten Polewali Mandar",
    "Kabupaten Mamasa"
  ],
  "Sulawesi Selatan": [
    "Kota Makassar",
    "Kota Palopo",
    "Kota Parepare",
    "Kabupaten Gowa",
    "Kabupaten Takalar",
    "Kabupaten Jeneponto",
    "Kabupaten Bantaeng",
    "Kabupaten Bulukumba",
    "Kabupaten Selayar",
    "Kabupaten Sinjai",
    "Kabupaten Bone",
    "Kabupaten Soppeng",
    "Kabupaten Wajo",
    "Kabupaten Sidrap",
    "Kabupaten Pinrang",
    "Kabupaten Enrekang",
    "Kabupaten Tana Toraja",
    "Kabupaten Toraja Utara",
    "Kabupaten Luwu",
    "Kabupaten Luwu Utara",
    "Kabupaten Luwu Timur",
    "Kabupaten Maros",
    "Kabupaten Pangkajene Kepulauan",
    "Kabupaten Barru"
  ],
  "Sulawesi Tenggara": [
    "Kota Kendari",
    "Kota Baubau",
    "Kabupaten Konawe",
    "Kabupaten Konawe Selatan",
    "Kabupaten Konawe Utara",
    "Kabupaten Konawe Kepulauan",
    "Kabupaten Kolaka",
    "Kabupaten Kolaka Utara",
    "Kabupaten Kolaka Timur",
    "Kabupaten Bombana",
    "Kabupaten Buton",
    "Kabupaten Buton Utara",
    "Kabupaten Buton Tengah",
    "Kabupaten Buton Selatan",
    "Kabupaten Muna",
    "Kabupaten Muna Barat",
    "Kabupaten Wakatobi"
  ],
  "Maluku": [
    "Kota Ambon",
    "Kota Tual",
    "Kabupaten Maluku Tengah",
    "Kabupaten Maluku Tenggara",
    "Kabupaten Maluku Barat Daya",
    "Kabupaten Kepulauan Aru",
    "Kabupaten Seram Bagian Barat",
    "Kabupaten Seram Bagian Timur",
    "Kabupaten Buru",
    "Kabupaten Buru Selatan",
    "Kabupaten Kepulauan Tanimbar"
  ],
  "Maluku Utara": [
    "Kota Ternate",
    "Kota Tidore Kepulauan",
    "Kabupaten Halmahera Barat",
    "Kabupaten Halmahera Tengah",
    "Kabupaten Halmahera Utara",
    "Kabupaten Halmahera Selatan",
    "Kabupaten Halmahera Timur",
    "Kabupaten Kepulauan Sula",
    "Kabupaten Pulau Taliabu",
    "Kabupaten Pulau Morotai"
  ],
  "Papua Barat": [
    "Kota Manokwari",
    "Kabupaten Manokwari Selatan",
    "Kabupaten Pegunungan Arfak",
    "Kabupaten Fakfak",
    "Kabupaten Kaimana",
    "Kabupaten Teluk Bintuni",
    "Kabupaten Teluk Wondama",
    "Kabupaten Sorong",
    "Kabupaten Sorong Selatan",
    "Kabupaten Raja Ampat",
    "Kabupaten Tambrauw",
    "Kabupaten Maybrat"
  ],
  "Papua Barat Daya": [
    "Kota Sorong",
    "Kabupaten Sorong",
    "Kabupaten Sorong Selatan",
    "Kabupaten Raja Ampat",
    "Kabupaten Tambrauw",
    "Kabupaten Maybrat"
  ],
  "Papua": [
    "Kota Jayapura",
    "Kabupaten Jayapura",
    "Kabupaten Keerom",
    "Kabupaten Sarmi",
    "Kabupaten Biak Numfor",
    "Kabupaten Kepulauan Yapen",
    "Kabupaten Waropen",
    "Kabupaten Supiori",
    "Kabupaten Mamberamo Raya",
    "Kabupaten Mamberamo Tengah",
    "Kabupaten Yalimo",
    "Kabupaten Jayawijaya",
    "Kabupaten Tolikara",
    "Kabupaten Pegunungan Bintang",
    "Kabupaten Yahukimo",
    "Kabupaten Lanny Jaya",
    "Kabupaten Nduga",
    "Kabupaten Puncak Jaya",
    "Kabupaten Puncak",
    "Kabupaten Paniai",
    "Kabupaten Intan Jaya",
    "Kabupaten Dogiyai",
    "Kabupaten Deiyai",
    "Kabupaten Nabire",
    "Kabupaten Mappi",
    "Kabupaten Asmat",
    "Kabupaten Boven Digoel",
    "Kabupaten Merauke",
    "Kabupaten Mimika"
  ],
  "Papua Tengah": [
    "Kota Nabire",
    "Kabupaten Paniai",
    "Kabupaten Puncak Jaya",
    "Kabupaten Puncak",
    "Kabupaten Dogiyai",
    "Kabupaten Intan Jaya",
    "Kabupaten Deiyai",
    "Kabupaten Mimika"
  ],
  "Papua Pegunungan": [
    "Kota Wamena",
    "Kabupaten Jayawijaya",
    "Kabupaten Pegunungan Bintang",
    "Kabupaten Tolikara",
    "Kabupaten Yahukimo",
    "Kabupaten Lanny Jaya",
    "Kabupaten Mamberamo Tengah",
    "Kabupaten Yalimo",
    "Kabupaten Nduga"
  ],
  "Papua Selatan": [
    "Kota Merauke",
    "Kabupaten Merauke",
    "Kabupaten Boven Digoel",
    "Kabupaten Mappi",
    "Kabupaten Asmat"
  ]
};

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
    location: user?.location || '',
    provinsi: '',
    kota: ''
  })
  const [pw, setPw] = useState({ current_password: '', password: '', password_confirmation: '' })

  const isLocationIncomplete = !user?.location || !user.location.includes(', ')

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
        
        let initProv = ''
        let initKota = ''
        if (p.location && p.location.includes(', ')) {
          const parts = p.location.split(', ')
          initKota = parts[0]
          initProv = parts[1]
        }
        
        setForm(f => ({ ...f, name: p.name, email: p.email, location: p.location || '', provinsi: initProv, kota: initKota }))
      }
      if (dashRes.status === 'fulfilled') setDashboard(dashRes.value.data || null)
    }
    load()
    return () => { active = false }
  }, [])

  const handleSave = async () => {
    const loc = (form.provinsi && form.kota) ? `${form.kota}, ${form.provinsi}` : form.location;
    const res = await authService.updateProfile({
      name: form.name,
      email: form.email,
      location: loc,
    })
    login(res.user, localStorage.getItem('tanibijak_token'))
    setForm(f => ({ ...f, location: loc }))
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
              <span className="text-primary-200 text-xs flex items-center gap-1"><MapPin size={12} /> {form.location || 'Lokasi Belum Diatur'}</span>
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

      {isLocationIncomplete && !editMode && activeTab === 'profil' && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl text-sm flex items-start gap-3">
          <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" /> 
          <div>
            <strong className="block mb-0.5">Perhatian: Lengkapi Lokasi Anda</strong>
            <p>Sistem membutuhkan data Provinsi dan Kota/Kabupaten yang valid untuk memberikan layanan cuaca dan peringatan dini yang akurat. Silakan klik <b>Edit Profil</b> untuk mengatur lokasi Anda.</p>
          </div>
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
            
            {/* Lokasi Dropdowns */}
            <div>
              <label className="label flex items-center gap-1.5">
                <MapPin size={13} className="text-gray-400" /> Provinsi
              </label>
              {editMode ? (
                <select 
                  value={form.provinsi}
                  onChange={(e) => setForm({ ...form, provinsi: e.target.value, kota: '' })}
                  className="input-field cursor-pointer bg-white"
                >
                  <option value="">— Pilih Provinsi —</option>
                  {Object.keys(locationData).sort().map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              ) : (
                <p className="py-3 px-4 bg-gray-50 rounded-lg text-gray-800 font-medium">{form.provinsi || '—'}</p>
              )}
            </div>

            <div>
              <label className="label flex items-center gap-1.5">
                <MapPin size={13} className="text-gray-400" /> Kota / Kabupaten
              </label>
              {editMode ? (
                <select 
                  value={form.kota}
                  onChange={(e) => setForm({ ...form, kota: e.target.value })}
                  className="input-field cursor-pointer bg-white"
                  disabled={!form.provinsi}
                >
                  <option value="">{form.provinsi ? '— Pilih Kota / Kabupaten —' : '— Pilih Provinsi dulu —'}</option>
                  {form.provinsi && locationData[form.provinsi]?.map(k => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              ) : (
                <p className="py-3 px-4 bg-gray-50 rounded-lg text-gray-800 font-medium">{form.kota || '—'}</p>
              )}
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
