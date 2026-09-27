<?php

use App\Http\Controllers\Admin\ArtikelController;
use App\Http\Controllers\Admin\AuditTrailController;
use App\Http\Controllers\Admin\Cv;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\KategoriController;
use App\Http\Controllers\Admin\MessageController;
use App\Http\Controllers\Admin\PortofolioController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\RolePermissionController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\UploadController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Front\BerandaController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Halaman publik
|--------------------------------------------------------------------------
*/
Route::get('/', [BerandaController::class, 'index'])->name('welcome');
Route::get('/portofolio', [BerandaController::class, 'portfolios'])->name('portfolio.index');
Route::get('/portofolio/{slug}', [BerandaController::class, 'portfolioShow'])->name('portfolio.show');
Route::get('/blog', [BerandaController::class, 'blog'])->name('blog.index');
Route::get('/blog/{slug}', [BerandaController::class, 'blogShow'])->name('blog.show');
Route::get('/cv', [BerandaController::class, 'cv'])->name('cv');
Route::get('/cv/download', [BerandaController::class, 'cvDownload'])->name('cv.download');
Route::post('/kontak', [BerandaController::class, 'contact'])->middleware('throttle:5,1')->name('contact.store');
Route::get('/sitemap.xml', [BerandaController::class, 'sitemap'])->name('sitemap');

