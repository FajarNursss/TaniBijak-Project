# Script Video Demo TANIBIJAK

Durasi ideal: 4-6 menit. Gunakan script ini sebagai narasi utama saat rekam layar aplikasi.

## Alur Demo Singkat

1. Buka aplikasi di `http://localhost:5173`.
2. Tampilkan halaman awal/login.
3. Login sebagai user:
   - Email: `budi@tanibijak.id`
   - Password: `user123`
4. Tampilkan Dashboard.
5. Tampilkan Lahan Saya.
6. Tampilkan Rekomendasi Tanam.
7. Tampilkan Cuaca.
8. Tampilkan Kalender Tanam.
9. Tampilkan Riwayat Tanam.
10. Tampilkan Kearifan Lokal dan Chatbot.
11. Jika waktu cukup, login admin:
   - Email: `admin@tanibijak.id`
   - Password: `admin123`

## Naskah Narasi

### 1. Opening

"Halo, kami memperkenalkan TANIBIJAK, sebuah sistem pendukung keputusan pertanian yang membantu petani menentukan waktu tanam, memilih tanaman yang sesuai, dan mengelola lahan berdasarkan data cuaca, machine learning, serta kearifan lokal."

### 2. Latar Belakang Masalah

"Perubahan iklim membuat pola curah hujan semakin sulit diprediksi. Awal musim hujan dapat bergeser hingga 30 sampai 60 hari dari pola historis. Kondisi ini berdampak langsung pada petani kecil yang masih bergantung pada kalender musim tradisional."

"Akibatnya, waktu tanam sering tidak tepat, risiko gagal panen meningkat, dan ketahanan pangan ikut terancam. Di sisi lain, kearifan lokal petani seperti tanda alam, pola angin, dan waktu tanam adat mulai terpinggirkan karena belum terdigitalisasi."

"Jadi, masalah utama yang ingin diselesaikan TANIBIJAK adalah bagaimana membantu petani beradaptasi dengan perubahan iklim tanpa meninggalkan pengetahuan lokal yang sudah terbukti di komunitas mereka."

### 3. Solusi yang Ditawarkan

"TANIBIJAK menawarkan pendekatan hybrid, yaitu menggabungkan kecerdasan buatan modern dengan kearifan lokal. Sistem ini tidak menggantikan pengalaman petani, tetapi memperkuatnya dengan data."

"Lapisan pertama adalah machine learning dan data cuaca untuk menghasilkan rekomendasi tanaman, informasi cuaca, dan dukungan keputusan berbasis kondisi aktual. Lapisan kedua adalah kearifan lokal yang disimpan dan ditampilkan sebagai konteks pertanian wilayah, sehingga keputusan tidak hanya ilmiah, tetapi juga relevan secara budaya dan ekologis."

"Nilai inovasinya adalah pendekatan co-intelligence: AI bekerja bersama pengetahuan petani."

### 4. Demo MVP

Tampilkan login lalu masuk ke dashboard.

"Ini adalah MVP TANIBIJAK dalam bentuk aplikasi web. Setelah login, pengguna masuk ke dashboard yang menampilkan ringkasan kondisi pertanian dan akses cepat ke fitur utama."

Tampilkan menu `Lahan Saya`.

"Di menu Lahan Saya, petani dapat mencatat data lahan seperti nama lahan, lokasi, luas, jenis tanah, tanaman, kondisi, dan catatan. Data ini menjadi dasar pengelolaan pertanian yang lebih rapi."

Tampilkan menu `Rekomendasi Tanam`.

"Di menu Rekomendasi Tanam, sistem menampilkan rekomendasi komoditas yang sesuai dengan kondisi lingkungan. Setiap rekomendasi memiliki skor, alasan, kebutuhan suhu, curah hujan, jenis tanah, dan tips budidaya."

Tampilkan menu `Cuaca`.

"Di menu Cuaca, pengguna dapat melihat kondisi cuaca dan prakiraan beberapa hari ke depan. Informasi ini penting untuk mengantisipasi hujan, kekeringan, atau perubahan kondisi sebelum melakukan tanam, pemupukan, dan panen."

Tampilkan menu `Kalender Tanam`.

"Di Kalender Tanam, pengguna dapat membuat jadwal kegiatan seperti tanam, pemupukan, irigasi, pengendalian hama, dan panen. Ini membantu petani menjalankan aktivitas lahan secara lebih teratur."

Tampilkan menu `Riwayat Tanam`.

"Di Riwayat Tanam, pengguna dapat mencatat musim tanam, hasil panen, status, dan catatan. Data historis ini berguna untuk mengevaluasi produktivitas dan menjadi dasar pengembangan rekomendasi yang lebih personal."

Tampilkan menu `Kearifan Lokal`.

"Di menu Kearifan Lokal, pengetahuan lokal pertanian disimpan secara digital, seperti pola tanam tradisional, sistem irigasi, konservasi, dan praktik lokal yang relevan dengan wilayah Indonesia."

Tampilkan Chatbot.

"TANIBIJAK juga memiliki chatbot pertanian untuk membantu pengguna bertanya tentang rekomendasi tanaman, pemupukan, hama, cuaca tanam, dan data lahan."

Jika tampilkan admin:

"Di sisi admin, sistem menyediakan pengelolaan data pengguna, lahan, kearifan lokal, notifikasi, dan monitoring aktivitas. Ini membuat TANIBIJAK layak digunakan tidak hanya oleh petani, tetapi juga penyuluh, koperasi tani, dan pemerintah daerah."

### 5. Teknologi yang Digunakan

"TANIBIJAK dibangun dengan React dan Vite untuk frontend, Laravel 10 sebagai backend REST API, MySQL sebagai database, Laravel Sanctum untuk autentikasi, serta Python Flask untuk service machine learning dan integrasi cuaca."

"Sistem juga menggunakan dataset tanaman, data lokasi, model prediksi, dan data cuaca sebagai dasar rekomendasi."

### 6. Dampak dan Kelayakan

"Target utama TANIBIJAK adalah petani kecil, penyuluh pertanian, koperasi tani, dan pemerintah daerah. Sistem ini dirancang ringan, berbasis web, dan tidak membutuhkan perangkat IoT mahal, sehingga lebih mudah diterapkan di lapangan."

"Dampak yang diharapkan adalah membantu petani mengurangi risiko salah waktu tanam, meningkatkan produktivitas, memperkuat ketahanan pangan, dan melestarikan kearifan lokal sebagai pengetahuan ekologis yang berharga."

"Ke depan, TANIBIJAK dapat dikembangkan menjadi aplikasi mobile, ditambah notifikasi WhatsApp, integrasi sensor tanah, bahasa daerah, serta model AI yang lebih personal berdasarkan histori lahan."

### 7. Closing

"Kesimpulannya, TANIBIJAK adalah sistem pendukung keputusan pertanian yang menjembatani AI modern dan kearifan lokal untuk membantu petani menghadapi ketidakpastian iklim. Dengan TANIBIJAK, keputusan tanam menjadi lebih terukur, kontekstual, dan berkelanjutan."

"Terima kasih."

## Checklist Sebelum Rekam

- Backend menyala: `http://127.0.0.1:8000`
- Frontend menyala: `http://localhost:5173`
- ML service menyala: `http://127.0.0.1:5000`
- Database sudah di-seed
- Login user dan admin berhasil
- Jangan tampilkan file `.env` saat rekaman
