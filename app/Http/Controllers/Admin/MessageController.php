<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Kotak masuk pesan dari form kontak website.
 */
class MessageController extends Controller
{
    public function index(Request $request): Response
    {
        $filter = $request->query('filter', 'all');
        $search = trim((string) $request->query('search'));

        $messages = Message::query()
            ->when($filter === 'unread', fn ($q) => $q->unread())
            ->when($filter === 'starred', fn ($q) => $q->where('is_starred', true))
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('subject', 'like', "%{$search}%")
                        ->orWhere('message', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Messages/Index', [
            'messages' => $messages,
            'filters' => ['filter' => $filter, 'search' => $search],
            'counts' => [
                'all' => Message::count(),
                'unread' => Message::unread()->count(),
                'starred' => Message::where('is_starred', true)->count(),
            ],
        ]);
    }

    public function read(Message $message): RedirectResponse
    {
        $message->markAsRead();

        return back();
    }

    public function unread(Message $message): RedirectResponse
    {
        $message->forceFill(['read_at' => null])->save();

        return back()->with('success', 'Pesan ditandai belum dibaca.');
    }

    public function star(Message $message): RedirectResponse
    {
        $message->update(['is_starred' => ! $message->is_starred]);

        return back();
    }

    public function destroy(Message $message): RedirectResponse
    {
        $message->delete();

        return back()->with('success', 'Pesan dihapus.');
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $request->validate(['ids' => 'required|array', 'ids.*' => 'integer']);
        Message::whereIn('id', $request->ids)->delete();

        return back()->with('success', count($request->ids).' pesan dihapus.');
    }
}
