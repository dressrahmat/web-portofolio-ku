<?php

// app/Models/Portfolio.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Portfolio extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'short_description',
        'category',
        'client_name',
        'project_date',
        'project_url',
        'github_url',
        'featured_image',
        'highlight',
        'status',
        'sort_order',
    ];

    protected $casts = [
        'project_date' => 'date',
        'highlight' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($portfolio) {
            if (empty($portfolio->slug)) {
                $portfolio->slug = Str::slug($portfolio->title);
            }
        });

        static::updating(function ($portfolio) {
            if ($portfolio->isDirty('title') && empty($portfolio->slug)) {
                $portfolio->slug = Str::slug($portfolio->title);
            }
        });
    }

    // Relationships
    public function technologies(): HasMany
    {
        return $this->hasMany(PortfolioTechnology::class)->orderBy('technology');
    }

    public function features(): HasMany
    {
        return $this->hasMany(PortfolioFeature::class)->orderBy('feature');
    }

    public function images(): HasMany
    {
        return $this->hasMany(PortfolioImage::class)->orderBy('sort_order');
    }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeHighlighted($query)
    {
        return $query->where('highlight', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('created_at', 'desc');
    }

    // Accessors
    public function getFeaturedImageUrlAttribute()
    {
        if ($this->featured_image) {
            return asset('storage/'.$this->featured_image);
        }

        return asset('images/portfolio-placeholder.jpg');
    }

    public function getProjectDateFormattedAttribute()
    {
        return $this->project_date?->format('F Y');
    }

    public function getTechnologiesListAttribute()
    {
        return $this->technologies->pluck('technology')->toArray();
    }

    public function getFeaturesListAttribute()
    {
        return $this->features->pluck('feature')->toArray();
    }
}
