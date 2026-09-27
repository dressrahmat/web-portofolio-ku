<?php

namespace App\Models;

use App\Traits\Auditable;
use App\Traits\HasVisibilityAndOrder;
use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    use Auditable, HasVisibilityAndOrder;

    protected $table = 'educations';

    protected $fillable = [
        'institution', 'degree', 'field_of_study', 'location', 'start_year',
        'end_year', 'grade', 'description', 'is_visible', 'sort_order',
    ];

    protected $casts = ['is_visible' => 'boolean'];

    protected $appends = ['period'];

    public function getPeriodAttribute(): string
    {
        if (! $this->start_year && ! $this->end_year) {
            return '';
        }

        return trim(($this->start_year ?? '').' – '.($this->end_year ?: 'Sekarang'), ' –');
    }
}
