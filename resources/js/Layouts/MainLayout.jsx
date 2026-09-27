import { usePage } from "@inertiajs/react";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import SeoHead from "@/Components/Front/SeoHead";
import { FaWhatsapp } from "@/Components/Front/Icons";

/**
 * Layout halaman publik (beranda, portofolio, blog).
 */
export default function MainLayout({ children, meta }) {
    const { profile = {} } = usePage().props;

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200 font-sans antialiased">
            <SeoHead meta={meta} />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />

            {profile.whatsapp_url && (
                <a
                    href={profile.whatsapp_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat WhatsApp"
                    className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform print:hidden"
                >
                    <FaWhatsapp className="w-7 h-7" />
                </a>
            )}
        </div>
    );
}
