<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CropHistory;
use App\Models\Lahan;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CropHistoryController extends Controller
{
    public function index(Request $request)
    {
        $query = CropHistory::with('lahan')->latest('started_at');

        if ($request->user()->role !== 'admin') {
            $query->where('user_id', $request->user()->id);
        }

        return response()->json([
            'data' => $query->get()->map(fn (CropHistory $history) => $this->payload($history)),
        ]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['yield_unit'] ??= 'ton';
        $this->authorizeLahan($request, $data['lahan_id'] ?? null);

        $history = CropHistory::create([
            ...$data,
            'user_id' => $request->user()->id,
        ]);

        return response()->json([
            'data' => $this->payload($history->load('lahan')),
        ], 201);
    }

    public function update(Request $request, CropHistory $cropHistory)
    {
        $this->authorizeHistory($request, $cropHistory);

        $data = $this->validated($request);
        $data['yield_unit'] ??= 'ton';
        $this->authorizeLahan($request, $data['lahan_id'] ?? null);

        $cropHistory->update($data);

        return response()->json([
            'data' => $this->payload($cropHistory->fresh('lahan')),
        ]);
    }

    public function destroy(Request $request, CropHistory $cropHistory)
    {
        $this->authorizeHistory($request, $cropHistory);

        $cropHistory->delete();

        return response()->json(['message' => 'Riwayat tanam berhasil dihapus.']);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'lahan_id' => ['nullable', 'integer', 'exists:lahans,id'],
            'tanaman' => ['required', 'string', 'max:255'],
            'started_at' => ['required', 'date'],
            'finished_at' => ['nullable', 'date', 'after_or_equal:started_at'],
            'yield_amount' => ['nullable', 'numeric', 'min:0'],
            'yield_unit' => ['nullable', 'string', 'max:50'],
            'status' => ['required', Rule::in(['sedang tanam', 'panen', 'gagal'])],
            'note' => ['nullable', 'string'],
        ]);
    }

    private function authorizeHistory(Request $request, CropHistory $history): void
    {
        if ($request->user()->role === 'admin') {
            return;
        }

        abort_unless($history->user_id === $request->user()->id, 403, 'Anda tidak memiliki akses ke riwayat ini.');
    }

    private function authorizeLahan(Request $request, ?int $lahanId): void
    {
        if (! $lahanId || $request->user()->role === 'admin') {
            return;
        }

        abort_unless(
            Lahan::query()
                ->where('id', $lahanId)
                ->where('user_id', $request->user()->id)
                ->exists(),
            403,
            'Anda tidak memiliki akses ke lahan ini.'
        );
    }

    private function payload(CropHistory $history): array
    {
        $yieldAmount = $history->yield_amount !== null
            ? rtrim(rtrim(number_format((float) $history->yield_amount, 1, '.', ''), '0'), '.')
            : null;

        return [
            'id' => $history->id,
            'tanaman' => $history->tanaman,
            'lahan' => $history->lahan?->nama,
            'lahan_id' => $history->lahan_id,
            'mulai' => $history->started_at?->format('d M Y'),
            'selesai' => $history->finished_at?->format('d M Y') ?: '-',
            'hasil' => $yieldAmount !== null ? $yieldAmount . ' ' . $history->yield_unit : '-',
            'started_at' => $history->started_at?->toDateString(),
            'finished_at' => $history->finished_at?->toDateString(),
            'yield_amount' => $history->yield_amount !== null ? (float) $history->yield_amount : null,
            'yield_unit' => $history->yield_unit,
            'status' => $history->status,
            'catatan' => $history->note,
            'note' => $history->note,
        ];
    }
}
