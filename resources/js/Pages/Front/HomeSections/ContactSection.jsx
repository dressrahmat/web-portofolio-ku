import { motion } from "framer-motion";
import { FiMail, FiMapPin } from "react-icons/fi";
import Section, { fadeUp } from "@/Components/Front/Section";
import ContactForm from "@/Components/Front/ContactForm";
import { FaWhatsapp, socialLinks } from "@/Components/Front/Icons";

export default function ContactSection({ profile }) {
    const socials = socialLinks(profile).filter((s) => !["email", "whatsapp"].includes(s.key));

    return (
        <Section id="kontak" eyebrow="Kontak" title="Mari bekerja sama" subtitle="Punya ide proyek, butuh website untuk lembaga, atau sekadar ingin berdiskusi? Kirim pesan — saya biasanya membalas dalam 1×24 jam.">
            <div className="grid md:grid-cols-5 gap-8">
                <motion.div {...fadeUp()} className="md:col-span-2 space-y-4">
                    {profile.whatsapp_url && (
                        <a href={profile.whatsapp_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-green-300 transition">
                            <span className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-600 flex items-center justify-center">
                                <FaWhatsapp className="w-6 h-6" />
                            </span>
                            <span>
                                <span className="block font-medium">WhatsApp</span>
                                <span className="block text-sm text-gray-500">Respons paling cepat</span>
                            </span>
                        </a>
                    )}
                    {profile.email && (
                        <a href={`mailto:${profile.email}`} className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-300 transition">
                            <span className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                                <FiMail className="w-6 h-6" />
                            </span>
                            <span className="min-w-0">
                                <span className="block font-medium">Email</span>
                                <span className="block text-sm text-gray-500 truncate">{profile.email}</span>
                            </span>
                        </a>
                    )}
                    {profile.location && (
                        <div className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <span className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center">
                                <FiMapPin className="w-6 h-6" />
                            </span>
                            <span>
                                <span className="block font-medium">Lokasi</span>
                                <span className="block text-sm text-gray-500">{profile.location} · bisa remote</span>
                            </span>
                        </div>
                    )}
                    {socials.length > 0 && (
                        <div className="flex gap-2 pt-2">
                            {socials.map(({ key, href, label, Icon }) => (
                                <a key={key} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="p-3 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900">
                                    <Icon />
                                </a>
                            ))}
                        </div>
                    )}
                </motion.div>

                <motion.div {...fadeUp(0.1)} className="md:col-span-3 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50/60 dark:from-gray-900 dark:to-blue-950/20 border border-gray-100 dark:border-gray-800">
                    <ContactForm />
                </motion.div>
            </div>
        </Section>
    );
}
