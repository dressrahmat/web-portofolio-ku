import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import Section, { fadeUp } from "@/Components/Front/Section";
import { ServiceIcon } from "@/Components/Front/Icons";

export default function ServicesSection({ services }) {
    if (!services?.length) return null;

    return (
        <Section id="layanan" eyebrow="Layanan" title="Apa yang bisa saya bantu" subtitle="Solusi digital dari perencanaan sampai sistem berjalan dan dipakai tim Anda.">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {services.map((s, i) => (
                    <motion.div
                        key={s.id}
                        {...fadeUp(i * 0.08)}
                        className="flex flex-col p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-lg transition-all"
                    >
                        <span className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-green-500 text-white flex items-center justify-center">
                            <ServiceIcon name={s.icon} />
                        </span>
                        <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{s.description}</p>
                        {s.items?.length > 0 && (
                            <ul className="mt-4 space-y-1.5 text-sm">
                                {s.items.map((item) => (
                                    <li key={item} className="flex gap-2 text-gray-700 dark:text-gray-300">
                                        <FiCheck className="mt-0.5 text-green-500 shrink-0" /> {item}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {s.price_note && (
                            <p className="mt-auto pt-5 text-sm font-medium text-blue-600 dark:text-blue-400">{s.price_note}</p>
                        )}
                    </motion.div>
                ))}
            </div>
        </Section>
    );
}
