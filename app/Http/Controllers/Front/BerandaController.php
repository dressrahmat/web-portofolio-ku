<?php

namespace App\Http\Controllers\Front;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use App\Models\Artikel;
use App\Models\Education;
use App\Models\Experience;
use App\Models\Message;
use App\Models\Portfolio;
use App\Models\Profile;
use App\Models\Service;
use App\Models\Setting;
use App\Models\Skill;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Halaman publik: beranda, portofolio, blog, CV, dan form kontak.
 */
class BerandaController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Front/Home', [
            'meta' => $this->meta(),
            'services' => Service::visible()->ordered()->get(),
            'experiences' => Experience::visible()->ordered()->get(),
            'educations' => Education::visible()->ordered()->get(),
            'skills' => $this->groupedSkills(),
            'featuredSkills' => Skill::visible()->where('is_featured', true)->ordered()->pluck('name'),
            'achievements' => Achievement::visible()->ordered()->get(),
            'testimonials' => Testimonial::visible()->ordered()->get(),
            'portfolios' => Portfolio::published()
                ->with(['technologies', 'images'])
                ->orderByDesc('highlight')
                ->ordered()
                ->take(6)
                ->get(),
            'portfolioCount' => Portfolio::published()->count(),
            'articles' => Artikel::published()
                ->with('kategori:kategori.id,kategori.nama,kategori.slug')
                ->latest('diterbitkan_pada')
                ->take(3)
                ->get()
                ->each->append(['gambar_url', 'ringkasan', 'waktu_baca']),
        ]);
    }

    public function portfolios(Request $request): Response
    {
        $category = $request->query('kategori');

        return Inertia::render('Front/Portfolio/Index', [
            'meta' => $this->meta('Portofolio', 'Kumpulan proyek dan studi kasus yang pernah saya kerjakan.'),
            'portfolios' => Portfolio::published()
                ->with(['technologies', 'images'])
                ->when($category, fn ($q) => $q->where('category', $category))
                ->orderByDesc('highlight')
                ->ordered()
                ->get(),
            'categories' => Portfolio::published()->distinct()->orderBy('category')->pluck('category'),
            'activeCategory' => $category,
        ]);
    }

    public function portfolioShow(string $slug): Response
    {
        $portfolio = Portfolio::published()
            ->with(['technologies', 'features', 'images'])
            ->where('slug', $slug)
            ->firstOrFail();

        $others = Portfolio::published()
            ->with('images')
            ->where('id', '!=', $portfolio->id)
            ->orderByRaw('CASE WHEN category = ? THEN 0 ELSE 1 END', [$portfolio->category])
            ->ordered()
            ->take(3)
            ->get();

        return Inertia::render('Front/Portfolio/Show', [
            'meta' => $this->meta(
                $portfolio->title,
                $portfolio->short_description ?: Str::limit(strip_tags($portfolio->description), 160),
                $portfolio->featured_image_url
            ),
            'portfolio' => $portfolio,
            'others' => $others,
        ]);
    }

    public function blog(Request $request): Response
    {
        $kategori = $request->query('kategori');
        $search = trim((string) $request->query('q'));

        $articles = Artikel::published()
            ->with('kategori:kategori.id,kategori.nama,kategori.slug')
            ->when($kategori, fn ($q) => $q->whereHas('kategori', fn ($k) => $k->where('slug', $kategori)))
            ->when($search !== '', fn ($q) => $q->where(fn ($w) => $w->where('judul', 'like', "%{$search}%")->orWhere('konten', 'like', "%{$search}%")))
            ->latest('diterbitkan_pada')
            ->paginate(9)
            ->withQueryString();

        $articles->getCollection()->each->append(['gambar_url', 'ringkasan', 'waktu_baca']);

        return Inertia::render('Front/Blog/Index', [
            'meta' => $this->meta('Blog', 'Catatan, tutorial, dan pengalaman seputar pengembangan web dan digital marketing.'),
            'articles' => $articles,
            'categories' => \App\Models\Kategori::whereHas('artikel', fn ($q) => $q->published())->orderBy('nama')->get(['id', 'nama', 'slug']),
            'filters' => ['kategori' => $kategori, 'q' => $search],
        ]);
    }

    public function blogShow(string $slug): Response
    {
        $article = Artikel::published()->with('kategori:kategori.id,kategori.nama,kategori.slug')->where('slug', $slug)->firstOrFail();

        // Hitung view sekali per sesi agar tidak bertambah saat refresh
        $sessionKey = 'viewed_article_'.$article->id;
        if (! session()->has($sessionKey)) {
            $article->incrementViews();
            session()->put($sessionKey, true);
        }

        $article->append(['gambar_url', 'ringkasan', 'waktu_baca']);

        return Inertia::render('Front/Blog/Show', [
            'meta' => $this->meta($article->meta_judul ?: $article->judul, $article->ringkasan, $article->gambar_url, 'article'),
            'article' => $article,
            'related' => Artikel::published()
                ->where('id', '!=', $article->id)
                ->latest('diterbitkan_pada')
                ->take(3)
                ->get()
                ->each->append(['gambar_url', 'ringkasan', 'waktu_baca']),
        ]);
    }

    /**
     * CV lengkap yang siap dicetak / disimpan sebagai PDF dari browser.
     */
    public function cv(): Response
    {
        return Inertia::render('Front/Cv', [
            'meta' => $this->meta('Curriculum Vitae', null),
            'experiences' => Experience::visible()->ordered()->get(),
            'educations' => Education::visible()->ordered()->get(),
            'skills' => $this->groupedSkills(),
            'achievements' => Achievement::visible()->ordered()->get(),
            'portfolios' => Portfolio::published()->orderByDesc('highlight')->ordered()->take(5)
                ->get(['id', 'title', 'slug', 'short_description', 'category', 'project_url', 'role']),
        ]);
    }

    /**
     * Unduh file CV PDF yang diunggah lewat admin.
     */
    public function cvDownload()
    {
        $profile = Profile::first();

        abort_unless($profile?->cv_file && Storage::disk('public')->exists($profile->cv_file), 404);

        $filename = 'CV-'.Str::slug($profile->full_name).'.pdf';

        return Storage::disk('public')->download($profile->cv_file, $filename);
    }

    public function contact(Request $request): RedirectResponse
    {
        // Honeypot sederhana: bot biasanya mengisi semua field
        if (filled($request->input('website'))) {
            return back()->with('success', 'Terima kasih! Pesan Anda sudah terkirim.');
        }

        $data = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:150',
            'phone' => 'nullable|string|max:30',
            'subject' => 'nullable|string|max:150',
            'message' => 'required|string|min:10|max:5000',
        ], [], [
            'name' => 'nama',
            'message' => 'pesan',
            'subject' => 'subjek',
            'phone' => 'nomor telepon',
        ]);

        Message::create($data + [
            'ip_address' => $request->ip(),
            'user_agent' => Str::limit((string) $request->userAgent(), 250, ''),
        ]);

        return back()->with('success', 'Terima kasih! Pesan Anda sudah terkirim, saya akan membalas secepatnya.');
    }

    public function sitemap()
    {
        $urls = collect([
            ['loc' => route('welcome'), 'lastmod' => null],
            ['loc' => route('portfolio.index'), 'lastmod' => null],
            ['loc' => route('blog.index'), 'lastmod' => null],
            ['loc' => route('cv'), 'lastmod' => null],
        ])
            ->merge(Portfolio::published()->get(['slug', 'updated_at'])->map(fn ($p) => [
                'loc' => route('portfolio.show', $p->slug),
                'lastmod' => $p->updated_at?->toAtomString(),
            ]))
            ->merge(Artikel::published()->get(['slug', 'updated_at'])->map(fn ($a) => [
                'loc' => route('blog.show', $a->slug),
                'lastmod' => $a->updated_at?->toAtomString(),
            ]));

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n".'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        foreach ($urls as $url) {
            $xml .= '<url><loc>'.e($url['loc']).'</loc>'.($url['lastmod'] ? '<lastmod>'.$url['lastmod'].'</lastmod>' : '').'</url>';
        }
        $xml .= '</urlset>';

        return response($xml, 200, ['Content-Type' => 'application/xml']);
    }

    /* ------------------------------------------------------------------ */

    private function groupedSkills(): array
    {
        return Skill::visible()->ordered()->get(['id', 'name', 'category', 'level'])
            ->groupBy('category')
            ->map(fn ($items, $category) => ['category' => $category, 'items' => $items->values()])
            ->values()
            ->all();
    }

    /**
     * Data meta SEO untuk <Head>.
     */
    private function meta(?string $title = null, ?string $description = null, ?string $image = null, string $type = 'website'): array
    {
        $settings = Setting::getSettings();
        $profile = Profile::first();

        $siteName = $settings->site_name ?: ($profile?->full_name ?? config('app.name'));

        return [
            'title' => $title ? "{$title} — {$siteName}" : trim($siteName.($profile?->headline ? ' — '.$profile->headline : '')),
            'description' => $description ?: ($settings->site_description ?: $profile?->short_bio),
            'keywords' => $settings->meta_keywords,
            'author' => $settings->meta_author ?: $profile?->full_name,
            'image' => $image ?: ($settings->og_image ? asset('storage/'.$settings->og_image) : $profile?->photo_url),
            'url' => url()->current(),
            'type' => $type,
        ];
    }
}
