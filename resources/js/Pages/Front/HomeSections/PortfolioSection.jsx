// PortfolioSection.jsx - Disesuaikan dengan proyek actual
import { motion } from "framer-motion";
import AnimatedSection from "@/Components/AnimatedSection";

export default function PortfolioSection() {
    const portfolioItems = [
        {
            title: "TV Info Masjid Digital",
            description:
                "Sistem informasi masjid digital yang menampilkan jadwal sholat otomatis dengan logika adzan dan iqomah, serta CMS untuk mengelola konten media. Dilengkapi dengan fitur CRUD untuk informasi pengumuman dan konten edukasi.",
            category: "Fullstack Development",
            technologies: ["Laravel", "JavaScript", "MySQL", "API Integration"],
            features: [
                "Jadwal Sholat Otomatis",
                "Logika Adzan & Iqomah",
                "CMS Media",
                "CRUD Operations",
            ],
            image: "/placeholder.jpg",
            highlight: true,
        },
        {
            title: "Sistem Manajemen Keuangan Yayasan",
            description:
                "Aplikasi akuntansi komprehensif untuk menghitung laba rugi yayasan, melacak pemasukan dan pengeluaran, serta menghasilkan laporan keuangan otomatis. Dibangun dengan fokus pada usability untuk staff non-teknis.",
            category: "Backend Development",
            technologies: ["Node.js", "Express", "PostgreSQL", "React"],
            features: [
                "Perhitungan Laba/Rugi",
                "Tracking Cashflow",
                "Laporan Otomatis",
                "Multi-user Access",
            ],
            image: "/placeholder.jpg",
            highlight: true,
        },
        {
            title: "Aplikasi Manajemen Keuangan",
            description:
                "Sistem akuntansi yang membantu UMKM dan organisasi dalam mengelola keuangan, menghitung profitabilitas, dan membuat laporan keuangan yang akurat. Mendukung multiple chart of accounts dan klasifikasi transaksi.",
            category: "Fullstack Development",
            technologies: ["PHP", "MySQL", "Bootstrap", "Chart.js"],
            features: [
                "Sistem Akuntansi",
                "Profit Calculation",
                "Financial Reports",
                "Data Export",
            ],
            image: "/placeholder.jpg",
        },
        {
            title: "Sistem Layanan Terpadu",
            description:
                "Platform untuk menyimpan dan mengelola data pelayanan dengan fitur pencarian, filtering, dan reporting. Mengoptimalkan proses administrasi pelayanan dengan workflow yang terstruktur.",
            category: "Backend Development",
            technologies: ["Laravel", "Vue.js", "REST API", "Redis"],
            features: [
                "Data Management",
                "Advanced Search",
                "Service Tracking",
                "Report Generation",
            ],
            image: "/placeholder.jpg",
        },
        {
            title: "Aplikasi Absensi Digital",
            description:
                "Sistem absensi modern dengan fitur presensi real-time, laporan kehadiran, dan manajemen cuti. Mendukung multiple metode presensi dan integrasi dengan sistem payroll.",
            category: "Fullstack Development",
            technologies: ["React Native", "Firebase", "Node.js", "MongoDB"],
            features: [
                "Real-time Attendance",
                "Leave Management",
                "Attendance Reports",
                "Mobile Support",
            ],
            image: "/placeholder.jpg",
        },
        {
            title: "Company Profile Yayasan",
            description:
                "Website company profile untuk yayasan dengan desain yang profesional dan informatif. Menampilkan visi-misi, program kerja, galeri kegiatan, dan informasi kontak dengan antarmuka yang user-friendly.",
            category: "Frontend Development",
            technologies: [
                "Next.js",
                "Tailwind CSS",
                "Framer Motion",
                "Vercel",
            ],
            features: [
                "Responsive Design",
                "Fast Performance",
                "SEO Optimized",
                "Easy Content Management",
            ],
            image: "/placeholder.jpg",
        },
    ];

    return (
        <AnimatedSection
            id="portfolio"
            className="py-28 max-w-6xl mx-auto px-4"
        >
            <motion.h2
                className="text-4xl font-medium mb-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
            >
                My Portfolio
            </motion.h2>

            <motion.p
                className="text-center text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                Kumpulan project pengembangan produk digital yang telah saya
                bangun, menampilkan kemampuan fullstack development dengan fokus
                pada solusi yang scalable dan user-friendly.
            </motion.p>

            <div className="space-y-24">
                {portfolioItems.map((item, index) => (
                    <motion.div
                        key={index}
                        className={`group relative ${
                            item.highlight
                                ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-8 rounded-2xl"
                                : ""
                        }`}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                    >
                        {item.highlight && (
                            <div className="absolute top-4 right-4">
                                <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium rounded-full">
                                    Featured Project
                                </span>
                            </div>
                        )}

                        <div
                            className={`flex flex-col ${
                                index % 2 === 0
                                    ? "md:flex-row"
                                    : "md:flex-row-reverse"
                            } gap-12 items-center`}
                        >
                            <div className="md:w-1/2">
                                <div className="w-full h-80 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden flex items-center justify-center relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-50"></div>
                                    <div className="text-center relative z-10">
                                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg
                                                className="w-8 h-8 text-white"
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
                                            {item.title}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="md:w-1/2">
                                <span className="text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                                    {item.category}
                                </span>
                                <h3 className="text-2xl md:text-3xl font-medium my-4 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                                    {item.description}
                                </p>

                                {/* Technologies */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {item.technologies.map(
                                        (tech, techIndex) => (
                                            <span
                                                key={techIndex}
                                                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                                            >
                                                {tech}
                                            </span>
                                        )
                                    )}
                                </div>

                                {/* Features */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                                        Key Features:
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {item.features.map(
                                            (feature, featureIndex) => (
                                                <span
                                                    key={featureIndex}
                                                    className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full"
                                                >
                                                    {feature}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>

                                <a
                                    href="#"
                                    className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:underline"
                                >
                                    View case study
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
                    </motion.div>
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
                    View all projects
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
        </AnimatedSection>
    );
}
