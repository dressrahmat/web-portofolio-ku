<?php

// app/Models/PortfolioFeature.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PortfolioFeature extends Model
{
    use HasFactory;

    protected $fillable = [
        'portfolio_id',
        'feature',
        'description',
    ];

    public function portfolio(): BelongsTo
    {
        return $this->belongsTo(Portfolio::class);
    }
}
