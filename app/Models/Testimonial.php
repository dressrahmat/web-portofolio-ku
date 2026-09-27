<?php

namespace App\Models;

use App\Support\Media;
use App\Traits\Auditable;
use App\Traits\HasVisibilityAndOrder;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use Auditable, HasVisibilityAndOrder;

    protected $fillable = ['name', 'role', 'company', 'content', 'photo', 'rating', 'is_visible', 'sort_order'];

    protected $casts = [
        'rating' => 'integer',
        'is_visible' => 'boolean',
    ];

    protected $appends = ['photo_url'];

    public function getPhotoUrlAttribute(): ?string
    {
        return Media::url($this->photo);
    }
}
