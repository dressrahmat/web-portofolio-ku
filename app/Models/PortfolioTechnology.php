<?php

// app/Models/PortfolioTechnology.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PortfolioTechnology extends Model
{
    use HasFactory;

    protected $fillable = [
        'portfolio_id',
        'technology',
        'icon',
    ];

    public function portfolio(): BelongsTo
    {
        return $this->belongsTo(Portfolio::class);
    }
}
