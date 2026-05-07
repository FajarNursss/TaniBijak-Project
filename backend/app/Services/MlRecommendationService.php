<?php

namespace App\Services;

use App\Models\Lahan;
use App\Models\Recommendation;
use App\Models\User;
use Illuminate\Support\Facades\Http;

class MlRecommendationService
{
    public function generate(User $user, Lahan $lahan): array
    {
        $locationInput = $this->normalizeLocation((string) $lahan->lokasi);

        if ($locationInput === '') {
            throw new \InvalidArgumentException('Lokasi lahan wajib diisi agar rekomendasi tanaman bisa dibuat.');
        }

        $latest = Recommendation::query()
            ->where('user_id', $user->id)
            ->where('lahan_id', $lahan->id)
            ->latest()
            ->first();

        $freshUntil = now()->subHours(config('services.ml.cache_hours', 6));

        if ($latest && $latest->created_at?->greaterThanOrEqualTo($freshUntil) && $this->hasMultipleStoredRecommendations($latest)) {
            return $this->payload($lahan, $latest, 'cache');
        }

        try {
            $mlData = $this->requestPrediction($locationInput);
            $weather = $mlData['weather'] ?? [];
            $crops = $this->recommendationCrops($mlData);

            if ($crops === []) {
                throw new \RuntimeException('Layanan prediksi tidak mengirim tanaman rekomendasi.');
            }

            $recommendation = Recommendation::create([
                'user_id' => $user->id,
                'lahan_id' => $lahan->id,
                'tanaman' => $this->processCrops(array_column($crops, 'crop')),
                'skor' => (int) round($crops[0]['confidence'] ?? ($mlData['score'] ?? 90)),
                'musim' => $weather['weather'] ?? null,
                'suhu' => isset($weather['temperature']) ? $weather['temperature'] . ' C' : null,
                'curah_hujan' => isset($weather['rainfall']) ? $weather['rainfall'] . ' mm' : null,
                'jenis_tanah' => $lahan->jenis_tanah,
                'ph' => $mlData['ph'] ?? '6.5',
                'alasan' => $this->cleanMLText($mlData['explanation'] ?? 'Rekomendasi dibuat berdasarkan prediksi model dan data cuaca terbaru.'),
                'tips' => $this->cleanTips($mlData['tips'] ?? [
                    'Pantau kondisi cuaca harian sebelum mulai tanam.',
                    'Sesuaikan pemupukan dengan jenis tanah dan kondisi lahan.',
                    'Periksa drainase jika intensitas hujan meningkat.',
                ]),
                'kategori' => 'ML',
                'featured' => false,
            ]);

            return $this->payload($lahan, $recommendation, 'ml', $weather, null, $crops);
        } catch (\Throwable $e) {
            if ($latest) {
                $payload = $this->payload($lahan, $latest, 'stale_cache');
                $payload['warning'] = 'Layanan prediksi sedang tidak tersedia. Menampilkan rekomendasi terakhir.';

                return $payload;
            }

            throw $e;
        }
    }

