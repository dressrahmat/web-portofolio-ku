<?php

namespace Database\Seeders;

use App\Models\Achievement;
use App\Models\Education;
use App\Models\Experience;
use App\Models\Portfolio;
use App\Models\Profile;
use App\Models\Service;
use App\Models\Setting;
use App\Models\Skill;
use Illuminate\Database\Seeder;

/**
 * Data awal CV & portofolio.
 *
 * Aman dijalankan berulang: setiap bagian hanya diisi jika tabelnya masih kosong,
 * sehingga tidak menimpa data yang sudah Anda ubah lewat panel admin.
 * Semua isi di sini adalah titik awal — silakan sesuaikan dari panel admin.
 */
class CvSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedSettings();
        $this->seedProfile();
        $this->seedExperiences();
        $this->seedEducations();
        $this->seedSkills();
        $this->seedAchievements();
        $this->seedServices();
        $this->seedPortfolios();
    }

    private function seedSettings(): void
    {
        $settings = Setting::first();
        if ($settings && in_array($settings->site_name, ['Nama Website Anda', 'Nama Website', null], true)) {
            $settings->update([
                'site_name' => 'Dedy Septya Rahmat',
                'site_description' => 'Portofolio & CV Dedy Septya Rahmat — web developer (Laravel, React, WordPress) yang juga paham digital marketing.',
                'meta_author' => 'Dedy Septya Rahmat',
                'meta_keywords' => 'web developer malang, laravel developer, react, wordpress, digital marketing, portofolio',
            ]);
        }
    }

    private function seedProfile(): void
    {
        if (Profile::exists()) {
            return;
        }

        Profile::create([
            'full_name' => 'Dedy Septya Rahmat',
            'nickname' => 'Dedy',
            'headline' => 'Web Developer & Digital Marketing',
            'tagline' => 'Membangun sistem digital dan aplikasi yang tidak hanya berfungsi baik, tapi juga mendukung strategi komunikasi dan tujuan lembaga.',
            'short_bio' => 'Web developer berbasis di Malang yang terbiasa bekerja di Laravel, React/Inertia.js, dan WordPress, dengan pengalaman di digital marketing. Fokus membantu masjid, pesantren, yayasan, instansi, dan UMKM hadir secara profesional di dunia digital.',
            'about' => "<p>Saya memiliki <strong>latar belakang programming</strong> dengan pengalaman membuat sistem digital, ditambah kemampuan dalam <strong>strategi digital marketing dan komunikasi</strong>.</p>\n<p>Pengalaman bekerja dengan berbagai <strong>lembaga dan organisasi</strong> membantu saya memahami bagaimana teknologi dapat mendukung tujuan bisnis dan komunikasi secara efektif. Tidak hanya membuat sistem yang berfungsi baik, tapi juga memastikan sistem tersebut mendukung strategi komunikasi dan marketing.</p>",
            'photo' => 'assets/images/me.png',
            'location' => 'Malang, Jawa Timur',
            'email' => 'dedysrahmat97@gmail.com',
            'whatsapp' => '6289530519448',
            'website' => 'https://solusimaju.org',
            'open_to_work' => true,
            'availability_text' => 'Terbuka untuk proyek freelance & kolaborasi',
            'hero_tags' => ['Laravel', 'React / Inertia.js', 'WordPress', 'Sistem Informasi', 'Digital Marketing', 'Analisis Data'],
            'stats' => [
                ['value' => '2+', 'label' => 'Tahun', 'caption' => 'Programming & Development'],
                ['value' => '1', 'label' => 'Tahun', 'caption' => 'Digital Marketing'],
                ['value' => '3+', 'label' => 'Kota', 'caption' => 'Jogja, Pontianak, Malang'],
            ],
        ]);
    }

    private function seedExperiences(): void
    {
        if (Experience::exists()) {
            return;
        }

        // CATATAN: tanggal di bawah adalah perkiraan — sesuaikan di Admin > Pengalaman.
        $items = [
            [
                'type' => 'freelance',
                'position' => 'Founder & Web Developer',
                'organization' => 'SolusiMaju',
                'organization_url' => 'https://solusimaju.org',
                'location' => 'Malang',
                'start_date' => '2025-01-01',
                'is_current' => true,
                'description' => 'Merintis layanan website profil dan sistem manajemen internal untuk masjid/pesantren, yayasan, instansi, dan UMKM.',
                'highlights' => [
                    'Membangun website profil masjid berbasis WordPress/Elementor',
                    'Mengembangkan template Laravel 12 + React + Inertia.js untuk mempercepat pembuatan sistem klien',
                    'Menyusun konsep paket layanan dan portofolio digital',
                ],
            ],
            [
                'type' => 'work',
                'position' => 'Programmer',
                'organization' => 'Yayasan & Lembaga (Jogja, Pontianak, Malang)',
                'location' => 'Indonesia',
                'start_date' => '2023-01-01',
                'is_current' => true,
                'description' => 'Membangun sistem informasi untuk lembaga: sistem informasi masjid, laporan keuangan yayasan, dan platform layanan.',
                'highlights' => [
                    'Membuat sistem informasi digital masjid (jadwal sholat, pengumuman, konten edukasi)',
                    'Mengubah pencatatan keuangan manual menjadi laporan otomatis yang mudah dibaca pengurus',
                    'Membangun platform layanan pelanggan yang terpusat',
                ],
            ],
            [
                'type' => 'work',
                'position' => 'Digital Marketing',
                'organization' => 'Isi nama perusahaan',
                'location' => 'Indonesia',
                'start_date' => '2022-01-01',
                'end_date' => '2022-12-31',
                'description' => 'Mengelola kampanye iklan digital (Meta Ads), strategi konten, dan analisis performa kampanye.',
                'highlights' => [
                    'Menyusun dan mengoptimalkan kampanye Meta Ads',
                    'Membuat kalender konten dan materi komunikasi',
                ],
                'is_visible' => false, // tampilkan setelah nama perusahaan & tanggal diisi
            ],
            [
                'type' => 'organization',
                'position' => 'Anggota Paskibraka',
                'organization' => 'Paskibraka Kabupaten Hulu Sungai Tengah',
                'location' => 'Kalimantan Selatan',
                'start_date' => '2016-01-01',
                'end_date' => '2016-12-31',
                'description' => 'Terpilih sebagai anggota Pasukan Pengibar Bendera Pusaka tingkat kabupaten.',
                'highlights' => ['Melatih kedisiplinan, kerja tim, dan tanggung jawab'],
            ],
        ];

        foreach ($items as $i => $item) {
            Experience::create($item + ['sort_order' => $i + 1, 'is_visible' => $item['is_visible'] ?? true]);
        }
    }

    private function seedEducations(): void
    {
        if (Education::exists()) {
            return;
        }

        // Disembunyikan sampai diisi dengan data yang sebenarnya.
        Education::create([
            'institution' => 'Isi nama sekolah / kampus Anda',
            'degree' => 'Jenjang',
            'field_of_study' => 'Jurusan',
            'start_year' => '2015',
            'end_year' => '2019',
            'is_visible' => false,
            'sort_order' => 1,
        ]);
    }

    private function seedSkills(): void
    {
        if (Skill::exists()) {
            return;
        }

        $skills = [
            'Backend' => [['Laravel', 85, true], ['PHP', 85, false], ['REST API', 75, false]],
            'Frontend' => [['React', 75, true], ['Inertia.js', 75, false], ['Tailwind CSS', 80, false], ['JavaScript', 75, false]],
            'CMS' => [['WordPress', 85, true], ['Elementor', 85, false]],
            'Database & DevOps' => [['MySQL', 75, false], ['Git', 70, false], ['Deploy VPS / Hosting', 65, false]],
            'Digital Marketing' => [['Meta Ads', 70, true], ['Content Strategy', 70, false], ['SEO Dasar', 65, false], ['Analisis Data', 65, false]],
        ];

        $order = 1;
        foreach ($skills as $category => $items) {
            foreach ($items as [$name, $level, $featured]) {
                Skill::create([
                    'name' => $name,
                    'category' => $category,
                    'level' => $level,
                    'is_featured' => $featured,
                    'is_visible' => true,
                    'sort_order' => $order++,
                ]);
            }
        }
    }

    private function seedAchievements(): void
    {
        if (Achievement::exists()) {
            return;
        }

        Achievement::create([
            'type' => 'award',
            'title' => 'Purna Paskibraka Kabupaten Hulu Sungai Tengah',
            'issuer' => 'Pemerintah Kabupaten Hulu Sungai Tengah, Kalimantan Selatan',
            'issued_at' => '2016-08-17',
            'description' => 'Anggota Pasukan Pengibar Bendera Pusaka pada upacara HUT RI ke-71.',
            'is_visible' => true,
            'sort_order' => 1,
        ]);
    }

    private function seedServices(): void
    {
        if (Service::exists()) {
            return;
        }

        $services = [
            ['layout', 'Website Profil Lembaga', 'Website profesional untuk masjid, pesantren, yayasan, instansi, dan UMKM — mudah dikelola sendiri oleh pengurus.', ['Desain responsif & cepat', 'Halaman profil, program, berita, donasi', 'Panel admin yang mudah', 'Optimasi SEO dasar']],
            ['database', 'Sistem Manajemen Internal', 'Aplikasi web untuk merapikan proses internal: keuangan, data anggota/jamaah, inventaris, dan laporan.', ['Laporan otomatis', 'Hak akses per pengguna', 'Ekspor data', 'Dibangun dengan Laravel + React']],
            ['code', 'Aplikasi Web Kustom', 'Pengembangan aplikasi sesuai kebutuhan bisnis, dari MVP hingga sistem yang siap dipakai tim.', ['Analisis kebutuhan', 'Desain alur & database', 'Pengembangan & deployment', 'Dukungan setelah rilis']],
            ['trending-up', 'Digital Marketing & Konten', 'Membantu lembaga menjangkau lebih banyak orang lewat iklan digital dan strategi konten yang terukur.', ['Setup & optimasi Meta Ads', 'Strategi & kalender konten', 'Laporan performa']],
        ];

        foreach ($services as $i => [$icon, $title, $description, $items]) {
            Service::create(compact('icon', 'title', 'description', 'items') + ['is_visible' => true, 'sort_order' => $i + 1]);
        }
    }

    private function seedPortfolios(): void
    {
        if (Portfolio::exists()) {
            return;
        }

        $items = [
            [
                'title' => 'Sistem Informasi Digital untuk Masjid',
                'category' => 'Sistem Informasi',
                'short_description' => 'Layar informasi masjid yang menampilkan jadwal sholat, pengumuman, dan konten edukasi secara otomatis.',
                'description' => '<p>Membuat sistem digital yang menampilkan informasi jadwal sholat, pengumuman, dan konten edukasi secara otomatis. Membantu jamaah mendapat informasi terbaru dengan mudah dan cepat.</p>',
                'results' => "Jamaah lebih mudah mendapat informasi terbaru\nKomunikasi pengurus menjadi lebih teratur\nProses dari manual menjadi digital",
                'features' => ['Sistem pengelolaan konten yang mudah', 'Penyampaian informasi real-time', 'Konten edukasi untuk jamaah', 'Media komunikasi dengan komunitas'],
                'technologies' => ['Laravel', 'JavaScript', 'MySQL'],
                'folder' => 'portofolio_tv', 'count' => 6, 'highlight' => true,
            ],
            [
                'title' => 'Sistem Laporan Keuangan Yayasan',
                'category' => 'Sistem Informasi',
                'short_description' => 'Mengubah data keuangan yang rumit menjadi laporan yang mudah dibaca pengurus yayasan.',
                'description' => '<p>Membuat sistem yang mengubah data keuangan rumit menjadi laporan yang mudah dibaca dan dipahami. Membantu pengurus yayasan membuat keputusan yang lebih baik.</p>',
                'results' => "Laporan keuangan lebih jelas dan mudah dibaca\nPengambilan keputusan lebih cepat\nKomunikasi internal lebih lancar",
                'features' => ['Tampilan data yang mudah dimengerti', 'Laporan otomatis', 'Transparansi keuangan'],
                'technologies' => ['Laravel', 'MySQL', 'Chart'],
                'folder' => 'portofolio_keuangan', 'count' => 3, 'highlight' => true,
            ],
            [
                'title' => 'Platform Layanan Pelanggan',
                'category' => 'Web Development',
                'short_description' => 'Platform terpusat untuk mencatat, mencari, dan mengelola informasi layanan pelanggan.',
                'description' => '<p>Membuat platform yang memudahkan komunikasi dengan pelanggan. Sistem ini membantu mencatat, mencari, dan mengelola semua informasi layanan dengan rapi.</p>',
                'results' => "Pelanggan lebih puas dengan layanan\nRespons lebih cepat untuk pertanyaan\nInformasi tersimpan rapi dan konsisten",
                'features' => ['Satu saluran komunikasi terpadu', 'Pengelolaan informasi layanan', 'Komunikasi multi-saluran'],
                'technologies' => ['Laravel', 'React', 'Tailwind CSS'],
                'folder' => 'portofolio_layanan', 'count' => 4, 'highlight' => false,
            ],
            [
                'title' => 'Website Profil Perusahaan',
                'category' => 'Company Profile',
                'short_description' => 'Website company profile yang menampilkan visi, misi, dan program lembaga secara menarik.',
                'description' => '<p>Membuat website company profile yang menampilkan visi, misi, dan program yayasan dengan cara yang menarik. Membantu memperkenalkan lembaga ke lebih banyak orang.</p>',
                'results' => "Brand lebih dikenal banyak orang\nInformasi lembaga mudah diakses\nMembangun citra profesional",
                'features' => ['Pembangunan identitas brand', 'Cerita lembaga yang menarik', 'Optimasi SEO'],
                'technologies' => ['WordPress', 'Elementor', 'SEO'],
                'folder' => 'portofolio_company_profile', 'count' => 3, 'highlight' => false,
            ],
        ];

        foreach ($items as $i => $item) {
            $portfolio = Portfolio::create([
                'title' => $item['title'],
                'category' => $item['category'],
                'short_description' => $item['short_description'],
                'description' => $item['description'],
                'results' => $item['results'],
                'role' => 'Developer',
                'highlight' => $item['highlight'],
                'status' => 'published',
                'sort_order' => $i + 1,
            ]);

            foreach ($item['features'] as $feature) {
                $portfolio->features()->create(['feature' => $feature]);
            }
            foreach ($item['technologies'] as $tech) {
                $portfolio->technologies()->create(['technology' => $tech]);
            }
            for ($n = 1; $n <= $item['count']; $n++) {
                $portfolio->images()->create([
                    'image_path' => "assets/images/{$item['folder']}/{$n}.png",
                    'is_primary' => $n === 1,
                    'sort_order' => $n,
                ]);
            }
        }
    }
}
