import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";
import Section, { fadeUp } from "@/Components/Front/Section";

export default function TestimonialsSection({ testimonials = [] }) {
    if (!testimonials.length) return null;

    return (
        <Section id="testimoni" eyebrow="Testimoni" title="Kata mereka">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((t, i) => (
                    <motion.figure key={t.id} {...fadeUp(i * 0.08)} className="flex flex-col p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                        <div className="flex gap-0.5 text-amber-400">
                            {Array.from({ length: t.rating || 5 }).map((_, k) => (
                                <FiStar key={k} className="fill-current w-4 h-4" />
                            ))}
                        </div>
                        <blockquote className="mt-4 flex-1 text-gray-700 dark:text-gray-300 leading-relaxed">“{t.content}”</blockquote>
                        <figcaption className="mt-6 flex items-center gap-3">
                            {t.photo_url ? (
                                <img src={t.photo_url} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                                <span className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-green-500 text-white flex items-center justify-center font-semibold">
                                    {t.name.charAt(0)}
                                </span>
                            )}
                            <span>
                                <span className="block font-medium text-sm">{t.name}</span>
                                <span className="block text-xs text-gray-500">{[t.role, t.company].filter(Boolean).join(", ")}</span>
                            </span>
                        </figcaption>
                    </motion.figure>
                ))}
            </div>
        </Section>
    );
}
