<?php

namespace App\Http\Controllers\Admin\Cv;

use App\Models\Testimonial;

class TestimonialController extends CvResourceController
{
    protected function model(): string { return Testimonial::class; }
    protected function key(): string { return 'testimonials'; }
    protected function title(): string { return 'Testimoni'; }
    protected function singular(): string { return 'Testimoni'; }
    protected function description(): string
    {
        return 'Kutipan dari klien atau rekan kerja. Gunakan testimoni asli dan minta izin sebelum menampilkan nama.';
    }

    protected function fields(): array
    {
        return [
            ['name' => 'name', 'label' => 'Nama', 'type' => 'text', 'required' => true, 'col' => 'half'],
            ['name' => 'role', 'label' => 'Jabatan', 'type' => 'text', 'placeholder' => 'Ketua Takmir', 'col' => 'half'],
            ['name' => 'company', 'label' => 'Lembaga / Perusahaan', 'type' => 'text', 'col' => 'half'],
            ['name' => 'rating', 'label' => 'Rating (1-5)', 'type' => 'number', 'default' => 5, 'rules' => 'nullable|integer|min:1|max:5', 'col' => 'half'],
            ['name' => 'content', 'label' => 'Isi testimoni', 'type' => 'textarea', 'rows' => 4, 'required' => true],
            ['name' => 'photo', 'label' => 'Foto (opsional)', 'type' => 'image', 'aspect' => 1, 'round' => true, 'sizes' => [300, 500]],
            ['name' => 'is_visible', 'label' => 'Tampilkan di website', 'type' => 'checkbox', 'default' => true],
        ];
    }

    protected function columns(): array
    {
        return [
            ['key' => 'photo_url', 'label' => '', 'type' => 'avatar', 'fallback' => 'name'],
            ['key' => 'name', 'label' => 'Nama', 'type' => 'title', 'sub' => 'company'],
            ['key' => 'content', 'label' => 'Testimoni', 'type' => 'excerpt'],
        ];
    }
}