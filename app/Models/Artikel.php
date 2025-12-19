<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Artikel extends Model
{
    use HasFactory;

    // Tentukan nama tabel secara eksplisit
    protected $table = 'artikel';
    
    protected $fillable = [
        'judul',
        'slug',
        'konten',
        'gambar_utama',
        'status',
        'diterbitkan_pada',
        'jumlah_dilihat',
        'meta_judul',
        'meta_deskripsi',
    ];

    protected $casts = [
        'diterbitkan_pada' => 'date',
        'disetujui' => 'boolean',
    ];

    public function kategoris()
    {
        return $this->belongsToMany(Kategori::class, 'artikel_kategori');
    }

    public function komentars()
    {
        return $this->hasMany(Komentar::class, 'artikel_id');
    }

    public function komentarUtama()
    {
        return $this->hasMany(Komentar::class, 'artikel_id')->whereNull('induk_id');
    }
}