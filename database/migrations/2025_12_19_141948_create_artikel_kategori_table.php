<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('artikel_kategori', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kategori_id')
                ->nullable()
                ->constrained('kategori')
                ->onDelete('cascade');
            $table->foreignId('artikel_id')
                ->nullable()
                ->constrained('artikel')
                ->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('artikel_kategori');
    }
};
