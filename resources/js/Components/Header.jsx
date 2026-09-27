import { Link, usePage } from "@inertiajs/react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { FiDownload, FiMenu, FiMoon, FiSun, FiX } from "react-icons/fi";

/**
 * Navigasi utama website publik.
 */
export default function Header() {
    const { profile = {}, settings = {} } = usePage().props;
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);
    const [dark, setDark] = useState(() =>
        typeof document !== "undefined" && document.documentElement.classList.contains("dark")
    );
    const { scrollY } = useScroll();
    useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 20));

    const isHome = route().current("welcome");
    const anchor = (hash) => (isHome ? `#${hash}` : `${route("welcome")}#${hash}`);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", dark);
        try {
            localStorage.setItem("darkMode", dark ? "true" : "false");
        } catch (e) {
            /* abaikan */
        }
    }, [dark]);

    const links = [
        { label: "Tentang", href: anchor("tentang") },
        { label: "Pengalaman", href: anchor("pengalaman") },
        { label: "Karya", href: route("portfolio.index"), active: route().current("portfolio.*") },
        { label: "Blog", href: route("blog.index"), active: route().current("blog.*") },
        { label: "Kontak", href: anchor("kontak") },
    ];

    const brand = profile.nickname || profile.full_name || settings.site_name || "Portofolio";

    const NavItem = ({ link, className, onClick }) =>
        link.href.includes("#") ? (
            <a href={link.href} className={className} onClick={onClick}>
                {link.label}
            </a>
        ) : (
            <Link href={link.href} className={`${className} ${link.active ? "text-blue-600 dark:text-blue-400" : ""}`} onClick={onClick}>
                {link.label}
            </Link>
        );

    return (
        <>
            <header
                className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
                    scrolled || !isHome
                        ? "bg-white/85 dark:bg-gray-950/85 backdrop-blur-md border-b border-gray-200/60 dark:border-gray-800/60 py-3"
                        : "py-5"
                }`}
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
                    <Link href={route("welcome")} className="flex items-center gap-2 font-semibold text-lg">
                        <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-green-500 text-white text-sm flex items-center justify-center">
                            {brand.charAt(0)}
                        </span>
                        <span>{brand}</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-7">
                        {links.map((l) => (
                            <NavItem key={l.label} link={l} className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" />
                        ))}
                        <button
                            onClick={() => setDark(!dark)}
                            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            aria-label="Ganti tema"
                        >
                            {dark ? <FiSun /> : <FiMoon />}
                        </button>
                        <Link
                            href={route("cv")}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium hover:opacity-90 transition"
                        >
                            <FiDownload className="w-4 h-4" /> CV
                        </Link>
                    </nav>

                    <div className="flex items-center gap-1 md:hidden">
                        <button onClick={() => setDark(!dark)} className="p-2 rounded-lg" aria-label="Ganti tema">
                            {dark ? <FiSun /> : <FiMoon />}
                        </button>
                        <button onClick={() => setOpen(true)} className="p-2 rounded-lg" aria-label="Buka menu">
                            <FiMenu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </header>

            <AnimatePresence>
                {open && (
                    <motion.div
                        className="fixed inset-0 z-[60] md:hidden bg-black/30 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                    >
                        <motion.nav
                            className="absolute right-0 top-0 h-full w-72 bg-white dark:bg-gray-950 p-6 flex flex-col gap-1 shadow-2xl"
                            initial={{ x: 300 }}
                            animate={{ x: 0 }}
                            exit={{ x: 300 }}
                            transition={{ type: "spring", damping: 28 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button onClick={() => setOpen(false)} className="self-end p-2 mb-4" aria-label="Tutup menu">
                                <FiX className="w-6 h-6" />
                            </button>
                            {links.map((l) => (
                                <NavItem key={l.label} link={l} onClick={() => setOpen(false)} className="py-3 text-lg font-medium border-b border-gray-100 dark:border-gray-800" />
                            ))}
                            <Link href={route("cv")} className="mt-6 text-center px-4 py-3 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium">
                                Lihat / Unduh CV
                            </Link>
                        </motion.nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
