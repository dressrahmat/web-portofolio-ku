<?php

namespace App\Models;

use App\Traits\Auditable;
use App\Traits\HasVisibilityAndOrder;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use Auditable, HasVisibilityAndOrder;

    protected $fillable = ['title', 'icon', 'description', 'items', 'price_note', 'is_visible', 'sort_order'];

    protected $casts = [
        'items' => 'array',
        'is_visible' => 'boolean',
    ];
}
