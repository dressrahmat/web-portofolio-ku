import React, { useState, useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import MenuSideBarAdmin from "@/Components/MenuSideBarAdmin";
import MenuHeaderAdmin from "@/Components/MenuHeaderAdmin";
import {
    FiHome, FiUser, FiBriefcase, FiBookOpen, FiZap, FiAward, FiLayers,
    FiMessageCircle, FiFolder, FiFileText, FiTag, FiInbox, FiSettings,
    FiUsers, FiShield, FiActivity,
} from "react-icons/fi";

export default function AdminLayout({ children, title }) {
    const { auth, settings } = usePage().props;
    const [isDark, setIsDark] = useState(
        localStorage.getItem("darkMode") === "true" ||
            (!localStorage.getItem("darkMode") &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loadingNotifications, setLoadingNotifications] = useState(true);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    // Helper functions untuk permission checking
    const hasPermission = (permission) => {
        return (
            auth.user &&
            auth.user.permissions &&
            auth.user.permissions.includes(permission)
        );
    };

    const hasRole = (role) => {
        return auth.user && auth.user.roles && auth.user.roles.includes(role);
    };

    const hasAnyPermission = (permissions) => {
        if (!auth.user || !auth.user.permissions) return false;
        return permissions.some((permission) =>
            auth.user.permissions.includes(permission)
        );
    };

    const hasAnyRole = (roles) => {
        if (!auth.user || !auth.user.roles) return false;
        return roles.some((role) => auth.user.roles.includes(role));
    };

    // Menu sidebar. `permission` bisa string atau array (cukup salah satu).
    // Item dengan `section` dipakai sebagai judul kelompok.
    const { unreadMessages = 0 } = usePage().props;
    const icon = (Icon) => <Icon className="w-5 h-5" />;

    const menuItems = [
        { id: "dashboard", label: "Dashboard", route: route("dashboard"), permission: "view dashboard", activeRoutes: ["dashboard"], icon: icon(FiHome) },

        { id: "sec-cv", section: "Konten CV", permission: "manage cv" },
        { id: "cv-profile", label: "Profil & Kontak", route: route("admin.cv.profile.edit"), permission: "manage cv", activeRoutes: ["admin.cv.profile.*"], icon: icon(FiUser) },
        { id: "cv-experiences", label: "Pengalaman", route: route("admin.cv.experiences.index"), permission: "manage cv", activeRoutes: ["admin.cv.experiences.*"], icon: icon(FiBriefcase) },
        { id: "cv-educations", label: "Pendidikan", route: route("admin.cv.educations.index"), permission: "manage cv", activeRoutes: ["admin.cv.educations.*"], icon: icon(FiBookOpen) },
        { id: "cv-skills", label: "Keahlian", route: route("admin.cv.skills.index"), permission: "manage cv", activeRoutes: ["admin.cv.skills.*"], icon: icon(FiZap) },
        { id: "cv-achievements", label: "Sertifikat & Penghargaan", route: route("admin.cv.achievements.index"), permission: "manage cv", activeRoutes: ["admin.cv.achievements.*"], icon: icon(FiAward) },
        { id: "cv-services", label: "Layanan", route: route("admin.cv.services.index"), permission: "manage cv", activeRoutes: ["admin.cv.services.*"], icon: icon(FiLayers) },
        { id: "cv-testimonials", label: "Testimoni", route: route("admin.cv.testimonials.index"), permission: "manage cv", activeRoutes: ["admin.cv.testimonials.*"], icon: icon(FiMessageCircle) },

        { id: "sec-content", section: "Karya & Tulisan", permission: ["view portofolio", "view artikel", "view kategori"] },
        { id: "portfolios", label: "Portofolio", route: route("admin.portfolios.index"), permission: "view portofolio", activeRoutes: ["admin.portfolios.*"], icon: icon(FiFolder) },
        { id: "artikel", label: "Artikel", route: route("admin.artikel.index"), permission: "view artikel", activeRoutes: ["admin.artikel.*"], icon: icon(FiFileText) },
        { id: "kategori", label: "Kategori Artikel", route: route("admin.kategori.index"), permission: "view kategori", activeRoutes: ["admin.kategori.*"], icon: icon(FiTag) },

        { id: "sec-inbox", section: "Kotak Masuk", permission: "view messages" },
        { id: "messages", label: "Pesan Masuk", route: route("admin.messages.index"), permission: "view messages", activeRoutes: ["admin.messages.*"], icon: icon(FiInbox), badge: unreadMessages },

        { id: "sec-system", section: "Sistem", permission: ["view settings", "view users", "view roles", "view permissions", "view audit trail"] },
        { id: "settings", label: "Pengaturan Website", route: route("admin.settings.index"), permission: "view settings", activeRoutes: ["admin.settings.*"], icon: icon(FiSettings) },
        { id: "users", label: "Pengguna", route: route("admin.users.index"), permission: "view users", activeRoutes: ["admin.users.*"], icon: icon(FiUsers) },
        { id: "role-permissions", label: "Role & Permission", route: route("admin.role-permissions.index"), permission: ["view roles", "view permissions"], activeRoutes: ["admin.role-permissions.index", "admin.roles.*", "admin.permissions.*"], icon: icon(FiShield) },
        { id: "audit-trail", label: "Audit Trail", route: route("admin.audit-trail.index"), permission: "view audit trail", activeRoutes: ["admin.audit-trail.*"], icon: icon(FiActivity) },
    ];

    const getFilteredMenuItems = () =>
        menuItems.filter((menu) => {
            if (!menu.permission) return true;
            return Array.isArray(menu.permission)
                ? hasAnyPermission(menu.permission)
                : hasPermission(menu.permission);
        });

    const filteredMenuItems = getFilteredMenuItems();

    // Fungsi untuk memuat notifikasi
    const loadNotifications = async () => {
        try {
            const response = await fetch(
                route("admin.audit-trail.notifications")
            );
            const data = await response.json();
            setNotifications(data.notifications || []);
            setUnreadCount(data.unread_count || 0);
        } catch (error) {
            console.error("Error loading notifications:", error);
            setNotifications([]);
            setUnreadCount(0);
        } finally {
            setLoadingNotifications(false);
        }
    };

    // Load notifikasi saat komponen mount
    useEffect(() => {
        loadNotifications();

        // Refresh notifikasi setiap 30 detik
        const interval = setInterval(loadNotifications, 30000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("darkMode", "true");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("darkMode", "false");
        }
    }, [isDark]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setSidebarOpen(true);
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Fungsi untuk mendapatkan warna event
    const getEventColor = (event) => {
        const colorMap = {
            created: "success",
            login: "success",
            approved: "success",
            updated: "warning",
            restored: "warning",
            imported: "warning",
            deleted: "error",
            logout: "error",
            rejected: "error",
            viewed: "info",
            downloaded: "info",
            exported: "primary",
        };
        return colorMap[event] || "neutral";
    };

    // Fungsi untuk mendapatkan ikon event
    const getEventIcon = (event) => {
        const iconMap = {
            created: (
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                </svg>
            ),
            updated: (
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                </svg>
            ),
            deleted: (
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                </svg>
            ),
            login: (
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                </svg>
            ),
            logout: (
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                </svg>
            ),
            viewed: (
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                </svg>
            ),
            default: (
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            ),
        };
        return iconMap[event] || iconMap.default;
    };

    return (
        <>
            <Head>
                {settings?.site_favicon && (
                    <link
                        rel="icon"
                        type="image/x-icon"
                        href={settings.site_favicon}
                    />
                )}
            </Head>
            <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
                <MenuSideBarAdmin
                    auth={auth}
                    settings={settings}
                    sidebarExpanded={sidebarExpanded}
                    sidebarOpen={sidebarOpen}
                    setSidebarExpanded={setSidebarExpanded}
                    setSidebarOpen={setSidebarOpen}
                    menuItems={filteredMenuItems}
                />

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <MenuHeaderAdmin
                        auth={auth}
                        title={title}
                        isDark={isDark}
                        setIsDark={setIsDark}
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                        notifications={notifications}
                        unreadCount={unreadCount}
                        loadingNotifications={loadingNotifications}
                        notificationsOpen={notificationsOpen}
                        setNotificationsOpen={setNotificationsOpen}
                        profileOpen={profileOpen}
                        setProfileOpen={setProfileOpen}
                        loadNotifications={loadNotifications}
                        getEventColor={getEventColor}
                        getEventIcon={getEventIcon}
                    />

                    <main className="flex-1 overflow-y-auto p-1 pt-3 bg-neutral-50 dark:bg-neutral-900">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
}
