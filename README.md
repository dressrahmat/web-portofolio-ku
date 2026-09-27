# CMS CV & Portofolio — Dedy Septya Rahmat

Website pribadi berbasis **Laravel 12 + Inertia.js + React 18 + Tailwind**. Semua isi website (profil, pengalaman, keahlian, portofolio, blog, dan CV) dikelola dari panel admin, tanpa mengubah kode.

## Fitur

**Website publik**

| Halaman | URL | Isi |
|---|---|---|
| Beranda | `/` | Hero, Tentang + angka sorotan, Layanan, Karya pilihan, Pengalaman & Pendidikan, Sertifikat, Keahlian, Testimoni, Tulisan terbaru, Form kontak |
| Portofolio | `/portofolio`, `/portofolio/{slug}` | Daftar karya dengan filter kategori, halaman studi kasus (galeri, fitur, hasil, teknologi, tombol WhatsApp) |
| Blog | `/blog`, `/blog/{slug}` | Artikel yang berstatus *terbit*, filter kategori, pencarian, penghitung dibaca |
| CV | `/cv` | CV otomatis dari data admin, siap **Cetak / Simpan PDF** (A4). Tombol **Unduh PDF** muncul jika file CV diunggah |
| Sitemap | `/sitemap.xml` | Untuk Google Search Console |

Section yang datanya kosong otomatis disembunyikan. Tersedia mode gelap, tombol WhatsApp melayang, meta SEO/Open Graph per halaman, dan script Google Analytics / GTM / Pixel dari menu Pengaturan.

**Panel admin** (`/login`)

- **Dashboard** — statistik, checklist kelengkapan CV, pesan terbaru, aksi cepat
- **Konten CV** — Profil & Kontak (foto, file CV PDF, bio, sosial media, tag hero, angka sorotan), Pengalaman, Pendidikan, Keahlian, Sertifikat & Penghargaan, Layanan, Testimoni. Setiap item bisa diurutkan (↑↓) dan disembunyikan tanpa dihapus
- **Karya & Tulisan** — Portofolio (sekarang dengan *Peran* dan *Hasil yang dicapai*), Artikel, Kategori
- **Pesan Masuk** — pesan dari form kontak (tandai dibaca, bintang, balas via email/WhatsApp)
- **Sistem** — Pengaturan website, Pengguna, Role & Permission, Audit Trail

## Instalasi (baru)

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
npm run build
php artisan serve
```

Login awal: `master@example.com` / `password` — **segera ganti email & password** lewat menu profil akun.

## Update dari versi sebelumnya (database sudah ada)

```bash
git pull   # atau salin file baru
composer install
php artisan migrate          # membuat tabel CV + kolom portofolio baru
php artisan db:seed --class=RolePermissionSeeder   # menambah permission "manage cv" & "view messages"
php artisan db:seed --class=CvSeeder               # opsional: isi data awal (hanya mengisi tabel yang masih kosong)
php artisan storage:link
npm run build
php artisan optimize:clear
```

Seeder aman dijalankan ulang: tidak menimpa data yang sudah Anda ubah.

## Catatan

- **Registrasi publik dinonaktifkan** — tambah akun lewat Admin > Pengguna.
- Role `master` mendapat semua permission. Untuk role lain, centang `manage cv` dan `view messages` di Role & Permission.
- Form kontak dibatasi 5 kiriman/menit per IP dan punya honeypot anti-bot.
- Menambah bagian CV baru cukup membuat satu controller turunan `App\Http\Controllers\Admin\Cv\CvResourceController` (definisikan model, field, kolom) lalu daftarkan di `routes/web.php` — form dan tabel admin dibangun otomatis oleh `Pages/Admin/Cv/Manage.jsx`.

## Testing

```bash
php artisan test
```

## Struktur penting

```
app/Http/Controllers/Front/BerandaController.php   # semua halaman publik
app/Http/Controllers/Admin/Cv/                     # modul CV (generik + profil)
app/Http/Controllers/Admin/MessageController.php   # pesan masuk
app/Models/{Profile,Experience,Education,Skill,Achievement,Service,Testimonial,Message}.php
database/seeders/CvSeeder.php                      # data awal
resources/js/Pages/Front/                          # Home, Portfolio, Blog, Cv
resources/js/Pages/Admin/Cv/                       # Manage.jsx (generik), Profile.jsx
resources/js/Components/Front/ & Components/Admin/ # komponen UI
```
