<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('komentar', function (Blueprint $table) {
            $table->id();
            $table->foreignId('artikel_id')
                  ->nullable()
                  ->constrained('artikel')
                  ->onDelete('cascade');
            $table->foreignId('induk_id')
                  ->nullable()
                  ->constrained('komentar')
                  ->onDelete('cascade');
            $table->string('nama', 255);
            $table->string('email', 255);
            $table->text('konten')->nullable();
            $table->boolean('disetujui')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('komentar');
    }
};