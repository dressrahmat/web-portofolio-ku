// AboutSection.jsx - Programmer & Digital Marketing
import { motion } from "framer-motion";
import AnimatedSection from "@/Components/AnimatedSection";

export default function AboutSection() {
    return (
        <AnimatedSection id="about" className="py-28 relative overflow-hidden">
            {/* Background pertama - Solid color dengan gradient */}
            <div className="absolute inset-0 -z-20 bg-gradient-to-b from-gray-50 to-blue-50/30 dark:from-gray-950 dark:to-blue-950/20"></div>

            {/* Background kedua - Garis-garis diagonal */}
            <div className="absolute inset-0 -z-10 opacity-10">
                <div className="absolute inset-0 bg-[linear-gradient(to_right_#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom_#4f4f4f12_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>

            <div className="max-w-5xl mx-auto px-4 relative z-10">
                <motion.h2
                    className="text-4xl font-medium mb-16 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    Tentang Saya
                </motion.h2>

                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="overflow-hidden">
                            {/* Container untuk foto dengan rasio 4:5 */}
                            <div className="h-full relative border-b-8 border-green-400 rounded-lg shadow-lg">
                                <img
                                    src="/assets/images/me.png"
                                    alt="Profile Photo"
                                    className="w-full h-full object-cover"
                                />
                                {/* Efek gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-30 rounded-lg"></div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h3 className="text-2xl font-medium mb-6">
                            Programmer yang Paham Marketing
                        </h3>
                        <p className="mb-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                            Saya memiliki{" "}
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                                latar belakang programming
                            </span>{" "}
                            dengan pengalaman membuat sistem digital, ditambah
                            kemampuan dalam{" "}
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                                strategi digital marketing dan komunikasi
                            </span>
                            .
                        </p>
                        <p className="mb-8 text-gray-600 dark:text-gray-400 leading-relaxed">
                            Pengalaman bekerja dengan berbagai{" "}
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                                lembaga dan organisasi
                            </span>{" "}
                            membantu saya memahami bagaimana{" "}
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                                teknologi dapat mendukung tujuan bisnis dan
                                komunikasi
                            </span>{" "}
                            secara efektif.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4">
                                    <svg
                                        className="w-6 h-6 text-blue-600 dark:text-blue-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-medium">
                                        Programming & Development
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        2+ tahun pengalaman
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-4">
                                    <svg
                                        className="w-6 h-6 text-green-600 dark:text-green-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-medium">
                                        Digital Marketing
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Strategi & Eksekusi
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-4">
                                    <svg
                                        className="w-6 h-6 text-purple-600 dark:text-purple-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-medium">
                                        Analisis Data
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Data-driven Decision Making
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Experience Timeline - Updated untuk positioning baru */}
                <motion.div
                    className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                            2+
                        </div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                            Tahun
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Programming & Development
                        </div>
                    </div>

                    <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                            1
                        </div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                            Tahun
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Digital Marketing
                        </div>
                    </div>

                    <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                            3+
                        </div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                            Kota
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Jogja, Pontianak, Malang
                        </div>
                    </div>
                </motion.div>

                {/* Unique Value Proposition */}
                <motion.div
                    className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30 rounded-2xl border border-blue-100 dark:border-blue-800"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <h4 className="text-xl font-medium text-center mb-4 text-gray-900 dark:text-gray-100">
                        Keunggulan Saya
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                            Saya memiliki pengalaman - technical dan marketing.
                        </span>{" "}
                        Tidak hanya membuat sistem yang berfungsi baik, tapi
                        juga memastikan sistem tersebut mendukung strategi
                        komunikasi dan marketing untuk mencapai tujuan bisnis.
                    </p>
                </motion.div>
            </div>
        </AnimatedSection>
    );
}
