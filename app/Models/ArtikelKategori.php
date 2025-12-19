<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ArtikelKategori extends Pivot
{
    protected $table = 'artikel_kategori';
    
    protected $fillable = [
        'kategori_id',
        'artikel_id',
    ];

    // Jika ingin menggunakan timestamps di pivot table
    public $timestamps = true;
}