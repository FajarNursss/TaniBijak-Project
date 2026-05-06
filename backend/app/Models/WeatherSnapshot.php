<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WeatherSnapshot extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'location',
        'temperature',
        'feels_like',
        'humidity',
        'wind_speed',
        'visibility',
        'pressure',
        'condition',
        'rain_chance',
        'observed_at',
    ];

    protected $casts = [
        'observed_at' => 'datetime',
    ];

    public function forecasts()
    {
        return $this->hasMany(WeatherForecast::class);
    }
}
