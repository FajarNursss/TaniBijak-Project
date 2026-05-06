<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lahan;
use App\Models\User;
use Illuminate\Http\Request;

class LahanController extends Controller
{
    public function mine(Request $request)
    {
        return response()->json([
            'data' => $request->user()->lahans()->latest()->get()->map(fn (Lahan $lahan) => $this->payload($lahan)),
        ]);
    }

    public function adminIndex(Request $request)
    {
        $query = Lahan::with('user')->latest();

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('lokasi', 'like', "%{$search}%");
            });
        }

        return response()->json([
            'data' => $query->get()->map(fn (Lahan $lahan) => $this->payload($lahan)),
        ]);
    }

    public function show(Request $request, Lahan $lahan)
    {
        $this->authorizeAccess($request->user(), $lahan);

        return response()->json(['data' => $this->payload($lahan->load('user'))]);
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['user_id'] = $request->user()->id;

        $lahan = Lahan::create($data);

        return response()->json(['data' => $this->payload($lahan->load('user'))], 201);
    }

    public function update(Request $request, Lahan $lahan)
    {
        $this->authorizeAccess($request->user(), $lahan);
        $lahan->update($this->validated($request, false));

        return response()->json(['data' => $this->payload($lahan->fresh()->load('user'))]);
    }

    public function destroy(Request $request, Lahan $lahan)
    {
        $this->authorizeAccess($request->user(), $lahan);
        $lahan->delete();

        return response()->json(['message' => 'Lahan berhasil dihapus.']);
    }

    public function rekomendasi(Request $request, Lahan $lahan)
    {
        $this->authorizeAccess($request->user(), $lahan);

        return response()->json([
            'data' => [
                'lahan' => $this->payload($lahan),
                'tanaman' => $lahan->tanaman ?: 'Padi IR64',
                'skor' => 86,
                'alasan' => 'Kondisi lahan dan cuaca saat ini mendukung untuk fase tanam berikutnya.',
                'rekomendasi' => [
                    'Pantau kelembaban tanah setiap pagi.',
                    'Gunakan pupuk organik sebelum pemupukan NPK.',
                    'Periksa drainase jika prakiraan hujan meningkat.',
                ],
            ],
        ]);
    }

    private function validated(Request $request, bool $creating = true): array
    {
        return $request->validate([
            'nama' => [$creating ? 'required' : 'sometimes', 'string', 'max:255'],
            'lokasi' => ['nullable', 'string', 'max:255'],
            'luas' => ['nullable', 'numeric', 'min:0'],
            'jenis_tanah' => ['nullable', 'string', 'max:255'],
            'tanaman' => ['nullable', 'string', 'max:255'],
            'kondisi' => ['nullable', 'string', 'max:255'],
            'catatan' => ['nullable', 'string'],
        ]);
    }

    private function authorizeAccess(User $user, Lahan $lahan): void
    {
        abort_if($user->role !== 'admin' && $lahan->user_id !== $user->id, 403, 'Anda tidak memiliki akses ke lahan ini.');
    }

    private function payload(Lahan $lahan): array
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
