// HeroSection.jsx - Product Developer & Digital Specialist
import { motion } from "framer-motion";

export default function HeroSection() {
    return (
        <section className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16 relative overflow-hidden">
            {/* Background pertama - Gradient tech-inspired */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-cyan-50/20 dark:from-blue-950/40 dark:via-indigo-900/30 dark:to-cyan-950/30"></div>

            {/* Background kedua - Pola geometris dengan digital information vibe */}
            <div className="absolute inset-0 -z-10 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl animate-blob"></div>
                <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-indigo-200 dark:bg-indigo-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-cyan-200 dark:bg-cyan-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-5xl mx-auto text-center relative z-10">
                <motion.h1
                    className="text-3xl md:text-5xl lg:text-6xl font-medium mb-6"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    Product Developer &<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
                        Digital Specialist
                    </span>
                </motion.h1>

                <motion.p
                    className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                    Membuat{" "}
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                        website, aplikasi, dan sistem digital
                    </span>{" "}
                    yang berkualitas, dari backend sampai frontend, dilengkapi
                    dengan strategi pemasaran digital untuk hasil yang maksimal.
                </motion.p>

                {/* Skill Highlights */}
                <motion.div
                    className="flex flex-wrap justify-center gap-2 mb-10 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                >
                    <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium">
                        Pembuatan Website
                    </span>
                    <span className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 rounded-full text-xs font-medium">
                        Backend System
                    </span>
                    <span className="px-3 py-1.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 rounded-full text-xs font-medium">
                        Frontend Design
                    </span>
                    <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-medium">
                        Digital Marketing
                    </span>
                    <span className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-xs font-medium">
                        Konten Kreatif
                    </span>
                    <span className="px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-xs font-medium">
                        Desain Grafis
                    </span>
                </motion.div>

                <motion.div
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                >
                    <motion.a
                        href="#portfolio"
                        className="px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                            />
                        </svg>
                        Lihat Hasil Karya
                    </motion.a>

                    <motion.a
                        href="#contact"
                        className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                        Hubungi Saya
                    </motion.a>
                </motion.div>

                {/* Quick Stats - Bahasa yang lebih sederhana */}
                <motion.div
                    className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4 max-w-2xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <div className="text-center">
                        <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                            35%
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Sistem & Backend
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                            25%
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Website & Aplikasi
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                            15%
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Desain & Tampilan
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                            15%
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Digital Marketing
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                            10%
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Konten Kreatif
                        </div>
                    </div>
                </motion.div>

                {/* Value Proposition - Bahasa yang mudah dipahami */}
                <motion.div
                    className="mt-10 p-6 bg-white/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-sm border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                >
                    <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 italic text-center">
                        "Bisa membuat sistem digital yang bagus di belakang
                        layar, sekaligus mempromosikannya di depan layar untuk
                        mencapai target bisnis."
                    </p>
                </motion.div>

                <motion.div
                    className="mt-16"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                >
                    <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center animate-bounce">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                            />
                        </svg>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
