<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArtikelKategori extends Model
{
    use HasFactory;

    protected $table = 'artikel_kategori';

    protected $fillable = [
        'kategori_id',
        'artikel_id',
    ];

    /**
     * Get the artikel associated with the pivot.
     */
    public function artikel()
    {
        return $this->belongsTo(Artikel::class);
    }

    /**
     * Get the kategori associated with the pivot.
     */
    public function kategori()
    {
        return $this->belongsTo(Kategori::class);
    }
}
