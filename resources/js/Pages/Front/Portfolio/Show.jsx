import { Link, usePage } from "@inertiajs/react";
import { FiArrowLeft, FiCalendar, FiCheckCircle, FiExternalLink, FiGithub, FiUser, FiBriefcase } from "react-icons/fi";
import MainLayout from "@/Layouts/MainLayout";
import Gallery from "@/Components/Front/Gallery";
import PortfolioCard from "@/Components/Front/PortfolioCard";
import { FaWhatsapp } from "@/Components/Front/Icons";

export default function PortfolioShow({ meta, portfolio, others }) {
    const { profile = {} } = usePage().props;

    const images = [
        ...(portfolio.featured_image ? [{ url: portfolio.featured_image_url, caption: null }] : []),
        ...portfolio.images.map((img) => ({ url: img.image_url, caption: img.caption })),
    ];

    const date = portfolio.project_date
        ? new Date(portfolio.project_date).toLocaleDateString("id-ID", { month: "long", year: "numeric" })
        : null;

    const facts = [
        { icon: FiBriefcase, label: "Kategori", value: portfolio.category },
        { icon: FiUser, label: "Klien", value: portfolio.client_name },
        { icon: FiUser, label: "Peran", value: portfolio.role },
        { icon: FiCalendar, label: "Waktu", value: date },
    ].filter((f) => f.value);

    return (
        <MainLayout meta={meta}>
            <article className="pt-28 pb-20 max-w-6xl mx-auto px-4 sm:px-6">
                <Link href={route("portfolio.index")} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600">
                    <FiArrowLeft /> Semua karya
                </Link>

                <header className="mt-6 max-w-3xl">
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{portfolio.category}</p>
                    <h1 className="mt-2 text-3xl md:text-5xl font-semibold tracking-tight leading-tight">{portfolio.title}</h1>
                    {portfolio.short_description && (
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">{portfolio.short_description}</p>
                    )}
                </header>

                <div className="mt-10 grid lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-10">
                        <Gallery images={images} title={portfolio.title} />

                        <section>
                            <h2 className="text-xl font-semibold mb-3">Tentang proyek</h2>
                            <div className="prose-content text-gray-700 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: portfolio.description }} />
                        </section>

                        {portfolio.features.length > 0 && (
                            <section>
                                <h2 className="text-xl font-semibold mb-4">Fitur & cara kerja</h2>
                                <ul className="grid sm:grid-cols-2 gap-3">
                                    {portfolio.features.map((f) => (
                                        <li key={f.id} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                                            <p className="font-medium text-sm">{f.feature}</p>
                                            {f.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{f.description}</p>}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </div>

                    <aside className="space-y-6 lg:sticky lg:top-24 self-start">
                        {portfolio.results_list.length > 0 && (
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 border border-green-100 dark:border-green-900/40">
                                <h2 className="font-semibold mb-3">Hasil yang dicapai</h2>
                                <ul className="space-y-2.5">
                                    {portfolio.results_list.map((r) => (
                                        <li key={r} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
                                            <FiCheckCircle className="mt-0.5 text-green-600 shrink-0" /> {r}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4">
                            {facts.map((f) => (
                                <div key={f.label} className="flex gap-3 text-sm">
                                    <f.icon className="mt-0.5 text-gray-400 shrink-0" />
                                    <div>
                                        <p className="text-gray-500 text-xs">{f.label}</p>
                                        <p className="font-medium">{f.value}</p>
                                    </div>
                                </div>
                            ))}

                            {portfolio.technologies.length > 0 && (
                                <div>
                                    <p className="text-gray-500 text-xs mb-2">Teknologi</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {portfolio.technologies.map((t) => (
                                            <span key={t.id} className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-xs">
                                                {t.technology}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {(portfolio.project_url || portfolio.github_url) && (
                                <div className="flex flex-col gap-2 pt-2">
                                    {portfolio.project_url && (
                                        <a href={portfolio.project_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium">
                                            <FiExternalLink /> Kunjungi website
                                        </a>
                                    )}
                                    {portfolio.github_url && (
                                        <a href={portfolio.github_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 text-sm font-medium">
                                            <FiGithub /> Lihat kode
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>

                        {profile.whatsapp_url && (
                            <div className="p-6 rounded-2xl bg-gray-900 dark:bg-gray-800 text-white">
                                <p className="font-semibold">Butuh sistem serupa?</p>
                                <p className="text-sm text-gray-300 mt-1">Diskusikan kebutuhan Anda, gratis.</p>
                                <a
                                    href={`${profile.whatsapp_url}?text=${encodeURIComponent(`Halo, saya tertarik dengan proyek "${portfolio.title}".`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366] text-white text-sm font-medium"
                                >
                                    <FaWhatsapp /> Chat WhatsApp
                                </a>
                            </div>
                        )}
                    </aside>
                </div>

                {others.length > 0 && (
                    <section className="mt-20">
                        <h2 className="text-2xl font-semibold mb-6">Karya lainnya</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {others.map((p, i) => (
                                <PortfolioCard key={p.id} item={p} index={i} />
                            ))}
                        </div>
                    </section>
                )}
            </article>
        </MainLayout>
    );
}
