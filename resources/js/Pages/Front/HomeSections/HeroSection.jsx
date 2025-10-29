// HeroSection.jsx - Marketing Communication dengan Technical Background
import { motion } from "framer-motion";

export default function HeroSection() {
    return (
        <section className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16 relative overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50/30 via-green-50/20 to-cyan-50/20 dark:from-blue-950/40 dark:via-green-900/30 dark:to-cyan-950/30"></div>

            {/* Background decorative elements */}
            <div className="absolute inset-0 -z-10 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl animate-blob"></div>
                <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-green-200 dark:bg-green-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-cyan-200 dark:bg-cyan-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-5xl mx-auto text-center relative z-10">
                <motion.h1
                    className="text-3xl md:text-5xl lg:text-6xl font-medium mb-6"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    Programmer &<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400">
                        Digital Marketing
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
                        sistem digital dan aplikasi
                    </span>{" "}
                    yang tidak hanya berfungsi baik, tapi juga mendukung
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {" "}
                        strategi marketing dan komunikasi{" "}
                    </span>
                    untuk mencapai tujuan lembaga.
                </motion.p>

                {/* Skill Highlights - Kombinasi Technical & Marketing */}
                <motion.div
                    className="flex flex-wrap justify-center gap-2 mb-10 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                >
                    <span className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium">
                        Web Development
                    </span>
                    <span className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-xs font-medium">
                        Sistem Informasi
                    </span>
                    <span className="px-3 py-1.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-800 dark:text-cyan-300 rounded-full text-xs font-medium">
                        Database Management
                    </span>
                    <span className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-xs font-medium">
                        Digital Marketing
                    </span>
                    <span className="px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 rounded-full text-xs font-medium">
                        Content Strategy
                    </span>
                    <span className="px-3 py-1.5 bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 rounded-full text-xs font-medium">
                        Analisis Data
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
                        Lihat Project Saya
                    </motion.a>

                    <motion.a
                        href="https://wa.me/6289530519448"
                        target="_blank"
                        rel="noopener noreferrer"
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

                {/* Keahlian Utama - Technical dengan nilai marketing */}
                <motion.div
                    className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <div className="text-center">
                        <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                            40%
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Programming & Development
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                            25%
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Sistem & Database
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                            20%
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Digital Marketing
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                            15%
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            Strategy & Communication
                        </div>
                    </div>
                </motion.div>

                {/* Value Proposition - Technical background untuk marketing */}
                <motion.div
                    className="mt-10 p-6 bg-white/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-sm border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                >
                    <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 italic text-center">
                        "Dengan background programming yang kuat, saya tidak
                        hanya bisa menjalankan kampanye marketing, tapi juga{" "}
                        <strong>
                            membangun sistem yang mendukung kesuksesan strategi
                            komunikasi
                        </strong>{" "}
                        dan
                        <strong>
                            {" "}
                            menganalisis data untuk hasil yang lebih baik
                        </strong>
                        ."
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
