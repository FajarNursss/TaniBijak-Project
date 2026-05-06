<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CropHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'lahan_id',
        'tanaman',
        'started_at',
        'finished_at',
        'yield_amount',
        'yield_unit',
        'status',
        'note',
    ];

    protected $casts = [
        'started_at' => 'date',
        'finished_at' => 'date',
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
