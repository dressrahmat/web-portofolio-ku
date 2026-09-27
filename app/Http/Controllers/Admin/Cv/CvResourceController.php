<?php

namespace App\Http\Controllers\Admin\Cv;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Controller generik untuk bagian-bagian CV (pengalaman, pendidikan, skill, dst).
 *
 * Setiap turunan cukup mendefinisikan model, judul, daftar field form dan kolom tabel.
 * Halaman React "Admin/Cv/Manage" membangun form & tabel secara otomatis dari skema ini,
 * sehingga menambah bagian CV baru cukup dengan membuat satu controller kecil.
 *
 * Tipe field yang didukung: text, textarea, email, url, number, range, date, year,
 * select, checkbox, image, list (array string, satu per baris).
 */
abstract class CvResourceController extends Controller
{
    /** @return class-string<Model> */
    abstract protected function model(): string;

    /** Nama unik resource, dipakai untuk route: admin.cv.{key}.* */
    abstract protected function key(): string;

    abstract protected function title(): string;

    protected function description(): string
    {
        return '';
    }

    /** Label tunggal untuk tombol, mis. "Pengalaman". */
    abstract protected function singular(): string;

    /**
     * Definisi field form.
     *
     * @return array<int, array<string, mixed>>
     */
    abstract protected function fields(): array;

    /**
     * Kolom yang tampil di tabel/daftar admin.
     * Setiap kolom: ['key' => ..., 'label' => ..., 'type' => text|badge|image|level|bool|date]
     */
    abstract protected function columns(): array;

    /** Field yang dipakai untuk mengelompokkan item di daftar (opsional). */
    protected function groupBy(): ?string
    {
        return null;
    }

    protected function uploadFolder(): string
    {
        return 'cv/'.$this->key();
    }

    public function index(Request $request): Response
    {
        $model = $this->model();
        $search = trim((string) $request->query('search'));

        $items = $model::query()
            ->when($search !== '', function ($q) use ($search) {
                $searchable = collect($this->fields())
                    ->whereIn('type', ['text', 'textarea', 'email', 'url', 'select'])
                    ->pluck('name')
                    ->all();

                $q->where(function ($q) use ($searchable, $search) {
                    foreach ($searchable as $col) {
                        $q->orWhere($col, 'like', "%{$search}%");
                    }
                });
            })
            ->ordered()
            ->get();

        return Inertia::render('Admin/Cv/Manage', [
            'items' => $items,
            'schema' => [
                'key' => $this->key(),
                'title' => $this->title(),
                'singular' => $this->singular(),
                'description' => $this->description(),
                'fields' => $this->fields(),
                'columns' => $this->columns(),
                'groupBy' => $this->groupBy(),
                'defaults' => $this->defaults(),
            ],
            'filters' => ['search' => $search],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $model = $this->model();
        $data = $this->validated($request);
        $data['sort_order'] = $model::nextSortOrder();

        $model::create($data);

        return back()->with('success', $this->singular().' berhasil ditambahkan.');
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $item = $this->find($id);
        $item->update($this->validated($request, $item));

        return back()->with('success', $this->singular().' berhasil diperbarui.');
    }

    public function destroy(int $id): RedirectResponse
    {
        $item = $this->find($id);

        foreach ($this->fileFields() as $field) {
            $this->deleteFile($item->{$field});
        }

        $item->delete();

        return back()->with('success', $this->singular().' berhasil dihapus.');
    }

    public function toggle(int $id): RedirectResponse
    {
        $item = $this->find($id);
        $item->update(['is_visible' => ! $item->is_visible]);

        return back()->with('success', $item->is_visible ? 'Item ditampilkan.' : 'Item disembunyikan.');
    }

    public function reorder(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer',
        ]);

        $model = $this->model();
        foreach (array_values($request->ids) as $index => $id) {
            $model::whereKey($id)->update(['sort_order' => $index + 1]);
        }

        return back()->with('success', 'Urutan disimpan.');
    }

