# TANIBIJAK-PROJECT

TaniBijak adalah aplikasi web pertanian untuk membantu pengguna mengelola lahan, memantau cuaca, melihat rekomendasi tanam, membuat kalender tanam, menyimpan riwayat tanam, membaca kearifan lokal, dan mengelola data melalui dashboard admin.

Project ini terdiri dari 3 bagian utama:

- `backend` - REST API Laravel 10, autentikasi Sanctum, database MySQL.
- `frontend` - React + Vite + Tailwind CSS.
- `machine_learning/ml-service` - service Python Flask untuk prediksi rekomendasi tanaman dan cuaca BMKG.

## Prasyarat Wajib

Pastikan perangkat sudah memiliki komponen berikut. Laragon/XAMPP boleh dipakai untuk menyediakan beberapa komponen ini, tetapi yang wajib adalah komponennya.

- PHP 8.1 atau lebih baru
- Composer
- Node.js 18 atau lebih baru
- npm
- Python 3.10 atau lebih baru
- MySQL atau MariaDB
- Git

## Tools Opsional

- Laragon atau XAMPP: opsional. Dipakai hanya sebagai cara mudah menjalankan PHP/MySQL lokal. Jika sudah punya PHP, Composer, dan MySQL tanpa Laragon/XAMPP, project tetap bisa berjalan.
- Ngrok: opsional. Dipakai hanya jika backend/frontend perlu diakses dari device lain atau internet saat demo. Untuk menjalankan project lokal di laptop sendiri, Ngrok tidak wajib.

## Port Default

Gunakan port berikut agar konfigurasi bawaan berjalan lancar:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000/api`
- ML Service: `http://127.0.0.1:5000`
- Database MySQL: `127.0.0.1:3306`

## 1. Clone Project

```bash
git clone <url-repository>
cd TaniBijak-Project
```

## 2. Setup Database

Buat database MySQL baru:

```sql
CREATE DATABASE tanibijak;
```

Nama database boleh diganti, tetapi harus disesuaikan juga di file `backend/.env`.

## 3. Setup Backend Laravel

Masuk ke folder backend:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Jika memakai Windows PowerShell dan `cp` tidak tersedia:

```powershell
Copy-Item .env.example .env
```

Edit file `backend/.env` sesuai konfigurasi lokal:

```env
APP_NAME=TaniBijak
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=tanibijak
DB_USERNAME=root
DB_PASSWORD=

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
ML_SERVICE_URL=http://127.0.0.1:5000
ML_SERVICE_TIMEOUT=30
ML_RECOMMENDATION_CACHE_HOURS=6
```

Jalankan migrasi dan seeder:

```bash
php artisan migrate --seed
```

Jalankan backend:

```bash
php artisan serve --host=127.0.0.1 --port=8000
```

Backend berjalan di:

```text
http://127.0.0.1:8000
```

Health check:

```text
http://127.0.0.1:8000/api/health
```

## 4. Setup Frontend React

Buka terminal baru dari root project, lalu masuk ke folder frontend:

```bash
cd frontend
npm install
```

Buat file `.env` di folder `frontend`:

```env
VITE_API_URL=http://localhost:8000/api
```

Jalankan frontend:

```bash
npm run dev
```

Frontend berjalan di:

```text
http://localhost:5173
```

## 5. Setup Machine Learning Service

Service ML dipakai untuk rekomendasi tanaman dan cuaca BMKG. Untuk fitur penuh, jalankan service ini bersama backend dan frontend.

Buka terminal baru dari root project:

```bash
cd machine_learning
python -m venv .venv
```

Aktifkan virtual environment.

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Windows CMD:

```cmd
.\.venv\Scripts\activate.bat
```

macOS/Linux:

```bash
source .venv/bin/activate
```

Install dependency Python:

```bash
pip install -r requirements.txt
```

Masuk ke folder service:

```bash
cd ml-service
```

Buat file `.env` jika diperlukan:

```env
GROQ_API_KEY=
```

Catatan: key AI bersifat opsional untuk beberapa fitur penjelasan AI. Jangan commit API key pribadi ke GitHub.

Jalankan ML service:

