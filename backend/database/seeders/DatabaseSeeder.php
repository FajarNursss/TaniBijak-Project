<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\ActivityLog;
use App\Models\CalendarEvent;
use App\Models\CropHistory;
use App\Models\FarmNotification;
use App\Models\Lahan;
use App\Models\LocalWisdom;
use App\Models\Recommendation;
use App\Models\WeatherForecast;
use App\Models\WeatherSnapshot;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@tanibijak.id'],
            [
                'name' => 'Admin TaniBijak',
                'password' => 'admin123',
                'role' => 'admin',
                'location' => 'Jakarta',
                'status' => 'aktif',
            ]
        );

        $user = User::updateOrCreate(
            ['email' => 'budi@tanibijak.id'],
            [
                'name' => 'Budi Santoso',
                'password' => 'user123',
                'role' => 'user',
                'location' => 'Jawa Tengah',
                'status' => 'aktif',
            ]
        );

        Lahan::updateOrCreate(
            ['user_id' => $user->id, 'nama' => 'Sawah Utara'],
            [
                'lokasi' => 'Kab. Semarang',
                'luas' => 1.75,
                'jenis_tanah' => 'Aluvial',
                'tanaman' => 'Padi IR64',
                'kondisi' => 'baik',
                'catatan' => 'Lahan demo untuk integrasi React.',
            ]
        );

        Lahan::updateOrCreate(
            ['user_id' => $user->id, 'nama' => 'Kebun Selatan'],
            [
                'lokasi' => 'Kab. Semarang',
                'luas' => 0.85,
                'jenis_tanah' => 'Latosol',
                'tanaman' => 'Jagung',
                'kondisi' => 'perhatian',
                'catatan' => 'Perlu pemantauan drainase.',
            ]
        );

        $current = WeatherSnapshot::updateOrCreate(
            ['location' => 'Kab. Semarang, Jawa Tengah', 'observed_at' => now()->startOfHour()],
            [
                'user_id' => $user->id,
                'temperature' => 28,
                'feels_like' => 30,
                'humidity' => 72,
                'wind_speed' => 12,
                'visibility' => 10,
                'pressure' => 1013,
                'condition' => 'Berawan Sebagian',
                'rain_chance' => 20,
            ]
        );

        foreach (range(1, 7) as $day) {
            WeatherSnapshot::updateOrCreate(
                ['location' => 'Kab. Semarang, Jawa Tengah', 'observed_at' => now()->subDays($day)->startOfHour()],
                [
                    'user_id' => $user->id,
                    'temperature' => 27 + ($day % 4),
                    'feels_like' => 28 + ($day % 3),
                    'humidity' => 68 + ($day % 10),
                    'wind_speed' => 8 + ($day % 5),
                    'visibility' => 9,
                    'pressure' => 1010 + ($day % 4),
                    'condition' => $day % 2 === 0 ? 'Hujan Ringan' : 'Berawan',
                    'rain_chance' => $day % 2 === 0 ? 80 : 20,
                ]
            );
        }

        WeatherForecast::where('weather_snapshot_id', $current->id)->delete();
        foreach ([
            ['Sen', 24, 30, 20, 'Berawan'],
            ['Sel', 22, 27, 80, 'Hujan'],
            ['Rab', 21, 25, 60, 'Mendung'],
            ['Kam', 25, 32, 5, 'Cerah'],
            ['Jum', 24, 31, 15, 'Cerah Berawan'],
            ['Sab', 22, 26, 70, 'Hujan Ringan'],
            ['Min', 25, 33, 10, 'Cerah'],
        ] as $idx => [$dayName, $min, $max, $rain, $cond]) {
            WeatherForecast::create([
                'weather_snapshot_id' => $current->id,
                'forecast_date' => now()->addDays($idx + 1)->toDateString(),
                'day_name' => $dayName,
                'temp_min' => $min,
                'temp_max' => $max,
                'rain_chance' => $rain,
                'condition' => $cond,
            ]);
        }

        Recommendation::query()->delete();
        foreach ([
            ['Padi IR64', 95, 'Hujan', '24-28C', '200-300mm', 'Liat', '5.5-7.0', 'Curah hujan optimal dan suhu ideal untuk pertumbuhan padi.', 'Lakukan pemupukan berimbang NPK dan jaga ketinggian air irigasi 5-10cm.', 'Pangan', true],
            ['Jagung Manis', 87, 'Kemarau', '21-34C', '100-200mm', 'Lempung', '5.6-7.5', 'Kelembaban tanah baik dan musim sangat cocok untuk jagung.', 'Jarak tanam 70x25cm, pemupukan urea saat 3 minggu setelah tanam.', 'Pangan', true],
            ['Kedelai', 78, 'Kemarau', '23-30C', '100-200mm', 'Lempung berpasir', '6.0-7.0', 'Rotasi tanam yang disarankan setelah padi untuk menyehatkan tanah.', 'Inokulasi benih dengan Rhizobium sebelum tanam untuk hasil optimal.', 'Kacang', true],
            ['Cabai Merah', 72, 'Kemarau', '25-30C', '600-1200mm', 'Lempung', '5.5-7.0', 'Kondisi cuaca mendukung, namun perlu perhatian terhadap hama.', 'Gunakan mulsa plastik hitam perak untuk menekan gulma dan menjaga kelembaban.', 'Sayuran', false],
        ] as $r) {
            Recommendation::create([
                'user_id' => null,
                'tanaman' => $r[0],
                'skor' => $r[1],
                'musim' => $r[2],
                'suhu' => $r[3],
                'curah_hujan' => $r[4],
                'jenis_tanah' => $r[5],
                'ph' => $r[6],
                'alasan' => $r[7],
                'tips' => $r[8],
                'kategori' => $r[9],
                'featured' => $r[10],
            ]);
        }

        CropHistory::query()->delete();
        foreach ([
            ['Padi IR64', 'Sawah Utara', '2025-01-15', '2025-05-04', 4.2, 'panen', 'Hasil sangat memuaskan. Hama wereng berhasil dikendalikan.'],
            ['Jagung Manis', 'Kebun Selatan', '2024-11-10', '2025-01-24', 2.8, 'panen', 'Kualitas baik. Dijual ke pasar lokal dengan harga Rp 4.500/kg.'],
            ['Kedelai', 'Kebun Selatan', '2024-08-20', '2024-11-18', 1.5, 'panen', 'Produksi di bawah target karena hujan terlambat.'],
            ['Cabai Merah', 'Kebun Selatan', '2024-06-05', null, null, 'gagal', 'Gagal panen akibat serangan virus mozaik. Perlu rotasi tanaman.'],
            ['Padi Ciherang', 'Sawah Utara', '2024-02-01', '2024-05-20', 3.9, 'panen', 'Kondisi optimal. Cuaca sangat mendukung.'],
        ] as $h) {
            $lahanName = $h[1];
            $lahanId = Lahan::where('nama', $lahanName)->value('id');
            CropHistory::create([
                'user_id' => $user->id,
                'lahan_id' => $lahanId,
                'tanaman' => $h[0],
                'started_at' => $h[2],
                'finished_at' => $h[3],
                'yield_amount' => $h[4],
                'yield_unit' => 'ton',
                'status' => $h[5],
                'note' => $h[6],
            ]);
        }

        CalendarEvent::query()->delete();
        foreach ([
            ['2025-05-05', 'tanam', 'Tanam Padi IR64', 'Sawah Utara', 'scheduled'],
            ['2025-05-08', 'pupuk', 'Pemupukan NPK', 'Kebun Selatan', 'scheduled'],
            ['2025-05-12', 'pupuk', 'Pemupukan Kedua', 'Sawah Utara', 'scheduled'],
            ['2025-05-15', 'hama', 'Cek dan Semprot Pestisida', 'Sawah Utara', 'scheduled'],
            ['2025-05-20', 'irigasi', 'Pengecekan Irigasi', 'Sawah Utara', 'scheduled'],
            ['2025-05-28', 'panen', 'Estimasi Panen Jagung', 'Kebun Selatan', 'scheduled'],
        ] as $e) {
            CalendarEvent::create([
                'user_id' => $user->id,
                'lahan_id' => Lahan::where('nama', $e[3])->value('id'),
                'event_date' => $e[0],
                'kind' => $e[1],
                'label' => $e[2],
                'status' => $e[4],
            ]);
        }

        LocalWisdom::query()->delete();
        foreach ([
            ['Pranata Mangsa', 'Musim', 'Jawa', 'Tinggi', 'Sistem penanggalan tradisional Jawa untuk menentukan waktu tanam berdasarkan perubahan alam dan musim.', ['Menentukan waktu tanam optimal', 'Menghindari risiko gagal panen', 'Menjaga keseimbangan alam'], ['Padi', 'Jagung', 'Kedelai'], 'aktif', ''],
            ['Subak', 'Irigasi', 'Bali', 'Tinggi', 'Sistem irigasi tradisional Bali yang mengatur distribusi air secara komunal dan berkelanjutan.', ['Distribusi air merata', 'Mencegah hama terpadu', 'Meningkatkan hasil panen'], ['Padi'], 'aktif', ''],
            ['Nyabuk Gunung', 'Teknik Tanam', 'Jawa Barat', 'Sedang', 'Teknik bercocok tanam mengikuti kontur bukit/gunung untuk mencegah erosi tanah.', ['Mencegah erosi', 'Menjaga kesuburan tanah', 'Konservasi air hujan'], ['Sayuran', 'Palawija'], 'aktif', ''],
            ['Gilir Balik Tanam', 'Rotasi', 'Nasional', 'Tinggi', 'Teknik rotasi tanaman secara berkala untuk menjaga kesuburan tanah dan memutus siklus hama.', ['Memutus siklus hama', 'Menjaga kesuburan tanah', 'Diversifikasi produksi'], ['Semua tanaman'], 'aktif', ''],
            ['Sasi Pertanian', 'Konservasi', 'Maluku', 'Sedang', 'Aturan adat untuk melarang panen selama periode tertentu demi menjaga kelestarian sumber daya.', ['Kelestarian sumber daya', 'Peningkatan hasil jangka panjang', 'Kearifan sosial'], ['Berbagai tanaman'], 'aktif', ''],
            ['Padi Gogo', 'Varietas', 'Nasional', 'Sedang', 'Varietas padi yang ditanam di lahan kering tanpa irigasi, memanfaatkan air hujan alami.', ['Hemat air', 'Cocok lahan kering', 'Tahan kekeringan'], ['Padi'], 'draft', ''],
        ] as $w) {
            LocalWisdom::create([
                'title' => $w[0],
                'category' => $w[1],
                'region' => $w[2],
                'relevance' => $w[3],
                'description' => $w[4],
                'benefits' => $w[5],
                'crops' => $w[6],
                'status' => $w[7],
                'icon' => $w[8] ?: null,
            ]);
        }

        FarmNotification::query()->delete();
        foreach ([
            ['warning', 'Risiko Kekeringan', 'Prediksi curah hujan rendah minggu ini. Siapkan irigasi tambahan.', false],
            ['info', 'Musim Tanam Optimal', 'Ini adalah waktu terbaik untuk menanam padi varietas IR64.', false],
            ['danger', 'Serangan Hama Wereng', 'Terdeteksi potensi hama wereng di area Anda. Segera ambil tindakan.', true],
            ['info', 'Pemupukan Terjadwal', 'Jadwal pemupukan lahan Sawah Utara besok pagi.', true],
            ['warning', 'Cuaca Ekstrem', 'Prakiraan hujan lebat disertai angin kencang 2 hari ke depan.', false],
        ] as $n) {
            FarmNotification::create([
                'user_id' => null,
                'type' => $n[0],
                'title' => $n[1],
                'message' => $n[2],
                'read_at' => $n[3] ? now()->subHours(2) : null,
                'source' => 'seed',
            ]);
        }

        ActivityLog::query()->delete();
        foreach ([
            [$user->id, 'Budi Santoso', 'user', 'Login ke sistem', '192.168.1.10', 'sukses', now()->subMinutes(5)],
            [$user->id, 'Budi Santoso', 'user', 'Menambah lahan baru', '192.168.1.10', 'sukses', now()->subMinutes(12)],
            [null, 'Ahmad Fauzi', 'user', 'Login ke sistem', '192.168.1.42', 'gagal', now()->subHours(1)],
            [$admin->id, 'Admin TaniBijak', 'admin', 'Membuat notifikasi baru', '127.0.0.1', 'sukses', now()->subHours(2)],
            [null, 'Dewi Rahayu', 'user', 'Melihat rekomendasi tanam', '192.168.1.55', 'sukses', now()->subHours(3)],
            [$user->id, 'Budi Santoso', 'user', 'Update profil', '192.168.1.10', 'sukses', now()->subHours(5)],
            [$admin->id, 'Admin TaniBijak', 'admin', 'Hapus pengguna nonaktif', '127.0.0.1', 'sukses', now()->subHours(7)],
        ] as $a) {
            ActivityLog::create([
                'user_id' => $a[0],
                'user_name' => $a[1],
                'role' => $a[2],
                'action' => $a[3],
                'ip_address' => $a[4],
                'status' => $a[5],
                'created_at' => $a[6],
                'updated_at' => $a[6],
            ]);
        }
    }
}
