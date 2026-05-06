<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recommendations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('lahan_id')->nullable()->constrained('lahans')->nullOnDelete();
            $table->string('tanaman');
            $table->unsignedTinyInteger('skor')->default(0);
            $table->string('musim')->nullable();
            $table->string('suhu')->nullable();
            $table->string('curah_hujan')->nullable();
            $table->string('jenis_tanah')->nullable();
            $table->string('ph')->nullable();
            $table->text('alasan');
            $table->text('tips')->nullable();
            $table->string('kategori')->nullable();
            $table->boolean('featured')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recommendations');
    }
};
