<?php

namespace App\Http\Controllers\Admin\Cv;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Profil publik pemilik website: identitas, bio, kontak, foto, file CV.
 */
class ProfileController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('Admin/Cv/Profile', [
            'profile' => Profile::current(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $profile = Profile::current();

        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'nickname' => 'nullable|string|max:100',
            'headline' => 'nullable|string|max:255',
            'tagline' => 'nullable|string|max:500',
            'short_bio' => 'nullable|string|max:2000',
            'about' => 'nullable|string|max:20000',
            'location' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:30',
            'whatsapp' => 'nullable|string|max:30',
            'website' => 'nullable|url|max:255',
            'github_url' => 'nullable|url|max:255',
            'linkedin_url' => 'nullable|url|max:255',
            'instagram_url' => 'nullable|url|max:255',
            'youtube_url' => 'nullable|url|max:255',
            'tiktok_url' => 'nullable|url|max:255',
            'open_to_work' => 'boolean',
            'availability_text' => 'nullable|string|max:255',
            'hero_tags' => 'nullable|array|max:12',
            'hero_tags.*' => 'nullable|string|max:50',
            'stats' => 'nullable|array|max:6',
            'stats.*.value' => 'nullable|string|max:20',
            'stats.*.label' => 'nullable|string|max:60',
            'stats.*.caption' => 'nullable|string|max:120',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:3072',
            'remove_photo' => 'nullable|boolean',
            'cv_file' => 'nullable|file|mimes:pdf|max:5120',
            'remove_cv_file' => 'nullable|boolean',
        ], [], [
            'full_name' => 'nama lengkap',
            'cv_file' => 'file CV',
            'photo' => 'foto',
        ]);

        $data = collect($validated)->except(['photo', 'remove_photo', 'cv_file', 'remove_cv_file'])->all();
        $data['open_to_work'] = $request->boolean('open_to_work');
        $data['hero_tags'] = collect($request->input('hero_tags', []))->map(fn ($t) => trim((string) $t))->filter()->values()->all();
        $data['stats'] = collect($request->input('stats', []))
            ->map(fn ($s) => [
                'value' => trim((string) ($s['value'] ?? '')),
                'label' => trim((string) ($s['label'] ?? '')),
                'caption' => trim((string) ($s['caption'] ?? '')),
            ])
            ->filter(fn ($s) => $s['value'] !== '' || $s['label'] !== '')
            ->values()
            ->all();

        foreach (['photo' => 'cv/profile', 'cv_file' => 'cv/files'] as $field => $folder) {
            if ($request->hasFile($field)) {
                $this->deleteFile($profile->{$field});
                $data[$field] = $request->file($field)->store($folder, 'public');
            } elseif ($request->boolean('remove_'.$field)) {
                $this->deleteFile($profile->{$field});
                $data[$field] = null;
            }
        }

        $profile->update($data);

        return back()->with('success', 'Profil berhasil disimpan.');
    }

    private function deleteFile(?string $path): void
    {
        if ($path && ! str_starts_with($path, 'assets/')) {
            Storage::disk('public')->delete($path);
        }
    }
}
