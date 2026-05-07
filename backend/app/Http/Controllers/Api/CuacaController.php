<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lahan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CuacaController extends Controller
{
    public function current(Request $request)
    {
        $city = $this->profileCity($request);
        $weather = $this->requestMlWeather($city);

        return response()->json([
            'data' => [
                'location' => $weather['city'] ?? $city,
                'temp' => (float) ($weather['temperature'] ?? 0),
                'humidity' => (int) ($weather['humidity'] ?? 0),
                'windSpeed' => (float) ($weather['wind_speed'] ?? 0),
                'condition' => $weather['weather'] ?? '-',
                'rain' => (int) ($weather['rainfall'] ?? 0) . ' mm',
                'rainfall' => (int) ($weather['rainfall'] ?? 0),
                'feelsLike' => (float) ($weather['temperature'] ?? 0),
                'visibility' => $weather['visibility'] ?? '-',
                'pressure' => null,
                'lastUpdate' => now('Asia/Jakarta')->format('d M Y, H:i') . ' WIB',
                'source' => 'BMKG',
            ],
        ]);
    }

    public function forecast(Request $request)
    {
        $city = $this->profileCity($request);
        $days = min(max((int) $request->query('days', 7), 1), 14);
        $items = $this->requestMlForecast($city, $days);

        return response()->json([
            'data' => collect($items)
                ->take($days)
                ->map(fn (array $item) => [
                    'date' => $item['date'] ?? null,
                    'day' => isset($item['date']) ? $this->dayName($item['date']) : null,
                    'temp_min' => (float) ($item['temp_min'] ?? 0),
                    'temp_max' => (float) ($item['temp_max'] ?? 0),
                    'condition' => $item['condition'] ?? '-',
                    'rain_chance' => (int) ($item['rain_chance'] ?? 0),
                    'rainfall' => (int) ($item['rainfall'] ?? 0),
                    'humidity' => (int) ($item['humidity'] ?? 0),
                ])
                ->values(),
        ]);
    }

    public function klimatologi(Request $request)
    {
        $city = $this->profileCity($request);
        $weather = $this->requestMlWeather($city);

        return response()->json([
            'data' => [
                'curah_hujan_bulanan' => (int) ($weather['rainfall'] ?? 0),
                'suhu_rata_rata' => (float) ($weather['temperature'] ?? 0),
                'kelembaban_rata_rata' => (int) ($weather['humidity'] ?? 0),
                'musim' => $weather['weather'] ?? '-',
                'location' => $weather['city'] ?? $city,
                'source' => 'BMKG',
            ],
        ]);
    }

    public function risk(Request $request, int $lahanId)
    {
        $lahan = Lahan::findOrFail($lahanId);
        abort_if($request->user()->role !== 'admin' && $lahan->user_id !== $request->user()->id, 403);

        $weather = $this->requestMlWeather($this->profileCity($request));
        $rainfall = (int) ($weather['rainfall'] ?? 0);
        $highRisk = $rainfall >= 100;

        return response()->json([
            'data' => [
                'lahan_id' => $lahanId,
                'lahan' => $lahan->nama,
                'level' => $highRisk ? 'tinggi' : 'sedang',
                'risiko' => $highRisk ? ['Hujan lebat', 'Kelembaban tinggi'] : ['Kondisi aman', 'Pantau kelembaban'],
                'saran' => $highRisk
                    ? 'Pastikan drainase lahan bersih dan tunda pemupukan jika hujan masih tinggi.'
                    : 'Pantau kondisi tanah dan sesuaikan penyiraman dengan kelembaban lahan.',
            ],
        ]);
    }

    public function history(Request $request)
    {
        $forecast = $this->requestMlForecast($this->profileCity($request), 7);

        return response()->json([
            'data' => collect($forecast)
                ->map(fn (array $item) => [
                    'date' => $item['date'] ?? null,
                    'temp' => (float) ($item['temp_max'] ?? 0),
                    'humidity' => (int) ($item['humidity'] ?? 0),
                    'rainfall' => (int) ($item['rainfall'] ?? 0),
                ])
                ->values(),
        ]);
    }

    private function profileCity(Request $request): string
    {
        $location = trim((string) $request->user()->location);

        if ($location === '') {
            abort(422, 'Lokasi profil user wajib diisi untuk memuat cuaca BMKG.');
        }

        $parts = array_values(array_filter(array_map('trim', preg_split('/,\s*/', $location))));

        return $parts[0] ?? $location;
    }

    private function requestMlWeather(string $city): array
    {
        $response = Http::timeout(config('services.ml.timeout', 30))
            ->get(rtrim(config('services.ml.url'), '/') . '/api/weather', [
                'city' => $city,
            ]);

        if (! $response->successful() || ! ($response->json('success') === true)) {
            abort(502, 'Gagal mengambil data cuaca dari BMKG.');
        }

        return $response->json('data') ?: [];
    }

    private function requestMlForecast(string $city, int $days): array
    {
        $response = Http::timeout(config('services.ml.timeout', 30))
            ->get(rtrim(config('services.ml.url'), '/') . '/api/forecast', [
                'city' => $city,
                'days' => $days,
            ]);

        if (! $response->successful() || ! ($response->json('success') === true)) {
            abort(502, 'Gagal mengambil prakiraan cuaca dari BMKG.');
        }

        return $response->json('data') ?: [];
    }

    private function dayName(string $date): string
    {
        return ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][(int) date('w', strtotime($date))];
    }
}
