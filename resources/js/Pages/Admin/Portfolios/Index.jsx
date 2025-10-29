import React, {
    useState,
    useEffect,
    useCallback,
    useMemo,
    useRef,
} from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import CrudLayout from "@/Components/CrudLayout";
import DataTable from "@/Components/DataTable";
import FilterSection from "@/Components/FilterSection";
import BulkActions from "@/Components/BulkActions";
import Pagination from "@/Components/Pagination";
import ConfirmationModal from "@/Components/ConfirmationModal";
import PrimaryButton from "@/Components/PrimaryButton";
import { useToast } from "@/Contexts/ToastContext";
import {
    FiEye,
    FiEdit,
    FiTrash2,
    FiSearch,
    FiPlus,
    FiX,
    FiFolderPlus,
    FiChevronUp,
    FiChevronDown,
    FiDownload,
    FiMoreVertical,
    FiImage,
    FiCode,
    FiList,
    FiGrid,
} from "react-icons/fi";
import { createPortal } from "react-dom";

// Komponen Dropdown dengan Portal untuk merender di luar hierarchy tabel
const PortalDropdown = ({ trigger, children, position = "bottom-right" }) => {
    const [positionData, setPositionData] = useState({
        top: 0,
        left: 0,
        width: 0,
    });
    const triggerRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    const updatePosition = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setPositionData({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width,
            });
        }
    };

    const getPositionClass = () => {
        switch (position) {
            case "bottom-left":
                return "origin-top-left left-0";
            case "bottom-right":
                return "origin-top-right right-0";
            default:
                return "origin-top-right right-0";
        }
    };

    return (
        <>
            <div
                ref={triggerRef}
                onClick={() => {
                    updatePosition();
                    setIsOpen(true);
                }}
            >
                {trigger}
            </div>

            {isOpen &&
                createPortal(
                    <div
                        className="fixed inset-0 z-50"
                        onClick={() => setIsOpen(false)}
                    >
                        <div
                            className={`absolute mt-1 w-48 rounded-md shadow-lg bg-neutral-50 dark:bg-neutral-800 ring-1 ring-primary-500 ring-opacity-20 focus:outline-none ${getPositionClass()}`}
                            style={{
                                top: positionData.top,
                                left:
                                    position === "bottom-right"
                                        ? "auto"
                                        : positionData.left,
                                right:
                                    position === "bottom-right"
                                        ? window.innerWidth -
                                          positionData.left -
                                          positionData.width
                                        : "auto",
                                zIndex: 9999,
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {children}
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
};

// Komponen Dropdown Actions untuk setiap baris
const RowActionsDropdown = ({ portfolio, onView, onEdit, onDelete }) => {
    const trigger = (
        <button className="inline-flex justify-center w-full p-2 text-sm font-medium text-primary-600 dark:text-primary-400 bg-neutral-50 dark:bg-neutral-800 rounded-md hover:bg-primary-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
            <FiMoreVertical className="h-4 w-4" aria-hidden="true" />
        </button>
    );

    return (
        <PortalDropdown trigger={trigger} position="bottom-right">
            <div className="py-1">
                <button
                    onClick={onView}
                    className="group flex items-center w-full px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-neutral-700 hover:text-primary-600 dark:hover:text-primary-400"
                >
                    <FiEye className="mr-3 h-4 w-4" aria-hidden="true" />
                    View Details
                </button>
                <button
                    onClick={onEdit}
                    className="group flex items-center w-full px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-neutral-700 hover:text-primary-600 dark:hover:text-primary-400"
                >
                    <FiEdit className="mr-3 h-4 w-4" aria-hidden="true" />
                    Edit
                </button>
                <button
                    onClick={onDelete}
                    className="group flex items-center w-full px-4 py-2 text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/30 hover:text-error-700 dark:hover:text-error-300"
                >
                    <FiTrash2 className="mr-3 h-4 w-4" aria-hidden="true" />
                    Delete
                </button>
            </div>
        </PortalDropdown>
    );
};

// Komponen Tab Navigation
const TabNavigation = ({ activeTab, onTabChange, stats }) => {
    const tabs = [
        {
            id: "portfolios",
            name: "Portfolios",
            icon: FiGrid,
            count: stats?.total_portfolios || 0,
        },
        {
            id: "technologies",
            name: "Technologies",
            icon: FiCode,
            count: stats?.total_technologies || 0,
        },
        {
            id: "features",
            name: "Features",
            icon: FiList,
            count: stats?.total_features || 0,
        },
        {
            id: "images",
            name: "Images",
            icon: FiImage,
            count: stats?.total_images || 0,
        },
    ];

    return (
        <div className="border-b border-neutral-200 dark:border-neutral-700 mb-6">
            <nav className="-mb-px flex space-x-8">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`
                                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center
                                ${
                                    activeTab === tab.id
                                        ? "border-primary-500 text-primary-600 dark:text-primary-400"
                                        : "border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-600"
                                }
                            `}
                        >
                            <Icon className="mr-2 h-4 w-4" />
                            {tab.name}
                            {tab.count > 0 && (
                                <span
                                    className={`
                                        ml-2 py-0.5 px-2 text-xs rounded-full
                                        ${
                                            activeTab === tab.id
                                                ? "bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200"
                                                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200"
                                        }
                                    `}
                                >
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

// Custom hook untuk menyimpan selected items di sessionStorage
const usePersistedSelectedItems = (initialValue = []) => {
    const [selectedItems, setSelectedItems] = useState(() => {
        try {
            const stored = sessionStorage.getItem("selectedPortfolios");
            return stored ? JSON.parse(stored) : initialValue;
        } catch {
            return initialValue;
        }
    });

    useEffect(() => {
        sessionStorage.setItem(
            "selectedPortfolios",
            JSON.stringify(selectedItems)
        );
    }, [selectedItems]);

    const clearSelectedItems = useCallback(() => {
        sessionStorage.removeItem("selectedPortfolios");
        setSelectedItems([]);
    }, []);

    return [selectedItems, setSelectedItems, clearSelectedItems];
};

// Helper function untuk mendapatkan URL gambar yang benar
const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // Jika imagePath sudah berupa URL lengkap, return langsung
    if (imagePath.startsWith("http")) {
        return imagePath;
    }

    // Jika imagePath adalah path di storage public
    if (imagePath.startsWith("portfolio/")) {
        return `/storage/${imagePath}`;
    }

    // Default case - anggap sudah berupa path yang benar
    return imagePath;
};

export default function PortfoliosIndex({
    portfolios,
    technologies,
    features,
    images,
    stats,
    categories,
    filters: initialFilters,
}) {
    const { props } = usePage();
    const flash = props.flash || {};
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        portfolioId: null,
        portfolioTitle: "",
    });
    const [bulkDeleteModal, setBulkDeleteModal] = useState({
        isOpen: false,
        count: 0,
    });
    const [activeTab, setActiveTab] = useState(
        initialFilters?.tab || "portfolios"
    );

    const [selectedItems, setSelectedItems, clearSelectedItems] =
        usePersistedSelectedItems([]);
    const [selectAll, setSelectAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState(initialFilters?.search || "");
    const [perPage, setPerPage] = useState(initialFilters?.per_page || 10);
    const [sortConfig, setSortConfig] = useState({
        key: initialFilters?.sort || "created_at",
        direction: initialFilters?.direction || "desc",
    });
    const { success, error } = useToast();

    const prevFiltersRef = useRef({
        search: initialFilters?.search || "",
        per_page: initialFilters?.per_page || 10,
        sort: initialFilters?.sort || "created_at",
        direction: initialFilters?.direction || "desc",
        tab: initialFilters?.tab || "portfolios",
    });

    // Get current data based on active tab
    const currentData = useMemo(() => {
        switch (activeTab) {
            case "technologies":
                return technologies;
            case "features":
                return features;
            case "images":
                return images;
            default:
                return portfolios;
        }
    }, [activeTab, portfolios, technologies, features, images]);

    useEffect(() => {
        const currentFilters = {
            search: searchTerm,
            per_page: perPage,
            sort: sortConfig.key,
            direction: sortConfig.direction,
            tab: activeTab,
        };

        const hasChanged =
            currentFilters.search !== prevFiltersRef.current.search ||
            currentFilters.per_page !== prevFiltersRef.current.per_page ||
            currentFilters.sort !== prevFiltersRef.current.sort ||
            currentFilters.direction !== prevFiltersRef.current.direction ||
            currentFilters.tab !== prevFiltersRef.current.tab;

        if (hasChanged) {
            const timer = setTimeout(() => {
                router.get(
                    route("admin.portfolios.index"),
                    {
                        search: searchTerm,
                        sort: sortConfig.key,
                        direction: sortConfig.direction,
                        per_page: perPage,
                        tab: activeTab,
                    },
                    {
                        preserveState: true,
                        replace: true,
                        preserveScroll: true,
                        onFinish: () => {
                            prevFiltersRef.current = currentFilters;
                        },
                    }
                );
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [searchTerm, perPage, sortConfig, activeTab]);

    useEffect(() => {
        if (currentData && currentData.data && selectedItems.length > 0) {
            const currentPageIds = currentData.data.map((item) => item.id);
            const allCurrentSelected = currentPageIds.every((id) =>
                selectedItems.includes(id)
            );
            const someCurrentSelected = currentPageIds.some((id) =>
                selectedItems.includes(id)
            );

            if (allCurrentSelected) {
                setSelectAll(true);
            } else if (someCurrentSelected) {
                setSelectAll(false);
            } else {
                setSelectAll(false);
            }
        } else {
            setSelectAll(false);
        }
    }, [currentData, selectedItems]);

    const handleRowClick = useCallback(
        (item) => {
            if (activeTab === "portfolios") {
                router.visit(route("admin.portfolios.show", item.id));
            }
        },
        [activeTab]
    );

    const handleSelectAll = useCallback(() => {
        if (currentData && currentData.data) {
            const currentPageIds = currentData.data.map((item) => item.id);

            if (!selectAll) {
                setSelectedItems((prev) => {
                    const newSelected = [
                        ...new Set([...prev, ...currentPageIds]),
                    ];
                    return newSelected;
                });
            } else {
                setSelectedItems((prev) =>
                    prev.filter((id) => !currentPageIds.includes(id))
                );
            }
        }
    }, [selectAll, currentData, setSelectedItems]);

    const handleItemSelection = useCallback(
        (itemId) => {
            setSelectedItems((prev) => {
                if (prev.includes(itemId)) {
                    return prev.filter((id) => id !== itemId);
                } else {
                    return [...prev, itemId];
                }
            });
        },
        [setSelectedItems]
    );

    const openDeleteModal = useCallback((portfolioId, portfolioTitle) => {
        setDeleteModal({
            isOpen: true,
            portfolioId,
            portfolioTitle,
        });
    }, []);

    const openBulkDeleteModal = useCallback(() => {
        setBulkDeleteModal({
            isOpen: true,
            count: selectedItems.length,
        });
    }, [selectedItems.length]);

    const closeDeleteModal = useCallback(() => {
        setDeleteModal({
            isOpen: false,
            portfolioId: null,
            portfolioTitle: "",
        });
    }, []);

    const closeBulkDeleteModal = useCallback(() => {
        setBulkDeleteModal({
            isOpen: false,
            count: 0,
        });
    }, []);

    const handleDelete = useCallback(() => {
        if (deleteModal.portfolioId) {
            router.delete(
                route("admin.portfolios.destroy", deleteModal.portfolioId),
                {
                    onSuccess: () => {
                        success("Portfolio deleted successfully!");
                        closeDeleteModal();
                        setSelectedItems((prev) =>
                            prev.filter((id) => id !== deleteModal.portfolioId)
                        );
                    },
                    onError: () => {
                        error("Failed to delete portfolio.");
                        closeDeleteModal();
                    },
                }
            );
        } else {
            closeDeleteModal();
        }
    }, [
        deleteModal.portfolioId,
        closeDeleteModal,
        success,
        error,
        setSelectedItems,
    ]);

    const handleBulkDelete = useCallback(() => {
        if (selectedItems.length > 0) {
            router.post(
                route("admin.portfolios.bulk-destroy"),
                {
                    ids: selectedItems,
                },
                {
                    onSuccess: () => {
                        success(
                            `${selectedItems.length} portfolio(s) deleted successfully!`
                        );
                        clearSelectedItems();
                        setSelectAll(false);
                        closeBulkDeleteModal();
                    },
                    onError: () => {
                        error("Failed to delete selected portfolios.");
                        closeBulkDeleteModal();
                    },
                }
            );
        }
    }, [
        selectedItems,
        closeBulkDeleteModal,
        success,
        error,
        clearSelectedItems,
    ]);

    const handleSort = useCallback((key) => {
        setSortConfig((prev) => {
            let direction = "asc";
            if (prev.key === key && prev.direction === "asc") {
                direction = "desc";
            }
            return { key, direction };
        });
    }, []);

    const clearFilters = useCallback(() => {
        setSearchTerm("");
        setPerPage(10);
        setSortConfig({ key: "created_at", direction: "desc" });
        router.get(
            route("admin.portfolios.index"),
            { tab: activeTab },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    prevFiltersRef.current = {
                        search: "",
                        per_page: 10,
                        sort: "created_at",
                        direction: "desc",
                        tab: activeTab,
                    };
                },
            }
        );
    }, [activeTab]);

    const handlePerPageChange = useCallback((newPerPage) => {
        setPerPage(newPerPage);
    }, []);

    const getSortIcon = useCallback(
        (key) => {
            if (sortConfig.key !== key) {
                return <FiChevronUp className="ml-1 h-4 w-4 opacity-50" />;
            }
            return sortConfig.direction === "asc" ? (
                <FiChevronUp className="ml-1 h-4 w-4" />
            ) : (
                <FiChevronDown className="ml-1 h-4 w-4" />
            );
        },
        [sortConfig]
    );

    // Columns configuration for different tabs
    const getColumns = useCallback(() => {
        const baseColumns = {
            portfolios: [
                {
                    key: "title",
                    label: "Project Title",
                    sortable: true,
                    onSort: () => handleSort("title"),
                    sortIcon: getSortIcon("title"),
                    render: (portfolio) => (
                        <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                                {portfolio.featured_image ? (
                                    <img
                                        className="h-10 w-10 rounded-lg object-cover"
                                        src={getImageUrl(
                                            portfolio.featured_image
                                        )}
                                        alt={portfolio.title}
                                        onError={(e) => {
                                            // Fallback jika gambar gagal load
                                            e.target.style.display = "none";
                                            e.target.nextSibling.style.display =
                                                "flex";
                                        }}
                                    />
                                ) : null}
                                <div
                                    className={`h-10 w-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center ${
                                        portfolio.featured_image
                                            ? "hidden"
                                            : "flex"
                                    }`}
                                >
                                    <FiGrid className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                                </div>
                            </div>
                            <div className="ml-4">
                                <div className="text-sm font-medium text-neutral-900 dark:text-white">
                                    {portfolio.title}
                                </div>
                                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                    {portfolio.category}
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    key: "status",
                    label: "Status",
                    render: (portfolio) => (
                        <span
                            className={`
                                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${
                                    portfolio.status === "published"
                                        ? "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300"
                                        : portfolio.status === "draft"
                                        ? "bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300"
                                        : "bg-error-100 text-error-800 dark:bg-error-900/30 dark:text-error-300"
                                }
                            `}
                        >
                            {portfolio.status.charAt(0).toUpperCase() +
                                portfolio.status.slice(1)}
                        </span>
                    ),
                },
                {
                    key: "technologies",
                    label: "Technologies",
                    render: (portfolio) => (
                        <div className="flex flex-wrap gap-1">
                            {portfolio.technologies
                                ?.slice(0, 3)
                                .map((tech, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                                    >
                                        {tech.technology}
                                    </span>
                                ))}
                            {portfolio.technologies?.length > 3 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                                    +{portfolio.technologies.length - 3}
                                </span>
                            )}
                        </div>
                    ),
                },
                {
                    key: "highlight",
                    label: "Featured",
                    render: (portfolio) => (
                        <span
                            className={`
                                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${
                                    portfolio.highlight
                                        ? "bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300"
                                        : "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
                                }
                            `}
                        >
                            {portfolio.highlight ? "Featured" : "Regular"}
                        </span>
                    ),
                },
                {
                    key: "created_at",
                    label: "Created Date",
                    sortable: true,
                    onSort: () => handleSort("created_at"),
                    sortIcon: getSortIcon("created_at"),
                    render: (portfolio) => (
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">
                            {new Date(portfolio.created_at).toLocaleDateString(
                                "id-ID",
                                {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                }
                            )}
                        </div>
                    ),
                },
            ],
            technologies: [
                {
                    key: "technology",
                    label: "Technology",
                    sortable: true,
                    onSort: () => handleSort("technology"),
                    sortIcon: getSortIcon("technology"),
                    render: (tech) => (
                        <div className="text-sm font-medium text-neutral-900 dark:text-white">
                            {tech.technology}
                        </div>
                    ),
                },
                {
                    key: "portfolio",
                    label: "Project",
                    render: (tech) => (
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                            {tech.portfolio?.title || "N/A"}
                        </div>
                    ),
                },
                {
                    key: "created_at",
                    label: "Added Date",
                    render: (tech) => (
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">
                            {new Date(tech.created_at).toLocaleDateString(
                                "id-ID",
                                {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                }
                            )}
                        </div>
                    ),
                },
            ],
            features: [
                {
                    key: "feature",
                    label: "Feature",
                    sortable: true,
                    onSort: () => handleSort("feature"),
                    sortIcon: getSortIcon("feature"),
                    render: (feature) => (
                        <div className="text-sm font-medium text-neutral-900 dark:text-white">
                            {feature.feature}
                        </div>
                    ),
                },
                {
                    key: "portfolio",
                    label: "Project",
                    render: (feature) => (
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                            {feature.portfolio?.title || "N/A"}
                        </div>
                    ),
                },
                {
                    key: "description",
                    label: "Description",
                    render: (feature) => (
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">
                            {feature.description || "No description"}
                        </div>
                    ),
                },
            ],
            images: [
                {
                    key: "image",
                    label: "Image",
                    render: (image) => (
                        <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                                <img
                                    className="h-12 w-12 rounded-lg object-cover"
                                    src={getImageUrl(image.image_path)}
                                    alt={image.caption || "Portfolio image"}
                                    onError={(e) => {
                                        // Fallback jika gambar gagal load
                                        e.target.style.display = "none";
                                        e.target.nextSibling.style.display =
                                            "flex";
                                    }}
                                />
                                <div
                                    className={`h-12 w-12 rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center ${
                                        image.image_path ? "hidden" : "flex"
                                    }`}
                                >
                                    <FiImage className="h-6 w-6 text-neutral-400" />
                                </div>
                            </div>
                            <div className="ml-4">
                                <div className="text-sm font-medium text-neutral-900 dark:text-white">
                                    {image.caption || "No caption"}
                                </div>
                                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                    {image.is_primary
                                        ? "Primary Image"
                                        : "Additional Image"}
                                </div>
                            </div>
                        </div>
                    ),
                },
                {
                    key: "portfolio",
                    label: "Project",
                    render: (image) => (
                        <div className="text-sm text-neutral-600 dark:text-neutral-400">
                            {image.portfolio?.title || "N/A"}
                        </div>
                    ),
                },
                {
                    key: "uploaded_at",
                    label: "Uploaded",
                    render: (image) => (
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">
                            {new Date(image.created_at).toLocaleDateString(
                                "id-ID",
                                {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                }
                            )}
                        </div>
                    ),
                },
            ],
        };

        return baseColumns[activeTab] || baseColumns.portfolios;
    }, [activeTab, handleSort, getSortIcon]);

    const emptyState = useMemo(() => {
        const emptyMessages = {
            portfolios: {
                title: "No portfolios found",
                description:
                    "Get started by creating your first portfolio project",
                icon: FiFolderPlus,
            },
            technologies: {
                title: "No technologies found",
                description:
                    "Technologies will appear when you add them to portfolios",
                icon: FiCode,
            },
            features: {
                title: "No features found",
                description:
                    "Features will appear when you add them to portfolios",
                icon: FiList,
            },
            images: {
                title: "No images found",
                description:
                    "Images will appear when you upload them to portfolios",
                icon: FiImage,
            },
        };

        const currentEmpty =
            emptyMessages[activeTab] || emptyMessages.portfolios;
        const Icon = currentEmpty.icon;

        return (
            <div className="flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500">
                <Icon className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-lg font-medium">{currentEmpty.title}</p>
                <p className="mt-1 text-sm">{currentEmpty.description}</p>
                {activeTab === "portfolios" && (
                    <div className="mt-6">
                        <Link href={route("admin.portfolios.create")}>
                            <PrimaryButton className="flex items-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-500">
                                <FiPlus className="mr-2 h-5 w-5" />
                                Add New Portfolio
                            </PrimaryButton>
                        </Link>
                    </div>
                )}
            </div>
        );
    }, [activeTab]);

    const rowActions = useCallback(
        (item) => {
            if (activeTab !== "portfolios") return null;

            return (
                <RowActionsDropdown
                    portfolio={item}
                    onView={() =>
                        router.visit(route("admin.portfolios.show", item.id))
                    }
                    onEdit={() =>
                        router.visit(route("admin.portfolios.edit", item.id))
                    }
                    onDelete={() => openDeleteModal(item.id, item.title)}
                />
            );
        },
        [activeTab, openDeleteModal]
    );

    const createButton = useMemo(
        () =>
            activeTab === "portfolios" ? (
                <Link href={route("admin.portfolios.create")}>
                    <PrimaryButton className="flex items-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-500">
                        <FiFolderPlus className="mr-2 h-5 w-5" />
                        Add Portfolio
                    </PrimaryButton>
                </Link>
            ) : null,
        [activeTab]
    );

    return (
        <AdminLayout title="Manage Portfolios">
            <Head title="Manage Portfolios" />

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                title="Confirm Delete"
                message={`Are you sure you want to delete portfolio "${deleteModal.portfolioTitle}"? This action cannot be undone.`}
                confirmText="Delete Portfolio"
                cancelText="Cancel"
            />

            <ConfirmationModal
                isOpen={bulkDeleteModal.isOpen}
                onClose={closeBulkDeleteModal}
                onConfirm={handleBulkDelete}
                title="Confirm Bulk Delete"
                message={`Are you sure you want to delete ${bulkDeleteModal.count} selected portfolio(s)? This action cannot be undone.`}
                confirmText={`Delete ${bulkDeleteModal.count} Portfolios`}
                cancelText="Cancel"
            />

            <CrudLayout
                title="Portfolio Management"
                description="Manage your portfolio projects, technologies, features, and images"
                createButton={createButton}
                filters={
                    <div className="mb-6">
                        <TabNavigation
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                            stats={stats}
                        />
                        <FilterSection
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            perPage={perPage}
                            onPerPageChange={handlePerPageChange}
                            onClearFilters={clearFilters}
                        />
                    </div>
                }
            >
                {flash.success && (
                    <div className="mb-8 bg-success-50 dark:bg-success-900/30 border border-success-200 dark:border-success-800 rounded-md p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-success-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-success-800 dark:text-success-200">
                                    {flash.success}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {flash.error && (
                    <div className="mb-8 bg-error-50 dark:bg-error-900/30 border border-error-200 dark:border-error-800 rounded-md p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-error-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-error-800 dark:text-error-200">
                                    {flash.error}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {selectedItems.length > 0 && activeTab === "portfolios" && (
                    <div className="mb-6">
                        <BulkActions
                            selectedCount={selectedItems.length}
                            onBulkDelete={openBulkDeleteModal}
                            onClearSelected={clearSelectedItems}
                        />
                    </div>
                )}

                <div className="mb-6">
                    <DataTable
                        columns={getColumns()}
                        data={currentData?.data || []}
                        selectedItems={selectedItems}
                        onSelectItem={handleItemSelection}
                        onSelectAll={handleSelectAll}
                        selectAll={selectAll}
                        emptyState={emptyState}
                        rowActions={rowActions}
                        keyField="id"
                        onRowClick={handleRowClick}
                        selectable={activeTab === "portfolios"}
                    />
                </div>

                {currentData &&
                    currentData.data &&
                    currentData.data.length > 0 &&
                    currentData.links &&
                    currentData.links.length > 3 && (
                        <Pagination data={currentData} />
                    )}
            </CrudLayout>
        </AdminLayout>
    );
}
