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
    FiFileText,
    FiChevronUp,
    FiChevronDown,
    FiDownload,
    FiMoreVertical,
    FiCalendar,
    FiEye as FiViews,
} from "react-icons/fi";
import { createPortal } from "react-dom";

// Komponen Dropdown dengan Portal
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
const RowActionsDropdown = ({
    artikel,
    onView,
    onEdit,
    onDelete,
    hasEditPermission,
    hasDeletePermission,
}) => {
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
                    Lihat Detail
                </button>
                {hasEditPermission && (
                    <button
                        onClick={onEdit}
                        className="group flex items-center w-full px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-neutral-700 hover:text-primary-600 dark:hover:text-primary-400"
                    >
                        <FiEdit className="mr-3 h-4 w-4" aria-hidden="true" />
                        Edit
                    </button>
                )}
                {hasDeletePermission && (
                    <button
                        onClick={onDelete}
                        className="group flex items-center w-full px-4 py-2 text-sm text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/30 hover:text-error-700 dark:hover:text-error-300"
                    >
                        <FiTrash2 className="mr-3 h-4 w-4" aria-hidden="true" />
                        Hapus
                    </button>
                )}
            </div>
        </PortalDropdown>
    );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
    const statusConfig = {
        draf: {
            label: "Draf",
            className:
                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
        },
        terbit: {
            label: "Terbit",
            className:
                "bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300",
        },
        arsip: {
            label: "Arsip",
            className:
                "bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300",
        },
    };

    const config = statusConfig[status] || statusConfig.draf;

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
        >
            {config.label}
        </span>
    );
};

// Custom hook untuk menyimpan selected items
const usePersistedSelectedArtikel = (initialValue = []) => {
    const [selectedArtikel, setSelectedArtikel] = useState(() => {
        try {
            const stored = sessionStorage.getItem("selectedArtikel");
            return stored ? JSON.parse(stored) : initialValue;
        } catch {
            return initialValue;
        }
    });

    useEffect(() => {
        sessionStorage.setItem(
            "selectedArtikel",
            JSON.stringify(selectedArtikel)
        );
    }, [selectedArtikel]);

    const clearSelectedArtikel = useCallback(() => {
        sessionStorage.removeItem("selectedArtikel");
        setSelectedArtikel([]);
    }, []);

    return [selectedArtikel, setSelectedArtikel, clearSelectedArtikel];
};

