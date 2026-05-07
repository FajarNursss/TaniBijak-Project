<?php

namespace App\Services;

use App\Models\ChatbotFaq;
use App\Models\Lahan;
use App\Models\LocalWisdom;
use App\Models\Recommendation;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class ChatbotService
{
    public function __construct(private readonly MlRecommendationService $mlRecommendation)
    {
    }

    private array $intentKeywords = [
        'recommendation' => ['rekomendasi', 'tanaman cocok', 'tanam apa', 'komoditas', 'cocok ditanam', 'pilih tanaman'],
        'fertilizer' => ['pupuk', 'pemupukan', 'npk', 'urea', 'kompos', 'kcl', 'sp36', 'nutrisi'],
        'plant_health' => ['hama', 'penyakit', 'wereng', 'ulat', 'jamur', 'mozaik', 'menguning', 'layu', 'bercak', 'busuk'],
        'local_wisdom' => ['kearifan', 'pranata', 'mangsa', 'subak', 'nyabuk', 'sasi', 'tradisional', 'adat'],
        'land_context' => ['lahan', 'tanah', 'kebun', 'sawah', 'lokasi', 'kondisi lahan', 'tanah saya'],
        'faq' => ['cara', 'apa itu', 'bagaimana', 'kenapa', 'mengapa', 'kapan'],
    ];

    public function answer(string $message, ?User $user = null): array
    {
        $normalized = $this->normalize($message);
        $intent = $this->detectIntent($normalized);
        $lahan = $this->resolveLahanContext($normalized, $user);

        $faq = $this->searchFaq($normalized);
        if ($faq && ! in_array($intent, ['recommendation', 'land_context'], true)) {
            return $this->faqAnswer($faq);
        }

        if ($intent === 'recommendation' || ($intent === 'land_context' && $lahan)) {
            return $this->recommendationAnswer($normalized, $user, $lahan);
        }

        if ($intent === 'fertilizer') {
            return $this->fertilizerAnswer($lahan);
        }

        if ($intent === 'plant_health') {
            return $this->plantHealthAnswer($lahan);
        }

        if ($intent === 'local_wisdom') {
            $wisdom = $this->searchLocalWisdom($normalized);
            if ($wisdom->isNotEmpty()) {
                return [
                    'answer' => $this->withDisclaimer($this->formatLocalWisdom($wisdom)),
                    'intent' => 'local_wisdom',
                    'sources' => $wisdom->map(fn (LocalWisdom $item) => [
                        'type' => 'local_wisdom',
                        'id' => $item->id,
                        'title' => $item->title,
                    ])->values()->all(),
                ];
            }
        }

        if ($faq) {
            return $this->faqAnswer($faq);
        }

        return [
            'answer' => $this->withDisclaimer(
                'Saya bisa bantu soal rekomendasi tanaman, pemupukan, gejala hama/penyakit, cuaca tanam, kearifan lokal, dan data lahan kamu. Coba tulis nama lahan, tanaman, jenis tanah, atau gejala yang terlihat supaya sarannya lebih tepat.'
            ),
            'intent' => 'fallback',
            'sources' => [],
        ];
    }

    private function recommendationAnswer(string $message, ?User $user, ?Lahan $lahan): array
    {
        if ($user && $lahan) {
            try {
                $ml = $this->mlRecommendation->generate($user, $lahan);

                return [
                    'answer' => $this->withDisclaimer($this->formatMlRecommendation($ml)),
                    'intent' => 'recommendation',
                    'sources' => collect($this->landSources($lahan))
                        ->push([
                            'type' => 'ml_recommendation',
                            'id' => $lahan->id,
                            'title' => strtoupper($ml['source']) . ': ' . $ml['tanaman'],
                        ])
                        ->values()
                        ->all(),
                ];
            } catch (\Throwable) {
                // Jika layanan prediksi belum siap, chatbot memakai rekomendasi tersimpan.
            }
        }

        $query = Recommendation::query()->orderByDesc('skor');
        $crop = $this->detectCrop($message) ?: $this->detectCrop(Str::lower((string) $lahan?->tanaman));

        if ($crop) {
            $query->where('tanaman', 'like', '%' . $crop . '%');
        }

        if ($user && $user->role !== 'admin') {
            $query->where(function ($q) use ($user, $lahan) {
                $q->whereNull('user_id')->orWhere('user_id', $user->id);
                if ($lahan) {
                    $q->orWhere('lahan_id', $lahan->id);
                }
            });
        }

        if ($lahan?->jenis_tanah) {
            $query->orderByRaw('CASE WHEN jenis_tanah LIKE ? THEN 0 ELSE 1 END', ['%' . $lahan->jenis_tanah . '%']);
        }

        $recommendations = $query->limit(3)->get();

        if ($recommendations->isEmpty()) {
            return [
                'answer' => $this->withDisclaimer($this->landIntro($lahan) . 'Belum ada data rekomendasi yang cocok. Tambahkan info jenis tanah, musim, pH, suhu, atau tanaman target agar bisa saya cocokkan dengan data yang tersedia.'),
                'intent' => 'recommendation',
                'sources' => $this->landSources($lahan),
            ];
        }

        $lines = $recommendations->map(function (Recommendation $item) {
            return sprintf(
                '%s cocok dengan skor %d. Alasan: %s Tips: %s',
                $item->tanaman,
                (int) $item->skor,
                $item->alasan,
                $item->tips
            );
        })->implode("\n");

        return [
            'answer' => $this->withDisclaimer($this->landIntro($lahan) . $lines),
            'intent' => 'recommendation',
            'sources' => collect($this->landSources($lahan))
                ->merge($recommendations->map(fn (Recommendation $item) => [
                    'type' => 'recommendation',
                    'id' => $item->id,
                    'title' => $item->tanaman,
                ]))
                ->values()
                ->all(),
        ];
    }

    private function fertilizerAnswer(?Lahan $lahan): array
    {
        $crop = $lahan?->tanaman ? " untuk {$lahan->tanaman}" : '';
        $soil = $lahan?->jenis_tanah ? " Pada tanah {$lahan->jenis_tanah}, perhatikan kelembaban supaya pupuk tidak mudah tercuci atau tertahan terlalu lama." : '';
        $condition = $lahan?->kondisi && $lahan->kondisi !== 'baik'
            ? " Karena kondisi lahan tercatat {$lahan->kondisi}, mulai dari dosis ringan dan pantau respons tanaman 3-5 hari."
            : '';

        return [
            'answer' => $this->withDisclaimer(
                $this->landIntro($lahan) .
                "Untuk pemupukan{$crop}, cek umur tanaman, warna daun, kelembaban tanah, dan fase tumbuh. Fase awal fokus perakaran, fase vegetatif fokus nitrogen, dan fase generatif fokus kalium. Hindari pemupukan saat tanah terlalu kering atau hujan lebat.{$soil}{$condition}"
            ),
            'intent' => 'fertilizer',
            'sources' => $this->landSources($lahan),
        ];
    }

    private function plantHealthAnswer(?Lahan $lahan): array
    {
        $crop = $lahan?->tanaman ? " pada {$lahan->tanaman}" : '';
        $note = $lahan?->catatan ? " Catatan lahan kamu: {$lahan->catatan}" : '';

        return [
            'answer' => $this->withDisclaimer(
                $this->landIntro($lahan) .
                "Untuk gejala{$crop}, cek pola serangan: menyebar merata atau hanya titik tertentu, daun muda atau tua, ada bercak, ada serangga di bawah daun, dan apakah akar busuk. Pisahkan tanaman yang parah, bersihkan gulma, perbaiki drainase, lalu gunakan pestisida atau fungisida sesuai penyebab. Daun menguning umumnya terkait kurang nitrogen, akar tergenang, serangan hama, atau pH tanah tidak sesuai.{$note}"
            ),
            'intent' => 'plant_health',
            'sources' => $this->landSources($lahan),
        ];
    }

    private function faqAnswer(ChatbotFaq $faq): array
    {
        return [
            'answer' => $this->withDisclaimer($faq->answer),
            'intent' => 'faq',
            'sources' => [[
                'type' => 'chatbot_faq',
                'id' => $faq->id,
                'title' => $faq->question,
            ]],
        ];
    }

    private function formatMlRecommendation(array $ml): string
    {
        $weather = $ml['weather'] ?: [];
        $weatherLine = $weather
            ? sprintf(
                'Cuaca pendukung: %s, suhu %s C, curah hujan %s mm.',
                $weather['weather'] ?? '-',
                $weather['temperature'] ?? '-',
                $weather['rainfall'] ?? '-'
            )
            : 'Cuaca pendukung belum tersedia dari layanan prediksi.';

        $tips = collect($ml['rekomendasi'] ?? [])
            ->map(fn ($tip) => '- ' . $tip)
            ->implode("\n");

        return implode("\n", array_filter([
            $this->landIntro(isset($ml['lahan']['id']) ? Lahan::find($ml['lahan']['id']) : null) . "Rekomendasi menyarankan {$ml['tanaman']} dengan skor {$ml['skor']}.",
            "Sumber: {$ml['source']}.",
            "Alasan: {$ml['alasan']}",
            $weatherLine,
            $tips ? "Saran:\n{$tips}" : null,
            $ml['warning'] ?? null,
        ]));
    }

    private function resolveLahanContext(string $message, ?User $user): ?Lahan
    {
        if (! $user) {
            return null;
        }

        $lahans = Lahan::query()
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        if ($lahans->isEmpty()) {
            return null;
        }

        $matched = $lahans->first(function (Lahan $lahan) use ($message) {
            return $this->containsAny($message, [
                $lahan->nama,
                $lahan->lokasi,
                $lahan->jenis_tanah,
                $lahan->tanaman,
            ]);
        });

        if ($matched) {
            return $matched;
        }

        if ($this->containsAny($message, $this->intentKeywords['land_context'])) {
            return $lahans->first();
        }

        return null;
    }

    private function searchFaq(string $message): ?ChatbotFaq
    {
        $terms = $this->extractTerms($message);

        $match = ChatbotFaq::query()
            ->where('status', 'aktif')
            ->get()
            ->map(function (ChatbotFaq $faq) use ($message, $terms) {
                $haystack = $this->normalize($faq->question . ' ' . $faq->answer . ' ' . $faq->category . ' ' . implode(' ', $faq->keywords ?: []));
                $score = $terms->sum(fn ($term) => Str::contains($haystack, $term) ? 1 : 0);
                if (Str::contains($message, $this->normalize($faq->question))) {
                    $score += 3;
                }

                return ['faq' => $faq, 'score' => $score];
            })
            ->filter(fn ($item) => $item['score'] >= 2)
            ->sortByDesc('score')
            ->first();

        return $match['faq'] ?? null;
    }

    private function searchLocalWisdom(string $message): Collection
    {
        $terms = $this->extractTerms($message);

        if ($terms->isEmpty()) {
            return collect();
        }

        return LocalWisdom::query()
            ->where('status', 'aktif')
            ->where(function ($query) use ($terms) {
                foreach ($terms as $term) {
                    $query->orWhere('title', 'like', '%' . $term . '%')
                        ->orWhere('category', 'like', '%' . $term . '%')
                        ->orWhere('region', 'like', '%' . $term . '%')
                        ->orWhere('description', 'like', '%' . $term . '%');
                }
            })
            ->limit(3)
            ->get();
    }

    private function formatLocalWisdom(Collection $wisdom): string
    {
        return $wisdom->map(function (LocalWisdom $item) {
            $benefits = collect($item->benefits)->take(3)->implode(', ');

            return "{$item->title} ({$item->region}) bisa dipakai sebagai referensi. {$item->description} Manfaat utama: {$benefits}.";
        })->implode("\n");
    }

    private function detectIntent(string $message): string
    {
        $scores = collect($this->intentKeywords)
            ->mapWithKeys(fn ($keywords, $intent) => [$intent => $this->scoreKeywords($message, $keywords)])
            ->filter(fn ($score) => $score > 0)
            ->sortDesc();

        return $scores->keys()->first() ?: 'fallback';
    }

    private function scoreKeywords(string $message, array $keywords): int
    {
        return collect($keywords)->sum(fn ($keyword) => Str::contains($message, $this->normalize($keyword)) ? 1 : 0);
    }

    private function detectCrop(string $message): ?string
    {
        foreach (['padi', 'jagung', 'kedelai', 'cabai', 'cabai merah', 'padi ir64'] as $crop) {
            if (Str::contains($message, $crop)) {
                return $crop;
            }
        }

        return null;
    }

    private function extractTerms(string $message): Collection
    {
        $stopwords = ['yang', 'dengan', 'untuk', 'saya', 'kamu', 'atau', 'bisa', 'gimana', 'bagaimana', 'kenapa', 'mengapa'];

        return collect(preg_split('/\s+/', $message))
            ->map(fn ($term) => trim($term, ".,!?;:()[]{}\"'"))
            ->filter(fn ($term) => Str::length($term) >= 4)
            ->reject(fn ($term) => in_array($term, $stopwords, true))
            ->unique()
            ->take(8)
            ->values();
    }

    private function containsAny(string $message, array $values): bool
    {
        foreach ($values as $value) {
            if ($value && Str::contains($message, $this->normalize((string) $value))) {
                return true;
            }
        }

        return false;
    }

    private function landIntro(?Lahan $lahan): string
    {
        if (! $lahan) {
            return '';
        }

        $parts = [
            "Saya pakai konteks lahan {$lahan->nama}",
            $lahan->lokasi ? "lokasi {$lahan->lokasi}" : null,
            $lahan->jenis_tanah ? "tanah {$lahan->jenis_tanah}" : null,
            $lahan->tanaman ? "tanaman saat ini {$lahan->tanaman}" : null,
            $lahan->kondisi ? "kondisi {$lahan->kondisi}" : null,
        ];

        return collect($parts)->filter()->implode(', ') . ".\n";
    }

    private function landSources(?Lahan $lahan): array
    {
        if (! $lahan) {
            return [];
        }

        return [[
            'type' => 'lahan',
            'id' => $lahan->id,
            'title' => $lahan->nama,
        ]];
    }

    private function normalize(string $message): string
    {
        return Str::of($message)->lower()->squish()->toString();
    }

    private function withDisclaimer(string $answer): string
    {
        return $answer . "\n\nCatatan: ini saran awal berbasis data TaniBijak. Untuk serangan berat atau kondisi lahan kritis, cek langsung di lapangan atau konsultasikan dengan penyuluh pertanian.";
    }
}
