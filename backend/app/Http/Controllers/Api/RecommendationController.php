<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Recommendation;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    public function index(Request $request)
    {
        $query = Recommendation::query()->latest('skor');

        if ($request->user()->role !== 'admin') {
            $query->where(function ($q) use ($request) {
                $q->whereNull('user_id')->orWhere('user_id', $request->user()->id);
            });
        }

        return response()->json([
            'data' => $query->get()->map(fn (Recommendation $r) => $this->payload($r)),
        ]);
    }

    public function featured(Request $request)
    {
        $query = Recommendation::query()->where('featured', true)->orderByDesc('skor')->limit(3);

        if ($request->user()->role !== 'admin') {
            $query->where(function ($q) use ($request) {
                $q->whereNull('user_id')->orWhere('user_id', $request->user()->id);
            });
        }

        return response()->json([
            'data' => $query->get()->map(fn (Recommendation $r) => $this->payload($r)),
        ]);
    }

    public function show(Recommendation $recommendation)
    {
        return response()->json(['data' => $this->payload($recommendation)]);
    }

    private function payload(Recommendation $r): array
    {
        return [
            'id' => $r->id,
            'tanaman' => $r->tanaman,
            'skor' => (int) $r->skor,
            'musim' => $r->musim,
            'suhu' => $r->suhu,
            'curah_hujan' => $r->curah_hujan,
            'jenis_tanah' => $r->jenis_tanah,
            'ph' => $r->ph,
            'alasan' => $r->alasan,
            'tips' => $r->tips,
            'kategori' => $r->kategori,
            'featured' => $r->featured,
        ];
    }
}
