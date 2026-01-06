import React, { useState, useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import MenuSideBarAdmin from "@/Components/MenuSideBarAdmin";
import MenuHeaderAdmin from "@/Components/MenuHeaderAdmin";

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

    // Array menu items - DIPERBAHARUI
    const menuItems = [
        {
            id: "dashboard",
            label: "Dashboard",
            route: route("dashboard"),
            permission: "view dashboard",
            roles: ["admin", "superadmin"],
            anyPermission: false,
            anyRole: true,
            activeRoutes: ["dashboard"],
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                </svg>
            ),
        },
        {
            id: "users",
            label: "Users",
            route: route("admin.users.index"),
            permission: "view users",
            roles: [],
            anyPermission: false,
            anyRole: false,
            activeRoutes: [
                "admin.users.index",
                "admin.users.create",
                "admin.users.edit",
            ],
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.281.022-.562.043-.843.064M12 14a6 6 0 006-6c0-3.314-2.686-6-6-6S6 4.686 6 8a6 6 0 006 6z"
                    />
                </svg>
            ),
        },
        {
            id: "role-permissions",
            label: "Role & Permissions",
            route: route("admin.role-permissions.index"),
            permission: "",
            roles: [],
            anyPermission: true,
            permissions: ["view roles", "view permissions"],
            anyRole: false,
            activeRoutes: [
                "admin.role-permissions.index",
                "admin.roles.create",
                "admin.roles.edit",
                "admin.permissions.create",
                "admin.permissions.edit",
            ],
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                </svg>
            ),
        },
        {
            id: "audit-trail",
            label: "Audit Trail",
            route: route("admin.audit-trail.index"),
            permission: "view audit trail",
            roles: [],
            anyPermission: false,
            anyRole: false,
            activeRoutes: ["admin.audit-trail.*"],
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                </svg>
            ),
        },
        {
            id: "settings",
            label: "Settings",
            route: route("admin.settings.index"),
            permission: "view settings",
            roles: ["admin", "superadmin"],
            anyPermission: false,
            anyRole: false,
            activeRoutes: ["admin.settings.*"],
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
            ),
        },
        {
            id: "kategori",
            label: "Kategori",
            route: route("admin.kategori.index"),
            permission: "view kategori",
            roles: ["admin", "superadmin"],
            anyPermission: false,
            anyRole: false,
            activeRoutes: ["admin.settings.*"],
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
            ),
        },
    ];

    // Filter menu berdasarkan permission user
    const getFilteredMenuItems = () => {
        const user = auth.user;

        return menuItems.filter((menu) => {
            // Check jika menu memiliki permission tertentu
            if (menu.permission && menu.anyPermission === false) {
                return hasPermission(menu.permission);
            }

            // Check jika menu memerlukan salah satu dari beberapa permissions
            if (menu.anyPermission && menu.permissions) {
                return hasAnyPermission(menu.permissions);
            }

            // Check jika menu memerlukan role tertentu
            if (menu.roles.length > 0 && menu.anyRole === false) {
                return menu.roles.some((role) => hasRole(role));
            }

            // Check jika menu memerlukan salah satu dari beberapa roles
            if (menu.anyRole && menu.roles.length > 0) {
                return hasAnyRole(menu.roles);
            }

            // Jika tidak ada permission/role requirement, tampilkan menu
            return true;
        });
    };

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
