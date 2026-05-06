<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CropHistory;
use Illuminate\Http\Request;

class CropHistoryController extends Controller
{
    public function index(Request $request)
    {
        $query = CropHistory::with('lahan')->latest('started_at');

        if ($request->user()->role !== 'admin') {
            $query->where('user_id', $request->user()->id);
        }

        return response()->json([
            'data' => $query->get()->map(fn (CropHistory $h) => [
                'id' => $h->id,
                'tanaman' => $h->tanaman,
                'lahan' => $h->lahan?->nama,
                'mulai' => $h->started_at?->format('d M Y'),
                'selesai' => $h->finished_at?->format('d M Y') ?: '—',
                'hasil' => $h->yield_amount !== null ? rtrim(rtrim(number_format($h->yield_amount, 1, '.', ''), '0'), '.') . ' ' . $h->yield_unit : '—',
                'status' => $h->status,
                'catatan' => $h->note,
            ]),
        ]);
    }
}
