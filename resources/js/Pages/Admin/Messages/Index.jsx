import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import Pagination from "@/Components/Pagination";
import ConfirmationModal from "@/Components/ConfirmationModal";
import useFlashToast from "@/Components/Admin/useFlashToast";
import { Badge, Button, Card, EmptyState, IconButton, PageHeader, inputClass } from "@/Components/Admin/ui";
import { FiMail, FiMessageSquare, FiPhone, FiSearch, FiStar, FiTrash2 } from "react-icons/fi";

const formatDate = (iso) =>
    new Date(iso).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

/**
 * Kotak masuk pesan dari form kontak website.
 */
export default function MessagesIndex({ messages, filters, counts }) {
    useFlashToast();
    const [selected, setSelected] = useState(messages.data[0] ?? null);
    const [search, setSearch] = useState(filters.search || "");
    const [deleting, setDeleting] = useState(null);

    const open = (message) => {
        setSelected(message);
        if (!message.read_at) {
            router.patch(route("admin.messages.read", message.id), {}, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => setSelected({ ...message, read_at: new Date().toISOString() }),
            });
        }
    };

    const tabs = [
        { key: "all", label: "Semua", count: counts.all },
        { key: "unread", label: "Belum dibaca", count: counts.unread },
        { key: "starred", label: "Berbintang", count: counts.starred },
    ];

    const go = (params) =>
        router.get(route("admin.messages.index"), { ...filters, ...params }, { preserveState: false, replace: true });

    const replyLink = (m) => {
        const subject = encodeURIComponent(`Re: ${m.subject || "Pesan dari website"}`);
        return `mailto:${m.email}?subject=${subject}`;
    };

    const waLink = (m) => {
        if (!m.phone) return null;
        let n = m.phone.replace(/\D/g, "");
        if (n.startsWith("0")) n = "62" + n.slice(1);
        return `https://wa.me/${n}`;
    };

    return (
        <AdminLayout title="Pesan Masuk">
            <Head title="Pesan Masuk" />

            <div className="max-w-6xl mx-auto px-2 lg:px-6 py-4">
                <PageHeader
                    title="Pesan Masuk"
                    description="Pesan yang dikirim pengunjung lewat form kontak di website."
                    actions={
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                go({ search, page: 1 });
                            }}
                            className="relative"
                        >
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari pesan..." className={`${inputClass} pl-9 w-56`} />
                        </form>
                    }
                />

                <div className="flex gap-2 mb-4 overflow-x-auto">
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => go({ filter: t.key, page: 1 })}
                            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                                filters.filter === t.key
                                    ? "bg-primary-600 text-white"
                                    : "bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300"
                            }`}
                        >
                            {t.label} <span className="opacity-70">({t.count})</span>
                        </button>
                    ))}
                </div>

                {messages.data.length === 0 ? (
                    <EmptyState
                        title="Belum ada pesan"
                        description="Pesan dari form kontak di halaman depan akan muncul di sini."
                    />
                ) : (
                    <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4">
                        <Card className="p-0 overflow-hidden">
                            <ul className="-m-5 divide-y divide-neutral-100 dark:divide-neutral-700">
                                {messages.data.map((m) => (
                                    <li key={m.id}>
                                        <button
                                            onClick={() => open(m)}
                                            className={`w-full text-left px-4 py-3 flex gap-3 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 ${
                                                selected?.id === m.id ? "bg-primary-50 dark:bg-primary-900/30" : ""
                                            }`}
                                        >
                                            <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${m.read_at ? "bg-transparent" : "bg-primary-500"}`} />
                                            <span className="flex-1 min-w-0">
                                                <span className="flex justify-between gap-2">
                                                    <span className={`truncate ${m.read_at ? "" : "font-semibold"}`}>{m.name}</span>
                                                    <span className="text-xs text-neutral-400 shrink-0">{formatDate(m.created_at)}</span>
                                                </span>
                                                <span className="block text-sm truncate text-neutral-700 dark:text-neutral-300">{m.subject || "(tanpa subjek)"}</span>
                                                <span className="block text-xs truncate text-neutral-500">{m.message}</span>
                                            </span>
                                            {m.is_starred && <FiStar className="text-warning-500 fill-current shrink-0 mt-1" />}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </Card>

                        <Card>
                            {selected ? (
                                <div>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                                                {selected.subject || "(tanpa subjek)"}
                                            </h2>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
                                                {selected.name} &lt;{selected.email}&gt;
                                            </p>
                                            <p className="text-xs text-neutral-400 mt-0.5">{formatDate(selected.created_at)}</p>
                                        </div>
                                        <div className="flex">
                                            <IconButton
                                                title={selected.is_starred ? "Hapus bintang" : "Beri bintang"}
                                                onClick={() =>
                                                    router.patch(route("admin.messages.star", selected.id), {}, {
                                                        preserveScroll: true,
                                                        onSuccess: () => setSelected({ ...selected, is_starred: !selected.is_starred }),
                                                    })
                                                }
                                            >
                                                <FiStar className={selected.is_starred ? "text-warning-500 fill-current" : ""} />
                                            </IconButton>
                                            <IconButton title="Hapus" onClick={() => setDeleting(selected)}>
                                                <FiTrash2 />
                                            </IconButton>
                                        </div>
                                    </div>

                                    {selected.phone && (
                                        <p className="mt-2">
                                            <Badge>
                                                <FiPhone className="mr-1" /> {selected.phone}
                                            </Badge>
                                        </p>
                                    )}

                                    <div className="mt-5 whitespace-pre-line text-neutral-800 dark:text-neutral-200 leading-relaxed">
                                        {selected.message}
                                    </div>

                                    <div className="mt-6 flex flex-wrap gap-2">
                                        <a href={replyLink(selected)}>
                                            <Button>
                                                <FiMail /> Balas via Email
                                            </Button>
                                        </a>
                                        {waLink(selected) && (
                                            <a href={waLink(selected)} target="_blank" rel="noreferrer">
                                                <Button variant="secondary">
                                                    <FiMessageSquare /> WhatsApp
                                                </Button>
                                            </a>
                                        )}
                                        {selected.read_at && (
                                            <Button
                                                variant="ghost"
                                                onClick={() =>
                                                    router.patch(route("admin.messages.unread", selected.id), {}, {
                                                        preserveScroll: true,
                                                        onSuccess: () => setSelected({ ...selected, read_at: null }),
                                                    })
                                                }
                                            >
                                                Tandai belum dibaca
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-neutral-500">Pilih pesan untuk membaca.</p>
                            )}
                        </Card>
                    </div>
                )}

                <div className="mt-4 rounded-xl overflow-hidden">
                    <Pagination data={messages} showingText="Menampilkan {from}–{to} dari {total} pesan" />
                </div>
            </div>

            <ConfirmationModal
                isOpen={!!deleting}
                onClose={() => setDeleting(null)}
                onConfirm={() =>
                    router.delete(route("admin.messages.destroy", deleting.id), {
                        onFinish: () => {
                            setDeleting(null);
                            setSelected(null);
                        },
                    })
                }
                title="Hapus pesan?"
                message="Pesan akan dihapus permanen."
                confirmText="Hapus"
                cancelText="Batal"
            />
        </AdminLayout>
    );
}
