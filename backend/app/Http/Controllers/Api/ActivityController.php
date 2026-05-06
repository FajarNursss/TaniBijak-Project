<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        $query = ActivityLog::latest();

        if ($request->user()->role !== 'admin') {
            $query->where('user_id', $request->user()->id);
        }

        return response()->json([
            'data' => $query->get()->map(fn (ActivityLog $a) => [
                'id' => $a->id,
                'user' => $a->user_name,
                'role' => $a->role,
                'action' => $a->action,
                'ip' => $a->ip_address,
                'time' => $a->created_at?->format('d M Y H:i'),
                'status' => $a->status,
            ]),
        ]);
    }
}
