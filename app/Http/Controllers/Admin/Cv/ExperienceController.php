<?php

namespace App\Http\Controllers\Admin\Cv;

use App\Models\Experience;
use Illuminate\Http\Request;

class ExperienceController extends CvResourceController
{
    protected function model(): string { return Experience::class; }
    protected function key(): string { return 'experiences'; }
    protected function title(): string { return 'Pengalaman'; }
    protected function singular(): string { return 'Pengalaman'; }
    protected function description(): string
    {
        return 'Riwayat kerja, proyek freelance, dan pengalaman organisasi yang tampil di timeline website & halaman CV.';
    }

    protected function groupBy(): ?string { return 'type_label'; }

    protected function fields(): array
    {
        return [
            ['name' => 'position', 'label' => 'Posisi / Peran', 'type' => 'text', 'required' => true, 'placeholder' => 'Fullstack Developer', 'col' => 'half'],
            ['name' => 'organization', 'label' => 'Perusahaan / Organisasi', 'type' => 'text', 'required' => true, 'placeholder' => 'SolusiMaju', 'col' => 'half'],
            ['name' => 'type', 'label' => 'Jenis', 'type' => 'select', 'options' => Experience::TYPES, 'required' => true, 'default' => 'work', 'col' => 'half'],
            ['name' => 'location', 'label' => 'Lokasi', 'type' => 'text', 'placeholder' => 'Malang / Remote', 'col' => 'half'],
            ['name' => 'start_date', 'label' => 'Mulai', 'type' => 'date', 'required' => true, 'col' => 'half'],
            ['name' => 'end_date', 'label' => 'Selesai', 'type' => 'date', 'col' => 'half', 'help' => 'Kosongkan bila masih berjalan.', 'hideWhen' => 'is_current'],
            ['name' => 'is_current', 'label' => 'Masih berjalan sampai sekarang', 'type' => 'checkbox'],
            ['name' => 'organization_url', 'label' => 'Website organisasi', 'type' => 'url', 'placeholder' => 'https://'],
            ['name' => 'description', 'label' => 'Deskripsi singkat', 'type' => 'textarea', 'rows' => 3],
            ['name' => 'highlights', 'label' => 'Pencapaian / tanggung jawab utama', 'type' => 'list', 'help' => 'Satu poin per baris. Tulis dengan kata kerja + hasil, mis. "Membangun sistem keuangan yang dipakai 3 yayasan".'],
            ['name' => 'is_visible', 'label' => 'Tampilkan di website', 'type' => 'checkbox', 'default' => true],
        ];
    }

    protected function columns(): array
    {
        return [
            ['key' => 'position', 'label' => 'Posisi', 'type' => 'title', 'sub' => 'organization'],
            ['key' => 'period', 'label' => 'Periode', 'type' => 'text'],
            ['key' => 'type_label', 'label' => 'Jenis', 'type' => 'badge'],
        ];
    }

    protected function mutate(array $data, Request $request): array
    {
        if ($data['is_current']) {
            $data['end_date'] = null;
        }

        return $data;
    }

    protected function rules(?\Illuminate\Database\Eloquent\Model $item = null): array
    {
        return array_merge(parent::rules($item), [
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);
    }
}
