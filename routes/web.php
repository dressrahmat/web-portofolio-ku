<?php

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\UploadController;
use App\Http\Controllers\Admin\ArtikelController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Front\BerandaController;
use App\Http\Controllers\Admin\KategoriController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\AuditTrailController;
use App\Http\Controllers\Admin\PortofolioController;
use App\Http\Controllers\Admin\RolePermissionController;

// Route untuk frontend (publik)
Route::get('/', [BerandaController::class, 'index'])->name('welcome');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->middleware(['permission:view dashboard'])
        ->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::prefix('admin')->name('admin.')->middleware(['permission:access admin panel'])->group(function () {

        // Resource Routes untuk Users
        Route::middleware(['permission:view users'])->group(function () {
            Route::resource('users', UserController::class)->except(['create', 'store', 'edit', 'update', 'destroy']);
        });

        Route::middleware(['permission:create users'])->group(function () {
            Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
            Route::post('/users', [UserController::class, 'store'])->name('users.store');
        });

        Route::middleware(['permission:edit users'])->group(function () {
            Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
            Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
        });

        Route::middleware(['permission:delete users'])->group(function () {
            Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
        });

        // Bulk operations untuk Users
        Route::post('/users/bulk-destroy', [UserController::class, 'bulkDestroy'])->middleware(['permission:delete users'])->name('users.bulk-destroy');
        Route::post('/users/export', [UserController::class, 'export'])->middleware(['permission:view users'])->name('users.export');
        Route::put('/users/bulk-update', [UserController::class, 'bulkUpdate'])->middleware(['permission:edit users'])->name('users.bulk-update');

        // Routes untuk Kategori
        Route::middleware(['permission:view kategori'])->group(function () {
            Route::resource('kategori', KategoriController::class);
        });

        Route::middleware(['permission:create kategori'])->group(function () {
            Route::get('/kategori/create', [KategoriController::class, 'create'])->name('kategori.create');
            Route::post('/kategori', [KategoriController::class, 'store'])->name('kategori.store');
        });

        Route::middleware(['permission:edit kategori'])->group(function () {
            Route::get('/kategori/{kategori}/edit', [KategoriController::class, 'edit'])->name('kategori.edit');
            Route::put('/kategori/{kategori}', [KategoriController::class, 'update'])->name('kategori.update');
        });

        Route::middleware(['permission:delete kategori'])->group(function () {
            Route::delete('/kategori/{kategori}', [KategoriController::class, 'destroy'])->name('kategori.destroy');
        });

        // Bulk operations untuk Kategori
        Route::post('/kategori/bulk-destroy', [KategoriController::class, 'bulkDestroy'])->middleware(['permission:delete kategori'])->name('kategori.bulk-destroy');
        Route::post('/kategori/export', [KategoriController::class, 'export'])->middleware(['permission:view kategori'])->name('kategori.export');
        Route::put('/kategori/bulk-update', [KategoriController::class, 'bulkUpdate'])->middleware(['permission:edit kategori'])->name('kategori.bulk-update');

        // Roles & Permissions
        Route::middleware(['permission:view roles', 'permission:view permissions'])->group(function () {
            Route::get('/role-permissions', [RolePermissionController::class, 'index'])->name('role-permissions.index');
        });

        // Routes untuk Artikel
        Route::middleware(['permission:view artikel'])->group(function () {
            Route::resource('artikel', ArtikelController::class);
        });

        Route::middleware(['permission:create artikel'])->group(function () {
            Route::get('/artikel/create', [ArtikelController::class, 'create'])->name('artikel.create');
            Route::post('/artikel', [ArtikelController::class, 'store'])->name('artikel.store');
        });

        Route::middleware(['permission:edit artikel'])->group(function () {
            Route::get('/artikel/{artikel}/edit', [ArtikelController::class, 'edit'])->name('artikel.edit');
            Route::put('/artikel/{artikel}', [ArtikelController::class, 'update'])->name('artikel.update');
            Route::post('/artikel/generate-slug', [ArtikelController::class, 'generateSlug'])->name('artikel.generate-slug');
        });

        Route::middleware(['permission:delete artikel'])->group(function () {
            Route::delete('/artikel/{artikel}', [ArtikelController::class, 'destroy'])->name('artikel.destroy');
        });

        // Bulk operations untuk Artikel
        Route::post('/artikel/bulk-destroy', [ArtikelController::class, 'bulkDestroy'])->middleware(['permission:delete artikel'])->name('artikel.bulk-destroy');
        Route::post('/artikel/export', [ArtikelController::class, 'export'])->middleware(['permission:view artikel'])->name('artikel.export');
        Route::put('/artikel/bulk-update', [ArtikelController::class, 'bulkUpdate'])->middleware(['permission:edit artikel'])->name('artikel.bulk-update');

        Route::prefix('roles')->name('roles.')->middleware(['permission:view roles'])->group(function () {
            Route::middleware(['permission:create roles'])->group(function () {
                Route::get('/create', [RolePermissionController::class, 'createRole'])->name('create');
                Route::post('/', [RolePermissionController::class, 'storeRole'])->name('store');
            });

            Route::middleware(['permission:edit roles'])->group(function () {
                Route::get('/{role}/edit', [RolePermissionController::class, 'editRole'])->name('edit');
                Route::put('/{role}', [RolePermissionController::class, 'updateRole'])->name('update');
            });
        });

        Route::prefix('permissions')->name('permissions.')->middleware(['permission:view permissions'])->group(function () {
            Route::middleware(['permission:create permissions'])->group(function () {
                Route::get('/create', [RolePermissionController::class, 'createPermission'])->name('create');
                Route::post('/', [RolePermissionController::class, 'storePermission'])->name('store');
            });

            Route::middleware(['permission:edit permissions'])->group(function () {
                Route::get('/{permission}/edit', [RolePermissionController::class, 'editPermission'])->name('edit');
                Route::put('/{permission}', [RolePermissionController::class, 'updatePermission'])->name('update');
            });
        });

        // Settings
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

        // Audit Trail
        Route::prefix('audit-trail')->name('audit-trail.')->middleware(['permission:view audit trail'])->group(function () {
            Route::get('/notifications', [AuditTrailController::class, 'notifications'])->name('notifications');
            Route::get('/', [AuditTrailController::class, 'index'])->name('index');
            Route::get('/{audit_trail}', [AuditTrailController::class, 'show'])->name('show');
            Route::delete('/cleanup', [AuditTrailController::class, 'cleanup'])->name('cleanup');
            Route::post('/export', [AuditTrailController::class, 'export'])->name('export');
        });

        // Portofolio
        Route::resource('portfolio', PortofolioController::class);

        // Nested routes untuk Portofolio
        Route::prefix('portfolio')->group(function () {
            // Technologies
            Route::post('/technologies', [PortofolioController::class, 'storeTechnology']);
            Route::put('/technologies/{technology}', [PortofolioController::class, 'updateTechnology']);
            Route::delete('/technologies/{technology}', [PortofolioController::class, 'destroyTechnology']);

            // Features
            Route::post('/features', [PortofolioController::class, 'storeFeature']);
            Route::put('/features/{feature}', [PortofolioController::class, 'updateFeature']);
            Route::delete('/features/{feature}', [PortofolioController::class, 'destroyFeature']);

            // Images
            Route::post('/images', [PortofolioController::class, 'storeImage']);
            Route::put('/images/{image}', [PortofolioController::class, 'updateImage']);
            Route::delete('/images/{image}', [PortofolioController::class, 'destroyImage']);

            // Bulk operations
            Route::post('/bulk-destroy', [PortofolioController::class, 'bulkDestroy']);
            Route::post('/bulk-update', [PortofolioController::class, 'bulkUpdate']);
        });

        Route::post('/upload-image', [UploadController::class, 'uploadImage'])->name('upload.image');
    });
});

// Route untuk menangani semua rute yang tidak terdaftar (404/403)
Route::fallback(function (Request $request) {
    if (! auth()->check()) {
        return Inertia::render('Admin/Errors/404', [
            'auth' => ['user' => null],
        ])->toResponse($request)->setStatusCode(404);
    }

    $user = auth()->user();
    $authData = [
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $user->getRoleNames()->toArray(),
            'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
        ],
    ];

    // Cek jika user mencoba mengakses admin tanpa permission
    if (str_starts_with($request->path(), 'admin') && ! $user->hasPermissionTo('access admin panel')) {
        return Inertia::render('Admin/Errors/403', ['auth' => $authData])
            ->toResponse($request)
            ->setStatusCode(403);
    }

    // Default ke 404
    return Inertia::render('Admin/Errors/404', ['auth' => $authData])
        ->toResponse($request)
        ->setStatusCode(404);
})->name('fallback');

require __DIR__.'/auth.php';