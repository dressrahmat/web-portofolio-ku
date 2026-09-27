import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { fadeUp } from "./Section";

export const formatDate = (value) =>
    value ? new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "";

export default function ArticleCard({ article, index = 0 }) {
    return (
        <motion.article {...fadeUp(index * 0.08)} className="group h-full">
            <Link
                href={route("blog.show", article.slug)}
                className="flex flex-col h-full rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow"
            >
                <div className="aspect-[16/9] bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    {article.gambar_url && (
                        <img src={article.gambar_url} alt={article.judul} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        {article.kategori?.[0] && (
                            <span className="text-blue-600 dark:text-blue-400 font-medium">{article.kategori[0].nama}</span>
                        )}
                        <span>{formatDate(article.diterbitkan_pada)}</span>
                        <span>· {article.waktu_baca} mnt baca</span>
                    </div>
                    <h3 className="mt-2 text-lg font-semibold leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                        {article.judul}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{article.ringkasan}</p>
                </div>
            </Link>
        </motion.article>
    );
}
