import { Link, router } from "@inertiajs/react";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import MainLayout from "@/Layouts/MainLayout";
import ArticleCard from "@/Components/Front/ArticleCard";

export default function BlogIndex({ meta, articles, categories, filters }) {
    const [q, setQ] = useState(filters.q || "");

    const chip = (active) =>
        `px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
            active ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900" : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`;

    return (
        <MainLayout meta={meta}>
            <section className="pt-32 pb-24 max-w-6xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div>
                        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-600 dark:text-blue-400">Blog</p>
                        <h1 className="mt-2 text-4xl md:text-5xl font-semibold tracking-tight">Catatan & tulisan</h1>
                        <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-xl">
                            Berbagi pengalaman membangun produk digital, tutorial, dan pelajaran dari lapangan.
                        </p>
                    </div>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            router.get(route("blog.index"), { ...filters, q: q || undefined, page: undefined }, { preserveState: true });
                        }}
                        className="relative w-full md:w-72"
                    >
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Cari tulisan..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500"
                        />
                    </form>
                </div>

                {categories.length > 0 && (
                    <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
                        <Link href={route("blog.index")} className={chip(!filters.kategori)}>Semua</Link>
                        {categories.map((c) => (
                            <Link key={c.id} href={route("blog.index", { kategori: c.slug })} className={chip(filters.kategori === c.slug)}>
                                {c.nama}
                            </Link>
                        ))}
                    </div>
                )}

                {articles.data.length === 0 ? (
                    <div className="mt-20 text-center">
                        <p className="text-lg font-medium">Belum ada tulisan</p>
                        <p className="text-gray-500 mt-1 text-sm">
                            {filters.q || filters.kategori ? "Coba kata kunci atau kategori lain." : "Tulisan pertama sedang disiapkan."}
                        </p>
                    </div>
                ) : (
                    <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.data.map((a, i) => (
                            <ArticleCard key={a.id} article={a} index={i % 3} />
                        ))}
                    </div>
                )}

                {articles.last_page > 1 && (
                    <nav className="mt-12 flex justify-center gap-1 flex-wrap">
                        {articles.links.map((l, i) =>
                            l.url ? (
                                <Link
                                    key={i}
                                    href={l.url}
                                    preserveScroll
                                    className={`min-w-[2.5rem] px-3 py-2 rounded-lg text-sm text-center ${
                                        l.active ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900" : "hover:bg-gray-100 dark:hover:bg-gray-800"
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: l.label }}
                                />
                            ) : (
                                <span key={i} className="px-3 py-2 text-sm text-gray-400" dangerouslySetInnerHTML={{ __html: l.label }} />
                            )
                        )}
                    </nav>
                )}
            </section>
        </MainLayout>
    );
}
