<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('portfolio_technologies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('portfolio_id')->constrained()->onDelete('cascade');
            $table->string('technology');
            $table->string('icon')->nullable();
            $table->timestamps();
            
            $table->index('portfolio_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('portfolio_technologies');
    }
};