import React, { useState, useEffect } from "react";
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { useToast } from "@/Contexts/ToastContext";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import QuillEditor from "@/Components/QuillEditor";
import {
    FiFileText,
    FiLink,
    FiImage,
    FiGlobe,
    FiType,
    FiCalendar,
    FiEye,
    FiUpload,
    FiFolder,
} from "react-icons/fi";

export default function CreateArtikel({ kategori, statusOptions }) {
    const [slugLoading, setSlugLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const { data, setData, errors, post, processing, reset } = useForm({
        judul: "",
        slug: "",
        konten: "",
        gambar_utama: null,
        status: "draf",
        diterbitkan_pada: "",
        meta_judul: "",
        meta_deskripsi: "",
        kategori_ids: [],
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

        // Format data sebelum dikirim
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (key === "kategori_ids") {
                if (Array.isArray(data[key])) {
                    data[key].forEach((id) => formData.append(`${key}[]`, id));
                }
            } else if (key === "gambar_utama" && data[key]) {
                formData.append(key, data[key]);
            } else {
                formData.append(key, data[key]);
            }
        });

        post(route("admin.artikel.store"), {
            data: formData,
            onSuccess: () => {
                success("Artikel berhasil dibuat!");
                reset();
            },
            onError: (errors) => {
                showError("Gagal membuat artikel. Silakan periksa form.");
            },
        });
    };

    const handleGenerateSlug = async () => {
        if (!data.judul) {
            showError("Judul harus diisi terlebih dahulu");
            return;
        }

        setSlugLoading(true);
        try {
            const response = await fetch(route("admin.artikel.generate-slug"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]'
                    ).content,
                },
                body: JSON.stringify({ judul: data.judul }),
            });

            const result = await response.json();
            setData("slug", result.slug);
        } catch (error) {
            showError("Gagal membuat slug");
        } finally {
            setSlugLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validasi ukuran file (2MB)
            if (file.size > 2 * 1024 * 1024) {
                showError("Ukuran gambar maksimal 2MB");
                return;
            }

            // Validasi tipe file
            const validTypes = [
                "image/jpeg",
                "image/png",
                "image/gif",
                "image/webp",
            ];
            if (!validTypes.includes(file.type)) {
                showError("Format gambar harus JPG, PNG, GIF, atau WEBP");
                return;
            }

            setData("gambar_utama", file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setData("gambar_utama", null);
        setImagePreview(null);
    };

    const handleEditorChange = (content) => {
        setData("konten", content);
    };

    return (
        <AdminLayout title="Tambah Artikel">
            <Head title="Tambah Artikel" />

            <div className="mx-auto px-1 lg:px-4 lg:pt-2">
                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl shadow-card p-6 sm:p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                            Tambah Artikel Baru
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                            Buat artikel baru untuk website
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Judul Artikel */}
                        <div>
                            <InputLabel
                                htmlFor="judul"
                                value="Judul Artikel"
                                required
                            />
                            <div className="relative">
                                <TextInput
                                    id="judul"
                                    type="text"
                                    value={data.judul}
                                    onChange={(e) =>
                                        setData("judul", e.target.value)
                                    }
                                    error={errors.judul}
                                    placeholder="Masukkan judul artikel"
                                    className="pl-10"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiType className="h-5 w-5 text-primary-400" />
                                </div>
                            </div>
                            <InputError message={errors.judul} />
                        </div>

                        {/* Slug */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <InputLabel
                                    htmlFor="slug"
                                    value="Slug URL"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={handleGenerateSlug}
                                    disabled={slugLoading}
                                    className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center"
                                >
                                    {slugLoading ? (
                                        <>
                                            <svg
                                                className="animate-spin mr-1 h-4 w-4"
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
                                            Membuat...
                                        </>
                                    ) : (
                                        <>
                                            <FiLink className="mr-1 h-4 w-4" />
                                            Generate slug
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="relative">
                                <TextInput
                                    id="slug"
                                    type="text"
                                    value={data.slug}
                                    onChange={(e) =>
                                        setData("slug", e.target.value)
                                    }
                                    error={errors.slug}
                                    placeholder="slug-artikel-anda"
                                    className="pl-10"
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FiLink className="h-5 w-5 text-primary-400" />
                                </div>
                            </div>
                            <InputError message={errors.slug} />
                            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                Slug akan digunakan untuk URL artikel
                            </p>
                        </div>

                        {/* Konten Artikel dengan Quill Editor */}
                        <div>
                            <QuillEditor
                                name="konten"
                                value={data.konten}
                                onChange={handleEditorChange}
                                error={errors.konten}
                                label="Konten Artikel"
                                height={400}
                                placeholder="Tulis konten artikel di sini..."
                            />
                            <InputError message={errors.konten} />
                        </div>

                        {/* Gambar Utama */}
                        <div>
                            <InputLabel
                                htmlFor="gambar_utama"
                                value="Gambar Utama"
                            />

                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="mb-4">
                                    <div className="relative w-64 h-48 rounded-lg overflow-hidden border border-neutral-300 dark:border-neutral-600">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute top-2 right-2 p-2 bg-error-600 text-white rounded-full hover:bg-error-700 transition-colors shadow-lg"
                                        >
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
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="mt-1 text-sm text-neutral-500">
                                        Preview gambar utama
                                    </p>
                                </div>
                            )}

                            {/* Upload Area */}
                            <div className="mt-1">
                                <label className="cursor-pointer block">
                                    <div className="flex items-center justify-center px-6 py-8 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg hover:border-primary-500 dark:hover:border-primary-400 transition-colors bg-white dark:bg-neutral-700">
                                        <div className="text-center">
                                            <FiUpload className="mx-auto h-12 w-12 text-neutral-400" />
                                            <div className="mt-3">
                                                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                                                    <span className="font-medium text-primary-600 dark:text-primary-400">
                                                        Klik untuk upload
                                                    </span>{" "}
                                                    atau drag & drop
                                                </p>
                                                <p className="text-xs text-neutral-500 mt-1">
                                                    PNG, JPG, GIF, WEBP maksimal
                                                    2MB
                                                </p>
                                            </div>
                                        </div>
                                        <input
                                            id="gambar_utama"
                                            name="gambar_utama"
                                            type="file"
                                            className="hidden"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                    </div>
                                </label>
                                {data.gambar_utama && (
                                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                                        File dipilih: {data.gambar_utama.name} (
                                        {(
                                            data.gambar_utama.size / 1024
                                        ).toFixed(1)}{" "}
                                        KB)
                                    </p>
                                )}
                            </div>
                            <InputError message={errors.gambar_utama} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Status */}
                            <div>
                                <InputLabel
                                    htmlFor="status"
                                    value="Status"
                                    required
                                />
                                <div className="relative">
                                    <select
                                        id="status"
                                        name="status"
                                        value={data.status}
                                        onChange={(e) =>
                                            setData("status", e.target.value)
                                        }
                                        className="w-full px-4 py-3 pl-10 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 text-neutral-900 dark:text-white appearance-none"
                                    >
                                        {statusOptions.map((option) => (
                                            <option
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiEye className="h-5 w-5 text-primary-400" />
                                    </div>
                                </div>
                                <InputError message={errors.status} />
                            </div>

                            {/* Tanggal Diterbitkan */}
                            <div>
                                <InputLabel
                                    htmlFor="diterbitkan_pada"
                                    value="Tanggal Diterbitkan"
                                />
                                <div className="relative">
                                    <input
                                        id="diterbitkan_pada"
                                        name="diterbitkan_pada"
                                        type="datetime-local"
                                        value={data.diterbitkan_pada}
                                        onChange={(e) =>
                                            setData(
                                                "diterbitkan_pada",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-4 py-3 pl-10 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 text-neutral-900 dark:text-white"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiCalendar className="h-5 w-5 text-primary-400" />
                                    </div>
                                </div>
                                <InputError message={errors.diterbitkan_pada} />
                                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                    Kosongkan untuk menggunakan tanggal saat ini
                                    saat diterbitkan
                                </p>
                            </div>
                        </div>

                        {/* Kategori */}
                        <div>
                            <InputLabel
                                htmlFor="kategori_ids"
                                value="Kategori"
                            />
                            <div className="mt-2">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {kategori.map((kat) => (
                                        <label
                                            key={kat.id}
                                            className="flex items-center p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                name="kategori_ids[]"
                                                value={kat.id}
                                                checked={data.kategori_ids.includes(
                                                    kat.id.toString()
                                                )}
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.value;
                                                    setData(
                                                        "kategori_ids",
                                                        data.kategori_ids.includes(
                                                            value
                                                        )
                                                            ? data.kategori_ids.filter(
                                                                  (id) =>
                                                                      id !==
                                                                      value
                                                              )
                                                            : [
                                                                  ...data.kategori_ids,
                                                                  value,
                                                              ]
                                                    );
                                                }}
                                                className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-700"
                                            />
                                            <span className="ml-3 text-sm font-medium text-neutral-700 dark:text-neutral-300 flex items-center">
                                                <FiFolder className="mr-2 h-4 w-4" />
                                                {kat.nama}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <InputError message={errors.kategori_ids} />
                        </div>

                        {/* SEO Metadata */}
                        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center">
                                <FiGlobe className="mr-2 h-5 w-5" />
                                SEO Metadata
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <InputLabel
                                        htmlFor="meta_judul"
                                        value="Meta Title"
                                    />
                                    <div className="relative">
                                        <TextInput
                                            id="meta_judul"
                                            name="meta_judul"
                                            type="text"
                                            value={data.meta_judul}
                                            onChange={(e) =>
                                                setData(
                                                    "meta_judul",
                                                    e.target.value
                                                )
                                            }
                                            error={errors.meta_judul}
                                            placeholder="Judul untuk SEO (jika berbeda)"
                                            className="pl-10"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiType className="h-5 w-5 text-primary-400" />
                                        </div>
                                    </div>
                                    <InputError message={errors.meta_judul} />
                                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                        {data.meta_judul?.length || 0}/255
                                        karakter
                                    </p>
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="meta_deskripsi"
                                        value="Meta Description"
                                    />
                                    <textarea
                                        id="meta_deskripsi"
                                        name="meta_deskripsi"
                                        value={data.meta_deskripsi}
                                        onChange={(e) =>
                                            setData(
                                                "meta_deskripsi",
                                                e.target.value
                                            )
                                        }
                                        rows="3"
                                        className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 resize-none"
                                        placeholder="Deskripsi untuk SEO (maksimal 255 karakter)"
                                        maxLength="255"
                                    />
                                    <InputError
                                        message={errors.meta_deskripsi}
                                    />
                                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                        {data.meta_deskripsi?.length || 0}/255
                                        karakter
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                            <Link
                                href={route("admin.artikel.index")}
                                className="inline-flex items-center justify-center px-6 py-3 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors duration-200 font-medium"
                            >
                                Batal
                            </Link>
                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 flex items-center"
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
                                        Membuat...
                                    </>
                                ) : (
                                    <>
                                        <FiFileText className="mr-2 h-5 w-5" />
                                        Buat Artikel
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