    public function generateFromUserLocation(User $user, bool $refresh = false): array
    {
        $locationInput = $this->normalizeLocation((string) $user->location);

        if ($locationInput === '') {
            throw new \InvalidArgumentException('Lokasi profil user wajib diisi agar rekomendasi tanaman bisa dibuat.');
        }

        $latest = Recommendation::query()
            ->where('user_id', $user->id)
            ->whereNull('lahan_id')
            ->latest()
            ->first();

        $freshUntil = now()->subHours(config('services.ml.cache_hours', 6));

        if (! $refresh && $latest && $latest->created_at?->greaterThanOrEqualTo($freshUntil) && $this->hasMultipleStoredRecommendations($latest)) {
            return $this->payload(null, $latest, 'cache', [], $locationInput);
        }

        try {
            $mlData = $this->requestPrediction($locationInput);
            $weather = $mlData['weather'] ?? [];
            $crops = $this->recommendationCrops($mlData);

            if ($crops === []) {
                throw new \RuntimeException('Layanan prediksi tidak mengirim tanaman rekomendasi.');
            }

            $recommendation = Recommendation::create([
                'user_id' => $user->id,
                'lahan_id' => null,
                'tanaman' => $this->processCrops(array_column($crops, 'crop')),
                'skor' => (int) round($crops[0]['confidence'] ?? ($mlData['score'] ?? 90)),
                'musim' => $weather['weather'] ?? null,
                'suhu' => isset($weather['temperature']) ? $weather['temperature'] . ' C' : null,
                'curah_hujan' => isset($weather['rainfall']) ? $weather['rainfall'] . ' mm' : null,
                'jenis_tanah' => null,
                'ph' => $mlData['ph'] ?? '6.5',
                'alasan' => $this->cleanMLText($mlData['explanation'] ?? 'Rekomendasi dibuat berdasarkan prediksi model dan data cuaca terbaru.'),
                'tips' => $this->cleanTips($mlData['tips'] ?? [
                    'Pantau kondisi cuaca harian sebelum mulai tanam.',
                    'Sesuaikan pemupukan dengan jenis tanah dan kondisi lahan.',
                    'Periksa drainase jika intensitas hujan meningkat.',
                ]),
                'kategori' => 'ML',
                'featured' => false,
            ]);

            return $this->payload(null, $recommendation, 'ml', $weather, $locationInput, $crops);
        } catch (\Throwable $e) {
            if (! $refresh && $latest) {
                $payload = $this->payload(null, $latest, 'stale_cache', [], $locationInput);
                $payload['warning'] = 'Layanan prediksi sedang tidak tersedia. Menampilkan rekomendasi terakhir.';

                return $payload;
            }

            throw $e;
        }
    }

    public function recommendationItems(array $recommendation): array
    {
        $items = $recommendation['recommendations'] ?? [];

        if (! is_array($items) || $items === []) {
            $items = $this->storedRecommendationsFromText((string) ($recommendation['tanaman'] ?? ''));
        }

        return collect($items)
            ->map(function ($item, int $index) use ($recommendation) {
                if (! is_array($item)) {
                    $item = ['crop' => $item];
                }

                $crop = $this->cleanMLText((string) ($item['crop'] ?? $item['tanaman'] ?? ''));

                if ($crop === '') {
                    return null;
                }

                return array_merge($recommendation, [
                    'id' => ($recommendation['id'] ?? 'prediksi') . '-' . $index,
                    'tanaman' => $crop,
                    'skor' => (int) round((float) ($item['confidence'] ?? $item['score'] ?? $recommendation['skor'] ?? 0)),
                    'rank' => $index + 1,
                    'recommendations' => [],
                ]);
            })
            ->filter()
            ->values()
            ->take(3)
            ->all();
    }

    private function normalizeLocation(string $location): string
    {
        $location = trim($location);

        if ($location === '') {
            return '';
        }

        $parts = preg_split('/,\s*/', $location);
        $parts = array_filter(array_map('trim', $parts));

        return $parts[0] ?? '';
    }

    private function cleanMLText(string $text): string
    {
        $text = trim($text);
        $text = preg_replace('/\*\*(.+?)\*\*/', '$1', $text);
        $text = preg_replace('/\*(.+?)\*/', '$1', $text);
        return trim($text);
    }

    private function processCrops($crop): string
    {
        if (is_array($crop)) {
            $cleaned = array_map(fn ($c) => $this->cleanMLText((string) $c), $crop);
            return implode('|', array_filter($cleaned));
        }
        return $this->cleanMLText((string) $crop);
    }

    private function recommendationCrops(array $mlData): array
    {
        $recommendations = $mlData['recommendations'] ?? [];

        if (is_array($recommendations) && $recommendations !== []) {
            return collect($recommendations)
                ->map(function ($item) use ($mlData) {
                    if (is_array($item)) {
                        $crop = $this->cleanMLText((string) ($item['crop'] ?? $item['tanaman'] ?? ''));
                        $confidence = (float) ($item['confidence'] ?? $item['score'] ?? $mlData['score'] ?? 90);
                    } else {
                        $crop = $this->cleanMLText((string) $item);
                        $confidence = (float) ($mlData['score'] ?? 90);
                    }

                    return $crop === '' ? null : [
                        'crop' => $crop,
                        'confidence' => $confidence,
                    ];
                })
                ->filter()
                ->values()
                ->all();
        }

        $crop = $mlData['crop'] ?? null;

        if (is_array($crop)) {
            return collect($crop)
                ->map(fn ($item) => [
                    'crop' => $this->cleanMLText((string) $item),
                    'confidence' => (float) ($mlData['score'] ?? 90),
                ])
                ->filter(fn ($item) => $item['crop'] !== '')
                ->values()
                ->all();
        }

        $crop = $this->cleanMLText((string) $crop);

        return $crop === '' ? [] : [[
            'crop' => $crop,
            'confidence' => (float) ($mlData['score'] ?? 90),
        ]];
    }

