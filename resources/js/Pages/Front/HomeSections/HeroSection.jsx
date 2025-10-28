// HeroSection.jsx - Disesuaikan untuk Product & Fullstack Developer
import { motion } from "framer-motion";

export default function HeroSection() {
    return (
        <section className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16 relative overflow-hidden">
            {/* Background pertama - Gradient tech-inspired */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50/30 via-gray-50/20 to-green-50/20 dark:from-blue-950/40 dark:via-gray-900/30 dark:to-green-950/30"></div>

            {/* Background kedua - Pola geometris dengan coding vibe */}
            <div className="absolute inset-0 -z-10 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl animate-blob"></div>
                <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-gray-200 dark:bg-gray-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-green-200 dark:bg-green-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-5xl mx-auto text-center relative z-10">
                <motion.h1
                    className="text-4xl md:text-6xl lg:text-7xl font-medium mb-6"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    Product Developer &<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400">
                        Fullstack Engineer
                    </span>
                </motion.h1>

                <motion.p
                    className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                >
                    I build{" "}
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                        scalable digital products
                    </span>{" "}
                    from concept to deployment, with strong backend architecture
                    and holistic product thinking.
                </motion.p>

                {/* Skill Highlights */}
                <motion.div
                    className="flex flex-wrap justify-center gap-3 mb-12 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                >
                    <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                        Backend Architecture
                    </span>
                    <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-full text-sm font-medium">
                        Fullstack Development
                    </span>
                    <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                        Product Strategy
                    </span>
                    <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm font-medium">
                        UI/UX Implementation
                    </span>
                </motion.div>

                <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                >
                    <motion.a
                        href="#portfolio"
                        className="px-8 py-3.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg
                            className="w-5 h-5"
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
                        View My Projects
                    </motion.a>

                    <motion.a
                        href="#contact"
                        className="px-8 py-3.5 border border-gray-300 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg
                            className="w-5 h-5"
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
                        Get in Touch
                    </motion.a>
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-6 max-w-2xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                            40%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Backend Focus
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                            20%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Frontend
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                            20%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Digital Marketing
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                            10%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Content Creation
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                            10%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Design
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="mt-24"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                >
                    <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center animate-bounce">
                        <svg
                            className="w-6 h-6"
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
