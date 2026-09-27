<?php

namespace App\Http\Controllers\Admin\Cv;

use App\Models\Skill;

class SkillController extends CvResourceController
{
    protected function model(): string { return Skill::class; }
    protected function key(): string { return 'skills'; }
    protected function title(): string { return 'Keahlian'; }
    protected function singular(): string { return 'Keahlian'; }
    protected function description(): string
    {
        return 'Skill dikelompokkan per kategori. Tandai "unggulan" agar tampil di bagian hero.';
    }

    protected function groupBy(): ?string { return 'category'; }

    protected function fields(): array
    {
        return [
            ['name' => 'name', 'label' => 'Nama skill', 'type' => 'text', 'required' => true, 'placeholder' => 'Laravel', 'col' => 'half'],
            ['name' => 'category', 'label' => 'Kategori', 'type' => 'text', 'required' => true, 'placeholder' => 'Backend', 'col' => 'half',
                'suggestions' => Skill::query()->distinct()->pluck('category')->merge(['Backend', 'Frontend', 'Mobile', 'CMS', 'Database & DevOps', 'Digital Marketing', 'Soft Skill'])->unique()->values()->all()],
            ['name' => 'level', 'label' => 'Tingkat penguasaan', 'type' => 'range', 'default' => 70, 'help' => '0–40 dasar, 40–70 menengah, 70–90 mahir, 90+ ahli.'],
            ['name' => 'is_featured', 'label' => 'Skill unggulan (tampil di hero)', 'type' => 'checkbox'],
            ['name' => 'is_visible', 'label' => 'Tampilkan di website', 'type' => 'checkbox', 'default' => true],
        ];
    }

    protected function columns(): array
    {
        return [
            ['key' => 'name', 'label' => 'Skill', 'type' => 'title'],
            ['key' => 'level', 'label' => 'Level', 'type' => 'level'],
            ['key' => 'is_featured', 'label' => 'Unggulan', 'type' => 'bool'],
        ];
    }
}
