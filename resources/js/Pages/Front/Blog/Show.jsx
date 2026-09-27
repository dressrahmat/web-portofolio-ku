import { Link, usePage } from "@inertiajs/react";
import { FiArrowLeft, FiClock, FiEye, FiShare2 } from "react-icons/fi";
import MainLayout from "@/Layouts/MainLayout";
import ArticleCard, { formatDate } from "@/Components/Front/ArticleCard";

export default function BlogShow({ meta, article, related }) {
    const { profile = {} } = usePage().props;

    const share = async () => {
        const data = { title: article.judul, url: window.location.href };
        if (navigator.share) {
            try {
                await navigator.share(data);
            } catch (e) {
                /* dibatalkan */
            }
        } else {
            await navigator.clipboard?.writeText(window.location.href);
            alert("Link disalin");
        }
    };

    return (
        <MainLayout meta={meta}>
            <article className="pt-28 pb-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    <Link href={route("blog.index")} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600">
                        <FiArrowLeft /> Semua tulisan
                    </Link>

                    <div className="mt-6 flex flex-wrap gap-2">
                        {article.kategori.map((k) => (
                            <Link key={k.id} href={route("blog.index", { kategori: k.slug })} className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                                {k.nama}
                            </Link>
                        ))}
                    </div>
                    <h1 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight leading-tight">{article.judul}</h1>

                    <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-2">
                            {profile.photo_url && <img src={profile.photo_url} alt="" className="w-8 h-8 rounded-full object-cover" />}
                            <span className="font-medium text-gray-800 dark:text-gray-200">{profile.full_name}</span>
                        </span>
                        <span>{formatDate(article.diterbitkan_pada)}</span>
                        <span className="flex items-center gap-1"><FiClock /> {article.waktu_baca} mnt baca</span>
                        <span className="flex items-center gap-1"><FiEye /> {article.jumlah_dilihat}×</span>
                        <button onClick={share} className="flex items-center gap-1 hover:text-blue-600"><FiShare2 /> Bagikan</button>
                    </div>
                </div>

                {article.gambar_url && (
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-10">
                        <img src={article.gambar_url} alt={article.judul} className="w-full rounded-2xl aspect-video object-cover" />
                    </div>
                )}

                <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-10">
                    <div className="prose-content text-[17px] text-gray-800 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: article.konten }} />
                </div>
            </article>

            {related.length > 0 && (
                <section className="pb-24 max-w-6xl mx-auto px-4 sm:px-6">
                    <h2 className="text-2xl font-semibold mb-6">Tulisan lainnya</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {related.map((a, i) => (
                            <ArticleCard key={a.id} article={a} index={i} />
                        ))}
                    </div>
                </section>
            )}
        </MainLayout>
    );
}
