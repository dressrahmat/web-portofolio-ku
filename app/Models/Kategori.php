<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Kategori extends Model
{
    use HasFactory;
    protected $table = 'kategori';

    protected $fillable = [
        'nama',
        'slug',
        'deskripsi',
    ];

    /**
     * Get the artikel associated with the kategori.
     */
    public function artikel(): BelongsToMany
    {
        return $this->belongsToMany(Artikel::class, 'artikel_kategori', 'kategori_id', 'artikel_id')
            ->withTimestamps();
    }
}