<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Portfolio;
use App\Models\PortfolioTechnology;
use App\Models\PortfolioFeature;
use App\Models\PortfolioImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PortofolioController extends Controller
{
    public function index(Request $request)
    {
        $authUser = auth()->user();
        
        // Ambil parameter dari request
        $search = $request->query('search');
        $category = $request->query('category');
        $status = $request->query('status');
        $highlight = $request->query('highlight');
        $sort = $request->query('sort', 'created_at');
        $direction = $request->query('direction', 'desc');
        $perPage = $request->query('per_page', 10);
        $tab = $request->query('tab', 'portfolios');

        // Validasi per_page
        $validPerPage = [5, 10, 15, 20];
        if (!in_array($perPage, $validPerPage)) {
            $perPage = 10;
        }

        // Validasi direction
        if (!in_array($direction, ['asc', 'desc'])) {
            $direction = 'desc';
        }

        // Validasi sort column
        $validSortColumns = ['title', 'category', 'status', 'created_at', 'sort_order'];
        if (!in_array($sort, $validSortColumns)) {
            $sort = 'created_at';
        }

        // Data untuk tab Portfolios
        $portfolios = Portfolio::with(['technologies', 'features', 'images'])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%")
                      ->orWhere('client_name', 'like', "%{$search}%");
                });
            })
            ->when($category, function ($query, $category) {
                $query->where('category', $category);
            })
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($highlight !== null, function ($query) use ($highlight) {
                $query->where('highlight', filter_var($highlight, FILTER_VALIDATE_BOOLEAN));
            })
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();

        // Data untuk tab Technologies
        $technologies = PortfolioTechnology::with('portfolio')
            ->when($search && $tab === 'technologies', function ($query) use ($search) {
                $query->where('technology', 'like', "%{$search}%");
            })
            ->orderBy('technology')
            ->paginate($perPage)
            ->withQueryString();

        // Data untuk tab Features
        $features = PortfolioFeature::with('portfolio')
            ->when($search && $tab === 'features', function ($query) use ($search) {
                $query->where('feature', 'like', "%{$search}%");
            })
            ->orderBy('feature')
            ->paginate($perPage)
            ->withQueryString();

        // Data untuk tab Images
        $images = PortfolioImage::with('portfolio')
            ->when($search && $tab === 'images', function ($query) use ($search) {
                $query->where('caption', 'like', "%{$search}%");
            })
            ->orderBy('sort_order')
            ->paginate($perPage)
            ->withQueryString();

        // Statistics
        $stats = [
            'total_portfolios' => Portfolio::count(),
            'published_portfolios' => Portfolio::where('status', 'published')->count(),
            'highlighted_portfolios' => Portfolio::where('highlight', true)->count(),
            'total_technologies' => PortfolioTechnology::distinct('technology')->count(),
        ];

        // Categories untuk filter
        $categories = Portfolio::distinct()->pluck('category');

        return Inertia::render('Admin/Portfolios/Index', [
            'portfolios' => $portfolios,
            'technologies' => $technologies,
            'features' => $features,
            'images' => $images,
            'stats' => $stats,
            'categories' => $categories,
            'filters' => $request->only(['search', 'category', 'status', 'highlight', 'sort', 'direction', 'per_page', 'tab']),
            'auth' => [
                'user' => [
                    'id' => $authUser->id,
                    'name' => $authUser->name,
                    'email' => $authUser->email,
                    'roles' => $authUser->getRoleNames()->toArray(),
                    'permissions' => $authUser->getAllPermissions()->pluck('name')->toArray(),
                ],
            ],
        ]);
    }

    public function create()
    {
        $authUser = auth()->user();

        return Inertia::render('Admin/Portfolios/Create', [
            'categories' => [
                'Fullstack Development',
                'Frontend Development', 
                'Backend Development',
                'Mobile Development',
                'Web Development',
            ],
            'auth' => [
                'user' => [
                    'id' => $authUser->id,
                    'name' => $authUser->name,
                    'email' => $authUser->email,
                    'roles' => $authUser->getRoleNames()->toArray(),
                    'permissions' => $authUser->getAllPermissions()->pluck('name')->toArray(),
                ],
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'short_description' => 'nullable|string|max:500',
            'category' => 'required|string|max:100',
            'client_name' => 'nullable|string|max:255',
            'project_date' => 'nullable|date',
            'project_url' => 'nullable|url|max:255',
            'github_url' => 'nullable|url|max:255',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'highlight' => 'boolean',
            'status' => 'required|in:draft,published,archived',
            'sort_order' => 'nullable|integer',
            'technologies' => 'nullable|array',
            'technologies.*' => 'string|max:100',
            'features' => 'nullable|array',
            'features.*' => 'string|max:255',
            'images' => 'nullable|array',
            'images.*.file' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120', // ubah jadi nullable
            'images.*.caption' => 'nullable|string|max:255',
            'images.*.is_primary' => 'boolean',
            'images.*.sort_order' => 'nullable|integer', // tambahkan ini
        ]);

        try {
            // Create portfolio
            $portfolioData = $request->only([
                'title', 'description', 'short_description', 'category', 
                'client_name', 'project_date', 'project_url', 'github_url',
                'highlight', 'status', 'sort_order'
            ]);

            // Generate slug
            $portfolioData['slug'] = Str::slug($request->title);

            // Handle featured image upload
            if ($request->hasFile('featured_image')) {
                $path = $request->file('featured_image')->store('portfolio/featured', 'public');
                $portfolioData['featured_image'] = $path;
            }

            $portfolio = Portfolio::create($portfolioData);

            // Create technologies
            if ($request->has('technologies')) {
                foreach ($request->technologies as $technology) {
                    if (!empty(trim($technology))) {
                        PortfolioTechnology::create([
                            'portfolio_id' => $portfolio->id,
                            'technology' => trim($technology)
                        ]);
                    }
                }
            }

            // Create features
            if ($request->has('features')) {
                foreach ($request->features as $feature) {
                    if (!empty(trim($feature))) {
                        PortfolioFeature::create([
                            'portfolio_id' => $portfolio->id,
                            'feature' => trim($feature)
                        ]);
                    }
                }
            }

            // Handle images upload - PERBAIKAN DI SINI
            if ($request->has('images')) {
                foreach ($request->images as $imageData) {
                    // Hanya proses jika ada file (image baru)
                    if (isset($imageData['file']) && $imageData['file'] instanceof \Illuminate\Http\UploadedFile) {
                        $path = $imageData['file']->store('portfolio/images', 'public');
                        
                        PortfolioImage::create([
                            'portfolio_id' => $portfolio->id,
                            'image_path' => $path,
                            'caption' => $imageData['caption'] ?? null,
                            'is_primary' => $imageData['is_primary'] ?? false,
                            'sort_order' => $imageData['sort_order'] ?? 0
                        ]);
                    }
                    // Jika tidak ada file tapi ada ID (image existing dari template), skip
                    // atau handle sesuai kebutuhan
                }
            }

            return redirect()->route('admin.portfolios.index')
                ->with('success', 'Portfolio created successfully.');

        } catch (\Exception $e) {
            \Log::error('Failed to create portfolio:', ['error' => $e->getMessage()]);
            return back()->with('error', 'Failed to create portfolio: ' . $e->getMessage());
        }
    }

    public function show(Portfolio $portfolio)
    {
        $authUser = auth()->user();
        $portfolio->load(['technologies', 'features', 'images']);

        return Inertia::render('Admin/Portfolios/Show', [
            'portfolio' => $portfolio,
            'auth' => [
                'user' => [
                    'id' => $authUser->id,
                    'name' => $authUser->name,
                    'email' => $authUser->email,
                    'roles' => $authUser->getRoleNames()->toArray(),
                    'permissions' => $authUser->getAllPermissions()->pluck('name')->toArray(),
                ],
            ],
        ]);
    }

    public function edit(Portfolio $portfolio)
    {
        $authUser = auth()->user();
        $portfolio->load(['technologies', 'features', 'images']);

        return Inertia::render('Admin/Portfolios/Edit', [
            'portfolio' => $portfolio,
            'categories' => [
                'Fullstack Development',
                'Frontend Development',
                'Backend Development', 
                'Mobile Development',
                'Web Development',
            ],
            'auth' => [
                'user' => [
                    'id' => $authUser->id,
                    'name' => $authUser->name,
                    'email' => $authUser->email,
                    'roles' => $authUser->getRoleNames()->toArray(),
                    'permissions' => $authUser->getAllPermissions()->pluck('name')->toArray(),
                ],
            ],
        ]);
    }

    public function update(Request $request, Portfolio $portfolio)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'short_description' => 'nullable|string|max:500',
            'category' => 'required|string|max:100',
            'client_name' => 'nullable|string|max:255',
            'project_date' => 'nullable|date',
            'project_url' => 'nullable|url|max:255',
            'github_url' => 'nullable|url|max:255',
            'featured_image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'remove_featured_image' => 'nullable|boolean',
            'highlight' => 'boolean',
            'status' => 'required|in:draft,published,archived',
            'sort_order' => 'nullable|integer',
            'technologies' => 'nullable|array',
            'technologies.*' => 'string|max:100',
            'features' => 'nullable|array',
            'features.*' => 'string|max:255',
            // Tambahkan validasi untuk images
            'images' => 'nullable|array',
            'images.*.file' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'images.*.caption' => 'nullable|string|max:255',
            'images.*.is_primary' => 'boolean',
            'images.*.sort_order' => 'nullable|integer',
            'deleted_images' => 'nullable|array', // untuk menghapus images yang dihapus
            'deleted_images.*' => 'exists:portfolio_images,id',
        ]);

        try {
            $portfolioData = $request->only([
                'title', 'description', 'short_description', 'category',
                'client_name', 'project_date', 'project_url', 'github_url', 
                'highlight', 'status', 'sort_order'
            ]);

            // Update slug jika title berubah
            if ($portfolio->title !== $request->title) {
                $portfolioData['slug'] = Str::slug($request->title);
            }

            // Handle featured image
            if ($request->hasFile('featured_image')) {
                // Delete old image
                if ($portfolio->featured_image) {
                    Storage::disk('public')->delete($portfolio->featured_image);
                }
                // Store new image
                $path = $request->file('featured_image')->store('portfolio/featured', 'public');
                $portfolioData['featured_image'] = $path;
            } elseif ($request->remove_featured_image && $portfolio->featured_image) {
                Storage::disk('public')->delete($portfolio->featured_image);
                $portfolioData['featured_image'] = null;
            }

            $portfolio->update($portfolioData);

            // Sync technologies
            if ($request->has('technologies')) {
                $portfolio->technologies()->delete();
                foreach ($request->technologies as $technology) {
                    if (!empty(trim($technology))) {
                        PortfolioTechnology::create([
                            'portfolio_id' => $portfolio->id,
                            'technology' => trim($technology)
                        ]);
                    }
                }
            }

            // Sync features
            if ($request->has('features')) {
                $portfolio->features()->delete();
                foreach ($request->features as $feature) {
                    if (!empty(trim($feature))) {
                        PortfolioFeature::create([
                            'portfolio_id' => $portfolio->id,
                            'feature' => trim($feature)
                        ]);
                    }
                }
            }

            // Handle deleted images
            if ($request->has('deleted_images')) {
                $imagesToDelete = PortfolioImage::whereIn('id', $request->deleted_images)->get();
                foreach ($imagesToDelete as $image) {
                    Storage::disk('public')->delete($image->image_path);
                    $image->delete();
                }
            }

            // Handle new/updated images
            if ($request->has('images')) {
                foreach ($request->images as $imageData) {
                    // Jika ada file baru (image baru)
                    if (isset($imageData['file']) && $imageData['file'] instanceof \Illuminate\Http\UploadedFile) {
                        $path = $imageData['file']->store('portfolio/images', 'public');
                        
                        PortfolioImage::create([
                            'portfolio_id' => $portfolio->id,
                            'image_path' => $path,
                            'caption' => $imageData['caption'] ?? null,
                            'is_primary' => $imageData['is_primary'] ?? false,
                            'sort_order' => $imageData['sort_order'] ?? 0
                        ]);
                    } 
                    // Jika hanya update data (caption, is_primary, sort_order)
                    elseif (isset($imageData['id'])) {
                        $image = PortfolioImage::find($imageData['id']);
                        if ($image) {
                            // Jika setting sebagai primary, hapus primary dari images lain
                            if ($imageData['is_primary'] ?? false) {
                                PortfolioImage::where('portfolio_id', $portfolio->id)
                                    ->where('id', '!=', $imageData['id'])
                                    ->update(['is_primary' => false]);
                            }
                            
                            $image->update([
                                'caption' => $imageData['caption'] ?? null,
                                'is_primary' => $imageData['is_primary'] ?? false,
                                'sort_order' => $imageData['sort_order'] ?? 0
                            ]);
                        }
                    }
                }
            }

            return redirect()->route('admin.portfolios.index')
                ->with('success', 'Portfolio updated successfully.');

        } catch (\Exception $e) {
            \Log::error('Failed to update portfolio:', ['error' => $e->getMessage()]);
            return back()->with('error', 'Failed to update portfolio: ' . $e->getMessage());
        }
    }

    public function destroy(Portfolio $portfolio)
    {
        try {
            // Delete featured image
            if ($portfolio->featured_image) {
                Storage::disk('public')->delete($portfolio->featured_image);
            }

            // Delete portfolio images
            foreach ($portfolio->images as $image) {
                Storage::disk('public')->delete($image->image_path);
            }

            $portfolio->delete();

            return redirect()->route('admin.portfolios.index')
                ->with('success', 'Portfolio deleted successfully.');

        } catch (\Exception $e) {
            \Log::error('Failed to delete portfolio:', ['error' => $e->getMessage()]);
            return back()->with('error', 'Failed to delete portfolio: ' . $e->getMessage());
        }
    }

    // Technology Management
    public function storeTechnology(Request $request)
    {
        $request->validate([
            'portfolio_id' => 'required|exists:portfolios,id',
            'technology' => 'required|string|max:100',
            'icon' => 'nullable|string|max:255',
        ]);

        PortfolioTechnology::create($request->only(['portfolio_id', 'technology', 'icon']));

        return back()->with('success', 'Technology added successfully.');
    }

    public function updateTechnology(Request $request, PortfolioTechnology $technology)
    {
        $request->validate([
            'technology' => 'required|string|max:100',
            'icon' => 'nullable|string|max:255',
        ]);

        $technology->update($request->only(['technology', 'icon']));

        return back()->with('success', 'Technology updated successfully.');
    }

    public function destroyTechnology(PortfolioTechnology $technology)
    {
        $technology->delete();

        return back()->with('success', 'Technology deleted successfully.');
    }

    // Feature Management
    public function storeFeature(Request $request)
    {
        $request->validate([
            'portfolio_id' => 'required|exists:portfolios,id',
            'feature' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        PortfolioFeature::create($request->only(['portfolio_id', 'feature', 'description']));

        return back()->with('success', 'Feature added successfully.');
    }

    public function updateFeature(Request $request, PortfolioFeature $feature)
    {
        $request->validate([
            'feature' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $feature->update($request->only(['feature', 'description']));

        return back()->with('success', 'Feature updated successfully.');
    }

    public function destroyFeature(PortfolioFeature $feature)
    {
        $feature->delete();

        return back()->with('success', 'Feature deleted successfully.');
    }

    // Image Management
    public function storeImage(Request $request)
    {
        $request->validate([
            'portfolio_id' => 'required|exists:portfolios,id',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'caption' => 'nullable|string|max:255',
            'is_primary' => 'boolean',
        ]);

        $path = $request->file('image')->store('portfolio/images', 'public');

        PortfolioImage::create([
            'portfolio_id' => $request->portfolio_id,
            'image_path' => $path,
            'caption' => $request->caption,
            'is_primary' => $request->is_primary ?? false,
        ]);

        return back()->with('success', 'Image uploaded successfully.');
    }

    public function updateImage(Request $request, PortfolioImage $image)
    {
        $request->validate([
            'caption' => 'nullable|string|max:255',
            'is_primary' => 'boolean',
            'sort_order' => 'nullable|integer',
        ]);

        // If setting as primary, remove primary from other images
        if ($request->is_primary) {
            PortfolioImage::where('portfolio_id', $image->portfolio_id)
                ->where('id', '!=', $image->id)
                ->update(['is_primary' => false]);
        }

        $image->update($request->only(['caption', 'is_primary', 'sort_order']));

        return back()->with('success', 'Image updated successfully.');
    }

    public function destroyImage(PortfolioImage $image)
    {
        Storage::disk('public')->delete($image->image_path);
        $image->delete();

        return back()->with('success', 'Image deleted successfully.');
    }

    // Bulk Actions
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:portfolios,id',
        ]);

        $portfolios = Portfolio::whereIn('id', $request->ids)->get();

        foreach ($portfolios as $portfolio) {
            // Delete featured image
            if ($portfolio->featured_image) {
                Storage::disk('public')->delete($portfolio->featured_image);
            }

            // Delete portfolio images
            foreach ($portfolio->images as $image) {
                Storage::disk('public')->delete($image->image_path);
            }

            $portfolio->delete();
        }

        return redirect()->route('admin.portfolios.index')
            ->with('success', 'Selected portfolios deleted successfully.');
    }

    public function bulkUpdate(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:portfolios,id',
            'field' => 'required|string|in:status,highlight,category',
            'value' => 'required',
        ]);

        Portfolio::whereIn('id', $request->ids)
            ->update([$request->field => $request->value]);

        return redirect()->route('admin.portfolios.index')
            ->with('success', 'Selected portfolios updated successfully.');
    }
}