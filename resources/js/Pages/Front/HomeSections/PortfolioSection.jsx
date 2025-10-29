// PortfolioSection.jsx - Bahasa Sederhana untuk Marketing Communication
import { motion } from "framer-motion";
import AnimatedSection from "@/Components/AnimatedSection";
import { useState, useEffect, useCallback } from "react";

export default function PortfolioSection() {
    const portfolioItems = [
        {
            title: "Sistem Informasi Digital untuk Masjid",
            description:
                "Membuat sistem digital yang menampilkan informasi jadwal sholat, pengumuman, dan konten edukasi secara otomatis. Membantu jamaah dapat informasi terbaru dengan mudah dan cepat.",
            category: "Strategi Komunikasi Digital",
            marketingHighlights: [
                "Sistem pengelolaan konten yang mudah",
                "Penyampaian informasi real-time",
                "Konten edukasi untuk jamaah",
                "Media komunikasi dengan komunitas",
            ],
            results: [
                "Jamaah lebih mudah dapat informasi terbaru",
                "Komunikasi menjadi lebih teratur",
                "Proses dari manual jadi digital",
            ],
            technologies: [
                "Strategi Konten",
                "Platform Digital",
                "Komunikasi",
                "Desain Informasi",
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
            title: "Sistem Laporan Keuangan",
            description:
                "Membuat sistem yang mengubah data keuangan rumit menjadi laporan yang mudah dibaca dan dipahami. Membantu pengurus yayasan membuat keputusan bisnis yang lebih baik.",
            category: "Komunikasi Bisnis",
            marketingHighlights: [
                "Tampilan data yang mudah dimengerti",
                "Laporan otomatis",
                "Alat komunikasi untuk tim",
                "Transparansi keuangan",
            ],
            results: [
                "Laporan keuangan lebih jelas dan mudah dibaca",
                "Proses pengambilan keputusan lebih cepat",
                "Komunikasi internal lebih lancar",
            ],
            technologies: [
                "Komunikasi Data",
                "Laporan Otomatis",
                "Manajemen Tim",
                "Analisis Bisnis",
            ],
            image: [
                "/assets/images/portofolio_keuangan/1.png",
                "/assets/images/portofolio_keuangan/2.png",
                "/assets/images/portofolio_keuangan/3.png",
            ],
            highlight: true,
        },
        {
            title: "Platform Layanan Pelanggan",
            description:
                "Membuat platform yang memudahkan komunikasi dengan pelanggan. Sistem ini membantu mencatat, mencari, dan mengelola semua informasi layanan dengan rapi.",
            category: "Komunikasi Pelanggan",
            marketingHighlights: [
                "Satu saluran komunikasi terpadu",
                "Pengelolaan informasi layanan",
                "Pengalaman pelanggan yang lebih baik",
                "Komunikasi multi-saluran",
            ],
            results: [
                "Pelanggan lebih puas dengan layanan",
                "Respons lebih cepat untuk pertanyaan",
                "Informasi tersimpan rapi dan konsisten",
            ],
            technologies: [
                "Pemetaan Customer Journey",
                "Komunikasi Layanan",
                "Struktur Informasi",
                "Desain Pengalaman",
            ],
            image: [
                "/assets/images/portofolio_layanan/1.png",
                "/assets/images/portofolio_layanan/2.png",
                "/assets/images/portofolio_layanan/3.png",
                "/assets/images/portofolio_layanan/4.png",
            ],
        },
        {
            title: "Website Profil Perusahaan",
            description:
                "Membuat website company profile yang menampilkan visi, misi, dan program yayasan dengan cara yang menarik. Membantu memperkenalkan perusahaan ke lebih banyak orang.",
            category: "Komunikasi Brand",
            marketingHighlights: [
                "Pembangunan identitas brand",
                "Cerita perusahaan yang menarik",
                "Media komunikasi dengan publik",
                "Kehadiran digital yang optimal",
            ],
            results: [
                "Brand lebih dikenal banyak orang",
                "Informasi perusahaan mudah diakses",
                "Membangun citra profesional",
            ],
            technologies: [
                "Strategi Brand",
                "Konten Marketing",
                "Optimasi SEO",
                "Kehadiran Digital",
            ],
            image: [
                "/assets/images/portofolio_company_profile/1.png",
                "/assets/images/portofolio_company_profile/2.png",
                "/assets/images/portofolio_company_profile/3.png",
            ],
        },
    ];

    // Komponen ImageSlider tetap sama
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

                <button
                    onClick={prevSlide}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 md:p-2 rounded-full opacity-0 md:group-hover:opacity-100 transition-all duration-200 md:block hidden"
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

                <button
                    onClick={prevSlide}
                    className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full md:hidden block"
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
                        />
                    ))}
                </div>

                <div className="absolute top-2 right-2 bg-black/50 text-white px-1.5 py-0.5 rounded text-xs">
                    {currentSlide + 1} / {images.length}
                </div>

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
                Project Marketing & Komunikasi
            </motion.h2>

            <motion.p
                className="text-center text-gray-600 dark:text-gray-400 mb-12 md:mb-16 max-w-2xl mx-auto text-sm md:text-base"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                Beberapa project yang saya kerjakan, fokus pada cara
                berkomunikasi yang efektif, meningkatkan hubungan dengan
                pelanggan, dan membuat sistem informasi yang mudah dipahami
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

                                {/* Cara Kerja */}
                                <div className="mb-4 md:mb-4">
                                    <h4 className="text-xs md:text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5 md:mb-2">
                                        Cara Kerja:
                                    </h4>
                                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                                        {item.marketingHighlights.map(
                                            (highlight, highlightIndex) => (
                                                <span
                                                    key={highlightIndex}
                                                    className="px-1.5 md:px-2 py-0.5 md:py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                                                >
                                                    {highlight}
                                                </span>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* Hasil */}
                                <div className="mb-4 md:mb-4">
                                    <h4 className="text-xs md:text-sm font-medium text-gray-900 dark:text-gray-100 mb-1.5 md:mb-2">
                                        Hasil yang Dicapai:
                                    </h4>
                                    <ul className="text-gray-600 dark:text-gray-400 text-xs md:text-sm space-y-1">
                                        {item.results.map(
                                            (result, resultIndex) => (
                                                <li
                                                    key={resultIndex}
                                                    className="flex items-start"
                                                >
                                                    <svg
                                                        className="w-3 h-3 md:w-4 md:h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                    {result}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>

                                {/* Keahlian yang Dipakai */}
                                <div className="flex flex-wrap gap-1.5 md:gap-2">
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
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </AnimatedSection>
    );
}
