import React from "react";
import { Link, usePage } from "@inertiajs/react";

export default function MenuSideBarAdmin({
    auth,
    settings,
    sidebarExpanded,
    sidebarOpen,
    setSidebarExpanded,
    setSidebarOpen,
    menuItems,
}) {
    const { url } = usePage();

    // Tambahkan default settings jika undefined
    const safeSettings = settings || {
        site_name: "Website",
        // tambahkan properti lain jika diperlukan
    };

    // Fungsi yang ditingkatkan untuk mengecek route aktif
    const isRouteActive = (activeRoutes) => {
        const currentRouteName = route().current();

        if (!currentRouteName || !activeRoutes) return false;

        // Pastikan activeRoutes selalu array
        const routes = Array.isArray(activeRoutes)
            ? activeRoutes
            : [activeRoutes];

        // Cek setiap pattern
        for (const pattern of routes) {
            // Jika pattern mengandung wildcard *
            if (pattern.includes("*")) {
                let regexPattern = pattern.replace(/\./g, "\\.");
                regexPattern = regexPattern.replace(/\*/g, ".*");
                const regex = new RegExp(`^${regexPattern}$`);

                if (regex.test(currentRouteName)) {
                    return true;
                }
            }
            // Exact match
            else if (currentRouteName === pattern) {
                return true;
            }
        }

        return false;
    };

    return (
        <>
            {/* Sidebar Mobile Overlay */}
            <div
                className={`fixed inset-0 z-40 md:hidden bg-neutral-900 bg-opacity-50 transition-opacity duration-300 ease-in-out ${
                    sidebarOpen
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setSidebarOpen(false)}
            ></div>

            {/* Sidebar */}
            <div
                className={`fixed z-50 md:static bg-neutral-50 dark:bg-neutral-800 shadow-card transition-transform md:transition-all duration-300 ease-in-out h-screen  ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } ${sidebarExpanded ? "w-64" : "w-20"} md:translate-x-0`}
            >
                <div className="p-4 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center">
                        {sidebarExpanded ? (
                            <h1 className="text-xl font-bold text-primary-500 dark:text-primary-400">
                                {safeSettings.site_name}
                            </h1>
                        ) : (
                            <div className="w-10 h-10 flex items-center justify-center">
                                <span className="text-2xl font-bold text-primary-500 dark:text-primary-400">
                                    {safeSettings.site_name?.charAt(0) || "W"}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex space-x-1">
                        <button
                            onClick={() => setSidebarExpanded(true)}
                            className={`p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 ${
                                sidebarExpanded ? "hidden" : ""
                            }`}
                            title="Expand sidebar"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-neutral-600 dark:text-neutral-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={() => setSidebarExpanded(false)}
                            className={`p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700 ${
                                sidebarExpanded ? "" : "hidden"
                            }`}
                            title="Collapse sidebar"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-neutral-600 dark:text-neutral-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                <nav className="p-3 overflow-y-auto h-[calc(100vh-4.5rem)]">
                    <ul className="space-y-1">
                        {menuItems.map((menu) => {
                            if (menu.section) {
                                return sidebarExpanded ? (
                                    <li
                                        key={menu.id}
                                        className="pt-4 pb-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-neutral-500"
                                    >
                                        {menu.section}
                                    </li>
                                ) : (
                                    <li key={menu.id} className="my-2 border-t border-neutral-200 dark:border-neutral-700" />
                                );
                            }

                            const active = isRouteActive(menu.activeRoutes);

                            return (
                                <li key={menu.id}>
                                    <Link
                                        href={menu.route}
                                        className={`relative flex items-center px-2 py-2 rounded-md text-sm transition-colors duration-200 ${
                                            active
                                                ? "bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-200 font-medium"
                                                : "hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                                        }`}
                                        title={!sidebarExpanded ? menu.label : ""}
                                    >
                                        <span className="flex-shrink-0">{menu.icon}</span>
                                        <span
                                            className={`ml-3 flex-1 truncate transition-all duration-300 ${
                                                sidebarExpanded
                                                    ? "opacity-100"
                                                    : "opacity-0 w-0 overflow-hidden"
                                            }`}
                                        >
                                            {menu.label}
                                        </span>
                                        {menu.badge > 0 && (
                                            <span
                                                className={`${
                                                    sidebarExpanded
                                                        ? "ml-2"
                                                        : "absolute top-0.5 right-0.5"
                                                } min-w-[1.25rem] h-5 px-1.5 rounded-full bg-error-500 text-white text-[11px] font-semibold flex items-center justify-center`}
                                            >
                                                {menu.badge > 99 ? "99+" : menu.badge}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </>
    );
}
