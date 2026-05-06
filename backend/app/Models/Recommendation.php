<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Recommendation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'lahan_id',
        'tanaman',
        'skor',
        'musim',
        'suhu',
        'curah_hujan',
        'jenis_tanah',
        'ph',
        'alasan',
        'tips',
        'kategori',
        'featured',
    ];

    protected $casts = [
        'featured' => 'boolean',
    ];
}
