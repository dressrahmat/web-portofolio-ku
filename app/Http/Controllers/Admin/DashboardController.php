<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use App\Models\Artikel;
use App\Models\Education;
use App\Models\Experience;
use App\Models\Message;
use App\Models\Portfolio;
use App\Models\Profile;
use App\Models\Service;
use App\Models\Skill;
use App\Models\Testimonial;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $profile = Profile::first();

        // Checklist kelengkapan CV - membantu melihat bagian mana yang belum diisi
        $checklist = [
            ['label' => 'Foto profil', 'done' => (bool) $profile?->photo, 'route' => 'admin.cv.profile.edit'],
            ['label' => 'Headline & ringkasan diri', 'done' => filled($profile?->headline) && filled($profile?->short_bio), 'route' => 'admin.cv.profile.edit'],
            ['label' => 'Kontak (email / WhatsApp)', 'done' => filled($profile?->email) || filled($profile?->whatsapp), 'route' => 'admin.cv.profile.edit'],
            ['label' => 'File CV PDF', 'done' => (bool) $profile?->cv_file, 'route' => 'admin.cv.profile.edit'],
            ['label' => 'Minimal 2 pengalaman', 'done' => Experience::count() >= 2, 'route' => 'admin.cv.experiences.index'],
            ['label' => 'Riwayat pendidikan', 'done' => Education::exists(), 'route' => 'admin.cv.educations.index'],
            ['label' => 'Minimal 6 keahlian', 'done' => Skill::count() >= 6, 'route' => 'admin.cv.skills.index'],
            ['label' => 'Minimal 3 portofolio terbit', 'done' => Portfolio::published()->count() >= 3, 'route' => 'admin.portfolios.index'],
            ['label' => 'Layanan yang ditawarkan', 'done' => Service::exists(), 'route' => 'admin.cv.services.index'],
            ['label' => 'Testimoni klien', 'done' => Testimonial::exists(), 'route' => 'admin.cv.testimonials.index'],
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'portfolios' => Portfolio::count(),
                'portfolios_published' => Portfolio::published()->count(),
                'articles' => Artikel::count(),
                'articles_published' => Artikel::published()->count(),
                'article_views' => (int) Artikel::sum('jumlah_dilihat'),
                'experiences' => Experience::count(),
                'skills' => Skill::count(),
                'achievements' => Achievement::count(),
                'messages_unread' => Message::unread()->count(),
                'messages_total' => Message::count(),
            ],
            'checklist' => $checklist,
            'latestMessages' => Message::latest()->take(5)->get(['id', 'name', 'email', 'subject', 'message', 'read_at', 'created_at']),
            'profileName' => $profile?->full_name,
        ]);
    }
}
