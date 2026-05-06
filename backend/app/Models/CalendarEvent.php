<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CalendarEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'lahan_id',
        'event_date',
        'kind',
        'label',
        'status',
    ];

    protected $casts = [
        'event_date' => 'date',
    ];

    public function lahan()
    {
        return $this->belongsTo(Lahan::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
