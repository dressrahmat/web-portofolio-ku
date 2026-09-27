import { motion } from "framer-motion";
import { FiAward, FiBookOpen, FiExternalLink } from "react-icons/fi";
import Section, { fadeUp } from "@/Components/Front/Section";

export default function ExperienceSection({ experiences = [], educations = [], achievements = [] }) {
    if (!experiences.length && !educations.length && !achievements.length) return null;

    return (
        <Section id="pengalaman" eyebrow="Perjalanan" title="Pengalaman & Pendidikan">
            <div className="grid lg:grid-cols-5 gap-10">
                {/* Timeline pengalaman */}
                <div className="lg:col-span-3">
                    <ol className="relative border-l-2 border-gray-200 dark:border-gray-800 ml-3 space-y-10">
                        {experiences.map((exp, i) => (
                            <motion.li key={exp.id} {...fadeUp(i * 0.05)} className="pl-8 relative">
                                <span
                                    className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-4 border-white dark:border-gray-950 ${
                                        exp.is_current ? "bg-green-500" : "bg-blue-500"
                                    }`}
                                />
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                                    <span className="font-medium text-gray-500 dark:text-gray-400">{exp.period}</span>
                                    <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                                        {exp.type_label}
                                    </span>
                                </div>
                                <h3 className="mt-1.5 text-lg font-semibold">{exp.position}</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    {exp.organization_url ? (
                                        <a href={exp.organization_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 inline-flex items-center gap-1">
                                            {exp.organization} <FiExternalLink className="w-3 h-3" />
                                        </a>
                                    ) : (
                                        exp.organization
                                    )}
                                    {exp.location && <span> · {exp.location}</span>}
                                </p>
                                {exp.description && <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{exp.description}</p>}
                                {exp.highlights?.length > 0 && (
                                    <ul className="mt-3 space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
                                        {exp.highlights.map((h) => (
                                            <li key={h} className="flex gap-2">
                                                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                                                {h}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </motion.li>
                        ))}
                    </ol>
                </div>

                {/* Pendidikan & sertifikat */}
                <div className="lg:col-span-2 space-y-8">
                    {educations.length > 0 && (
                        <motion.div {...fadeUp(0.1)}>
                            <h3 className="flex items-center gap-2 font-semibold mb-4">
                                <FiBookOpen className="text-blue-600" /> Pendidikan
                            </h3>
                            <div className="space-y-3">
                                {educations.map((ed) => (
                                    <div key={ed.id} className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                                        <p className="font-medium">{ed.institution}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {[ed.degree, ed.field_of_study].filter(Boolean).join(" · ")}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {ed.period}
                                            {ed.grade && ` · ${ed.grade}`}
                                        </p>
                                        {ed.description && <p className="text-sm mt-2 text-gray-600 dark:text-gray-400">{ed.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {achievements.length > 0 && (
                        <motion.div {...fadeUp(0.2)}>
                            <h3 className="flex items-center gap-2 font-semibold mb-4">
                                <FiAward className="text-amber-500" /> Sertifikat & Penghargaan
                            </h3>
                            <div className="space-y-3">
                                {achievements.map((a) => (
                                    <div key={a.id} className="flex gap-3 p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                                        {a.image_url ? (
                                            <img src={a.image_url} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                                        ) : (
                                            <span className="w-12 h-12 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-500 flex items-center justify-center shrink-0">
                                                <FiAward className="w-5 h-5" />
                                            </span>
                                        )}
                                        <div className="min-w-0">
                                            <p className="font-medium leading-snug">{a.title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {[a.issuer, a.issued_label].filter(Boolean).join(" · ")}
                                            </p>
                                            {a.credential_url && (
                                                <a href={a.credential_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 mt-1">
                                                    Lihat kredensial <FiExternalLink className="w-3 h-3" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </Section>
    );
}
