<?php

namespace App\Models;

use App\Support\Media;
use App\Traits\Auditable;
use App\Traits\HasVisibilityAndOrder;
use Illuminate\Database\Eloquent\Model;

class Achievement extends Model
{
    use Auditable, HasVisibilityAndOrder;

    public const TYPES = [
        'certificate' => 'Sertifikat',
        'award' => 'Penghargaan',
        'other' => 'Pencapaian Lain',
    ];

    protected $fillable = [
        'type', 'title', 'issuer', 'issued_at', 'credential_id', 'credential_url',
        'description', 'image', 'is_visible', 'sort_order',
    ];

    protected $casts = [
        'issued_at' => 'date:Y-m-d',
        'is_visible' => 'boolean',
    ];

    protected $appends = ['type_label', 'image_url', 'issued_label'];

    public function getTypeLabelAttribute(): string
    {
        return self::TYPES[$this->type] ?? ucfirst((string) $this->type);
    }

    public function getImageUrlAttribute(): ?string
    {
        return Media::url($this->image);
    }

    public function getIssuedLabelAttribute(): ?string
    {
        return $this->issued_at?->translatedFormat('M Y');
    }
}
