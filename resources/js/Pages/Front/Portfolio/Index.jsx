import { Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import PortfolioCard from "@/Components/Front/PortfolioCard";

export default function PortfolioIndex({ meta, portfolios, categories, activeCategory }) {
    const chip = (active) =>
        `px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
            active
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`;

    return (
        <MainLayout meta={meta}>
            <section className="pt-32 pb-24 max-w-6xl mx-auto px-4 sm:px-6">
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-600 dark:text-blue-400">Portofolio</p>
                <h1 className="mt-2 text-4xl md:text-5xl font-semibold tracking-tight">Karya & studi kasus</h1>
                <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl">
                    Proyek yang pernah saya kerjakan — masalah yang diselesaikan, cara kerjanya, dan hasil yang dicapai.
                </p>

                {categories.length > 1 && (
                    <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
                        <Link href={route("portfolio.index")} preserveScroll className={chip(!activeCategory)}>
                            Semua
                        </Link>
                        {categories.map((c) => (
                            <Link key={c} href={route("portfolio.index", { kategori: c })} preserveScroll className={chip(activeCategory === c)}>
                                {c}
                            </Link>
                        ))}
                    </div>
                )}

                {portfolios.length === 0 ? (
                    <p className="mt-16 text-center text-gray-500">Belum ada karya di kategori ini.</p>
                ) : (
                    <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {portfolios.map((p, i) => (
                            <PortfolioCard key={p.id} item={p} index={i % 3} />
                        ))}
                    </div>
                )}
            </section>
        </MainLayout>
    );
}
