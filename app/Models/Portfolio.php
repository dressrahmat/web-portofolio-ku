<?php

// app/Models/Portfolio.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Support\Media;
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
        'role',
        'results',
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

    protected $appends = ['featured_image_url', 'results_list'];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($portfolio) {
            if (empty($portfolio->slug)) {
                $portfolio->slug = static::uniqueSlug($portfolio->title);
            }
        });
    }

    /**
     * Buat slug unik (menambahkan -2, -3, ... bila sudah dipakai).
     */
    public static function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title) ?: 'portofolio';
        $slug = $base;
        $i = 2;

        while (static::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
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
            return Media::url($this->featured_image);
        }

        // Fallback ke gambar galeri pertama (primary lebih dulu)
        if ($this->relationLoaded('images') && $this->images->isNotEmpty()) {
            $img = $this->images->firstWhere('is_primary', true) ?? $this->images->first();

            return $img->image_url;
        }

        return null;
    }

    public function getResultsListAttribute(): array
    {
        return collect(preg_split('/\r\n|\r|\n/', (string) $this->results))
            ->map(fn ($line) => trim(ltrim(trim($line), '-•*')))
            ->filter()
            ->values()
            ->all();
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
