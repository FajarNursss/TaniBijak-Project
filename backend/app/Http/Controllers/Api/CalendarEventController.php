<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CalendarEvent;
use Illuminate\Http\Request;

class CalendarEventController extends Controller
{
    public function index(Request $request)
    {
        $query = CalendarEvent::with('lahan')->orderBy('event_date');

        if ($request->user()->role !== 'admin') {
            $query->where('user_id', $request->user()->id);
        }

        return response()->json([
            'data' => $query->get()->map(fn (CalendarEvent $e) => [
                'id' => $e->id,
                'date' => $e->event_date?->toDateString(),
                'jenis' => $e->kind,
                'label' => $e->label,
                'lahan' => $e->lahan?->nama,
                'status' => $e->status,
            ]),
        ]);
    }
}
