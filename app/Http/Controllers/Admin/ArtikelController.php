<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;
use App\Models\Artikel;
use App\Models\Kategori;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ArtikelController extends Controller
{
    public function index(Request $request)
    {
        // Ambil user yang sedang login
        $authUser = auth()->user();

        // Ambil parameter dari request
        $search = $request->query('search');
        $status = $request->query('status');
        $kategori = $request->query('kategori');
        $sort = $request->query('sort', 'created_at');
        $direction = $request->query('direction', 'desc');
        $perPage = $request->query('per_page', 10);

        // Validasi per_page
        $validPerPage = [5, 10, 15, 20, 50];
        if (! in_array($perPage, $validPerPage)) {
            $perPage = 10;
        }

        // Validasi direction
        if (! in_array($direction, ['asc', 'desc'])) {
            $direction = 'desc';
        }

        // Validasi sort column
        $validSortColumns = ['judul', 'status', 'diterbitkan_pada', 'created_at', 'jumlah_dilihat'];
        if (! in_array($sort, $validSortColumns)) {
            $sort = 'created_at';
        }

        // Query artikel dengan pencarian dan pengurutan
        $artikel = Artikel::with(['kategori' => function ($query) {
            $query->select('kategori.id', 'kategori.nama', 'kategori.slug');
        }])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('judul', 'like', "%{$search}%")
                        ->orWhere('konten', 'like', "%{$search}%")
                        ->orWhere('meta_deskripsi', 'like', "%{$search}%");
                });
            })
            ->when($status, function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($kategori, function ($query, $kategori) {
                $query->whereHas('kategori', function ($q) use ($kategori) {
                    $q->where('kategori.id', $kategori);
                });
            })
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();

        // Ambil semua kategori untuk filter
        $semuaKategori = Kategori::orderBy('nama')->get(['id', 'nama']);

        return Inertia::render('Admin/Artikel/Index', [
            'artikel' => $artikel,
            'semuaKategori' => $semuaKategori,
            'filters' => $request->only(['search', 'status', 'kategori', 'sort', 'direction', 'per_page']),
            'statusOptions' => [
                ['value' => 'draf', 'label' => 'Draf'],
                ['value' => 'terbit', 'label' => 'Terbit'],
                ['value' => 'arsip', 'label' => 'Arsip'],
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

    public function create()
    {
        $authUser = auth()->user();
        $kategori = Kategori::orderBy('nama')->get(['id', 'nama']);

        return Inertia::render('Admin/Artikel/Create', [
            'kategori' => $kategori,
            'statusOptions' => [
                ['value' => 'draf', 'label' => 'Draf'],
                ['value' => 'terbit', 'label' => 'Terbit'],
                ['value' => 'arsip', 'label' => 'Arsip'],
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
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:artikel,slug',
            'konten' => 'nullable|string',
            'gambar_utama' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'status' => 'required|in:draf,terbit,arsip',
            'diterbitkan_pada' => 'nullable|date',
            'meta_judul' => 'nullable|string|max:255',
            'meta_deskripsi' => 'nullable|string|max:255',
            'kategori_ids' => 'nullable|array',
            'kategori_ids.*' => 'exists:kategori,id',
        ]);

        try {
            // Generate slug jika tidak disediakan
            if (empty($validated['slug'])) {
                $validated['slug'] = Str::slug($validated['judul']);

                // Cek keunikan slug
                $count = Artikel::where('slug', $validated['slug'])->count();
                if ($count > 0) {
                    $validated['slug'] = $validated['slug'].'-'.time();
                }
            }

            // Handle upload gambar utama
            if ($request->hasFile('gambar_utama')) {
                $path = $request->file('gambar_utama')->store('artikel', 'public');
                $validated['gambar_utama'] = $path;
            } else {
                $validated['gambar_utama'] = 'default-article.jpg'; // default image
            }

            // Set diterbitkan_pada berdasarkan status
            if ($validated['status'] === 'terbit' && empty($validated['diterbitkan_pada'])) {
                $validated['diterbitkan_pada'] = now();
            } elseif ($validated['status'] !== 'terbit') {
                $validated['diterbitkan_pada'] = null;
            }

            // Buat artikel
            $artikel = Artikel::create($validated);

            // Sync kategori jika ada
            if (! empty($validated['kategori_ids'])) {
                $artikel->kategori()->sync($validated['kategori_ids']);
            }

            return redirect()->route('admin.artikel.index')
                ->with('success', 'Artikel berhasil dibuat.');

        } catch (\Exception $e) {
            \Log::error('Gagal membuat artikel:', ['error' => $e->getMessage()]);

            return back()->with('error', 'Gagal membuat artikel: '.$e->getMessage());
        }
    }

    public function show(Artikel $artikel)
    {
        $authUser = auth()->user();
        $artikel->load('kategori');

        return Inertia::render('Admin/Artikel/Show', [
            'artikel' => $artikel,
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

    public function edit(Artikel $artikel)
    {
        $authUser = auth()->user();
        $kategori = Kategori::orderBy('nama')->get(['id', 'nama']);
        $artikel->load('kategori');

        return Inertia::render('Admin/Artikel/Edit', [
            'artikel' => [
                'id' => $artikel->id,
                'judul' => $artikel->judul,
                'slug' => $artikel->slug,
                'konten' => $artikel->konten,
                'gambar_utama' => $artikel->gambar_utama,
                'status' => $artikel->status,
                'diterbitkan_pada' => $artikel->diterbitkan_pada,
                'jumlah_dilihat' => $artikel->jumlah_dilihat,
                'meta_judul' => $artikel->meta_judul,
                'meta_deskripsi' => $artikel->meta_deskripsi,
                'kategori_ids' => $artikel->kategori->pluck('id')->toArray(),
                'created_at' => $artikel->created_at,
                'updated_at' => $artikel->updated_at,
            ],
            'kategori' => $kategori,
            'statusOptions' => [
                ['value' => 'draf', 'label' => 'Draf'],
                ['value' => 'terbit', 'label' => 'Terbit'],
                ['value' => 'arsip', 'label' => 'Arsip'],
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

    public function update(Request $request, $id)
    {
        $artikel = Artikel::findOrFail($id);

        // Validasi
        $validator = Validator::make($request->all(), [
            'judul' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:artikel,slug,' . $id,
            'konten' => 'required|string',
            'gambar_utama' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'status' => 'required|in:draf,terbit,arsip',
            'diterbitkan_pada' => 'nullable|date',
            'meta_judul' => 'nullable|string|max:255',
            'meta_deskripsi' => 'nullable|string|max:255',
            'kategori_ids' => 'nullable|array',
            'kategori_ids.*' => 'exists:kategori,id',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        // Ambil konten lama untuk membandingkan gambar
        $oldContent = $artikel->konten;
        $newContent = $request->konten;

        // Ekstrak gambar dari konten lama
        $oldImages = $this->extractImagesFromContent($oldContent);
        $newImages = $this->extractImagesFromContent($newContent);

        // Cari gambar yang dihapus
        $deletedImages = array_diff($oldImages, $newImages);

        // Hapus gambar yang tidak digunakan lagi
        foreach ($deletedImages as $imageUrl) {
            $this->deleteImageFromStorage($imageUrl);
        }

        // Handle gambar utama
        $gambarPath = $artikel->gambar_utama;
        if ($request->has('remove_gambar') && $request->remove_gambar == '1') {
            // Hapus gambar lama jika ada
            if ($gambarPath && Storage::disk('public')->exists($gambarPath)) {
                Storage::disk('public')->delete($gambarPath);
            }
            $gambarPath = 'default-article.jpg';
        } elseif ($request->hasFile('gambar_utama')) {
            // Hapus gambar lama jika ada
            if ($gambarPath && Storage::disk('public')->exists($gambarPath)) {
                Storage::disk('public')->delete($gambarPath);
            }
            
            // Upload gambar baru
            $file = $request->file('gambar_utama');
            $gambarPath = $file->store('article-images', 'public');
        }

        // Update artikel
        $artikel->update([
            'judul' => $request->judul,
            'slug' => $request->slug,
            'konten' => $newContent,
            'gambar_utama' => $gambarPath,
            'status' => $request->status,
            'diterbitkan_pada' => $request->diterbitkan_pada,
            'meta_judul' => $request->meta_judul,
            'meta_deskripsi' => $request->meta_deskripsi,
        ]);

        // Sync kategori
        if ($request->has('kategori_ids')) {
            $artikel->kategori()->sync($request->kategori_ids);
        }

        return redirect()->route('admin.artikel.index')
            ->with('success', 'Artikel berhasil diperbarui!');
    }

    /**
     * Ekstrak URL gambar dari konten HTML
     */
    private function extractImagesFromContent($content)
    {
        $images = [];
        
        if (empty($content)) {
            return $images;
        }

        // Gunakan DOMDocument untuk parsing HTML
        $dom = new \DOMDocument();
        @$dom->loadHTML($content, LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);
        
        $imgTags = $dom->getElementsByTagName('img');
        
        foreach ($imgTags as $img) {
            $src = $img->getAttribute('src');
            if (!empty($src)) {
                $images[] = $src;
            }
        }

        return $images;
    }

    /**
     * Hapus gambar dari storage
     */
    private function deleteImageFromStorage($imageUrl)
    {
        try {
            // Ekstrak path dari URL
            $parsedUrl = parse_url($imageUrl);
            
            // Jika URL mengandung '/storage/'
            if (isset($parsedUrl['path']) && strpos($parsedUrl['path'], '/storage/') !== false) {
                // Hilangkan '/storage/' dari path
                $relativePath = str_replace('/storage/', '', $parsedUrl['path']);
                
                // Hapus dari storage
                if (Storage::disk('public')->exists($relativePath)) {
                    Storage::disk('public')->delete($relativePath);
                }
            }
            
            // Jika URL langsung ke storage path
            elseif (strpos($imageUrl, 'article-images/') !== false) {
                if (Storage::disk('public')->exists($imageUrl)) {
                    Storage::disk('public')->delete($imageUrl);
                }
            }
        } catch (\Exception $e) {
            // Log error tapi jangan stop proses
            \Log::error('Failed to delete image: ' . $e->getMessage());
        }
    }

    public function destroy(Artikel $artikel)
    {
        try {
            // Hapus gambar utama jika bukan default
            if ($artikel->gambar_utama && $artikel->gambar_utama !== 'default-article.jpg') {
                Storage::disk('public')->delete($artikel->gambar_utama);
            }

            $artikel->delete();

            return redirect()->route('admin.artikel.index')
                ->with('success', 'Artikel berhasil dihapus.');

        } catch (\Exception $e) {
            \Log::error('Gagal menghapus artikel:', ['error' => $e->getMessage()]);

            return back()->with('error', 'Gagal menghapus artikel: '.$e->getMessage());
        }
    }

    /**
     * Bulk delete artikel
     */
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:artikel,id',
        ]);

        try {
            $artikel = Artikel::whereIn('id', $request->ids)->get();

            foreach ($artikel as $item) {
                // Hapus gambar utama jika bukan default
                if ($item->gambar_utama && $item->gambar_utama !== 'default-article.jpg') {
                    Storage::disk('public')->delete($item->gambar_utama);
                }
            }

            Artikel::whereIn('id', $request->ids)->delete();

            return redirect()->route('admin.artikel.index')
                ->with('success', 'Artikel yang dipilih berhasil dihapus.');

        } catch (\Exception $e) {
            \Log::error('Gagal bulk delete artikel:', ['error' => $e->getMessage()]);

            return back()->with('error', 'Gagal menghapus artikel: '.$e->getMessage());
        }
    }

    /**
     * Export artikel (basic implementation - can be extended)
     */
    public function export(Request $request)
    {
        $request->validate([
            'ids' => 'nullable|array',
            'ids.*' => 'exists:artikel,id',
        ]);

        $artikel = $request->has('ids')
            ? Artikel::with('kategori')->whereIn('id', $request->ids)->get()
            : Artikel::with('kategori')->all();

        // Untuk sekarang hanya return data JSON
        // Bisa dikembangkan menjadi CSV/Excel export
        return response()->json([
            'artikel' => $artikel,
            'message' => 'Export functionality can be implemented further',
        ]);
    }

    /**
     * Bulk update artikel status
     */
    public function bulkUpdate(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:artikel,id',
            'field' => 'required|string|in:status',
            'value' => 'required|in:draf,terbit,arsip',
        ]);

        try {
            $data = [$request->field => $request->value];

            // Jika status diubah menjadi terbit, tambahkan tanggal penerbitan
            if ($request->field === 'status' && $request->value === 'terbit') {
                $data['diterbitkan_pada'] = now();
            }

            Artikel::whereIn('id', $request->ids)->update($data);

            return redirect()->route('admin.artikel.index')
                ->with('success', 'Status artikel berhasil diperbarui.');

        } catch (\Exception $e) {
            \Log::error('Gagal bulk update artikel:', ['error' => $e->getMessage()]);

            return back()->with('error', 'Gagal memperbarui artikel: '.$e->getMessage());
        }
    }

    /**
     * Generate slug dari judul
     */
    public function generateSlug(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'id' => 'nullable|exists:artikel,id',
        ]);

        $slug = Str::slug($request->judul);

        // Cek keunikan
        $query = Artikel::where('slug', $slug);
        if ($request->id) {
            $query->where('id', '!=', $request->id);
        }

        if ($query->exists()) {
            $slug = $slug.'-'.time();
        }

        return response()->json(['slug' => $slug]);
    }
}