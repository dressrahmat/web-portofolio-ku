<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Kategori extends Model
{
    use HasFactory;

    // Tentukan nama tabel secara eksplisit
    protected $table = 'kategori';
    
    protected $fillable = [
        'nama',
        'slug',
        'deskripsi',
    ];

    // Nonaktifkan timestamps otomatis jika tidak diperlukan
    // public $timestamps = false;

    public function artikels()
    {
        return $this->belongsToMany(Artikel::class, 'artikel_kategori');
    }
}