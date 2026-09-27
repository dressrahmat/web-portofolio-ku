<?php

namespace App\Models;

use App\Traits\Auditable;
use App\Traits\HasVisibilityAndOrder;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use Auditable, HasVisibilityAndOrder;

    protected $fillable = ['name', 'category', 'level', 'is_featured', 'is_visible', 'sort_order'];

    protected $casts = [
        'level' => 'integer',
        'is_featured' => 'boolean',
        'is_visible' => 'boolean',
    ];
}