    /* ------------------------------------------------------------------ */

    protected function find(int $id): Model
    {
        $model = $this->model();

        return $model::findOrFail($id);
    }

    protected function defaults(): array
    {
        $defaults = [];
        foreach ($this->fields() as $field) {
            $defaults[$field['name']] = $field['default'] ?? match ($field['type']) {
                'checkbox' => false,
                'list' => [],
                'image' => null,
                'range' => 70,
                default => '',
            };
        }

        return $defaults;
    }

    protected function fileFields(): array
    {
        return collect($this->fields())->where('type', 'image')->pluck('name')->all();
    }

    protected function rules(?Model $item = null): array
    {
        $rules = [];

        foreach ($this->fields() as $field) {
            $name = $field['name'];
            $base = $field['rules'] ?? null;

            $rules[$name] = $base ?? match ($field['type']) {
                'email' => 'nullable|email|max:255',
                'url' => 'nullable|url|max:255',
                'number' => 'nullable|integer',
                'range' => 'nullable|integer|min:0|max:100',
                'date' => 'nullable|date',
                'year' => 'nullable|string|max:10',
                'checkbox' => 'boolean',
                'textarea' => 'nullable|string|max:5000',
                'list' => 'nullable|array',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:3072',
                'select' => 'nullable|in:'.implode(',', array_keys($field['options'] ?? [])),
                default => 'nullable|string|max:255',
            };

            if (($field['required'] ?? false) && $field['type'] !== 'image') {
                $rules[$name] = preg_replace('/^nullable\|?/', '', $rules[$name]);
                $rules[$name] = 'required'.($rules[$name] ? '|'.$rules[$name] : '');
            }

            if ($field['type'] === 'list') {
                $rules[$name.'.*'] = 'nullable|string|max:500';
            }
            if ($field['type'] === 'image') {
                $rules['remove_'.$name] = 'nullable|boolean';
            }
        }

        return $rules;
    }

    protected function attributeNames(): array
    {
        return collect($this->fields())->mapWithKeys(fn ($f) => [$f['name'] => strtolower($f['label'])])->all();
    }

    protected function validated(Request $request, ?Model $item = null): array
    {
        $request->validate($this->rules($item), [], $this->attributeNames());

        $data = [];

        foreach ($this->fields() as $field) {
            $name = $field['name'];

            switch ($field['type']) {
                case 'checkbox':
                    $data[$name] = $request->boolean($name);
                    break;

                case 'list':
                    $data[$name] = collect(Arr::wrap($request->input($name, [])))
                        ->map(fn ($v) => trim((string) $v))
                        ->filter()
                        ->values()
                        ->all();
                    break;

                case 'image':
                    $file = $request->file($name);
                    if ($file instanceof UploadedFile) {
                        $this->deleteFile($item?->{$name});
                        $data[$name] = $file->store($this->uploadFolder(), 'public');
                    } elseif ($request->boolean('remove_'.$name)) {
                        $this->deleteFile($item?->{$name});
                        $data[$name] = null;
                    }
                    break;

                case 'range':
                case 'number':
                    $data[$name] = $request->filled($name) ? (int) $request->input($name) : ($field['default'] ?? 0);
                    break;

                default:
                    $value = $request->input($name);
                    $data[$name] = is_string($value) ? trim($value) : $value;
                    if ($data[$name] === '') {
                        $data[$name] = null;
                    }
            }
        }

        return $this->mutate($data, $request);
    }

    /** Hook untuk turunan yang perlu memodifikasi data sebelum disimpan. */
    protected function mutate(array $data, Request $request): array
    {
        return $data;
    }

    protected function deleteFile(?string $path): void
    {
        if ($path && ! str_starts_with($path, 'assets/') && ! str_starts_with($path, 'http')) {
            Storage::disk('public')->delete($path);
        }
    }
}
