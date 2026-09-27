<?php

namespace App\Http\Controllers\Admin\Cv;

use App\Models\Education;

class EducationController extends CvResourceController
{
    protected function model(): string { return Education::class; }
    protected function key(): string { return 'educations'; }
    protected function title(): string { return 'Pendidikan'; }
    protected function singular(): string { return 'Pendidikan'; }
    protected function description(): string
    {
        return 'Pendidikan formal maupun non-formal (bootcamp, kursus panjang).';
    }

    protected function fields(): array
    {
        return [
            ['name' => 'institution', 'label' => 'Institusi', 'type' => 'text', 'required' => true, 'placeholder' => 'Universitas ...'],
            ['name' => 'degree', 'label' => 'Jenjang', 'type' => 'text', 'placeholder' => 'S1 / SMA / Bootcamp', 'col' => 'half'],
            ['name' => 'field_of_study', 'label' => 'Jurusan / Bidang', 'type' => 'text', 'placeholder' => 'Teknik Informatika', 'col' => 'half'],
            ['name' => 'start_year', 'label' => 'Tahun mulai', 'type' => 'year', 'placeholder' => '2015', 'col' => 'half'],
            ['name' => 'end_year', 'label' => 'Tahun lulus', 'type' => 'year', 'placeholder' => '2019 (kosongkan bila masih)', 'col' => 'half'],
            ['name' => 'location', 'label' => 'Lokasi', 'type' => 'text', 'col' => 'half'],
            ['name' => 'grade', 'label' => 'IPK / Nilai', 'type' => 'text', 'placeholder' => '3.50 / 4.00', 'col' => 'half'],
            ['name' => 'description', 'label' => 'Keterangan', 'type' => 'textarea', 'rows' => 3, 'help' => 'Mis. tugas akhir, organisasi kampus, prestasi.'],
            ['name' => 'is_visible', 'label' => 'Tampilkan di website', 'type' => 'checkbox', 'default' => true],
        ];
    }

    protected function columns(): array
    {
        return [
            ['key' => 'institution', 'label' => 'Institusi', 'type' => 'title', 'sub' => 'field_of_study'],
            ['key' => 'degree', 'label' => 'Jenjang', 'type' => 'badge'],
            ['key' => 'period', 'label' => 'Periode', 'type' => 'text'],
        ];
    }
}
