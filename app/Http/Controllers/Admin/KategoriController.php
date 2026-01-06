<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kategori;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class KategoriController extends Controller
{
    public function index(Request $request)
    {
        // Ambil user yang sedang login
        $authUser = auth()->user();

        // Ambil parameter dari request
        $search = $request->query('search');
        $sort = $request->query('sort', 'created_at');
        $direction = $request->query('direction', 'desc');
        $perPage = $request->query('per_page', 5);

        // Validasi per_page
        $validPerPage = [5, 10, 15];
        if (! in_array($perPage, $validPerPage)) {
            $perPage = 5;
        }

        // Validasi direction
        if (! in_array($direction, ['asc', 'desc'])) {
            $direction = 'desc';
        }

        // Validasi sort column
        $validSortColumns = ['nama', 'slug', 'created_at'];
        if (! in_array($sort, $validSortColumns)) {
            $sort = 'created_at';
        }

        // Query kategori dengan pencarian dan pengurutan
        $kategories = Kategori::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama', 'like', "%{$search}%")
                        ->orWhere('slug', 'like', "%{$search}%")
                        ->orWhere('deskripsi', 'like', "%{$search}%");
                });
            })
            ->orderBy($sort, $direction)
            ->paginate($perPage)
            ->withQueryString();

        return Inertia::render('Admin/Kategori/Index', [
            'kategories' => $kategories,
            'filters' => $request->only(['search', 'sort', 'direction', 'per_page']),
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

        return Inertia::render('Admin/Kategori/Create', [
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
            'nama' => 'required|string|max:255|unique:kategori,nama',
            'deskripsi' => 'nullable|string',
        ]);

        try {
            $kategori = Kategori::create([
                'nama' => $request->nama,
                'slug' => Str::slug($request->nama),
                'deskripsi' => $request->deskripsi,
            ]);

            return redirect()->route('admin.kategori.index')
                ->with('success', 'Kategori berhasil dibuat.');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal membuat kategori: ' . $e->getMessage());
        }
    }

    public function show(Kategori $kategori)
    {
        $authUser = auth()->user();
        
        // Load relasi artikel jika diperlukan
        $kategori->load('artikels');

        return Inertia::render('Admin/Kategori/Show', [
            'kategori' => $kategori,
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

    public function edit(Kategori $kategori)
    {
        $authUser = auth()->user();

        return Inertia::render('Admin/Kategori/Edit', [
            'kategori' => $kategori,
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

    public function update(Request $request, Kategori $kategori)
    {
        $request->validate([
            'nama' => 'required|string|max:255|unique:kategori,nama,' . $kategori->id,
            'deskripsi' => 'nullable|string',
        ]);

        try {
            $kategori->update([
                'nama' => $request->nama,
                'slug' => Str::slug($request->nama),
                'deskripsi' => $request->deskripsi,
            ]);

            return redirect()->route('admin.kategori.index')
                ->with('success', 'Kategori berhasil diperbarui.');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal memperbarui kategori: ' . $e->getMessage());
        }
    }

    public function destroy(Kategori $kategori)
    {
        try {
            // Cek apakah kategori memiliki artikel terkait
            if ($kategori->artikels()->count() > 0) {
                return back()->with('error', 'Tidak dapat menghapus kategori karena memiliki artikel terkait.');
            }

            $kategori->delete();

            return redirect()->route('admin.kategori.index')
                ->with('success', 'Kategori berhasil dihapus.');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menghapus kategori: ' . $e->getMessage());
        }
    }

    /**
     * Bulk delete kategori
     */
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:kategori,id',
        ]);

        try {
            // Cek apakah ada kategori yang memiliki artikel terkait
            $kategoriesWithArticles = Kategori::whereIn('id', $request->ids)
                ->whereHas('artikels')
                ->count();

            if ($kategoriesWithArticles > 0) {
                return back()->with('error', 'Tidak dapat menghapus kategori yang memiliki artikel terkait.');
            }

            Kategori::whereIn('id', $request->ids)->delete();

            return redirect()->route('admin.kategori.index')
                ->with('success', 'Kategori yang dipilih berhasil dihapus.');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal menghapus kategori: ' . $e->getMessage());
        }
    }

    /**
     * Export kategori (basic implementation - can be extended)
     */
    public function export(Request $request)
    {
        $request->validate([
            'ids' => 'nullable|array',
            'ids.*' => 'exists:kategori,id',
        ]);

        $kategories = $request->has('ids')
            ? Kategori::whereIn('id', $request->ids)->get()
            : Kategori::all();

        // Untuk sekarang hanya return data JSON
        // Bisa dikembangkan menjadi CSV/Excel export
        return response()->json([
            'kategories' => $kategories,
            'message' => 'Fungsi ekspor dapat dikembangkan lebih lanjut',
        ]);
    }

    /**
     * Bulk update kategori
     */
    public function bulkUpdate(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:kategori,id',
            'field' => 'required|string|in:nama,deskripsi',
            'value' => 'required',
        ]);

        try {
            if ($request->field === 'nama') {
                // Untuk update nama, kita perlu juga update slug
                $kategories = Kategori::whereIn('id', $request->ids)->get();
                
                foreach ($kategories as $kategori) {
                    $kategori->update([
                        'nama' => $request->value,
                        'slug' => Str::slug($request->value),
                    ]);
                }
            } else {
                Kategori::whereIn('id', $request->ids)
                    ->update([$request->field => $request->value]);
            }

            return redirect()->route('admin.kategori.index')
                ->with('success', 'Kategori yang dipilih berhasil diperbarui.');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal memperbarui kategori: ' . $e->getMessage());
        }
    }
}