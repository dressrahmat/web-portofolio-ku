import { motion } from "framer-motion";
import Section, { fadeUp } from "@/Components/Front/Section";

export default function AboutSection({ profile }) {
    const stats = profile.stats || [];
    if (!profile.about && !profile.short_bio && stats.length === 0) return null;

    return (
        <Section id="tentang" eyebrow="Tentang Saya" title="Teknologi yang melayani tujuan" tinted>
            <div className="grid md:grid-cols-5 gap-10 items-start">
                <motion.div {...fadeUp()} className="md:col-span-3">
                    {profile.about ? (
                        <div
                            className="prose-content text-gray-700 dark:text-gray-300 text-[17px]"
                            dangerouslySetInnerHTML={{ __html: profile.about }}
                        />
                    ) : (
                        <p className="text-gray-700 dark:text-gray-300 text-[17px] leading-relaxed">{profile.short_bio}</p>
                    )}
                </motion.div>

                {stats.length > 0 && (
                    <motion.div {...fadeUp(0.15)} className="md:col-span-2 grid grid-cols-2 gap-4">
                        {stats.map((s, i) => (
                            <div
                                key={i}
                                className={`p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 ${
                                    stats.length % 2 === 1 && i === stats.length - 1 ? "col-span-2" : ""
                                }`}
                            >
                                <p className="flex items-baseline gap-1.5">
                                    <span className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400">
                                        {s.value}
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-gray-100">{s.label}</span>
                                </p>
                                {s.caption && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{s.caption}</p>}
                            </div>
                        ))}
                    </motion.div>
                )}
            </div>
        </Section>
    );
}
