<?php

namespace App\Http\Controllers\Admin\Cv;

use App\Models\Achievement;

class AchievementController extends CvResourceController
{
    protected function model(): string { return Achievement::class; }
    protected function key(): string { return 'achievements'; }
    protected function title(): string { return 'Sertifikat & Penghargaan'; }
    protected function singular(): string { return 'Sertifikat/Penghargaan'; }
    protected function description(): string
    {
        return 'Sertifikasi, penghargaan, dan pencapaian yang memperkuat kredibilitas Anda.';
    }

    protected function groupBy(): ?string { return 'type_label'; }

    protected function fields(): array
    {
        return [
            ['name' => 'title', 'label' => 'Judul', 'type' => 'text', 'required' => true, 'placeholder' => 'Purna Paskibraka Kabupaten ...'],
            ['name' => 'type', 'label' => 'Jenis', 'type' => 'select', 'options' => Achievement::TYPES, 'required' => true, 'default' => 'certificate', 'col' => 'half'],
            ['name' => 'issuer', 'label' => 'Penerbit / Pemberi', 'type' => 'text', 'placeholder' => 'Dicoding / Pemkab ...', 'col' => 'half'],
            ['name' => 'issued_at', 'label' => 'Tanggal', 'type' => 'date', 'col' => 'half'],
            ['name' => 'credential_id', 'label' => 'ID Kredensial', 'type' => 'text', 'col' => 'half'],
            ['name' => 'credential_url', 'label' => 'Link verifikasi', 'type' => 'url', 'placeholder' => 'https://'],
            ['name' => 'description', 'label' => 'Keterangan', 'type' => 'textarea', 'rows' => 3],
            ['name' => 'image', 'label' => 'Gambar sertifikat (opsional)', 'type' => 'image',
                'aspects' => [['label' => 'Lanskap 4:3', 'value' => 4 / 3], ['label' => 'Persegi 1:1', 'value' => 1], ['label' => 'Bebas', 'value' => null]],
                'sizes' => [800, 1200]],
            ['name' => 'is_visible', 'label' => 'Tampilkan di website', 'type' => 'checkbox', 'default' => true],
        ];
    }

    protected function columns(): array
    {
        return [
            ['key' => 'image_url', 'label' => '', 'type' => 'image'],
            ['key' => 'title', 'label' => 'Judul', 'type' => 'title', 'sub' => 'issuer'],
            ['key' => 'issued_label', 'label' => 'Tanggal', 'type' => 'text'],
        ];
    }
}