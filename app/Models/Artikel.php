<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Artikel extends Model
{
    use HasFactory;

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
        'jumlah_dilihat' => 'integer',
    ];

    /**
     * Get the kategori associated with the artikel.
     */
    public function kategori(): BelongsToMany
    {
        return $this->belongsToMany(Kategori::class, 'artikel_kategori', 'artikel_id', 'kategori_id')
            ->withTimestamps();
    }

    /**
     * Scope untuk artikel yang sudah diterbitkan
     */
    public function scopePublished($query)
    {
        return $query->where('status', 'terbit')
            ->whereNotNull('diterbitkan_pada')
            ->where('diterbitkan_pada', '<=', now());
    }

    /**
     * Scope untuk artikel draf
     */
    public function scopeDraft($query)
    {
        return $query->where('status', 'draf');
    }

    /**
     * Scope untuk artikel diarsipkan
     */
    public function scopeArchived($query)
    {
        return $query->where('status', 'arsip');
    }

    /**
     * Increment jumlah dilihat
     */
    public function incrementViews()
    {
        $this->increment('jumlah_dilihat');
    }
}
