<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

/**
 * Scope umum untuk item CV yang bisa disembunyikan dan diurutkan.
 */
trait HasVisibilityAndOrder
{
    public function scopeVisible(Builder $query): Builder
    {
        return $query->where('is_visible', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('id');
    }

    public static function nextSortOrder(): int
    {
        return (int) static::max('sort_order') + 1;
    }
}
