import { motion } from "framer-motion";
import Section, { fadeUp } from "@/Components/Front/Section";

const levelLabel = (l) => (l >= 90 ? "Ahli" : l >= 70 ? "Mahir" : l >= 40 ? "Menengah" : "Dasar");

export default function SkillsSection({ skills = [] }) {
    if (!skills.length) return null;

    return (
        <Section id="keahlian" eyebrow="Keahlian" title="Tools & kemampuan" tinted>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {skills.map((group, gi) => (
                    <motion.div key={group.category} {...fadeUp(gi * 0.06)} className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                        <h3 className="font-semibold mb-4">{group.category}</h3>
                        <ul className="space-y-3">
                            {group.items.map((s) => (
                                <li key={s.id}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>{s.name}</span>
                                        <span className="text-xs text-gray-500">{levelLabel(s.level)}</span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                                        <motion.div
                                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-500"
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${s.level}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                        />
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </div>
        </Section>
    );
}
