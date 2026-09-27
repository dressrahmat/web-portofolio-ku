<?php

namespace App\Http\Controllers\Admin\Cv;

use App\Models\Service;

class ServiceController extends CvResourceController
{
    public const ICONS = [
        'code' => 'Kode / Web App',
        'layout' => 'Website / Landing Page',
        'server' => 'Backend / Server',
        'database' => 'Database / Sistem Informasi',
        'smartphone' => 'Aplikasi Mobile',
        'trending-up' => 'Marketing / Growth',
        'bar-chart' => 'Analitik / Laporan',
        'pen-tool' => 'Desain',
        'globe' => 'SEO / Online Presence',
        'shopping-cart' => 'Toko Online',
        'users' => 'Konsultasi / Pelatihan',
        'settings' => 'Maintenance',
    ];

    protected function model(): string { return Service::class; }
    protected function key(): string { return 'services'; }
    protected function title(): string { return 'Layanan'; }
    protected function singular(): string { return 'Layanan'; }
    protected function description(): string
    {
        return 'Jasa yang Anda tawarkan kepada klien. Tampil di bagian "Layanan" pada beranda.';
    }

    protected function fields(): array
    {
        return [
            ['name' => 'title', 'label' => 'Nama layanan', 'type' => 'text', 'required' => true, 'placeholder' => 'Website Profil Lembaga', 'col' => 'half'],
            ['name' => 'icon', 'label' => 'Ikon', 'type' => 'select', 'options' => self::ICONS, 'default' => 'code', 'col' => 'half'],
            ['name' => 'description', 'label' => 'Deskripsi', 'type' => 'textarea', 'rows' => 3, 'required' => true],
            ['name' => 'items', 'label' => 'Yang didapat klien', 'type' => 'list', 'help' => 'Satu poin per baris, mis. "Desain responsif", "Panel admin".'],
            ['name' => 'price_note', 'label' => 'Catatan harga (opsional)', 'type' => 'text', 'placeholder' => 'Mulai Rp1,5 juta'],
            ['name' => 'is_visible', 'label' => 'Tampilkan di website', 'type' => 'checkbox', 'default' => true],
        ];
    }

    protected function columns(): array
    {
        return [
            ['key' => 'title', 'label' => 'Layanan', 'type' => 'title', 'sub' => 'price_note'],
            ['key' => 'icon', 'label' => 'Ikon', 'type' => 'badge'],
        ];
    }
}
