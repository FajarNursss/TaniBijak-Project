<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('crop_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lahan_id')->nullable()->constrained('lahans')->nullOnDelete();
            $table->string('tanaman');
            $table->date('started_at');
            $table->date('finished_at')->nullable();
            $table->decimal('yield_amount', 8, 2)->nullable();
            $table->string('yield_unit')->default('ton');
            $table->string('status');
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('crop_histories');
    }
};
