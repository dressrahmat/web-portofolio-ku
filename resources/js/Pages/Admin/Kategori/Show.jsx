import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import DangerButton from "@/Components/DangerButton";
import ConfirmationModal from "@/Components/ConfirmationModal";
import { useToast } from "@/Contexts/ToastContext";
import {
    FiFolder,
    FiFileText,
    FiCalendar,
    FiHash,
    FiRefreshCw,
    FiBookOpen,
} from "react-icons/fi";

export default function ShowKategori({ kategori }) {
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        kategoriId: null,
        kategoriNama: "",
    });
    const { success, error } = useToast();

    const openDeleteModal = () => {
        setDeleteModal({
            isOpen: true,
            kategoriId: kategori.id,
            kategoriNama: kategori.nama,
        });
    };

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            kategoriId: null,
            kategoriNama: "",
        });
    };

    const handleDelete = () => {
        if (deleteModal.kategoriId) {
            router.delete(
                route("admin.kategori.destroy", deleteModal.kategoriId),
                {
                    onSuccess: () => {
                        success("Kategori berhasil dihapus!");
                        closeDeleteModal();
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
    };

    return (
        <AdminLayout title="Detail Kategori">
            <Head title="Detail Kategori" />

            {/* Confirmation Modal for delete */}
            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                title="Konfirmasi Hapus"
                message={`Apakah Anda yakin ingin menghapus kategori "${deleteModal.kategoriNama}"? Aksi ini tidak dapat dibatalkan.`}
                confirmText="Hapus Kategori"
                cancelText="Batal"
            />

            <div className="mx-auto px-1 lg:px-4 lg:pt-2">
                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl shadow-card overflow-hidden">
                    {/* Header dengan gradient */}
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-5 text-white flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <h2 className="text-2xl font-bold">
                                Detail Kategori
                            </h2>
                            <p className="text-primary-100 opacity-90 mt-1">
                                Informasi lengkap tentang kategori
                            </p>
                        </div>

                        {/* Tombol Action */}
                        <div className="hidden md:flex items-center space-x-3">
                            <Link
                                href={route("admin.kategori.index")}
                                className="inline-flex items-center justify-center px-4 py-2 bg-neutral-50/20 hover:bg-neutral-50/30 border border-neutral-50/30 rounded-lg text-white shadow-sm transition-all duration-200"
                            >
                                <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>
                                Kembali
                            </Link>

                            <Link
                                href={route("admin.kategori.edit", kategori.id)}
                            >
                                <PrimaryButton className="flex items-center px-4 py-2">
                                    <svg
                                        className="w-4 h-4 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                    </svg>
                                    Edit
                                </PrimaryButton>
                            </Link>

                            <DangerButton
                                onClick={openDeleteModal}
                                className="flex items-center px-4 py-2"
                            >
                                <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                                Hapus
                            </DangerButton>
                        </div>
                    </div>

                    <div className="p-4 md:p-8">
                        <div className="flex flex-col md:flex-row gap-6 mb-8">
                            {/* Icon Kategori */}
                            <div className="flex-shrink-0">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-lg">
                                        <FiFolder className="w-16 h-16" />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-success-500 rounded-full p-2 border-2 border-neutral-50 dark:border-neutral-800">
                                        <FiBookOpen className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Informasi Kategori */}
                            <div className="flex-grow">
                                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                                    {kategori.nama}
                                </h1>
                                {kategori.slug && (
                                    <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-4">
                                        <span className="font-mono text-sm bg-neutral-100 dark:bg-neutral-700 px-2 py-1 rounded">
                                            {kategori.slug}
                                        </span>
                                    </p>
                                )}

                                <div className="flex flex-wrap gap-2">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                                        <FiBookOpen className="mr-1 h-4 w-4" />
                                        {kategori.artikels_count || 0} Artikel
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                                        <FiCalendar className="mr-1 h-4 w-4" />
                                        Dibuat{" "}
                                        {new Date(
                                            kategori.created_at
                                        ).getFullYear()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Informasi Utama */}
                            <div className="bg-neutral-50 dark:bg-neutral-700/50 p-3 rounded-xl">
                                <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-5 border-b border-neutral-200 dark:border-neutral-600 pb-3 flex items-center">
                                    <FiFolder className="mr-2 h-5 w-5" />
                                    Informasi Kategori
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                            Nama Kategori
                                        </label>
                                        <p className="text-lg font-medium text-neutral-900 dark:text-white">
                                            {kategori.nama}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                            Slug URL
                                        </label>
                                        <p className="text-lg font-medium text-neutral-900 dark:text-white font-mono">
                                            {kategori.slug}
                                        </p>
                                    </div>

                                    {kategori.deskripsi && (
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                                Deskripsi
                                            </label>
                                            <p className="text-neutral-900 dark:text-white">
                                                {kategori.deskripsi}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Metadata */}
                            <div className="bg-neutral-50 dark:bg-neutral-700/50 p-3 rounded-xl">
                                <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-5 border-b border-neutral-200 dark:border-neutral-600 pb-3 flex items-center">
                                    <FiHash className="mr-2 h-5 w-5" />
                                    Metadata
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1 flex items-center">
                                            <FiHash className="mr-1 h-4 w-4" />
                                            ID Kategori
                                        </label>
                                        <p className="text-lg font-medium text-neutral-900 dark:text-white">
                                            #{kategori.id}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1 flex items-center">
                                            <FiCalendar className="mr-1 h-4 w-4" />
                                            Dibuat Pada
                                        </label>
                                        <p className="text-lg font-medium text-neutral-900 dark:text-white">
                                            {new Date(
                                                kategori.created_at
                                            ).toLocaleDateString("id-ID", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1 flex items-center">
                                            <FiRefreshCw className="mr-1 h-4 w-4" />
                                            Terakhir Diperbarui
                                        </label>
                                        <p className="text-lg font-medium text-neutral-900 dark:text-white">
                                            {new Date(
                                                kategori.updated_at
                                            ).toLocaleDateString("id-ID", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Statistik Artikel */}
                            <div className="bg-neutral-50 dark:bg-neutral-700/50 p-3 rounded-xl md:col-span-2">
                                <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-5 border-b border-neutral-200 dark:border-neutral-600 pb-3 flex items-center">
                                    <FiBookOpen className="mr-2 h-5 w-5" />
                                    Statistik Artikel
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="text-center p-4 bg-white dark:bg-neutral-800 rounded-xl">
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                                            Total Artikel
                                        </p>
                                        <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                                            {kategori.artikels_count || 0}
                                        </p>
                                    </div>
                                    <div className="text-center p-4 bg-white dark:bg-neutral-800 rounded-xl">
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                                            Artikel Terbaru
                                        </p>
                                        <p className="text-sm text-neutral-900 dark:text-white">
                                            {kategori.latest_article
                                                ? new Date(
                                                      kategori.latest_article.created_at
                                                  ).toLocaleDateString(
                                                      "id-ID",
                                                      {
                                                          year: "numeric",
                                                          month: "short",
                                                          day: "numeric",
                                                      }
                                                  )
                                                : "-"}
                                        </p>
                                    </div>
                                    <div className="text-center p-4 bg-white dark:bg-neutral-800 rounded-xl">
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                                            Status
                                        </p>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800 dark:bg-success-900 dark:text-success-200">
                                            Aktif
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tombol untuk mobile */}
                        <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700 flex flex-col space-y-3 md:hidden">
                            <Link
                                href={route("admin.kategori.edit", kategori.id)}
                                className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-xl text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                </svg>
                                Edit Kategori
                            </Link>

                            <DangerButton
                                onClick={openDeleteModal}
                                className="inline-flex items-center justify-center w-full px-6 py-3"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                                Hapus Kategori
                            </DangerButton>

                            <Link
                                href={route("admin.kategori.index")}
                                className="inline-flex items-center justify-center w-full px-6 py-3 bg-neutral-50 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-xl text-neutral-700 dark:text-neutral-300 shadow-sm hover:bg-neutral-100 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>
                                Kembali ke Daftar
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
