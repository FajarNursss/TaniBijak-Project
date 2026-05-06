<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LocalWisdom;
use Illuminate\Http\Request;

class LocalWisdomController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => LocalWisdom::latest()->get()->map(fn (LocalWisdom $w) => $this->payload($w)),
        ]);
    }

    public function adminIndex()
    {
        return $this->index();
    }

    public function store(Request $request)
    {
        $data = $this->validatePayload($request);
        $wisdom = LocalWisdom::create($data);

        return response()->json(['data' => $this->payload($wisdom)], 201);
    }

    public function update(Request $request, LocalWisdom $localWisdom)
    {
        $localWisdom->update($this->validatePayload($request));

        return response()->json(['data' => $this->payload($localWisdom->fresh())]);
    }

    public function destroy(LocalWisdom $localWisdom)
    {
        $localWisdom->delete();

        return response()->json(['message' => 'Kearifan lokal berhasil dihapus.']);
    }

    private function validatePayload(Request $request): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'region' => ['required', 'string', 'max:255'],
            'relevance' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'benefits' => ['required', 'array'],
            'crops' => ['required', 'array'],
            'status' => ['required', 'string', 'max:255'],
            'icon' => ['nullable', 'string', 'max:255'],
        ]);
    }

    private function payload(LocalWisdom $w): array
    {
        return [
            'id' => $w->id,
            'judul' => $w->title,
            'kategori' => $w->category,
            'daerah' => $w->region,
            'relevansi' => $w->relevance,
            'icon' => $w->icon,
            'deskripsi' => $w->description,
            'manfaat' => $w->benefits,
            'tanaman' => $w->crops,
            'status' => $w->status,
        ];
    }
}
