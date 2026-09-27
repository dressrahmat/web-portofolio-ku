import { Link, usePage } from "@inertiajs/react";
import { socialLinks } from "@/Components/Front/Icons";

export default function Footer() {
    const { profile = {}, settings = {} } = usePage().props;
    const name = profile.full_name || settings.site_name;

    return (
        <footer className="border-t border-gray-200 dark:border-gray-800">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                    <p className="font-semibold">{name}</p>
                    {profile.headline && <p className="text-sm text-gray-500 dark:text-gray-400">{profile.headline}</p>}
                </div>

                <div className="flex items-center gap-2">
                    {socialLinks(profile).map(({ key, href, label, Icon }) => (
                        <a
                            key={key}
                            href={href}
                            target={key === "email" ? undefined : "_blank"}
                            rel="noopener noreferrer"
                            aria-label={label}
                            title={label}
                            className="p-2.5 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-gray-800 transition"
                        >
                            <Icon className="w-4 h-4" />
                        </a>
                    ))}
                </div>
            </div>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
                <p>© {new Date().getFullYear()} {name}. Semua hak dilindungi.</p>
                <nav className="flex gap-4">
                    <Link href={route("portfolio.index")} className="hover:text-gray-900 dark:hover:text-white">Portofolio</Link>
                    <Link href={route("blog.index")} className="hover:text-gray-900 dark:hover:text-white">Blog</Link>
                    <Link href={route("cv")} className="hover:text-gray-900 dark:hover:text-white">CV</Link>
                </nav>
            </div>
        </footer>
    );
}
