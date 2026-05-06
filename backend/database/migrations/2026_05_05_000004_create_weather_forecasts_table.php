<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('weather_forecasts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('weather_snapshot_id')->nullable()->constrained('weather_snapshots')->nullOnDelete();
            $table->date('forecast_date');
            $table->string('day_name');
            $table->decimal('temp_min', 5, 2);
            $table->decimal('temp_max', 5, 2);
            $table->unsignedSmallInteger('rain_chance')->default(0);
            $table->string('condition');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('weather_forecasts');
    }
};
