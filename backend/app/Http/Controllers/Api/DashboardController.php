<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\CalendarEvent;
use App\Models\CropHistory;
use App\Models\FarmNotification;
use App\Models\LocalWisdom;
use App\Models\Recommendation;
use App\Models\WeatherSnapshot;
use App\Models\Lahan;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function user(Request $request)
    {
        $user = $request->user();
        $lahan = $user->lahans();
        $snapshot = WeatherSnapshot::latest('observed_at')->first();
        $recommendations = Recommendation::query()
            ->where(fn ($q) => $q->whereNull('user_id')->orWhere('user_id', $user->id))
            ->orderByDesc('featured')
            ->orderByDesc('skor')
            ->limit(3)
            ->get();
        $activities = ActivityLog::query()
            ->where(fn ($q) => $q->whereNull('user_id')->orWhere('user_id', $user->id))
            ->latest()
            ->limit(4)
            ->get();
        $notifications = FarmNotification::query()
            ->where(fn ($q) => $q->whereNull('user_id')->orWhere('user_id', $user->id))
            ->latest()
            ->limit(4)
            ->get();

        return response()->json([
            'data' => [
                'total_lahan' => $lahan->count(),
                'total_luas' => (float) $lahan->sum('luas'),
                'kondisi_baik' => (clone $lahan)->where('kondisi', 'baik')->count(),
                'perlu_perhatian' => (clone $lahan)->where('kondisi', '!=', 'baik')->count(),
                'tanaman_aktif' => $lahan->whereNotNull('tanaman')->count(),
                'riwayat_tanam' => CropHistory::where('user_id', $user->id)->count(),
                'weather' => $snapshot ? [
                    'location' => $snapshot->location,
                    'temp' => (float) $snapshot->temperature,
                    'humidity' => (int) $snapshot->humidity,
                    'windSpeed' => (int) $snapshot->wind_speed,
                    'condition' => $snapshot->condition,
                    'rain' => $snapshot->rain_chance . '%',
                ] : null,
                'recommendations' => $recommendations->map(fn ($r) => [
                    'id' => $r->id,
                    'tanaman' => $r->tanaman,
                    'skor' => (int) $r->skor,
                    'alasan' => $r->alasan,
                ]),
                'activities' => $activities->map(fn ($a) => [
                    'id' => $a->id,
                    'action' => $a->action,
                    'lahan' => $a->user_name,
                    'date' => $a->created_at?->format('d M Y'),
                    'status' => $a->status,
                ]),
                'notifications' => $notifications->map(fn ($n) => [
                    'id' => $n->id,
                    'type' => $n->type,
                    'title' => $n->title,
                    'message' => $n->message,
                    'read' => $n->read,
                    'time' => $n->time,
                ]),
                'unread_count' => $notifications->where('read', false)->count(),
            ],
        ]);
    }

    public function admin()
    {
        $recentUsers = User::latest()->limit(5)->get()->map(fn (User $user) => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'status' => $user->status,
            'joined' => $user->created_at?->format('d M Y'),
        ]);
        $recentActivity = ActivityLog::latest()->limit(4)->get()->map(fn ($a) => [
            'user' => $a->user_name,
            'action' => $a->action,
            'time' => $a->created_at?->diffForHumans(),
        ]);

        return response()->json([
            'data' => [
                'total_user' => User::count(),
                'total_lahan' => Lahan::count(),
                'user_aktif' => User::where('status', 'aktif')->count(),
                'total_luas' => (float) Lahan::sum('luas'),
                'notifikasi_aktif' => FarmNotification::whereNull('read_at')->count(),
                'kearifan_lokal' => LocalWisdom::count(),
                'recent_users' => $recentUsers,
                'recent_activity' => $recentActivity,
            ],
        ]);
    }
}
