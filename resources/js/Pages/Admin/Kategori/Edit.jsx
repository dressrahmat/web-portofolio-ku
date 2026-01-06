import React, { useState, useEffect } from "react";
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { useToast } from "@/Contexts/ToastContext";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import { FiFolder, FiFileText, FiRefreshCw } from "react-icons/fi";

export default function EditKategori({ kategori }) {
    const { data, setData, errors, post, processing, reset } = useForm({
        nama: kategori.nama,
        deskripsi: kategori.deskripsi || "",
        _method: "PUT",
    });

    const { success, error: showError } = useToast();
    const { props: pageProps } = usePage();
    const flash = pageProps.flash || {};

    useEffect(() => {
        if (flash.success) {
            success(flash.success);
        }
        if (flash.error) {
            showError(flash.error);
        }
    }, [flash]);

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("admin.kategori.update", kategori.id), {
            onSuccess: () => {
                success("Kategori berhasil diperbarui!");
                reset();
            },
            onError: (errors) => {
                showError("Gagal memperbarui kategori. Silakan periksa form.");
            },
        });
    };

    return (
        <AdminLayout title="Edit Kategori">
            <Head title="Edit Kategori" />

            <div className="mx-auto px-1 lg:px-4 lg:pt-2">
                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl shadow-card p-6 sm:p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                            Edit Kategori: {kategori.nama}
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                            Perbarui informasi kategori
                        </p>
                        {kategori.slug && (
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                Slug: {kategori.slug}
                            </p>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Nama Kategori */}
                        <div>
                            <InputLabel
                                htmlFor="nama"
                                value="Nama Kategori"
                                required
                            />
                            <div className="relative">
                                <TextInput
                                    id="nama"
                                    type="text"
                                    value={data.nama}
                                    onChange={(e) =>
                                        setData("nama", e.target.value)
                                    }
                                    error={errors.nama}
                                    placeholder="Masukkan nama kategori"
                                    className="pl-10"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiFolder className="h-5 w-5 text-primary-400" />
                                </div>
                            </div>
                            <InputError message={errors.nama} />
                            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                Slug akan otomatis diperbarui dari nama kategori
                            </p>
                        </div>

                        {/* Deskripsi */}
                        <div>
                            <InputLabel htmlFor="deskripsi" value="Deskripsi" />
                            <div className="relative">
                                <textarea
                                    id="deskripsi"
                                    value={data.deskripsi}
                                    onChange={(e) =>
                                        setData("deskripsi", e.target.value)
                                    }
                                    rows="4"
                                    className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 resize-none"
                                    placeholder="Masukkan deskripsi kategori (opsional)"
                                />
                                <div className="absolute top-3 left-3 flex items-center pointer-events-none">
                                    <FiFileText className="h-5 w-5 text-primary-400" />
                                </div>
                            </div>
                            <InputError message={errors.deskripsi} />
                        </div>

                        {/* Statistik Kategori */}
                        <div className="bg-neutral-50 dark:bg-neutral-700/50 p-4 rounded-xl">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                                Statistik Kategori
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-white dark:bg-neutral-800 rounded-lg">
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                                        Jumlah Artikel
                                    </p>
                                    <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                        {kategori.artikels_count || 0}
                                    </p>
                                </div>
                                <div className="text-center p-3 bg-white dark:bg-neutral-800 rounded-lg">
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                                        Dibuat Pada
                                    </p>
                                    <p className="text-sm text-neutral-900 dark:text-white">
                                        {new Date(
                                            kategori.created_at
                                        ).toLocaleDateString("id-ID", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                            <Link
                                href={route("admin.kategori.index")}
                                className="inline-flex items-center justify-center px-6 py-3 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors duration-200 font-medium"
                            >
                                Batal
                            </Link>
                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 focus:ring-primary-500"
                            >
                                {processing ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Memperbarui...
                                    </>
                                ) : (
                                    <>
                                        <FiRefreshCw className="mr-2 h-5 w-5" />
                                        Perbarui Kategori
                                    </>
                                )}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