/*
|--------------------------------------------------------------------------
| Area admin
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->middleware(['permission:view dashboard'])
        ->name('dashboard');

    // Akun (nama, email, password, foto)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::prefix('admin')->name('admin.')->middleware(['permission:access admin panel'])->group(function () {

        /*
         * Konten CV
         */
        Route::prefix('cv')->name('cv.')->middleware(['permission:manage cv'])->group(function () {
            Route::get('/profil', [Cv\ProfileController::class, 'edit'])->name('profile.edit');
            Route::put('/profil', [Cv\ProfileController::class, 'update'])->name('profile.update');

            $resources = [
                'experiences' => Cv\ExperienceController::class,
                'educations' => Cv\EducationController::class,
                'skills' => Cv\SkillController::class,
                'achievements' => Cv\AchievementController::class,
                'services' => Cv\ServiceController::class,
                'testimonials' => Cv\TestimonialController::class,
            ];

            foreach ($resources as $key => $controller) {
                Route::prefix($key)->name($key.'.')->controller($controller)->group(function () {
                    Route::get('/', 'index')->name('index');
                    Route::post('/', 'store')->name('store');
                    Route::post('/reorder', 'reorder')->name('reorder');
                    Route::put('/{id}', 'update')->whereNumber('id')->name('update');
                    Route::patch('/{id}/toggle', 'toggle')->whereNumber('id')->name('toggle');
                    Route::delete('/{id}', 'destroy')->whereNumber('id')->name('destroy');
                });
            }
        });

        /*
         * Pesan masuk dari form kontak
         */
        Route::prefix('messages')->name('messages.')->middleware(['permission:view messages'])->controller(MessageController::class)->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/bulk-destroy', 'bulkDestroy')->name('bulk-destroy');
            Route::patch('/{message}/read', 'read')->name('read');
            Route::patch('/{message}/unread', 'unread')->name('unread');
            Route::patch('/{message}/star', 'star')->name('star');
            Route::delete('/{message}', 'destroy')->name('destroy');
        });

        /*
         * Portofolio
         */
        Route::middleware(['permission:create portofolio'])->group(function () {
            Route::get('/portfolios/create', [PortofolioController::class, 'create'])->name('portfolios.create');
            Route::post('/portfolios', [PortofolioController::class, 'store'])->name('portfolios.store');
        });
        Route::middleware(['permission:edit portofolio'])->group(function () {
            Route::get('/portfolios/{portfolio}/edit', [PortofolioController::class, 'edit'])->name('portfolios.edit');
            Route::put('/portfolios/{portfolio}', [PortofolioController::class, 'update'])->name('portfolios.update');
            Route::post('/portfolios/bulk-update', [PortofolioController::class, 'bulkUpdate'])->name('portfolios.bulk-update');
            Route::post('/portfolios/technologies', [PortofolioController::class, 'storeTechnology'])->name('portfolios.technologies.store');
            Route::put('/portfolios/technologies/{technology}', [PortofolioController::class, 'updateTechnology'])->name('portfolios.technologies.update');
            Route::delete('/portfolios/technologies/{technology}', [PortofolioController::class, 'destroyTechnology'])->name('portfolios.technologies.destroy');
            Route::post('/portfolios/features', [PortofolioController::class, 'storeFeature'])->name('portfolios.features.store');
            Route::put('/portfolios/features/{feature}', [PortofolioController::class, 'updateFeature'])->name('portfolios.features.update');
            Route::delete('/portfolios/features/{feature}', [PortofolioController::class, 'destroyFeature'])->name('portfolios.features.destroy');
            Route::post('/portfolios/images', [PortofolioController::class, 'storeImage'])->name('portfolios.images.store');
            Route::put('/portfolios/images/{image}', [PortofolioController::class, 'updateImage'])->name('portfolios.images.update');
            Route::delete('/portfolios/images/{image}', [PortofolioController::class, 'destroyImage'])->name('portfolios.images.destroy');
        });
        Route::middleware(['permission:delete portofolio'])->group(function () {
            Route::delete('/portfolios/{portfolio}', [PortofolioController::class, 'destroy'])->name('portfolios.destroy');
            Route::post('/portfolios/bulk-destroy', [PortofolioController::class, 'bulkDestroy'])->name('portfolios.bulk-destroy');
        });
        Route::middleware(['permission:view portofolio'])->group(function () {
            Route::get('/portfolios', [PortofolioController::class, 'index'])->name('portfolios.index');
            Route::get('/portfolios/{portfolio}', [PortofolioController::class, 'show'])->whereNumber('portfolio')->name('portfolios.show');
        });

        /*
         * Artikel (blog)
         */
        Route::middleware(['permission:create artikel'])->group(function () {
            Route::get('/artikel/create', [ArtikelController::class, 'create'])->name('artikel.create');
            Route::post('/artikel', [ArtikelController::class, 'store'])->name('artikel.store');
        });
        Route::middleware(['permission:edit artikel'])->group(function () {
            Route::get('/artikel/{artikel}/edit', [ArtikelController::class, 'edit'])->name('artikel.edit');
            Route::put('/artikel/{artikel}', [ArtikelController::class, 'update'])->name('artikel.update');
            Route::post('/artikel/generate-slug', [ArtikelController::class, 'generateSlug'])->name('artikel.generate-slug');
            Route::put('/artikel/bulk-update', [ArtikelController::class, 'bulkUpdate'])->name('artikel.bulk-update');
        });
        Route::middleware(['permission:delete artikel'])->group(function () {
            Route::delete('/artikel/{artikel}', [ArtikelController::class, 'destroy'])->name('artikel.destroy');
            Route::post('/artikel/bulk-destroy', [ArtikelController::class, 'bulkDestroy'])->name('artikel.bulk-destroy');
        });
        Route::middleware(['permission:view artikel'])->group(function () {
            Route::get('/artikel', [ArtikelController::class, 'index'])->name('artikel.index');
            Route::get('/artikel/{artikel}', [ArtikelController::class, 'show'])->whereNumber('artikel')->name('artikel.show');
            Route::post('/artikel/export', [ArtikelController::class, 'export'])->name('artikel.export');
        });

        /*
         * Kategori artikel
         */
        Route::middleware(['permission:create kategori'])->group(function () {
            Route::get('/kategori/create', [KategoriController::class, 'create'])->name('kategori.create');
            Route::post('/kategori', [KategoriController::class, 'store'])->name('kategori.store');
        });
        Route::middleware(['permission:edit kategori'])->group(function () {
            Route::get('/kategori/{kategori}/edit', [KategoriController::class, 'edit'])->name('kategori.edit');
            Route::put('/kategori/{kategori}', [KategoriController::class, 'update'])->name('kategori.update');
            Route::put('/kategori/bulk-update', [KategoriController::class, 'bulkUpdate'])->name('kategori.bulk-update');
        });
        Route::middleware(['permission:delete kategori'])->group(function () {
            Route::delete('/kategori/{kategori}', [KategoriController::class, 'destroy'])->name('kategori.destroy');
            Route::post('/kategori/bulk-destroy', [KategoriController::class, 'bulkDestroy'])->name('kategori.bulk-destroy');
        });
        Route::middleware(['permission:view kategori'])->group(function () {
            Route::get('/kategori', [KategoriController::class, 'index'])->name('kategori.index');
            Route::get('/kategori/{kategori}', [KategoriController::class, 'show'])->whereNumber('kategori')->name('kategori.show');
            Route::post('/kategori/export', [KategoriController::class, 'export'])->name('kategori.export');
        });

        // Upload gambar dari editor artikel
        Route::post('/upload-image', [UploadController::class, 'uploadImage'])
            ->middleware(['permission:edit artikel|create artikel'])
            ->name('upload.image');

        /*
         * Pengguna
         */
        Route::middleware(['permission:create users'])->group(function () {
            Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
            Route::post('/users', [UserController::class, 'store'])->name('users.store');
        });
        Route::middleware(['permission:edit users'])->group(function () {
            Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
            Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
            Route::put('/users/bulk-update', [UserController::class, 'bulkUpdate'])->name('users.bulk-update');
        });
        Route::middleware(['permission:delete users'])->group(function () {
            Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
            Route::post('/users/bulk-destroy', [UserController::class, 'bulkDestroy'])->name('users.bulk-destroy');
        });
        Route::middleware(['permission:view users'])->group(function () {
            Route::get('/users', [UserController::class, 'index'])->name('users.index');
            Route::get('/users/{user}', [UserController::class, 'show'])->whereNumber('user')->name('users.show');
            Route::post('/users/export', [UserController::class, 'export'])->name('users.export');
        });

        /*
         * Role & Permission
         */
        Route::middleware(['permission:view roles|view permissions'])->group(function () {
            Route::get('/role-permissions', [RolePermissionController::class, 'index'])->name('role-permissions.index');
        });

        Route::prefix('roles')->name('roles.')->group(function () {
            Route::middleware(['permission:create roles'])->group(function () {
                Route::get('/create', [RolePermissionController::class, 'createRole'])->name('create');
                Route::post('/', [RolePermissionController::class, 'storeRole'])->name('store');
            });
            Route::middleware(['permission:edit roles'])->group(function () {
                Route::get('/{role}/edit', [RolePermissionController::class, 'editRole'])->name('edit');
                Route::put('/{role}', [RolePermissionController::class, 'updateRole'])->name('update');
            });
        });

        Route::prefix('permissions')->name('permissions.')->group(function () {
            Route::middleware(['permission:create permissions'])->group(function () {
                Route::get('/create', [RolePermissionController::class, 'createPermission'])->name('create');
                Route::post('/', [RolePermissionController::class, 'storePermission'])->name('store');
            });
            Route::middleware(['permission:edit permissions'])->group(function () {
                Route::get('/{permission}/edit', [RolePermissionController::class, 'editPermission'])->name('edit');
                Route::put('/{permission}', [RolePermissionController::class, 'updatePermission'])->name('update');
            });
        });

        /*
         * Pengaturan website
         */
        Route::prefix('settings')->name('settings.')->group(function () {
            Route::get('/', [SettingController::class, 'index'])->middleware(['permission:view settings'])->name('index');
            Route::middleware(['permission:edit settings'])->group(function () {
                Route::put('/', [SettingController::class, 'update'])->name('update');
                Route::delete('/images/{type}', [SettingController::class, 'removeImage'])->name('removeImage');
                Route::post('/upload-logo', [SettingController::class, 'uploadLogoOnly'])->name('upload-logo');
                Route::post('/upload-favicon', [SettingController::class, 'uploadFaviconOnly'])->name('upload-favicon');
                Route::post('/upload-og-image', [SettingController::class, 'uploadOgImageOnly'])->name('upload-og-image');
            });
        });

        /*
         * Audit Trail
         */
        Route::prefix('audit-trail')->name('audit-trail.')->middleware(['permission:view audit trail'])->group(function () {
            Route::get('/notifications', [AuditTrailController::class, 'notifications'])->name('notifications');
            Route::get('/', [AuditTrailController::class, 'index'])->name('index');
            Route::delete('/cleanup', [AuditTrailController::class, 'cleanup'])->name('cleanup');
            Route::post('/export', [AuditTrailController::class, 'export'])->name('export');
            Route::get('/{audit_trail}', [AuditTrailController::class, 'show'])->name('show');
        });
    });
});

require __DIR__.'/auth.php';

// Halaman 404/403 untuk rute yang tidak terdaftar
Route::fallback(function (Request $request) {
    $user = $request->user();

    if ($user && str_starts_with($request->path(), 'admin') && ! $user->can('access admin panel')) {
        return Inertia::render('Admin/Errors/403')->toResponse($request)->setStatusCode(403);
    }

    return Inertia::render('Admin/Errors/404')->toResponse($request)->setStatusCode(404);
})->name('fallback');
