import React from "react";
import { Link } from "@inertiajs/react";

export default function MenuHeaderAdmin({
    auth,
    title,
    isDark,
    setIsDark,
    sidebarOpen,
    setSidebarOpen,
    notifications,
    unreadCount,
    loadingNotifications,
    notificationsOpen,
    setNotificationsOpen,
    profileOpen,
    setProfileOpen,
    loadNotifications,
    getEventColor,
    getEventIcon,
}) {
    return (
        <header className="bg-neutral-50 dark:bg-neutral-800 shadow-sm border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 mr-2 md:hidden"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-neutral-600 dark:text-neutral-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                        {title}
                    </h2>
                </div>

                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => setIsDark(!isDark)}
                        className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                    >
                        {isDark ? (
                            <svg
                                className="h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                            </svg>
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setNotificationsOpen(!notificationsOpen);
                                if (!notificationsOpen) {
                                    loadNotifications();
                                }
                            }}
                            className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 relative"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                            </svg>
                            {unreadCount > 0 && (
                                <span className="absolute top-0 right-0 w-2 h-2 bg-error-500 rounded-full"></span>
                            )}
                        </button>

                        {/* Notifications Panel */}
                        <div
                            className={`absolute right-0 mt-2 w-96 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-neutral-200 dark:border-neutral-700 z-50 ${
                                notificationsOpen ? "block" : "hidden"
                            }`}
                        >
                            <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                                        Aktivitas Terbaru
                                    </h3>
                                    {unreadCount > 0 && (
                                        <span className="text-xs bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 px-2 py-1 rounded-full">
                                            {unreadCount} baru
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="max-h-96 overflow-y-auto">
                                {loadingNotifications ? (
                                    <div className="px-4 py-4 text-center">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                                            Memuat notifikasi...
                                        </p>
                                    </div>
                                ) : notifications.length === 0 ? (
                                    <div className="px-4 py-6 text-center">
                                        <svg
                                            className="w-12 h-12 text-neutral-400 mx-auto mb-3"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                            />
                                        </svg>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                            Belum ada aktivitas
                                        </p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
                                        {notifications.map((notification) => (
                                            <Link
                                                key={notification.id}
                                                href={route(
                                                    "admin.audit-trail.show",
                                                    notification.id
                                                )}
                                                className="block px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors duration-150"
                                                onClick={() =>
                                                    setNotificationsOpen(false)
                                                }
                                            >
                                                <div className="flex items-start space-x-3">
                                                    <div
                                                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-${getEventColor(
                                                            notification.event
                                                        )}-100 dark:bg-${getEventColor(
                                                            notification.event
                                                        )}-900 text-${getEventColor(
                                                            notification.event
                                                        )}-600 dark:text-${getEventColor(
                                                            notification.event
                                                        )}-400`}
                                                    >
                                                        {getEventIcon(
                                                            notification.event
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                                                {notification.user
                                                                    ? notification
                                                                          .user
                                                                          .name
                                                                    : "Sistem"}
                                                            </p>
                                                            <span className="text-xs text-neutral-500 dark:text-neutral-500">
                                                                {
                                                                    notification.created_at_human
                                                                }
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
                                                            {
                                                                notification.description
                                                            }
                                                        </p>
                                                        <div className="flex items-center mt-1 space-x-2">
                                                            <span
                                                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-${getEventColor(
                                                                    notification.event
                                                                )}-100 dark:bg-${getEventColor(
                                                                    notification.event
                                                                )}-900 text-${getEventColor(
                                                                    notification.event
                                                                )}-800 dark:text-${getEventColor(
                                                                    notification.event
                                                                )}-200`}
                                                            >
                                                                {
                                                                    notification.event_display_name
                                                                }
                                                            </span>
                                                            {notification.auditable_type_display_name && (
                                                                <span className="text-xs text-neutral-500 dark:text-neutral-500">
                                                                    {
                                                                        notification.auditable_type_display_name
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="px-4 py-3 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-700 rounded-b-xl">
                                <Link
                                    href={route("admin.audit-trail.index")}
                                    className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center justify-center"
                                    onClick={() => setNotificationsOpen(false)}
                                >
                                    Lihat semua aktivitas
                                    <svg
                                        className="w-4 h-4 ml-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setProfileOpen(!profileOpen)}
                            className="flex items-center space-x-2 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100"
                        >
                            <div className="w-8 h-8 rounded-full bg-primary-500 dark:bg-primary-400 flex items-center justify-center text-white font-medium">
                                {auth.user.name.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="hidden md:inline font-medium">
                                {auth.user.name}
                            </span>
                        </button>
                        <div
                            className={`absolute right-0 mt-2 w-48 bg-neutral-50 dark:bg-neutral-700 rounded-xl shadow-card py-1 z-50 border border-neutral-200 dark:border-neutral-600 ${
                                profileOpen ? "" : "hidden"
                            }`}
                        >
                            <Link
                                href={route("profile.edit")}
                                className="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-600"
                            >
                                Profil Anda
                            </Link>
                            <Link
                                href={route("admin.settings.index")}
                                className="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-600"
                            >
                                Pengaturan
                            </Link>
                            <Link
                                href={route("logout")}
                                method="post"
                                as="button"
                                className="block w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-600"
                            >
                                Keluar
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
