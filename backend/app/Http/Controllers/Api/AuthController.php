<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password tidak valid.'],
            ]);
        }

        if ($user->status !== 'aktif') {
            return response()->json(['message' => 'Akun tidak aktif.'], 403);
        }

        return response()->json([
            'message' => 'Login berhasil.',
            'token' => $user->createToken('tanibijak-react')->plainTextToken,
            'user' => $this->userPayload($user),
        ]);
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'location' => ['nullable', 'string', 'max:255'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'location' => $data['location'] ?? null,
            'password' => $data['password'],
            'role' => 'user',
            'status' => 'aktif',
        ]);

        return response()->json([
            'message' => 'Registrasi berhasil.',
            'token' => $user->createToken('tanibijak-react')->plainTextToken,
            'user' => $this->userPayload($user),
        ], 201);
    }

    public function logout(Request $request)
    {
        $request->user()?->currentAccessToken()?->delete();

        return response()->json(['message' => 'Logout berhasil.']);
    }

    public function profile(Request $request)
    {
        return response()->json(['user' => $this->userPayload($request->user())]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'location' => ['nullable', 'string', 'max:255'],
        ]);

        $user->update($data);

        return response()->json([
            'message' => 'Profil berhasil diperbarui.',
            'user' => $this->userPayload($user->fresh()),
        ]);
    }

    public function changePassword(Request $request)
    {
        $data = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        if (! Hash::check($data['current_password'], $request->user()->password)) {
            return response()->json(['message' => 'Password lama tidak sesuai.'], 422);
        }

        $request->user()->update(['password' => $data['password']]);

        return response()->json(['message' => 'Password berhasil diperbarui.']);
    }

    private function userPayload(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'location' => $user->location,
            'status' => $user->status,
            'joined' => optional($user->created_at)->format('d M Y'),
        ];
    }
}
