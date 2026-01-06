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
    FiFolder,
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
    kategori,
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

// Custom hook untuk menyimpan selected items
const usePersistedSelectedKategori = (initialValue = []) => {
    const [selectedKategori, setSelectedKategori] = useState(() => {
        try {
            const stored = sessionStorage.getItem("selectedKategori");
            return stored ? JSON.parse(stored) : initialValue;
        } catch {
            return initialValue;
        }
    });

    useEffect(() => {
        sessionStorage.setItem(
            "selectedKategori",
            JSON.stringify(selectedKategori)
        );
    }, [selectedKategori]);

    const clearSelectedKategori = useCallback(() => {
        sessionStorage.removeItem("selectedKategori");
        setSelectedKategori([]);
    }, []);

    return [selectedKategori, setSelectedKategori, clearSelectedKategori];
};

export default function KategoriIndex({ kategories, filters: initialFilters }) {
    const { props } = usePage();
    const { auth } = props;
    const flash = props.flash || {};
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        kategoriId: null,
        kategoriNama: "",
    });
    const [bulkDeleteModal, setBulkDeleteModal] = useState({
        isOpen: false,
        count: 0,
    });

    const [selectedKategori, setSelectedKategori, clearSelectedKategori] =
        usePersistedSelectedKategori([]);
    const [selectAll, setSelectAll] = useState(false);
    const [searchTerm, setSearchTerm] = useState(initialFilters?.search || "");
    const [perPage, setPerPage] = useState(initialFilters?.per_page || 5);
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
        per_page: initialFilters?.per_page || 5,
        sort: initialFilters?.sort || "created_at",
        direction: initialFilters?.direction || "desc",
    });

    useEffect(() => {
        const currentFilters = {
            search: searchTerm,
            per_page: perPage,
            sort: sortConfig.key,
            direction: sortConfig.direction,
        };

        const hasChanged =
            currentFilters.search !== prevFiltersRef.current.search ||
            currentFilters.per_page !== prevFiltersRef.current.per_page ||
            currentFilters.sort !== prevFiltersRef.current.sort ||
            currentFilters.direction !== prevFiltersRef.current.direction;

        if (hasChanged) {
            const timer = setTimeout(() => {
                router.get(
                    route("admin.kategori.index"),
                    {
                        search: searchTerm,
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
    }, [searchTerm, perPage, sortConfig]);

    useEffect(() => {
        if (kategories && kategories.data && selectedKategori.length > 0) {
            const currentPageIds = kategories.data.map(
                (kategori) => kategori.id
            );
            const allCurrentSelected = currentPageIds.every((id) =>
                selectedKategori.includes(id)
            );
            const someCurrentSelected = currentPageIds.some((id) =>
                selectedKategori.includes(id)
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
    }, [kategories, selectedKategori]);

    const handleRowClick = useCallback((kategori) => {
        router.visit(route("admin.kategori.show", kategori.id));
    }, []);

    const handleSelectAll = useCallback(() => {
        if (kategories && kategories.data) {
            const currentPageIds = kategories.data.map(
                (kategori) => kategori.id
            );

            if (!selectAll) {
                setSelectedKategori((prev) => {
                    const newSelected = [
                        ...new Set([...prev, ...currentPageIds]),
                    ];
                    return newSelected;
                });
            } else {
                setSelectedKategori((prev) =>
                    prev.filter((id) => !currentPageIds.includes(id))
                );
            }
        }
    }, [selectAll, kategories, setSelectedKategori]);

    const handleKategoriSelection = useCallback(
        (kategoriId) => {
            setSelectedKategori((prev) => {
                if (prev.includes(kategoriId)) {
                    return prev.filter((id) => id !== kategoriId);
                } else {
                    return [...prev, kategoriId];
                }
            });
        },
        [setSelectedKategori]
    );

    const openDeleteModal = useCallback((kategoriId, kategoriNama) => {
        setDeleteModal({
            isOpen: true,
            kategoriId,
            kategoriNama,
        });
    }, []);

    const openBulkDeleteModal = useCallback(() => {
        setBulkDeleteModal({
            isOpen: true,
            count: selectedKategori.length,
        });
    }, [selectedKategori.length]);

    const closeDeleteModal = useCallback(() => {
        setDeleteModal({
            isOpen: false,
            kategoriId: null,
            kategoriNama: "",
        });
    }, []);

    const closeBulkDeleteModal = useCallback(() => {
        setBulkDeleteModal({
            isOpen: false,
            count: 0,
        });
    }, []);

    const handleDelete = useCallback(() => {
        if (deleteModal.kategoriId) {
            router.delete(
                route("admin.kategori.destroy", deleteModal.kategoriId),
                {
                    onSuccess: () => {
                        success("Kategori berhasil dihapus!");
                        closeDeleteModal();
                        setSelectedKategori((prev) =>
                            prev.filter((id) => id !== deleteModal.kategoriId)
                        );
                    },
                    onError: (errors) => {
                        const errorMessage =
                            errors?.message || "Gagal menghapus kategori.";
                        error(errorMessage);
                        closeDeleteModal();
                    },
                }
            );
        } else {
            closeDeleteModal();
        }
    }, [
        deleteModal.kategoriId,
        deleteModal.kategoriNama,
        closeDeleteModal,
        success,
        error,
        setSelectedKategori,
    ]);

    const handleBulkDelete = useCallback(() => {
        if (selectedKategori.length > 0) {
            router.post(
                route("admin.kategori.bulk-destroy"),
                {
                    ids: selectedKategori,
                },
                {
                    onSuccess: () => {
                        success(
                            `${selectedKategori.length} kategori berhasil dihapus!`
                        );
                        clearSelectedKategori();
                        setSelectAll(false);
                        closeBulkDeleteModal();
                    },
                    onError: (errors) => {
                        const errorMessage =
                            errors?.message ||
                            "Gagal menghapus kategori yang dipilih.";
                        error(errorMessage);
                        closeBulkDeleteModal();
                    },
                }
            );
        }
    }, [
        selectedKategori,
        closeBulkDeleteModal,
        success,
        error,
        clearSelectedKategori,
    ]);

    const handleExport = useCallback(() => {
        if (selectedKategori.length > 0) {
            router.post(
                route("admin.kategori.export"),
                {
                    ids: selectedKategori,
                },
                {
                    onSuccess: () => {
                        success("Ekspor kategori berhasil dimulai!");
                    },
                    onError: () => {
                        error("Gagal mengekspor kategori.");
                    },
                }
            );
        }
    }, [selectedKategori, success, error]);

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
        setPerPage(5);
        setSortConfig({ key: "created_at", direction: "desc" });
        router.get(
            route("admin.kategori.index"),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    prevFiltersRef.current = {
                        search: "",
                        per_page: 5,
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
                key: "nama",
                label: "Nama Kategori",
                sortable: true,
                onSort: () => handleSort("nama"),
                sortIcon: getSortIcon("nama"),
                render: (kategori) => (
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                <FiFolder className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                            </div>
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-neutral-900 dark:text-white">
                                {kategori.nama}
                            </div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                {kategori.slug}
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                key: "deskripsi",
                label: "Deskripsi",
                render: (kategori) => (
                    <div className="text-sm text-neutral-900 dark:text-white line-clamp-2">
                        {kategori.deskripsi || "-"}
                    </div>
                ),
            },
            {
                key: "artikels_count",
                label: "Jumlah Artikel",
                render: (kategori) => (
                    <div className="text-sm text-neutral-900 dark:text-white">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                            {kategori.artikels_count || 0} Artikel
                        </span>
                    </div>
                ),
            },
            {
                key: "created_at",
                label: "Dibuat Pada",
                sortable: true,
                onSort: () => handleSort("created_at"),
                sortIcon: getSortIcon("created_at"),
                render: (kategori) => (
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        {new Date(kategori.created_at).toLocaleDateString(
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
                <FiFolderPlus className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-lg font-medium">Belum ada kategori</p>
                <p className="mt-1 text-sm">
                    Mulai dengan membuat kategori baru
                </p>
                {hasPermission("create kategori") && (
                    <div className="mt-6">
                        <Link href={route("admin.kategori.create")}>
                            <PrimaryButton className="flex items-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-500">
                                <FiPlus className="mr-2 h-5 w-5" />
                                Tambah Kategori Baru
                            </PrimaryButton>
                        </Link>
                    </div>
                )}
            </div>
        ),
        []
    );

    const rowActions = useCallback(
        (kategori) => (
            <RowActionsDropdown
                kategori={kategori}
                onView={() =>
                    router.visit(route("admin.kategori.show", kategori.id))
                }
                onEdit={() =>
                    router.visit(route("admin.kategori.edit", kategori.id))
                }
                onDelete={() => openDeleteModal(kategori.id, kategori.nama)}
                hasEditPermission={hasPermission("edit kategori")}
                hasDeletePermission={hasPermission("delete kategori")}
            />
        ),
        [openDeleteModal]
    );

    const createButton = useMemo(
        () =>
            hasPermission("create kategori") ? (
                <Link href={route("admin.kategori.create")}>
                    <PrimaryButton className="flex items-center bg-primary-600 hover:bg-primary-700 focus:ring-primary-500">
                        <FiFolderPlus className="mr-2 h-5 w-5" />
                        Tambah Kategori
                    </PrimaryButton>
                </Link>
            ) : null,
        []
    );

    return (
        <AdminLayout title="Kelola Kategori">
            <Head title="Kelola Kategori" />

            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                title="Konfirmasi Hapus"
                message={`Apakah Anda yakin ingin menghapus kategori "${deleteModal.kategoriNama}"? Aksi ini tidak dapat dibatalkan.`}
                confirmText="Hapus Kategori"
                cancelText="Batal"
            />

            {hasPermission("delete kategori") && (
                <ConfirmationModal
                    isOpen={bulkDeleteModal.isOpen}
                    onClose={closeBulkDeleteModal}
                    onConfirm={handleBulkDelete}
                    title="Konfirmasi Hapus Massal"
                    message={`Apakah Anda yakin ingin menghapus ${bulkDeleteModal.count} kategori yang dipilih? Aksi ini tidak dapat dibatalkan.`}
                    confirmText={`Hapus ${bulkDeleteModal.count} Kategori`}
                    cancelText="Batal"
                />
            )}

            <CrudLayout
                title="Manajemen Kategori"
                description="Kelola semua kategori untuk mengelompokkan artikel"
                createButton={createButton}
                filters={
                    <div className="mb-6">
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

                {hasPermission("delete kategori") &&
                    selectedKategori.length > 0 && (
                        <div className="mb-6">
                            <BulkActions
                                selectedCount={selectedKategori.length}
                                onBulkDelete={openBulkDeleteModal}
                                onBulkExport={handleExport}
                                onClearSelected={clearSelectedKategori}
                            />
                        </div>
                    )}

                <div className="mb-6">
                    <DataTable
                        columns={columns}
                        data={kategories?.data || []}
                        selectedItems={selectedKategori}
                        onSelectItem={handleKategoriSelection}
                        onSelectAll={handleSelectAll}
                        selectAll={selectAll}
                        emptyState={emptyState}
                        rowActions={rowActions}
                        keyField="id"
                        onRowClick={handleRowClick}
                    />
                </div>

                {kategories &&
                    kategories.data &&
                    kategories.data.length > 0 &&
                    kategories.links &&
                    kategories.links.length > 3 && (
                        <Pagination data={kategories} />
                    )}
            </CrudLayout>
        </AdminLayout>
    );
}
