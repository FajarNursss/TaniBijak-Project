<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CalendarEvent;
use App\Models\Lahan;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CalendarEventController extends Controller
{
    public function index(Request $request)
    {
        $query = CalendarEvent::with('lahan')->orderBy('event_date');

        if ($request->user()->role !== 'admin') {
            $query->where('user_id', $request->user()->id);
        }

        return response()->json([
            'data' => $query->get()->map(fn (CalendarEvent $event) => $this->payload($event)),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'event_date' => ['required', 'date'],
            'kind' => ['required', Rule::in(['tanam', 'pupuk', 'hama', 'irigasi', 'panen'])],
            'label' => ['required', 'string', 'max:255'],
            'status' => ['nullable', 'string', 'max:255'],
            'lahan_id' => ['nullable', 'integer', 'exists:lahans,id'],
        ]);

        if (! empty($data['lahan_id']) && $request->user()->role !== 'admin') {
            abort_unless(
                Lahan::query()
                    ->where('id', $data['lahan_id'])
                    ->where('user_id', $request->user()->id)
                    ->exists(),
                403,
                'Anda tidak memiliki akses ke lahan ini.'
            );
        }

        $event = CalendarEvent::create([
            ...$data,
            'user_id' => $request->user()->id,
        ]);

        return response()->json([
            'data' => $this->payload($event->load('lahan')),
        ], 201);
    }

    private function payload(CalendarEvent $event): array
    {
        return [
            'id' => $event->id,
            'date' => $event->event_date?->toDateString(),
            'event_date' => $event->event_date?->toDateString(),
            'jenis' => $event->kind,
            'kind' => $event->kind,
            'label' => $event->label,
            'lahan' => $event->lahan?->nama,
            'lahan_id' => $event->lahan_id,
            'status' => $event->status,
        ];
    }
}