export default function ArtikelIndex({
    artikel,
    filters: initialFilters,
    semuaKategori,
    statusOptions,
}) {
    const { props } = usePage();
    const { auth } = props;
    const flash = props.flash || {};
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        artikelId: null,
        artikelJudul: "",
    });
    const [bulkDeleteModal, setBulkDeleteModal] = useState({
        isOpen: false,
        count: 0,
    });

    const [selectedArtikel, setSelectedArtikel, clearSelectedArtikel] =
        usePersistedSelectedArtikel([]);
    const [selectAll, setSelectAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState(initialFilters?.search || "");
    const [statusFilter, setStatusFilter] = useState(
        initialFilters?.status || ""
    );
    const [kategoriFilter, setKategoriFilter] = useState(
        initialFilters?.kategori || ""
    );
    const [perPage, setPerPage] = useState(initialFilters?.per_page || 10);
    const [sortConfig, setSortConfig] = useState({
        key: initialFilters?.sort || "created_at",
        direction: initialFilters?.direction || "desc",
    });
    const { success, error } = useToast();

    // Helper function to check permissions
    const hasPermission = (permission) => {
        return (
            auth.user &&
            auth.user.permissions &&
            auth.user.permissions.includes(permission)
        );
    };

    const prevFiltersRef = useRef({
        search: initialFilters?.search || "",
        status: initialFilters?.status || "",
        kategori: initialFilters?.kategori || "",
        per_page: initialFilters?.per_page || 10,
        sort: initialFilters?.sort || "created_at",
        direction: initialFilters?.direction || "desc",
    });

    useEffect(() => {
        const currentFilters = {
            search: searchTerm,
            status: statusFilter,
            kategori: kategoriFilter,
            per_page: perPage,
            sort: sortConfig.key,
            direction: sortConfig.direction,
        };

        const hasChanged =
            currentFilters.search !== prevFiltersRef.current.search ||
            currentFilters.status !== prevFiltersRef.current.status ||
            currentFilters.kategori !== prevFiltersRef.current.kategori ||
            currentFilters.per_page !== prevFiltersRef.current.per_page ||
            currentFilters.sort !== prevFiltersRef.current.sort ||
            currentFilters.direction !== prevFiltersRef.current.direction;

        if (hasChanged) {
            const timer = setTimeout(() => {
                router.get(
                    route("admin.artikel.index"),
                    {
                        search: searchTerm,
                        status: statusFilter,
                        kategori: kategoriFilter,
                        sort: sortConfig.key,
                        direction: sortConfig.direction,
                        per_page: perPage,
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
    }, [searchTerm, statusFilter, kategoriFilter, perPage, sortConfig]);

    useEffect(() => {
        if (artikel && artikel.data && selectedArtikel.length > 0) {
            const currentPageIds = artikel.data.map((artikel) => artikel.id);
            const allCurrentSelected = currentPageIds.every((id) =>
                selectedArtikel.includes(id)
            );
            const someCurrentSelected = currentPageIds.some((id) =>
                selectedArtikel.includes(id)
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
    }, [artikel, selectedArtikel]);

    const handleRowClick = useCallback((artikel) => {
        router.visit(route("admin.artikel.show", artikel.id));
    }, []);

    const handleSelectAll = useCallback(() => {
        if (artikel && artikel.data) {
            const currentPageIds = artikel.data.map((artikel) => artikel.id);

            if (!selectAll) {
                setSelectedArtikel((prev) => {
                    const newSelected = [
                        ...new Set([...prev, ...currentPageIds]),
                    ];
                    return newSelected;
                });
            } else {
                setSelectedArtikel((prev) =>
                    prev.filter((id) => !currentPageIds.includes(id))
                );
            }
        }
    }, [selectAll, artikel, setSelectedArtikel]);

    const handleArtikelSelection = useCallback(
        (artikelId) => {
            setSelectedArtikel((prev) => {
                if (prev.includes(artikelId)) {
                    return prev.filter((id) => id !== artikelId);
                } else {
                    return [...prev, artikelId];
                }
            });
        },
        [setSelectedArtikel]
    );

    const openDeleteModal = useCallback((artikelId, artikelJudul) => {
        setDeleteModal({
            isOpen: true,
            artikelId,
            artikelJudul,
        });
    }, []);

    const openBulkDeleteModal = useCallback(() => {
        setBulkDeleteModal({
            isOpen: true,
            count: selectedArtikel.length,
        });
    }, [selectedArtikel.length]);

    const closeDeleteModal = useCallback(() => {
        setDeleteModal({
            isOpen: false,
            artikelId: null,
            artikelJudul: "",
        });
    }, []);

    const closeBulkDeleteModal = useCallback(() => {
        setBulkDeleteModal({
            isOpen: false,
            count: 0,
        });
    }, []);

    const handleDelete = useCallback(() => {
        if (deleteModal.artikelId) {
            router.delete(
                route("admin.artikel.destroy", deleteModal.artikelId),
                {
                    onSuccess: () => {
                        success("Artikel berhasil dihapus!");
                        closeDeleteModal();
                        setSelectedArtikel((prev) =>
                            prev.filter((id) => id !== deleteModal.artikelId)
                        );
                    },
                    onError: (errors) => {
                        const errorMessage =
                            errors?.message || "Gagal menghapus artikel.";
                        error(errorMessage);
                        closeDeleteModal();
                    },
                }
            );
        } else {
            closeDeleteModal();
        }
    }, [
        deleteModal.artikelId,
        deleteModal.artikelJudul,
        closeDeleteModal,
        success,
        error,
        setSelectedArtikel,
    ]);

    const handleBulkDelete = useCallback(() => {
        if (selectedArtikel.length > 0) {
            router.post(
                route("admin.artikel.bulk-destroy"),
                {
                    ids: selectedArtikel,
                },
                {
                    onSuccess: () => {
                        success(
                            `${selectedArtikel.length} artikel berhasil dihapus!`
                        );
                        clearSelectedArtikel();
                        setSelectAll(false);
                        closeBulkDeleteModal();
                    },
                    onError: (errors) => {
                        const errorMessage =
                            errors?.message ||
                            "Gagal menghapus artikel yang dipilih.";
                        error(errorMessage);
                        closeBulkDeleteModal();
                    },
                }
            );
        }
    }, [
        selectedArtikel,
        closeBulkDeleteModal,
        success,
        error,
        clearSelectedArtikel,
    ]);

    const handleExport = useCallback(() => {
        if (selectedArtikel.length > 0) {
            router.post(
                route("admin.artikel.export"),
                {
                    ids: selectedArtikel,
                },
                {
                    onSuccess: () => {
                        success("Ekspor artikel berhasil dimulai!");
                    },
                    onError: () => {
                        error("Gagal mengekspor artikel.");
                    },
                }
            );
        }
    }, [selectedArtikel, success, error]);

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
        setStatusFilter("");
        setKategoriFilter("");
        setPerPage(10);
        setSortConfig({ key: "created_at", direction: "desc" });
        router.get(
            route("admin.artikel.index"),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    prevFiltersRef.current = {
                        search: "",
                        status: "",
                        kategori: "",
                        per_page: 10,
                        sort: "created_at",
                        direction: "desc",
                    };
                },
            }
        );
    }, []);

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

    const columns = useMemo(
        () => [
            {
                key: "judul",
                label: "Judul Artikel",
                sortable: true,
                onSort: () => handleSort("judul"),
                sortIcon: getSortIcon("judul"),
                render: (artikel) => (
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                <FiFileText className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                            </div>
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-neutral-900 dark:text-white line-clamp-1">
                                {artikel.judul}
                            </div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                {artikel.slug}
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                key: "kategori",
                label: "Kategori",
                render: (artikel) => (
                    <div className="text-sm text-neutral-900 dark:text-white">
                        {artikel.kategori && artikel.kategori.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                                {artikel.kategori.slice(0, 2).map((kat) => (
                                    <span
                                        key={kat.id}
                                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300"
                                    >
                                        {kat.nama}
                                    </span>
                                ))}
                                {artikel.kategori.length > 2 && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300">
                                        +{artikel.kategori.length - 2}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <span className="text-xs text-neutral-400 dark:text-neutral-500">
                                Tidak ada kategori
                            </span>
                        )}
                    </div>
                ),
            },
            {
                key: "status",
                label: "Status",
                sortable: true,
                onSort: () => handleSort("status"),
                sortIcon: getSortIcon("status"),
                render: (artikel) => <StatusBadge status={artikel.status} />,
            },
            {
                key: "views",
                label: "Dilihat",
                sortable: true,
                onSort: () => handleSort("jumlah_dilihat"),
                sortIcon: getSortIcon("jumlah_dilihat"),
                render: (artikel) => (
                    <div className="flex items-center text-sm text-neutral-900 dark:text-white">
                        <FiViews className="mr-1 h-4 w-4 text-neutral-400" />
                        {artikel.jumlah_dilihat.toLocaleString()}
                    </div>
                ),
            },
            {
                key: "published",
                label: "Diterbitkan",
                sortable: true,
                onSort: () => handleSort("diterbitkan_pada"),
                sortIcon: getSortIcon("diterbitkan_pada"),
                render: (artikel) => (
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        {artikel.diterbitkan_pada ? (
                            new Date(
                                artikel.diterbitkan_pada
                            ).toLocaleDateString("id-ID", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })
                        ) : (
                            <span className="text-xs text-neutral-400">
                                Belum diterbitkan
                            </span>
                        )}
                    </div>
                ),
            },
            {
                key: "created_at",
                label: "Dibuat",
                sortable: true,
                onSort: () => handleSort("created_at"),
                sortIcon: getSortIcon("created_at"),
                render: (artikel) => (
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        {new Date(artikel.created_at).toLocaleDateString(
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
        [handleSort, getSortIcon]
    );

    const emptyState = useMemo(
        () => (
            <div className="flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-500">
                <FiFileText className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-lg font-medium">Belum ada artikel</p>
                <p className="mt-1 text-sm">
                    Mulai dengan membuat artikel baru
                </p>
                {hasPermission("create artikel") && (
                    <div className="mt-6">
                        <Link href={route("admin.artikel.create")}>
                            <PrimaryButton className="flex items-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-500">
                                <FiPlus className="mr-2 h-5 w-5" />
                                Tambah Artikel Baru
                            </PrimaryButton>
                        </Link>
                    </div>
                )}
            </div>
        ),
        []
    );

    const rowActions = useCallback(
        (artikel) => (
            <RowActionsDropdown
                artikel={artikel}
                onView={() =>
                    router.visit(route("admin.artikel.show", artikel.id))
                }
                onEdit={() =>
                    router.visit(route("admin.artikel.edit", artikel.id))
                }
                onDelete={() => openDeleteModal(artikel.id, artikel.judul)}
                hasEditPermission={hasPermission("edit artikel")}
                hasDeletePermission={hasPermission("delete artikel")}
            />
        ),
        [openDeleteModal]
    );

    const createButton = useMemo(
        () =>
            hasPermission("create artikel") ? (
                <Link href={route("admin.artikel.create")}>
                    <PrimaryButton className="flex items-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-500">
                        <FiFileText className="mr-2 h-5 w-5" />
                        Tambah Artikel
                    </PrimaryButton>
                </Link>
            ) : null,
        []
    );

    return (
        <AdminLayout title="Kelola Artikel">
            <Head title="Kelola Artikel" />

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                title="Konfirmasi Hapus"
                message={`Apakah Anda yakin ingin menghapus artikel "${deleteModal.artikelJudul}"? Aksi ini tidak dapat dibatalkan.`}
                confirmText="Hapus Artikel"
                cancelText="Batal"
            />

            {hasPermission("delete artikel") && (
                <ConfirmationModal
                    isOpen={bulkDeleteModal.isOpen}
                    onClose={closeBulkDeleteModal}
                    onConfirm={handleBulkDelete}
                    title="Konfirmasi Hapus Massal"
                    message={`Apakah Anda yakin ingin menghapus ${bulkDeleteModal.count} artikel yang dipilih? Aksi ini tidak dapat dibatalkan.`}
                    confirmText={`Hapus ${bulkDeleteModal.count} Artikel`}
                    cancelText="Batal"
                />
            )}

            <CrudLayout
                title="Manajemen Artikel"
                description="Kelola semua artikel pada website"
                createButton={createButton}
                filters={
                    <div className="mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search Input */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    Cari Artikel
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        placeholder="Cari judul atau konten..."
                                        className="w-full px-4 py-2 pl-10 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 text-neutral-900 dark:text-white"
                                    />
                                    <FiSearch className="absolute left-3 top-2.5 h-5 w-5 text-neutral-400" />
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    Status
                                </label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 text-neutral-900 dark:text-white"
                                >
                                    <option value="">Semua Status</option>
                                    {statusOptions?.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Kategori Filter */}
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    Kategori
                                </label>
                                <select
                                    value={kategoriFilter}
                                    onChange={(e) =>
                                        setKategoriFilter(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 text-neutral-900 dark:text-white"
                                >
                                    <option value="">Semua Kategori</option>
                                    {semuaKategori?.map((kategori) => (
                                        <option
                                            key={kategori.id}
                                            value={kategori.id}
                                        >
                                            {kategori.nama}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <select
                                    value={perPage}
                                    onChange={(e) =>
                                        handlePerPageChange(e.target.value)
                                    }
                                    className="px-3 py-1.5 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 rounded-lg text-sm text-neutral-900 dark:text-white"
                                >
                                    <option value="5">5 per halaman</option>
                                    <option value="10">10 per halaman</option>
                                    <option value="15">15 per halaman</option>
                                    <option value="20">20 per halaman</option>
                                    <option value="50">50 per halaman</option>
                                </select>
                            </div>

                            {(searchTerm || statusFilter || kategoriFilter) && (
                                <button
                                    onClick={clearFilters}
                                    className="inline-flex items-center px-3 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                                >
                                    <FiX className="mr-1 h-4 w-4" />
                                    Hapus Filter
                                </button>
                            )}
                        </div>
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

                {hasPermission("delete artikel") &&
                    selectedArtikel.length > 0 && (
                        <div className="mb-6">
                            <BulkActions
                                selectedCount={selectedArtikel.length}
                                onBulkDelete={openBulkDeleteModal}
                                onBulkExport={handleExport}
                                onClearSelected={clearSelectedArtikel}
                            />
                        </div>
                    )}

                <div className="mb-6">
                    <DataTable
                        columns={columns}
                        data={artikel?.data || []}
                        selectedItems={selectedArtikel}
                        onSelectItem={handleArtikelSelection}
                        onSelectAll={handleSelectAll}
                        selectAll={selectAll}
                        emptyState={emptyState}
                        rowActions={rowActions}
                        keyField="id"
                        onRowClick={handleRowClick}
                    />
                </div>

                {artikel &&
                    artikel.data &&
                    artikel.data.length > 0 &&
                    artikel.links &&
                    artikel.links.length > 3 && <Pagination data={artikel} />}
            </CrudLayout>
        </AdminLayout>
    );
}
