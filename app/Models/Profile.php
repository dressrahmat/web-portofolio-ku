<?php

namespace App\Models;

use App\Support\Media;
use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Profile extends Model
{
    use Auditable;

    public const CACHE_KEY = 'public_profile';

    protected $fillable = [
        'full_name', 'nickname', 'headline', 'tagline', 'short_bio', 'about',
        'photo', 'cv_file', 'location', 'email', 'phone', 'whatsapp', 'website',
        'github_url', 'linkedin_url', 'instagram_url', 'youtube_url', 'tiktok_url',
        'open_to_work', 'availability_text', 'hero_tags', 'stats',
    ];

    protected $casts = [
        'open_to_work' => 'boolean',
        'hero_tags' => 'array',
        'stats' => 'array',
    ];

    protected $appends = ['photo_url', 'cv_url', 'whatsapp_url'];

    protected static function booted(): void
    {
        static::saved(fn () => Cache::forget(self::CACHE_KEY));
        static::deleted(fn () => Cache::forget(self::CACHE_KEY));
    }

    /**
     * Ambil profil tunggal, buat default bila belum ada.
     */
    public static function current(): self
    {
        return static::first() ?? static::create([
            'full_name' => config('app.name', 'Nama Anda'),
            'headline' => 'Judul profesi Anda',
        ]);
    }

    /**
     * Data profil yang aman untuk dibagikan ke frontend publik (di-cache).
     */
    public static function publicData(): array
    {
        return Cache::remember(self::CACHE_KEY, 3600, function () {
            $p = static::first();

            return $p ? $p->toArray() : [];
        });
    }

    public function getPhotoUrlAttribute(): ?string
    {
        return Media::url($this->photo);
    }

    public function getCvUrlAttribute(): ?string
    {
        return $this->cv_file ? route('cv.download') : null;
    }

    public function getWhatsappUrlAttribute(): ?string
    {
        if (! $this->whatsapp) {
            return null;
        }

        $number = preg_replace('/\D+/', '', $this->whatsapp);
        if (str_starts_with($number, '0')) {
            $number = '62'.substr($number, 1);
        }

        return 'https://wa.me/'.$number;
    }
}
