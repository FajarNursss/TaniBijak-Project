<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WeatherForecast extends Model
{
    use HasFactory;

    protected $fillable = [
        'weather_snapshot_id',
        'forecast_date',
        'day_name',
        'temp_min',
        'temp_max',
        'rain_chance',
        'condition',
    ];

    protected $casts = [
        'forecast_date' => 'date',
    ];

    public function snapshot()
    {
        return $this->belongsTo(WeatherSnapshot::class, 'weather_snapshot_id');
    }
}
