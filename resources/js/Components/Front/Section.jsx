import { motion } from "framer-motion";

/**
 * Pembungkus section beranda dengan judul konsisten.
 */
export default function Section({ id, eyebrow, title, subtitle, children, className = "", tinted = false }) {
    return (
        <section id={id} className={`scroll-mt-20 py-20 md:py-28 ${tinted ? "bg-gray-50/80 dark:bg-gray-900/40" : ""} ${className}`}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {(eyebrow || title) && (
                    <motion.div
                        className="text-center max-w-2xl mx-auto mb-12 md:mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6 }}
                    >
                        {eyebrow && (
                            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-600 dark:text-blue-400 mb-3">
                                {eyebrow}
                            </p>
                        )}
                        {title && <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{title}</h2>}
                        {subtitle && <p className="mt-4 text-gray-600 dark:text-gray-400">{subtitle}</p>}
                    </motion.div>
                )}
                {children}
            </div>
        </section>
    );
}

export const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.6, delay },
});