```bash
python api/app.py
```

ML service berjalan di:

```text
http://127.0.0.1:5000
```

Health check:

```text
http://127.0.0.1:5000/health
```

## 6. Akun Demo dari Seeder

Setelah menjalankan `php artisan migrate --seed`, akun demo tersedia:

Admin:

```text
Email: admin@tanibijak.id
Password: admin123
```

User:

```text
Email: budi@tanibijak.id
Password: user123
```

## 7. Cara Menjalankan Semua Service

Buka 3 terminal terpisah.

Terminal 1 - Backend:

```bash
cd backend
php artisan serve --host=127.0.0.1 --port=8000
```

Terminal 2 - Frontend:

```bash
cd frontend
npm run dev
```

Terminal 3 - ML Service:

```bash
cd machine_learning
python -m venv .venv
```

Aktifkan virtual environment, lalu:

```bash
pip install -r requirements.txt
cd ml-service
python api/app.py
```

Buka aplikasi:

```text
http://localhost:5173
```

## 8. Build Production Frontend

Untuk memastikan frontend bisa dibuild:

```bash
cd frontend
npm run build
```

Hasil build berada di:

```text
frontend/dist
```

## 9. Test Backend

Jika ingin menjalankan test Laravel:

```bash
cd backend
php artisan test
```

## 10. Struktur Folder

```text
TaniBijak-Project/
|-- backend/
|   |-- app/
|   |-- config/
|   |-- database/
|   |-- routes/
|   `-- ...
|-- frontend/
|   |-- public/
|   |-- src/
|   |-- package.json
|   `-- ...
|-- machine_learning/
|   |-- requirements.txt
|   `-- ml-service/
|       |-- api/
|       |-- data/
|       |-- model/
|       `-- src/
`-- README.md
```

## 11. Fitur Utama

- Login dan register pengguna
- Dashboard user
- Dashboard admin
- Manajemen lahan
- Rekomendasi tanam berbasis data dan ML service
- Cuaca dan prakiraan BMKG melalui ML service
- Kalender tanam
- Riwayat tanam
- Kearifan lokal
- Notifikasi
- Chatbot pertanian
- Monitoring aktivitas admin

## 12. Troubleshooting

Jika frontend tidak bisa mengakses API:

- Pastikan backend berjalan di `http://127.0.0.1:8000`.
- Pastikan `frontend/.env` berisi `VITE_API_URL=http://localhost:8000/api`.
- Restart `npm run dev` setelah mengubah `.env`.
- Pastikan `CORS_ALLOWED_ORIGINS` di `backend/.env` memuat `http://localhost:5173`.

Jika backend gagal konek database:

- Pastikan MySQL berjalan.
- Pastikan database `tanibijak` sudah dibuat.
- Cek `DB_DATABASE`, `DB_USERNAME`, dan `DB_PASSWORD` di `backend/.env`.
- Jalankan ulang `php artisan migrate --seed`.

Jika rekomendasi/cuaca gagal:

- Pastikan ML service berjalan di `http://127.0.0.1:5000`.
- Pastikan `ML_SERVICE_URL=http://127.0.0.1:5000` ada di `backend/.env`.
- Cek endpoint `http://127.0.0.1:5000/health`.

Jika port sudah dipakai:

- Ganti port command server, lalu sesuaikan `.env`.
- Contoh frontend di port lain:

```bash
npm run dev -- --port 5174
```

Jika menggunakan Ngrok:

- Ubah `VITE_API_URL` di `frontend/.env` ke URL backend ngrok dengan suffix `/api`.
- Tambahkan origin frontend/ngrok ke `CORS_ALLOWED_ORIGINS` atau pattern CORS di `backend/.env`.
- Jangan commit URL ngrok permanen atau API key pribadi.

## 13. Catatan untuk GitHub

File yang tidak perlu dicommit:

- `backend/.env`
- `frontend/.env`
- `machine_learning/ml-service/.env`
- `vendor/`
- `node_modules/`
- `.venv/`
- `dist/`
- file log seperti `*.log`

Pastikan hanya file contoh konfigurasi dan source code yang dipush ke repository.
