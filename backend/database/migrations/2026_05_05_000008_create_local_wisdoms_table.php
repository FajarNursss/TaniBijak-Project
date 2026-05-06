<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('local_wisdoms', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category');
            $table->string('region');
            $table->string('relevance');
            $table->text('description');
            $table->json('benefits');
            $table->json('crops');
            $table->string('status')->default('aktif');
            $table->string('icon')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('local_wisdoms');
    }
};
