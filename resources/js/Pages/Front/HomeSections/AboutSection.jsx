// AboutSection.jsx - Disesuaikan dengan pengalaman advertising & programming
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
                    About me
                </motion.h2>

                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-blue-100 dark:from-gray-800 dark:to-blue-900/30 rounded-lg flex items-center justify-center relative overflow-hidden">
                            {/* Efek gradient pada gambar */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-30"></div>
                            <div className="text-center relative z-10">
                                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg
                                        className="w-10 h-10 text-white"
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
                                <span className="text-gray-600 dark:text-gray-300 font-medium">
                                    Fullstack Developer
                                </span>
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
                            My Professional Journey
                        </h3>
                        <p className="mb-6 text-gray-600 dark:text-gray-400 leading-relaxed">
                            With{" "}
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                                3 years of fullstack development
                            </span>{" "}
                            experience, combined with{" "}
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                                1 year in Meta Ads advertising
                            </span>{" "}
                            and
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                                {" "}
                                content creation
                            </span>
                            , I bring a unique blend of technical expertise and
                            digital marketing insight to every project.
                        </p>
                        <p className="mb-8 text-gray-600 dark:text-gray-400 leading-relaxed">
                            My background working with various{" "}
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                                Islamic institutions
                            </span>
                            across{" "}
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                                Malang, Jogja, and Pontianak
                            </span>{" "}
                            has given me deep understanding of creating
                            technology solutions that serve community needs with
                            cultural sensitivity.
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
                                        Fullstack Development
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        3+ years experience
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
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-medium">
                                        Digital Advertising
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Meta Ads Specialist - 1 year
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
                                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-medium">
                                        Content Creation
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Design & Creative Content - 1 year
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mr-4">
                                    <svg
                                        className="w-6 h-6 text-orange-600 dark:text-orange-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="font-medium">
                                        Community Focus
                                    </h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Islamic Institutions Experience
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Experience Timeline */}
                <motion.div
                    className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                            3+
                        </div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                            Years
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Fullstack Development
                        </div>
                    </div>

                    <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                            1
                        </div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                            Year
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Meta Ads & Digital Marketing
                        </div>
                    </div>

                    <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                            Multiple
                        </div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                            Cities
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Malang, Jogja, Pontianak
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatedSection>
    );
}
