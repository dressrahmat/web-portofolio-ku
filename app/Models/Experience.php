<?php

namespace App\Models;

use App\Traits\Auditable;
use App\Traits\HasVisibilityAndOrder;
use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    use Auditable, HasVisibilityAndOrder;

    public const TYPES = [
        'work' => 'Pekerjaan',
        'freelance' => 'Freelance / Proyek',
        'organization' => 'Organisasi',
        'volunteer' => 'Relawan',
    ];

    protected $fillable = [
        'type', 'position', 'organization', 'organization_url', 'location',
        'start_date', 'end_date', 'is_current', 'description', 'highlights',
        'is_visible', 'sort_order',
    ];

    protected $casts = [
        'start_date' => 'date:Y-m-d',
        'end_date' => 'date:Y-m-d',
        'is_current' => 'boolean',
        'is_visible' => 'boolean',
        'highlights' => 'array',
    ];

    protected $appends = ['type_label', 'period'];

    public function getTypeLabelAttribute(): string
    {
        return self::TYPES[$this->type] ?? ucfirst((string) $this->type);
    }

    public function getPeriodAttribute(): string
    {
        $start = $this->start_date?->translatedFormat('M Y');
        $end = $this->is_current || ! $this->end_date ? 'Sekarang' : $this->end_date->translatedFormat('M Y');

        return trim("{$start} – {$end}", ' –');
    }
}
