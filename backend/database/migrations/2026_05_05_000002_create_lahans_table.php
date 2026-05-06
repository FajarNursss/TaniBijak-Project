<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lahans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('nama');
            $table->string('lokasi')->nullable();
            $table->decimal('luas', 8, 2)->default(0);
            $table->string('jenis_tanah')->nullable();
            $table->string('tanaman')->nullable();
            $table->string('kondisi')->default('baik');
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lahans');
    }
};
