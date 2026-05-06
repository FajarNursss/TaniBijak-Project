<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FarmNotification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $notifications = FarmNotification::query()
            ->where(function ($q) use ($request) {
                $q->whereNull('user_id')->orWhere('user_id', $request->user()->id);
            })
            ->latest()
            ->get();

        return response()->json([
            'data' => $notifications->map(fn (FarmNotification $n) => [
                'id' => $n->id,
                'type' => $n->type,
                'title' => $n->title,
                'message' => $n->message,
                'read' => $n->read,
                'time' => $n->time,
            ]),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => ['required', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
        ]);

        $notif = FarmNotification::create($data);

        return response()->json(['data' => $this->payload($notif)], 201);
    }

    public function markAsRead(FarmNotification $notification)
    {
        $notification->update(['read_at' => now()]);

        return response()->json(['data' => $this->payload($notification->fresh())]);
    }

    public function markAllRead(Request $request)
    {
        FarmNotification::where(function ($q) use ($request) {
            $q->whereNull('user_id')->orWhere('user_id', $request->user()->id);
        })->update(['read_at' => now()]);

        return response()->json(['message' => 'Semua notifikasi ditandai dibaca.']);
    }

    public function destroy(FarmNotification $notification)
    {
        $notification->delete();

        return response()->json(['message' => 'Notifikasi dihapus.']);
    }

    private function payload(FarmNotification $n): array
    {
        return [
            'id' => $n->id,
            'type' => $n->type,
            'title' => $n->title,
            'message' => $n->message,
            'read' => $n->read,
            'time' => $n->time,
        ];
    }
}
