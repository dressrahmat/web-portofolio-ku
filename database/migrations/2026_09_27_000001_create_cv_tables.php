<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Tabel-tabel untuk CMS CV & Portofolio.
 */
return new class extends Migration
{
    public function up(): void
    {
        // Profil pemilik website (singleton - hanya 1 baris)
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('nickname')->nullable();
            $table->string('headline')->nullable();          // mis. "Fullstack Developer & Digital Marketer"
            $table->string('tagline', 500)->nullable();       // kalimat singkat di hero
            $table->text('short_bio')->nullable();            // ringkasan untuk CV
            $table->longText('about')->nullable();            // cerita "Tentang Saya" (HTML sederhana)
            $table->string('photo')->nullable();
            $table->string('cv_file')->nullable();            // file PDF CV yang diunggah
            $table->string('location')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('whatsapp')->nullable();           // format 62xxx
            $table->string('website')->nullable();
            $table->string('github_url')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->string('instagram_url')->nullable();
            $table->string('youtube_url')->nullable();
            $table->string('tiktok_url')->nullable();
            $table->boolean('open_to_work')->default(true);
            $table->string('availability_text')->nullable();  // mis. "Terbuka untuk proyek freelance"
            $table->json('hero_tags')->nullable();            // ["Laravel", "React", ...]
            $table->json('stats')->nullable();                // [{value:"3+", label:"Tahun", caption:"..."}]
            $table->timestamps();
        });

        // Pengalaman kerja / freelance / organisasi
        Schema::create('experiences', function (Blueprint $table) {
            $table->id();
            $table->string('type', 30)->default('work');      // work|freelance|organization|volunteer
            $table->string('position');
            $table->string('organization');
            $table->string('organization_url')->nullable();
            $table->string('location')->nullable();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->boolean('is_current')->default(false);
            $table->text('description')->nullable();
            $table->json('highlights')->nullable();           // poin-poin pencapaian
            $table->boolean('is_visible')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('educations', function (Blueprint $table) {
            $table->id();
            $table->string('institution');
            $table->string('degree')->nullable();             // S1, SMA, Bootcamp, ...
            $table->string('field_of_study')->nullable();
            $table->string('location')->nullable();
            $table->string('start_year', 10)->nullable();
            $table->string('end_year', 10)->nullable();       // kosong = sekarang
            $table->string('grade')->nullable();              // IPK / nilai
            $table->text('description')->nullable();
            $table->boolean('is_visible')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category')->default('Lainnya');
            $table->unsignedTinyInteger('level')->default(70); // 0-100
            $table->boolean('is_featured')->default(false);   // tampil di hero
            $table->boolean('is_visible')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Sertifikat, penghargaan, dan pencapaian lain
        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->string('type', 30)->default('certificate'); // certificate|award|other
            $table->string('title');
            $table->string('issuer')->nullable();
            $table->date('issued_at')->nullable();
            $table->string('credential_id')->nullable();
            $table->string('credential_url')->nullable();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->boolean('is_visible')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('icon', 50)->default('code');
            $table->text('description')->nullable();
            $table->json('items')->nullable();                // daftar yang termasuk dalam layanan
            $table->string('price_note')->nullable();         // mis. "Mulai Rp1,5 jt"
            $table->boolean('is_visible')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('role')->nullable();
            $table->string('company')->nullable();
            $table->text('content');
            $table->string('photo')->nullable();
            $table->unsignedTinyInteger('rating')->default(5);
            $table->boolean('is_visible')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        // Pesan dari form kontak
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('subject')->nullable();
            $table->text('message');
            $table->timestamp('read_at')->nullable();
            $table->boolean('is_starred')->default(false);
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();

            $table->index('read_at');
        });

        // Tambahan kolom portofolio agar lebih lengkap sebagai studi kasus
        Schema::table('portfolios', function (Blueprint $table) {
            $table->string('role')->nullable()->after('client_name');
            $table->text('results')->nullable()->after('description'); // satu hasil per baris
        });
    }

    public function down(): void
    {
        Schema::table('portfolios', function (Blueprint $table) {
            $table->dropColumn(['role', 'results']);
        });

        Schema::dropIfExists('messages');
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('services');
        Schema::dropIfExists('achievements');
        Schema::dropIfExists('skills');
        Schema::dropIfExists('educations');
        Schema::dropIfExists('experiences');
        Schema::dropIfExists('profiles');
    }
};
