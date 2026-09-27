import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiStar } from "react-icons/fi";
import { fadeUp } from "./Section";

export default function PortfolioCard({ item, index = 0 }) {
    return (
        <motion.article {...fadeUp(index * 0.08)} className="group">
            <Link
                href={route("portfolio.show", item.slug)}
                className="block h-full rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
                <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-950 dark:to-green-950 overflow-hidden">
                    {item.featured_image_url ? (
                        <img
                            src={item.featured_image_url}
                            alt={item.title}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl font-semibold text-blue-600/40">
                            {item.title.charAt(0)}
                        </div>
                    )}
                    {item.highlight && (
                        <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 dark:bg-gray-900/90 text-xs font-medium text-amber-600">
                            <FiStar className="fill-current" /> Unggulan
                        </span>
                    )}
                </div>
                <div className="p-5">
                    <p className="text-xs font-medium text-blue-600 dark:text-blue-400">{item.category}</p>
                    <h3 className="mt-1.5 text-lg font-semibold leading-snug flex items-start justify-between gap-2">
                        <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.title}</span>
                        <FiArrowUpRight className="shrink-0 mt-1 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </h3>
                    {item.short_description && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{item.short_description}</p>
                    )}
                    {item.technologies?.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                            {item.technologies.slice(0, 4).map((t) => (
                                <span key={t.id} className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300">
                                    {t.technology}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </Link>
        </motion.article>
    );
}
