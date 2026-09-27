<?php

namespace App\Support;

use Illuminate\Support\Str;

/**
 * Helper untuk mengubah path file tersimpan menjadi URL publik.
 * - URL penuh (http/https) dikembalikan apa adanya
 * - Path yang diawali "assets/" dianggap berada di folder public/
 * - Selain itu dianggap berada di disk "public" (storage/app/public)
 */
class Media
{
    public static function url(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        if (Str::startsWith($path, ['http://', 'https://', '//'])) {
            return $path;
        }

        if (Str::startsWith($path, ['assets/', '/assets/'])) {
            return asset(ltrim($path, '/'));
        }

        return asset('storage/'.ltrim($path, '/'));
    }
}
