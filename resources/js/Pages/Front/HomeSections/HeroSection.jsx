import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { FiArrowRight, FiDownload, FiMapPin } from "react-icons/fi";
import { FaWhatsapp } from "@/Components/Front/Icons";

export default function HeroSection({ profile, featuredSkills = [] }) {
    const tags = profile.hero_tags?.length ? profile.hero_tags : featuredSkills;
    const firstName = profile.nickname || profile.full_name?.split(" ")[0];

    return (
        <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50/60 via-white to-green-50/50 dark:from-blue-950/30 dark:via-gray-950 dark:to-green-950/20" />
            <div className="absolute -top-24 -right-24 -z-10 w-96 h-96 rounded-full bg-blue-200/40 dark:bg-blue-900/20 blur-3xl" />
            <div className="absolute -bottom-32 -left-24 -z-10 w-96 h-96 rounded-full bg-green-200/40 dark:bg-green-900/20 blur-3xl" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-[1.4fr_1fr] gap-12 items-center">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                    {profile.open_to_work && profile.availability_text && (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-xs font-medium mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                            </span>
                            {profile.availability_text}
                        </span>
                    )}

                    <p className="text-lg text-gray-600 dark:text-gray-400">Halo, saya {firstName} 👋</p>
                    <h1 className="mt-2 text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1]">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400">
                            {profile.headline}
                        </span>
                    </h1>
                    {profile.tagline && (
                        <p className="mt-6 text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed">
                            {profile.tagline}
                        </p>
                    )}

                    {tags.length > 0 && (
                        <div className="mt-6 flex flex-wrap gap-2">
                            {tags.map((t) => (
                                <span key={t} className="px-3 py-1 rounded-full bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 text-xs font-medium">
                                    {t}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            href={route("portfolio.index")}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium text-sm hover:opacity-90 transition"
                        >
                            Lihat Karya <FiArrowRight />
                        </Link>
                        {profile.whatsapp_url ? (
                            <a
                                href={profile.whatsapp_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-900 transition"
                            >
                                <FaWhatsapp className="text-green-600" /> Hubungi Saya
                            </a>
                        ) : (
                            <a href="#kontak" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 font-medium text-sm">
                                Hubungi Saya
                            </a>
                        )}
                        <a
                            href={profile.cv_url || route("cv")}
                            className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600"
                        >
                            <FiDownload /> {profile.cv_url ? "Unduh CV" : "Lihat CV"}
                        </a>
                    </div>
                </motion.div>

                {profile.photo_url && (
                    <motion.div
                        className="relative mx-auto w-full max-w-sm"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.15 }}
                    >
                        <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-3xl bg-gradient-to-br from-blue-500 to-green-400 opacity-80" />
                        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-xl">
                            <img src={profile.photo_url} alt={profile.full_name} className="w-full h-full object-cover" />
                        </div>
                        {profile.location && (
                            <div className="absolute -bottom-4 left-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-900 shadow-lg text-sm">
                                <FiMapPin className="text-blue-600" /> {profile.location}
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
