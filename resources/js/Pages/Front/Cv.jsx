import { Link, usePage } from "@inertiajs/react";
import { FiArrowLeft, FiDownload, FiGlobe, FiMail, FiMapPin, FiPhone, FiPrinter, FiLinkedin, FiGithub } from "react-icons/fi";
import SeoHead from "@/Components/Front/SeoHead";

const cleanUrl = (u) => u?.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

/**
 * CV yang disusun otomatis dari data admin.
 * Didesain untuk A4 — tombol "Cetak / Simpan PDF" memakai dialog cetak browser.
 */
export default function Cv({ meta, experiences, educations, skills, achievements, portfolios }) {
    const { profile = {} } = usePage().props;

    const contacts = [
        { icon: FiMail, value: profile.email, href: profile.email && `mailto:${profile.email}` },
        { icon: FiPhone, value: profile.whatsapp || profile.phone, href: profile.whatsapp_url },
        { icon: FiMapPin, value: profile.location },
        { icon: FiGlobe, value: cleanUrl(profile.website), href: profile.website },
        { icon: FiLinkedin, value: cleanUrl(profile.linkedin_url), href: profile.linkedin_url },
        { icon: FiGithub, value: cleanUrl(profile.github_url), href: profile.github_url },
    ].filter((c) => c.value);

    const Heading = ({ children }) => (
        <h2 className="text-[11px] font-bold tracking-[0.18em] uppercase text-blue-700 border-b border-gray-200 pb-1.5 mb-3">
            {children}
        </h2>
    );

    return (
        <div className="min-h-screen bg-gray-100 print:bg-white text-gray-900 cv-page">
            <SeoHead meta={{ ...meta, description: profile.short_bio }} />

            {/* Toolbar (tidak ikut dicetak) */}
            <div className="print:hidden sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200">
                <div className="max-w-[210mm] mx-auto px-4 py-3 flex items-center justify-between gap-3">
                    <Link href={route("welcome")} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600">
                        <FiArrowLeft /> Kembali
                    </Link>
                    <div className="flex gap-2">
                        {profile.cv_url && (
                            <a href={profile.cv_url} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50">
                                <FiDownload /> Unduh PDF
                            </a>
                        )}
                        <button onClick={() => window.print()} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:opacity-90">
                            <FiPrinter /> Cetak / Simpan PDF
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-[210mm] mx-auto my-6 print:my-0 bg-white shadow-sm print:shadow-none px-[14mm] py-[12mm] print:p-0 text-[13px] leading-relaxed">
                {/* Header */}
                <header className="flex items-center gap-6 pb-5 border-b-2 border-gray-900">
                    {profile.photo_url && (
                        <img src={profile.photo_url} alt="" className="w-24 h-24 rounded-full object-cover shrink-0" />
                    )}
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{profile.full_name}</h1>
                        {profile.headline && <p className="text-base text-blue-700 font-medium mt-0.5">{profile.headline}</p>}
                        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-gray-600">
                            {contacts.map(({ icon: Icon, value, href }) => (
                                <li key={value} className="inline-flex items-center gap-1.5">
                                    <Icon className="w-3.5 h-3.5 text-gray-400" />
                                    {href ? <a href={href}>{value}</a> : value}
                                </li>
                            ))}
                        </ul>
                    </div>
                </header>

                <div className="grid grid-cols-[1fr_62mm] gap-8 mt-6">
                    {/* Kolom utama */}
                    <div className="space-y-6">
                        {profile.short_bio && (
                            <section>
                                <Heading>Ringkasan</Heading>
                                <p className="text-gray-700">{profile.short_bio}</p>
                            </section>
                        )}

                        {experiences.length > 0 && (
                            <section>
                                <Heading>Pengalaman</Heading>
                                <div className="space-y-4">
                                    {experiences.map((e) => (
                                        <div key={e.id} className="break-inside-avoid">
                                            <div className="flex justify-between gap-4">
                                                <p className="font-semibold">{e.position}</p>
                                                <p className="text-[11px] text-gray-500 whitespace-nowrap">{e.period}</p>
                                            </div>
                                            <p className="text-gray-600 text-[12px]">
                                                {e.organization}
                                                {e.location && ` · ${e.location}`}
                                            </p>
                                            {e.description && <p className="mt-1 text-gray-700">{e.description}</p>}
                                            {e.highlights?.length > 0 && (
                                                <ul className="mt-1 list-disc pl-4 text-gray-700 space-y-0.5">
                                                    {e.highlights.map((h) => (
                                                        <li key={h}>{h}</li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {portfolios.length > 0 && (
                            <section>
                                <Heading>Proyek Pilihan</Heading>
                                <div className="space-y-2.5">
                                    {portfolios.map((p) => (
                                        <div key={p.id} className="break-inside-avoid">
                                            <p className="font-semibold">
                                                {p.title} <span className="font-normal text-gray-500 text-[11px]">— {p.category}</span>
                                            </p>
                                            {p.short_description && <p className="text-gray-700">{p.short_description}</p>}
                                            <p className="text-[11px] text-blue-700">{cleanUrl(p.project_url || route("portfolio.show", p.slug))}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">
                        {skills.length > 0 && (
                            <section>
                                <Heading>Keahlian</Heading>
                                <div className="space-y-3">
                                    {skills.map((g) => (
                                        <div key={g.category}>
                                            <p className="font-semibold text-[12px]">{g.category}</p>
                                            <p className="text-gray-700 text-[12px]">{g.items.map((s) => s.name).join(" · ")}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {educations.length > 0 && (
                            <section>
                                <Heading>Pendidikan</Heading>
                                <div className="space-y-3">
                                    {educations.map((ed) => (
                                        <div key={ed.id} className="break-inside-avoid">
                                            <p className="font-semibold text-[12px]">{ed.institution}</p>
                                            <p className="text-gray-700 text-[12px]">{[ed.degree, ed.field_of_study].filter(Boolean).join(", ")}</p>
                                            <p className="text-gray-500 text-[11px]">
                                                {ed.period}
                                                {ed.grade && ` · ${ed.grade}`}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {achievements.length > 0 && (
                            <section>
                                <Heading>Sertifikat & Penghargaan</Heading>
                                <div className="space-y-2.5">
                                    {achievements.map((a) => (
                                        <div key={a.id} className="break-inside-avoid">
                                            <p className="font-semibold text-[12px] leading-snug">{a.title}</p>
                                            <p className="text-gray-500 text-[11px]">{[a.issuer, a.issued_label].filter(Boolean).join(" · ")}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </aside>
                </div>

                <p className="mt-8 pt-3 border-t border-gray-200 text-[10px] text-gray-400 text-center">
                    Versi terbaru: {route("cv")}
                </p>
            </main>
        </div>
    );
}
