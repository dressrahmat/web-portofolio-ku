// PortfolioSection.jsx - Disesuaikan dengan proyek actual
import { motion } from "framer-motion";
import AnimatedSection from "@/Components/AnimatedSection";
import { useState, useEffect, useCallback } from "react";

export default function PortfolioSection() {
    const portfolioItems = [
        {
            title: "TV Info Masjid Digital",
            description:
                "Sistem informasi masjid digital yang menampilkan jadwal sholat otomatis dengan logika adzan dan iqomah, serta CMS untuk mengelola konten media. Dilengkapi dengan fitur CRUD untuk informasi pengumuman dan konten edukasi.",
            category: "Fullstack Development",
            technologies: ["Laravel", "ReactJs", "MySQL", "API Integration"],
            features: [
                "Jadwal Sholat Otomatis",
                "Logika Adzan & Iqomah",
                "CMS Media",
                "CRUD Operations",
            ],
            image: [
                "/assets/images/portofolio_tv/1.png",
                "/assets/images/portofolio_tv/2.png",
                "/assets/images/portofolio_tv/3.png",
                "/assets/images/portofolio_tv/4.png",
                "/assets/images/portofolio_tv/5.png",
                "/assets/images/portofolio_tv/6.png",
            ],
            highlight: true,
        },
        {
            title: "Sistem Manajemen Keuangan Yayasan",
            description:
                "Aplikasi akuntansi komprehensif untuk menghitung laba rugi yayasan, melacak pemasukan dan pengeluaran, serta menghasilkan laporan keuangan otomatis. Dibangun dengan fokus pada usability untuk staff non-teknis.",
            category: "Fullstack Development",
            technologies: ["Laravel", "Filament", "MySQL", "Tailwind CSS"],
            features: [
                "Perhitungan Laba/Rugi",
                "Tracking Cashflow",
                "Laporan Otomatis",
                "Multi-user Access",
            ],
            image: [
                "/assets/images/portofolio_keuangan/1.png",
                "/assets/images/portofolio_keuangan/2.png",
                "/assets/images/portofolio_keuangan/3.png",
            ],
            highlight: true,
        },
        {
            title: "Sistem Layanan Terpadu",
            description:
                "Platform untuk menyimpan dan mengelola data pelayanan dengan fitur pencarian, filtering, dan reporting. Mengoptimalkan proses administrasi pelayanan dengan workflow yang terstruktur.",
            category: "Fullstack Development",
            technologies: [
                "Laravel",
                "React.js",
                "Tailwind CSS",
                "Framer Motion",
                "MySQL",
            ],
            features: [
                "Data Management",
                "Advanced Search",
                "Service Tracking",
                "Report Generation",
            ],
            image: [
                "/assets/images/portofolio_layanan/1.png",
                "/assets/images/portofolio_layanan/2.png",
                "/assets/images/portofolio_layanan/3.png",
                "/assets/images/portofolio_layanan/4.png",
            ],
        },
        // {
        //     title: "Aplikasi Absensi Digital",
        //     description:
        //         "Sistem absensi modern dengan fitur presensi real-time, laporan kehadiran, dan manajemen cuti. Mendukung multiple metode presensi dan integrasi dengan sistem payroll.",
        //     category: "Fullstack Development",
        //     technologies: ["React Native", "Firebase", "Node.js", "MongoDB"],
        //     features: [
        //         "Real-time Attendance",
        //         "Leave Management",
        //         "Attendance Reports",
        //         "Mobile Support",
        //     ],
        //     image: "/placeholder.jpg",
        // },
        {
            title: "Company Profile Yayasan",
            description:
                "Website company profile untuk yayasan dengan desain responsif dan konten yang mudah diakses. Menampilkan informasi tentang visi, misi, program, dan kontak yayasan secara profesional.",
            category: "Frontend Development",
            technologies: ["Wordpress", "Elementor"],
            features: [
                "Responsive Design",
                "Fast Performance",
                "SEO Optimized",
                "Easy Content Management",
            ],
            image: [
                "/assets/images/portofolio_company_profile/1.png",
                "/assets/images/portofolio_company_profile/2.png",
                "/assets/images/portofolio_company_profile/3.png",
            ],
        },
    ];

    // Komponen ImageSlider untuk TV Info Masjid Digital
    const ImageSlider = ({ images, title }) => {
        const [currentSlide, setCurrentSlide] = useState(0);
        const [isPaused, setIsPaused] = useState(false);

        const nextSlide = useCallback(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, [images.length]);

        const prevSlide = () => {
            setCurrentSlide(
                (prev) => (prev - 1 + images.length) % images.length
            );
        };

        const goToSlide = (index) => {
            setCurrentSlide(index);
        };

        // Auto slide setiap 3 detik
        useEffect(() => {
            if (isPaused || images.length <= 1) return;

            const interval = setInterval(nextSlide, 3000);
            return () => clearInterval(interval);
        }, [nextSlide, isPaused, images.length]);

        if (!images || images.length === 0) {
            return (
                <div className="w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden flex items-center justify-center relative">
                    <div className="text-center">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                            <svg
                                className="w-6 h-6 md:w-8 md:h-8 text-white"
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
                        <span className="text-gray-600 dark:text-gray-300 font-medium text-sm md:text-base">
                            {title}
                        </span>
                    </div>
                </div>
            );
        }

        if (images.length === 1) {
            return (
                <div className="w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden flex items-center justify-center relative">
                    <img
                        src={images[0]}
                        alt={`${title} - Slide 1`}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-50"></div>
                </div>
            );
        }

        return (
            <div
                className="w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden relative group"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Slides */}
                <div className="relative w-full h-full overflow-hidden">
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                                index === currentSlide
                                    ? "opacity-100"
                                    : "opacity-0"
                            }`}
                        >
                            <img
                                src={image}
                                alt={`${title} - Slide ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>

                {/* Navigation Arrows - Hidden on mobile, show on hover desktop */}
                <button
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 md:p-2 rounded-full opacity-0 md:group-hover:opacity-100 transition-all duration-200 md:block hidden"
                    aria-label="Previous slide"
                >
                    <svg
                        className="w-4 h-4 md:w-5 md:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 md:p-2 rounded-full opacity-0 md:group-hover:opacity-100 transition-all duration-200 md:block hidden"
                    aria-label="Next slide"
                >
                    <svg
                        className="w-4 h-4 md:w-5 md:h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>

                {/* Mobile Navigation Arrows - Always visible on mobile */}
                <button
                    onClick={prevSlide}
                    className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full md:hidden block"
                    aria-label="Previous slide"
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
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full md:hidden block"
                    aria-label="Next slide"
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
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-1.5">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 ${
                                index === currentSlide
                                    ? "bg-white scale-125"
                                    : "bg-white/50 hover:bg-white/70"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Slide Counter */}
                <div className="absolute top-2 right-2 bg-black/50 text-white px-1.5 py-0.5 rounded text-xs">
                    {currentSlide + 1} / {images.length}
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-50"></div>
            </div>
        );
    };

    return (
        <AnimatedSection
            id="portfolio"
            className="py-16 md:py-28 max-w-6xl mx-auto px-4 md:px-6"
        >
            <motion.h2
                className="text-3xl md:text-4xl font-medium mb-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
            >
                My Portfolio
            </motion.h2>

            <motion.p
                className="text-center text-gray-600 dark:text-gray-400 mb-12 md:mb-16 max-w-2xl mx-auto text-sm md:text-base"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                Kumpulan project pengembangan produk digital yang telah saya
                bangun, menampilkan kemampuan fullstack development dengan fokus
                pada solusi yang scalable dan user-friendly.
            </motion.p>

            <div className="space-y-16 md:space-y-24">
                {portfolioItems.map((item, index) => (
                    <motion.div
                        key={index}
                        className={`group relative ${
                            item.highlight
                                ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 md:p-8 rounded-xl md:rounded-2xl"
                                : ""
                        }`}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                    >
                        {/* {item.highlight && (
                            <div className="absolute top-2 right-2 md:top-4 md:right-4">
                                <span className="px-2 py-1 md:px-3 md:py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium rounded-full">
                                    Featured Project
                                </span>
                            </div>
                        )} */}

                        <div
                            className={`flex flex-col ${
                                index % 2 === 0
                                    ? "md:flex-row"
                                    : "md:flex-row-reverse"
                            } gap-6 md:gap-12 items-center`}
                        >
                            <div className="w-full md:w-1/2">
                                {Array.isArray(item.image) ? (
                                    <ImageSlider
                                        images={item.image}
                                        title={item.title}
                                    />
                                ) : (
                                    <div className="w-full aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden flex items-center justify-center relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-50"></div>
                                        <div className="text-center relative z-10">
                                            <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                                                <svg
                                                    className="w-6 h-6 md:w-8 md:h-8 text-white"
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
                                            <span className="text-gray-600 dark:text-gray-300 font-medium text-sm md:text-base">
                                                {item.title}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="w-full md:w-1/2">
                                <span className="text-xs md:text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 md:px-3 py-1 rounded-full">
                                    {item.category}
                                </span>
                                <h3 className="text-xl md:text-2xl lg:text-3xl font-medium my-3 md:my-4 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                                    {item.description}
                                </p>

                                {/* Technologies */}
                                <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
                                    {item.technologies.map(
                                        (tech, techIndex) => (
                                            <span
                                                key={techIndex}
                                                className="px-2 md:px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs md:text-sm rounded-full"
                                            >
                                                {tech}
                                            </span>
                                        )
                                    )}
                                </div>

                                {/* Features */}
                                <div className="mb-4 md:mb-6">
                                    <h4 className="text-xs md:text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5 md:mb-2">
                                        Key Features:
                                    </h4>
                                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                                        {item.features.map(
                                            (feature, featureIndex) => (
                                                <span
                                                    key={featureIndex}
                                                    className="px-1.5 md:px-2 py-0.5 md:py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full"
                                                >
                                                    {feature}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* <a
                                    href="#"
                                    className="inline-flex items-center text-xs md:text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:underline"
                                >
                                    View case study
                                    <svg
                                        className="w-3 h-3 md:w-4 md:h-4 ml-1"
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
                                </a> */}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* <motion.div
                className="text-center mt-12 md:mt-16"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                <a
                    href="#"
                    className="inline-flex items-center px-5 py-2.5 md:px-6 md:py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm md:text-base"
                >
                    View all projects
                    <svg
                        className="w-3 h-3 md:w-4 md:h-4 ml-1"
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
            </motion.div> */}
        </AnimatedSection>
    );
}
