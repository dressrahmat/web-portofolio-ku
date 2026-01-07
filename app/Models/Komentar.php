<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Komentar extends Model
{
    use HasFactory;

    // Tentukan nama tabel secara eksplisit
    protected $table = 'komentar';

    protected $fillable = [
        'artikel_id',
        'induk_id',
        'nama',
        'email',
        'konten',
        'disetujui',
    ];

    protected $casts = [
        'disetujui' => 'boolean',
    ];

    public function artikel()
    {
        return $this->belongsTo(Artikel::class, 'artikel_id');
    }

    public function induk()
    {
        return $this->belongsTo(Komentar::class, 'induk_id');
    }

    public function balasan()
    {
        return $this->hasMany(Komentar::class, 'induk_id');
    }
}
