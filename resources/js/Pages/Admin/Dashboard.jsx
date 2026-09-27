import { Head, Link, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import useFlashToast from "@/Components/Admin/useFlashToast";
import { Badge, Card } from "@/Components/Admin/ui";
import {
    FiArrowRight,
    FiAward,
    FiBriefcase,
    FiCheckCircle,
    FiCircle,
    FiExternalLink,
    FiEye,
    FiFileText,
    FiFolder,
    FiInbox,
    FiPlus,
    FiZap,
} from "react-icons/fi";

/**
 * Dashboard: ringkasan konten, kelengkapan CV, dan pesan terbaru.
 */
export default function Dashboard({ stats, checklist, latestMessages, profileName }) {
    useFlashToast();
    const { auth } = usePage().props;
    const can = (p) => auth.user?.permissions?.includes(p);

    const done = checklist.filter((c) => c.done).length;
    const percent = Math.round((done / checklist.length) * 100);

    const cards = [
        { label: "Portofolio terbit", value: stats.portfolios_published, sub: `${stats.portfolios} total`, icon: FiFolder, href: route("admin.portfolios.index"), color: "text-primary-600 bg-primary-50 dark:bg-primary-900/40" },
        { label: "Artikel terbit", value: stats.articles_published, sub: `${stats.article_views.toLocaleString("id-ID")} kali dibaca`, icon: FiFileText, href: route("admin.artikel.index"), color: "text-accent-600 bg-accent-50 dark:bg-accent-900/40" },
        { label: "Pengalaman", value: stats.experiences, sub: `${stats.skills} keahlian · ${stats.achievements} sertifikat`, icon: FiBriefcase, href: route("admin.cv.experiences.index"), color: "text-warning-600 bg-warning-50 dark:bg-warning-900/30" },
        { label: "Pesan belum dibaca", value: stats.messages_unread, sub: `${stats.messages_total} pesan total`, icon: FiInbox, href: route("admin.messages.index"), color: "text-error-600 bg-error-50 dark:bg-error-900/30" },
    ];

    const quick = [
        { label: "Tambah portofolio", href: route("admin.portfolios.create"), icon: FiFolder, perm: "create portofolio" },
        { label: "Tulis artikel", href: route("admin.artikel.create"), icon: FiFileText, perm: "create artikel" },
        { label: "Tambah pengalaman", href: route("admin.cv.experiences.index"), icon: FiBriefcase, perm: "manage cv" },
        { label: "Tambah keahlian", href: route("admin.cv.skills.index"), icon: FiZap, perm: "manage cv" },
        { label: "Tambah sertifikat", href: route("admin.cv.achievements.index"), icon: FiAward, perm: "manage cv" },
    ].filter((q) => can(q.perm));

    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="max-w-6xl mx-auto px-2 lg:px-6 py-4 space-y-6">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                            Halo, {profileName?.split(" ")[0] || auth.user?.name} 👋
                        </h1>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                            Kelola CV, portofolio, dan tulisan Anda dari satu tempat.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <a href={route("welcome")} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50">
                            <FiExternalLink /> Website
                        </a>
                        <a href={route("cv")} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-700">
                            <FiEye /> Lihat CV
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {cards.map((c) => (
                        <Link key={c.label} href={c.href} className="group bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <span className={`p-2.5 rounded-lg ${c.color}`}>
                                    <c.icon className="w-5 h-5" />
                                </span>
                                <FiArrowRight className="text-neutral-300 group-hover:text-neutral-500 transition-colors" />
                            </div>
                            <p className="mt-4 text-3xl font-semibold text-neutral-900 dark:text-neutral-100">{c.value}</p>
                            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{c.label}</p>
                            <p className="text-xs text-neutral-500 mt-0.5">{c.sub}</p>
                        </Link>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <Card
                        className="lg:col-span-1"
                        title="Kelengkapan CV"
                        description={`${done} dari ${checklist.length} langkah selesai`}
                    >
                        <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-700 overflow-hidden mb-4">
                            <div className="h-full bg-success-500 transition-all" style={{ width: `${percent}%` }} />
                        </div>
                        <ul className="space-y-2">
                            {checklist.map((item) => (
                                <li key={item.label}>
                                    <Link href={route(item.route)} className="flex items-center gap-2 text-sm hover:text-primary-600">
                                        {item.done ? (
                                            <FiCheckCircle className="text-success-500 shrink-0" />
                                        ) : (
                                            <FiCircle className="text-neutral-300 shrink-0" />
                                        )}
                                        <span className={item.done ? "text-neutral-500 line-through" : "text-neutral-800 dark:text-neutral-200"}>
                                            {item.label}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </Card>

                    <Card
                        className="lg:col-span-2"
                        title="Pesan terbaru"
                        actions={
                            <Link href={route("admin.messages.index")} className="text-sm text-primary-600 hover:underline">
                                Lihat semua
                            </Link>
                        }
                    >
                        {latestMessages.length === 0 ? (
                            <p className="text-sm text-neutral-500">Belum ada pesan dari form kontak.</p>
                        ) : (
                            <ul className="divide-y divide-neutral-100 dark:divide-neutral-700 -my-2">
                                {latestMessages.map((m) => (
                                    <li key={m.id} className="py-3 flex gap-3">
                                        <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-200 flex items-center justify-center font-semibold shrink-0">
                                            {m.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium truncate">{m.name}</p>
                                                {!m.read_at && <Badge color="primary">Baru</Badge>}
                                            </div>
                                            <p className="text-sm text-neutral-500 truncate">{m.subject || m.message}</p>
                                        </div>
                                        <span className="text-xs text-neutral-400 shrink-0">
                                            {new Date(m.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {quick.length > 0 && (
                            <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-700">
                                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">Aksi cepat</p>
                                <div className="flex flex-wrap gap-2">
                                    {quick.map((q) => (
                                        <Link key={q.label} href={q.href} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600">
                                            <FiPlus className="w-3.5 h-3.5" /> {q.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
