<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::withCount('lahans')->latest();

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }

        return response()->json([
            'data' => $query->get()->map(fn (User $user) => $this->payload($user)),
        ]);
    }

    public function show(User $user)
    {
        return response()->json(['data' => $this->payload($user->loadCount('lahans'))]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'password' => ['required', 'string', 'min:6'],
            'role' => ['nullable', Rule::in(['admin', 'user'])],
            'location' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::in(['aktif', 'nonaktif'])],
        ]);

        $user = User::create($data);

        return response()->json(['data' => $this->payload($user->loadCount('lahans'))], 201);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:6'],
            'role' => ['nullable', Rule::in(['admin', 'user'])],
            'location' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::in(['aktif', 'nonaktif'])],
        ]);

        if (empty($data['password'])) {
            unset($data['password']);
        }

        $user->update($data);

        return response()->json(['data' => $this->payload($user->fresh()->loadCount('lahans'))]);
    }

    public function destroy(User $user)
    {
        $user->delete();

        return response()->json(['message' => 'User berhasil dihapus.']);
    }

    private function payload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'location' => $user->location,
            'status' => $user->status,
            'lahan' => $user->lahans_count ?? $user->lahans()->count(),
            'joined' => optional($user->created_at)->format('d M Y'),
        ];
    }
}