    private function cleanTips(array $tips): string
    {
        $cleanedTips = array_map(
            fn ($tip) => $this->cleanMLText((string) $tip),
            $tips
        );
        return implode("\n", array_filter($cleanedTips));
    }

    private function requestPrediction(string $locationInput): array
    {
        $baseUrl = rtrim(config('services.ml.url'), '/');

        $response = Http::timeout(config('services.ml.timeout', 30))
            ->post("{$baseUrl}/api/predict", [
                'city' => $locationInput,
            ]);

        if (! $response->successful()) {
            throw new \RuntimeException("Layanan prediksi error: HTTP {$response->status()}");
        }

        $body = $response->json();

        if (($body['success'] ?? false) !== true || ! isset($body['data'])) {
            throw new \RuntimeException('Response layanan prediksi tidak valid.');
        }

        return $body['data'];
    }

    private function payload(?Lahan $lahan, Recommendation $recommendation, string $source, array $weather = [], ?string $location = null, array $mlRecommendations = []): array
    {
        return [
            'lahan' => $lahan ? $this->lahanPayload($lahan) : $this->locationPayload($location),
            'tanaman' => $recommendation->tanaman,
            'skor' => (int) $recommendation->skor,
            'alasan' => $recommendation->alasan,
            'rekomendasi' => $this->tipsPayload($recommendation),
            'weather' => $weather ?: null,
            'source' => $source,
            'generated_at' => $recommendation->created_at?->toIso8601String(),
            'recommendations' => $mlRecommendations ?: $this->storedRecommendations($recommendation),
        ];
    }

    private function storedRecommendations(Recommendation $recommendation): array
    {
        return $this->storedRecommendationsFromText((string) $recommendation->tanaman, (float) $recommendation->skor);
    }

    private function storedRecommendationsFromText(string $crops, ?float $firstScore = null): array
    {
        return collect(explode('|', $crops))
            ->map(fn ($crop) => $this->cleanMLText($crop))
            ->filter()
            ->values()
            ->map(fn ($crop, $index) => [
                'crop' => $crop,
                'confidence' => $index === 0 ? $firstScore : null,
            ])
            ->all();
    }

    private function hasMultipleStoredRecommendations(Recommendation $recommendation): bool
    {
        return count($this->storedRecommendations($recommendation)) > 1;
    }

    private function tipsPayload(Recommendation $recommendation): array
    {
        if (! $recommendation->tips) {
            return [];
        }

        return collect(preg_split('/\r\n|\r|\n/', $recommendation->tips))
            ->map(fn ($tip) => $this->cleanMLText(trim($tip)))
            ->filter()
            ->values()
            ->all();
    }

    private function locationPayload(?string $location): array
    {
        return [
            'id' => null,
            'nama' => 'Profil Lokasi',
            'lokasi' => $location,
            'luas' => 0.0,
            'jenis_tanah' => null,
            'tanaman' => null,
            'kondisi' => null,
            'catatan' => null,
            'pemilik' => null,
            'user_id' => null,
        ];
    }

    private function lahanPayload(Lahan $lahan): array
    {
        return [
            'id' => $lahan->id,
            'nama' => $lahan->nama,
            'lokasi' => $lahan->lokasi,
            'luas' => (float) $lahan->luas,
            'jenis_tanah' => $lahan->jenis_tanah,
            'tanaman' => $lahan->tanaman,
            'kondisi' => $lahan->kondisi,
            'catatan' => $lahan->catatan,
            'pemilik' => $lahan->user?->name,
            'user_id' => $lahan->user_id,
        ];
    }
}
