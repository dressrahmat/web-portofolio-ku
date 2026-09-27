import {
    FiBarChart2, FiCode, FiDatabase, FiGithub, FiGlobe, FiInstagram, FiLayout, FiLinkedin,
    FiMail, FiPenTool, FiServer, FiSettings, FiShoppingCart, FiSmartphone, FiTrendingUp,
    FiUsers, FiYoutube,
} from "react-icons/fi";
import { FaTiktok, FaWhatsapp } from "react-icons/fa";

const SERVICE_ICONS = {
    code: FiCode,
    layout: FiLayout,
    server: FiServer,
    database: FiDatabase,
    smartphone: FiSmartphone,
    "trending-up": FiTrendingUp,
    "bar-chart": FiBarChart2,
    "pen-tool": FiPenTool,
    globe: FiGlobe,
    "shopping-cart": FiShoppingCart,
    users: FiUsers,
    settings: FiSettings,
};

export function ServiceIcon({ name, className = "w-6 h-6" }) {
    const Icon = SERVICE_ICONS[name] || FiCode;
    return <Icon className={className} />;
}

/**
 * Daftar link sosial dari profil yang terisi saja.
 */
export function socialLinks(profile = {}) {
    return [
        { key: "linkedin", href: profile.linkedin_url, label: "LinkedIn", Icon: FiLinkedin },
        { key: "github", href: profile.github_url, label: "GitHub", Icon: FiGithub },
        { key: "instagram", href: profile.instagram_url, label: "Instagram", Icon: FiInstagram },
        { key: "youtube", href: profile.youtube_url, label: "YouTube", Icon: FiYoutube },
        { key: "tiktok", href: profile.tiktok_url, label: "TikTok", Icon: FaTiktok },
        { key: "whatsapp", href: profile.whatsapp_url, label: "WhatsApp", Icon: FaWhatsapp },
        { key: "email", href: profile.email ? `mailto:${profile.email}` : null, label: "Email", Icon: FiMail },
    ].filter((l) => l.href);
}

export { FaWhatsapp };
