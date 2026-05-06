<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('weather_snapshots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('location');
            $table->decimal('temperature', 5, 2);
            $table->decimal('feels_like', 5, 2)->nullable();
            $table->unsignedSmallInteger('humidity')->default(0);
            $table->unsignedSmallInteger('wind_speed')->default(0);
            $table->unsignedSmallInteger('visibility')->nullable();
            $table->unsignedSmallInteger('pressure')->nullable();
            $table->string('condition');
            $table->unsignedSmallInteger('rain_chance')->default(0);
            $table->timestamp('observed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('weather_snapshots');
    }
};
