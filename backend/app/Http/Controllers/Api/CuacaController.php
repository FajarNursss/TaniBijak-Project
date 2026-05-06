<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WeatherForecast;
use App\Models\WeatherSnapshot;
use App\Models\Lahan;
use Illuminate\Http\Request;

class CuacaController extends Controller
{
    public function current(Request $request)
    {
        $snapshot = WeatherSnapshot::latest('observed_at')->first();

        return response()->json([
            'data' => $snapshot ? [
                'location' => $snapshot->location,
                'temp' => (float) $snapshot->temperature,
                'humidity' => (int) $snapshot->humidity,
                'windSpeed' => (int) $snapshot->wind_speed,
                'condition' => $snapshot->condition,
                'rain' => $snapshot->rain_chance . '%',
                'feelsLike' => (float) $snapshot->feels_like,
                'visibility' => (int) $snapshot->visibility,
                'pressure' => (int) $snapshot->pressure,
                'lastUpdate' => $snapshot->observed_at?->format('d M Y, H:i') . ' WIB',
            ] : null,
        ]);
    }

    public function forecast(Request $request)
    {
        $snapshot = WeatherSnapshot::latest('observed_at')->first();
        $days = min((int) $request->query('days', 7), 14);
        $items = $snapshot
            ? $snapshot->forecasts()->orderBy('forecast_date')->limit($days)->get()->map(fn (WeatherForecast $f) => [
                'date' => $f->forecast_date?->toDateString(),
                'day' => $f->day_name,
                'temp_min' => (float) $f->temp_min,
                'temp_max' => (float) $f->temp_max,
                'condition' => $f->condition,
                'rain_chance' => (int) $f->rain_chance,
            ])
            : collect();

        return response()->json(['data' => $items]);
    }

    public function klimatologi()
    {
        return response()->json([
            'data' => [
                'curah_hujan_bulanan' => 210,
                'suhu_rata_rata' => 27.4,
                'kelembaban_rata_rata' => 76,
                'musim' => 'Peralihan',
            ],
        ]);
    }

    public function risk(int $lahanId)
    {
        $lahan = Lahan::findOrFail($lahanId);
        $snapshot = WeatherSnapshot::latest('observed_at')->first();
        return response()->json([
            'data' => [
                'lahan_id' => $lahanId,
                'lahan' => $lahan->nama,
                'level' => $snapshot && $snapshot->rain_chance > 60 ? 'tinggi' : 'sedang',
                'risiko' => $snapshot && $snapshot->rain_chance > 60 ? ['Hujan lebat', 'Kelembaban tinggi'] : ['Kondisi aman', 'Pantau kelembaban'],
                'saran' => 'Pastikan drainase lahan bersih dan pantau potensi hama.',
            ],
        ]);
    }

    public function history()
    {
        $snapshots = WeatherSnapshot::orderByDesc('observed_at')->limit(7)->get();
        return response()->json([
            'data' => $snapshots->map(fn (WeatherSnapshot $s) => [
                'date' => $s->observed_at?->toDateString(),
                'temp' => (float) $s->temperature,
                'humidity' => (int) $s->humidity,
                'rainfall' => (int) $s->rain_chance,
            ]),
        ]);
    }
}
