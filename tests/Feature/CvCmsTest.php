<?php

namespace Tests\Feature;

use App\Models\Artikel;
use App\Models\Experience;
use App\Models\Message;
use App\Models\Portfolio;
use App\Models\Profile;
use App\Models\Skill;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CvCmsTest extends TestCase
{
    use RefreshDatabase;

    private User $master;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
        $this->master = User::where('email', 'master@example.com')->first();
    }

    /* ---------------- Halaman publik ---------------- */

    public function test_public_pages_render_with_seeded_data(): void
    {
        $this->get('/')->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('Front/Home')
            ->has('portfolios', 4)
            ->has('services', 4)
            ->where('profile.full_name', 'Dedy Septya Rahmat')
        );

        $this->get('/portofolio')->assertOk()->assertInertia(fn (Assert $p) => $p->component('Front/Portfolio/Index')->has('portfolios', 4));

        $slug = Portfolio::first()->slug;
        $this->get("/portofolio/{$slug}")->assertOk()->assertInertia(fn (Assert $p) => $p
            ->component('Front/Portfolio/Show')
            ->where('portfolio.slug', $slug)
            ->has('portfolio.results_list', 3)
        );

        $this->get('/cv')->assertOk()->assertInertia(fn (Assert $p) => $p->component('Front/Cv'));
        $this->get('/blog')->assertOk();
        $this->get('/sitemap.xml')->assertOk()->assertSee($slug);
    }

    public function test_draft_portfolio_and_hidden_items_are_not_public(): void
    {
        $draft = Portfolio::first();
        $draft->update(['status' => 'draft']);
        $this->get("/portofolio/{$draft->slug}")->assertNotFound();

        $hidden = Experience::where('is_visible', false)->count();
        $this->get('/')->assertInertia(fn (Assert $p) => $p->has('experiences', Experience::count() - $hidden));
    }

    public function test_published_article_is_viewable_and_counts_views(): void
    {
        $article = Artikel::create([
            'judul' => 'Halo Dunia', 'slug' => 'halo-dunia', 'konten' => '<p>Isi artikel</p>',
            'gambar_utama' => 'x.jpg', 'status' => 'terbit', 'diterbitkan_pada' => now()->subDay(),
        ]);

        $this->get('/blog/halo-dunia')->assertOk()->assertInertia(fn (Assert $p) => $p->component('Front/Blog/Show'));
        $this->assertSame(1, $article->fresh()->jumlah_dilihat);

        $article->update(['status' => 'draf']);
        $this->get('/blog/halo-dunia')->assertNotFound();
    }

    public function test_contact_form_stores_message(): void
    {
        $this->post('/kontak', [
            'name' => 'Budi', 'email' => 'budi@example.com', 'message' => 'Saya ingin membuat website masjid.',
        ])->assertRedirect()->assertSessionHas('success');

        $this->assertDatabaseHas('messages', ['email' => 'budi@example.com']);

        // validasi
        $this->post('/kontak', ['name' => '', 'email' => 'bukan-email', 'message' => 'x'])
            ->assertSessionHasErrors(['name', 'email', 'message']);

        // honeypot: tidak disimpan
        $this->post('/kontak', ['name' => 'Bot', 'email' => 'bot@x.com', 'message' => 'spam spam spam', 'website' => 'http://spam'])
            ->assertSessionHas('success');
        $this->assertSame(1, Message::count());
    }

    public function test_cv_download(): void
    {
        $this->get('/cv/download')->assertNotFound();

        Storage::fake('public');
        $path = UploadedFile::fake()->create('cv.pdf', 50, 'application/pdf')->store('cv/files', 'public');
        Profile::first()->update(['cv_file' => $path]);

        $this->get('/cv/download')->assertOk()->assertDownload('CV-dedy-septya-rahmat.pdf');
    }

    /* ---------------- Admin ---------------- */

    public function test_guest_cannot_access_admin(): void
    {
        $this->get('/admin/cv/experiences')->assertRedirect('/login');
        $this->get('/admin/messages')->assertRedirect('/login');
    }

    public function test_admin_pages_render(): void
    {
        $this->actingAs($this->master);

        foreach ([
            '/dashboard' => 'Admin/Dashboard',
            '/admin/cv/profil' => 'Admin/Cv/Profile',
            '/admin/cv/experiences' => 'Admin/Cv/Manage',
            '/admin/cv/educations' => 'Admin/Cv/Manage',
            '/admin/cv/skills' => 'Admin/Cv/Manage',
            '/admin/cv/achievements' => 'Admin/Cv/Manage',
            '/admin/cv/services' => 'Admin/Cv/Manage',
            '/admin/cv/testimonials' => 'Admin/Cv/Manage',
            '/admin/messages' => 'Admin/Messages/Index',
            '/admin/portfolios' => 'Admin/Portfolios/Index',
            '/admin/portfolios/create' => 'Admin/Portfolios/Create',
            '/admin/artikel' => 'Admin/Artikel/Index',
            '/admin/kategori' => 'Admin/Kategori/Index',
            '/admin/settings' => 'Admin/Settings/Index',
            '/admin/users' => 'Admin/Users/Index',
            '/admin/audit-trail' => 'Admin/AuditTrail/Index',
            '/admin/role-permissions' => 'Admin/RolePermissions/Index',
        ] as $url => $component) {
            $this->get($url)->assertOk()->assertInertia(fn (Assert $p) => $p->component($component));
        }

        $portfolio = Portfolio::first();
        $this->get("/admin/portfolios/{$portfolio->id}")->assertOk();
        $this->get("/admin/portfolios/{$portfolio->id}/edit")->assertOk();
    }

    public function test_viewer_role_cannot_manage_cv(): void
    {
        $viewer = User::where('email', 'user@example.com')->first();
        $this->actingAs($viewer)->get('/admin/cv/skills')->assertForbidden();
    }

    public function test_cv_resource_crud_reorder_and_toggle(): void
    {
        $this->actingAs($this->master);

        $this->post('/admin/cv/experiences', [
            'position' => 'Backend Developer',
            'organization' => 'PT Contoh',
            'type' => 'work',
            'start_date' => '2024-01-01',
            'is_current' => '1',
            'end_date' => '2024-06-01',
            'highlights' => ['Membangun API', '', 'Optimasi query'],
            'is_visible' => '1',
        ])->assertRedirect()->assertSessionHasNoErrors();

        $exp = Experience::where('organization', 'PT Contoh')->firstOrFail();
        $this->assertNull($exp->end_date, 'end_date dikosongkan bila is_current');
        $this->assertSame(['Membangun API', 'Optimasi query'], $exp->highlights);

        // validasi wajib
        $this->post('/admin/cv/experiences', ['type' => 'invalid'])
            ->assertSessionHasErrors(['position', 'organization', 'start_date', 'type']);

        // update
        $this->put("/admin/cv/experiences/{$exp->id}", [
            'position' => 'Lead Developer', 'organization' => 'PT Contoh', 'type' => 'work',
            'start_date' => '2024-01-01', 'end_date' => '2024-12-31', 'is_current' => '0', 'is_visible' => '1',
        ])->assertSessionHasNoErrors();
        $this->assertSame('Lead Developer', $exp->fresh()->position);

        // toggle
        $this->patch("/admin/cv/experiences/{$exp->id}/toggle");
        $this->assertFalse($exp->fresh()->is_visible);

        // reorder
        $ids = Experience::orderByDesc('id')->pluck('id')->all();
        $this->post('/admin/cv/experiences/reorder', ['ids' => $ids])->assertRedirect();
        $this->assertSame(1, Experience::find($ids[0])->sort_order);

        // delete
        $this->delete("/admin/cv/experiences/{$exp->id}");
        $this->assertModelMissing($exp);
    }

    public function test_skill_and_testimonial_with_image(): void
    {
        Storage::fake('public');
        $this->actingAs($this->master);

        $this->post('/admin/cv/skills', ['name' => 'Docker', 'category' => 'DevOps', 'level' => 60, 'is_visible' => '1'])
            ->assertSessionHasNoErrors();
        $this->assertDatabaseHas('skills', ['name' => 'Docker', 'level' => 60]);

        $this->post('/admin/cv/testimonials', [
            'name' => 'Pak Ahmad', 'content' => 'Sangat membantu!', 'rating' => 5,
            'photo' => UploadedFile::fake()->image('a.jpg'), 'is_visible' => '1',
        ])->assertSessionHasNoErrors();

        $photo = \App\Models\Testimonial::first()->photo;
        Storage::disk('public')->assertExists($photo);

        $this->get('/')->assertInertia(fn (Assert $p) => $p->has('testimonials', 1));
    }

    public function test_profile_update(): void
    {
        Storage::fake('public');
        $this->actingAs($this->master);

        $this->put('/admin/cv/profil', [
            'full_name' => 'Dedy S. Rahmat',
            'headline' => 'Laravel Developer',
            'whatsapp' => '0812-3456-789',
            'open_to_work' => '0',
            'hero_tags' => ['Laravel', 'React'],
            'stats' => [['value' => '5', 'label' => 'Proyek', 'caption' => '']],
            'cv_file' => UploadedFile::fake()->create('cv.pdf', 100, 'application/pdf'),
        ])->assertSessionHasNoErrors();

        $profile = Profile::first();
        $this->assertSame('Dedy S. Rahmat', $profile->full_name);
        $this->assertFalse($profile->open_to_work);
        $this->assertSame('https://wa.me/628123456789', $profile->whatsapp_url);
        $this->assertNotNull($profile->cv_file);

        // cache publik ikut diperbarui
        $this->get('/')->assertInertia(fn (Assert $p) => $p->where('profile.full_name', 'Dedy S. Rahmat'));
    }

    public function test_messages_inbox_actions(): void
    {
        $this->actingAs($this->master);
        $m = Message::create(['name' => 'A', 'email' => 'a@a.com', 'message' => 'Halo halo halo']);

        $this->get('/dashboard')->assertInertia(fn (Assert $p) => $p->where('unreadMessages', 1));

        $this->patch("/admin/messages/{$m->id}/read");
        $this->assertNotNull($m->fresh()->read_at);

        $this->patch("/admin/messages/{$m->id}/star");
        $this->assertTrue($m->fresh()->is_starred);

        $this->delete("/admin/messages/{$m->id}");
        $this->assertModelMissing($m);
    }

    public function test_portfolio_slug_is_unique(): void
    {
        $this->actingAs($this->master);
        $title = Portfolio::first()->title;

        $this->post('/admin/portfolios', [
            'title' => $title, 'description' => 'desc', 'category' => 'Web Development',
            'status' => 'published', 'highlight' => false, 'results' => "Hasil A\nHasil B",
        ])->assertSessionHasNoErrors()->assertRedirect(route('admin.portfolios.index'));

        $new = Portfolio::latest('id')->first();
        $this->assertStringEndsWith('-2', $new->slug);
        $this->assertSame(['Hasil A', 'Hasil B'], $new->results_list);
    }
}
