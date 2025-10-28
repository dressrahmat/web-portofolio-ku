// ArticlesSection.jsx - Disesuaikan untuk Product & Fullstack Developer
import { motion } from "framer-motion";
import AnimatedSection from "@/Components/AnimatedSection";

export default function ArticlesSection() {
    const articles = [
        {
            category: "BACKEND ARCHITECTURE",
            date: "15 Mar 2024",
            title: "Membangun Sistem Jadwal Sholat Otomatis dengan Algorithm",
            description:
                "Bagaimana saya mengimplementasikan logika perhitungan jadwal sholat yang akurat dan sistem adzan otomatis menggunakan algoritma astronomi.",
            readTime: "8 min read",
            tags: ["Algorithm", "Node.js", "API Design"],
        },
        {
            category: "FULLSTACK DEVELOPMENT",
            date: "2 Apr 2024",
            title: "From Code to Product: Pendekatan Holistik dalam Pengembangan Software",
            description:
                "Menggabungkan kemampuan teknis backend, frontend, dan pemahaman produk untuk menciptakan solusi digital yang impactful.",
            readTime: "6 min read",
            tags: ["Product Thinking", "Fullstack", "Development"],
        },
        {
            category: "DIGITAL MARKETING",
            date: "10 Apr 2024",
            title: "Meta Ads untuk Layanan Digital: Strategi Conversion yang Efektif",
            description:
                "Leveraging pengalaman 1 tahun di advertising untuk mengoptimalkan campaign digital product dan layanan IT.",
            readTime: "5 min read",
            tags: ["Meta Ads", "Digital Marketing", "Conversion"],
        },
        {
            category: "TECH & COMMUNITY",
            date: "18 Apr 2024",
            title: "Membangun Software untuk Lembaga Islam: Tantangan dan Solusi",
            description:
                "Sharing pengalaman mengembangkan sistem untuk yayasan Islam di Malang, Jogja, dan Pontianak dengan pendekatan yang sesuai budaya.",
            readTime: "7 min read",
            tags: ["Community", "Software", "Islamic Tech"],
        },
    ];

    return (
        <AnimatedSection id="articles" className="py-28 max-w-6xl mx-auto px-4">
            <motion.h2
                className="text-4xl font-medium mb-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
            >
                Insights & Articles
            </motion.h2>

            <motion.p
                className="text-center text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                Sharing knowledge tentang pengembangan produk digital, backend
                architecture, dan pengalaman membangun software untuk komunitas.
            </motion.p>

            <div className="grid md:grid-cols-2 gap-8">
                {articles.map((article, index) => (
                    <motion.article
                        key={index}
                        className="group"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 h-full transition-all duration-300 group-hover:shadow-lg border border-gray-100 dark:border-gray-800 group-hover:border-blue-200 dark:group-hover:border-blue-800">
                            <div className="flex justify-between items-start mb-3">
                                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                                    {article.category}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {article.date}
                                </span>
                            </div>

                            <h3 className="text-xl font-medium my-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                                {article.title}
                            </h3>

                            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                                {article.description}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {article.tags.map((tag, tagIndex) => (
                                    <span
                                        key={tagIndex}
                                        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-800">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {article.readTime}
                                </span>
                                <a
                                    href="#"
                                    className="text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:underline flex items-center"
                                >
                                    Baca selengkapnya
                                    <svg
                                        className="w-4 h-4 ml-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                                        />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </motion.article>
                ))}
            </div>

            <motion.div
                className="text-center mt-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                <a
                    href="#"
                    className="inline-flex items-center px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                    Lihat semua artikel
                    <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                    </svg>
                </a>
            </motion.div>

            {/* Newsletter CTA */}
            <motion.div
                className="mt-20 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-2xl p-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                <h3 className="text-2xl font-medium mb-4">
                    Dapatkan Insight Teknis Terbaru
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                    Subscribe untuk mendapatkan update tentang backend
                    development, product thinking, dan case study pengembangan
                    software.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                    <input
                        type="email"
                        placeholder="Email anda..."
                        className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                        Subscribe
                    </button>
                </div>
            </motion.div>
        </AnimatedSection>
    );
}
