<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('artikel', function (Blueprint $table) {
            $table->id();
            $table->string('judul', 255);
            $table->string('slug', 255)->unique();
            $table->text('konten')->nullable();            $table->string('gambar_utama', 255);
            $table->enum('status', ['draf', 'terbit', 'arsip'])->default('draf');
            $table->date('diterbitkan_pada')->nullable();
            $table->integer('jumlah_dilihat')->default(0);
            $table->string('meta_judul', 255)->nullable();
            $table->string('meta_deskripsi', 255)->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('artikel');
    }
};