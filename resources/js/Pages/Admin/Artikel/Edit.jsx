import React, { useState, useEffect, useRef } from "react";
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { useToast } from "@/Contexts/ToastContext";
import TextInput from "@/Components/TextInput";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import QuillEditor from "@/Components/QuillEditor";
import {
    FiFileText,
    FiLink,
    FiImage,
    FiGlobe,
    FiType,
    FiCalendar,
    FiRefreshCw,
    FiEye,
    FiTrash2,
    FiUpload,
    FiFolder,
    FiSave,
    FiArrowLeft,
} from "react-icons/fi";

export default function EditArtikel({ artikel, kategori, statusOptions }) {
    const [slugLoading, setSlugLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(
        artikel.gambar_utama && artikel.gambar_utama !== "default-article.jpg"
            ? `/storage/${artikel.gambar_utama}`
            : null
    );

    // Simpan path gambar yang diupload dari editor
    const uploadedImagesRef = useRef([]);

    // State untuk menampilkan gambar yang akan dihapus
    const [imagesToDelete, setImagesToDelete] = useState([]);

    const { data, setData, errors, put, processing, reset } = useForm({
        judul: artikel.judul || "",
        slug: artikel.slug || "",
        konten: artikel.konten || "",
        gambar_utama: null,
        remove_gambar: false,
        status: artikel.status || "draf",
        diterbitkan_pada: artikel.diterbitkan_pada
            ? new Date(artikel.diterbitkan_pada).toISOString().slice(0, 16)
            : "",
        meta_judul: artikel.meta_judul || "",
        meta_deskripsi: artikel.meta_deskripsi || "",
        kategori_ids: artikel.kategori?.map((kat) => kat.id.toString()) || [],
        images_to_delete: [], // Field untuk menyimpan gambar yang akan dihapus
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

    // Fungsi untuk mengekstrak gambar dari konten
    const extractImagesFromContent = (content) => {
        if (!content) return [];

        const images = [];
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = content;

        const imgElements = tempDiv.getElementsByTagName("img");
        for (let img of imgElements) {
            const src = img.getAttribute("src");
            if (src) {
                images.push(src);
            }
        }

        return images;
    };

    // Handler untuk gambar yang diupload di editor
    const handleImageUpload = (imagePath) => {
        if (!uploadedImagesRef.current.includes(imagePath)) {
            uploadedImagesRef.current.push(imagePath);
        }
    };

    // Handler untuk menghapus gambar dari konten
    const handleRemoveImageFromContent = (imageUrl) => {
        // Cek apakah gambar berasal dari storage lokal
        if (imageUrl.includes("/storage/")) {
            // Ekstrak path relatif dari URL
            const pathMatch = imageUrl.match(/\/storage\/(.+)/);
            if (pathMatch) {
                const relativePath = pathMatch[1];

                // Tambahkan ke daftar gambar yang akan dihapus
                if (!imagesToDelete.includes(relativePath)) {
                    setImagesToDelete([...imagesToDelete, relativePath]);

                    // Update form data
                    setData("images_to_delete", [
                        ...(data.images_to_delete || []),
                        relativePath,
                    ]);
                }

                // Hapus gambar dari konten
                const newContent = data.konten.replace(
                    new RegExp(
                        `<img[^>]*src=["']${imageUrl.replace(
                            /[.*+?^${}()|[\]\\]/g,
                            "\\$&"
                        )}["'][^>]*>`,
                        "gi"
                    ),
                    '<div style="padding: 20px; background: #f8f9fa; border: 1px dashed #dc3545; border-radius: 5px; text-align: center; color: #dc3545;"><i>Gambar dihapus: ' +
                        relativePath +
                        "</i></div>"
                );

                setData("konten", newContent);
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Format data sebelum dikirim
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (key === "_method") {
                formData.append(key, data[key]);
            } else if (key === "kategori_ids") {
                if (Array.isArray(data[key])) {
                    data[key].forEach((id) => formData.append(`${key}[]`, id));
                }
            } else if (key === "images_to_delete") {
                if (Array.isArray(data[key])) {
                    data[key].forEach((path) =>
                        formData.append(`${key}[]`, path)
                    );
                }
            } else if (key === "gambar_utama" && data[key]) {
                formData.append(key, data[key]);
            } else if (key === "remove_gambar") {
                if (data[key]) {
                    formData.append(key, "1");
                }
            } else {
                formData.append(key, data[key] || "");
            }
        });

        put(route("admin.artikel.update", artikel.id), {
            data: formData,
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                success("Artikel berhasil diperbarui!");
                // Reset
                uploadedImagesRef.current = [];
                setImagesToDelete([]);
            },
            onError: (errors) => {
                showError("Gagal memperbarui artikel. Silakan periksa form.");
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
                body: JSON.stringify({ judul: data.judul, id: artikel.id }),
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
            setData("remove_gambar", false);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setData("remove_gambar", true);
        setData("gambar_utama", null);
        setImagePreview(null);
    };

    const handleEditorChange = (content) => {
        setData("konten", content);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "terbit":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
            case "draf":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
            case "arsip":
                return "bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300";
            default:
                return "bg-neutral-100 text-neutral-800";
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case "terbit":
                return "Terbit";
            case "draf":
                return "Draf";
            case "arsip":
                return "Arsip";
            default:
                return status;
        }
    };

    // Ekstrak gambar dari konten saat ini untuk ditampilkan
    const currentImages = extractImagesFromContent(data.konten);

    return (
        <AdminLayout title="Edit Artikel">
            <Head title="Edit Artikel" />

            <div className="mx-auto px-1 lg:px-4 lg:pt-2">
                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl shadow-card p-6 sm:p-8">
                    {/* Header dengan Breadcrumb */}
                    <div className="mb-8">
                        <div className="flex items-center mb-4 text-sm text-neutral-500 dark:text-neutral-400">
                            <Link
                                href={route("admin.artikel.index")}
                                className="hover:text-primary-600 dark:hover:text-primary-400 flex items-center"
                            >
                                <FiArrowLeft className="mr-2" />
                                Kembali ke Daftar Artikel
                            </Link>
                            <span className="mx-2">/</span>
                            <span className="text-neutral-700 dark:text-neutral-300">
                                Edit Artikel
                            </span>
                        </div>

                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                                    Edit Artikel: {artikel.judul}
                                </h2>
                                <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                                    Perbarui informasi artikel. Gambar yang
                                    dihapus akan dihapus permanen dari server.
                                </p>
                                <div className="flex items-center gap-4 mt-3">
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                        ID:{" "}
                                        <span className="font-medium">
                                            {artikel.id}
                                        </span>
                                    </p>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                        Dilihat:{" "}
                                        <span className="font-medium">
                                            {artikel.jumlah_dilihat} kali
                                        </span>
                                    </p>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                        Dibuat:{" "}
                                        <span className="font-medium">
                                            {new Date(
                                                artikel.created_at
                                            ).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                        artikel.status
                                    )}`}
                                >
                                    {getStatusLabel(artikel.status)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section: Informasi Dasar */}
                        <div className="bg-white dark:bg-neutral-700/50 rounded-xl p-6 border border-neutral-200 dark:border-neutral-600">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6 flex items-center">
                                <FiFileText className="mr-2 h-5 w-5 text-primary-500" />
                                Informasi Dasar
                            </h3>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Judul Artikel */}
                                <div className="lg:col-span-2">
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
                                            placeholder="Masukkan judul artikel yang menarik"
                                            className="pl-10"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiType className="h-5 w-5 text-primary-400" />
                                        </div>
                                    </div>
                                    <InputError message={errors.judul} />
                                </div>

                                {/* Slug */}
                                <div className="lg:col-span-2">
                                    <div className="flex justify-between items-center mb-2">
                                        <InputLabel
                                            htmlFor="slug"
                                            value="Slug URL"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={handleGenerateSlug}
                                            disabled={
                                                slugLoading || !data.judul
                                            }
                                            className="text-sm bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/30 dark:hover:bg-primary-900/50 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-lg flex items-center transition-colors"
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
                                                    <FiRefreshCw className="mr-1 h-4 w-4" />
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
                                            placeholder="contoh: judul-artikel-anda"
                                            className="pl-10"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiLink className="h-5 w-5 text-primary-400" />
                                        </div>
                                    </div>
                                    <div className="mt-1">
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                            URL akan menjadi:{" "}
                                            <span className="font-medium">
                                                {window.location.origin}
                                                /artikel/
                                                {data.slug || "judul-artikel"}
                                            </span>
                                        </p>
                                    </div>
                                    <InputError message={errors.slug} />
                                </div>
                            </div>
                        </div>

                        {/* Section: Konten Artikel */}
                        <div className="bg-white dark:bg-neutral-700/50 rounded-xl p-6 border border-neutral-200 dark:border-neutral-600">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center">
                                    <FiFileText className="mr-2 h-5 w-5 text-primary-500" />
                                    Konten Artikel
                                </h3>
                                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                    {currentImages.length} gambar dalam konten
                                </div>
                            </div>

                            <QuillEditor
                                name="konten"
                                value={data.konten}
                                onChange={handleEditorChange}
                                onImageUpload={handleImageUpload}
                                error={errors.konten}
                                label="Konten Lengkap"
                                height={500}
                                placeholder="Tulis konten artikel di sini. Gunakan fitur format untuk membuat artikel yang menarik..."
                            />
                            <InputError message={errors.konten} />

                            {/* Daftar Gambar dalam Konten */}
                            {currentImages.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-600">
                                    <h4 className="text-md font-medium text-neutral-900 dark:text-white mb-4">
                                        Gambar dalam Konten (
                                        {currentImages.length})
                                    </h4>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {currentImages.map(
                                            (imageUrl, index) => {
                                                const pathMatch =
                                                    imageUrl.match(
                                                        /\/storage\/(.+)/
                                                    );
                                                const relativePath = pathMatch
                                                    ? pathMatch[1]
                                                    : null;
                                                const isMarkedForDeletion =
                                                    relativePath &&
                                                    imagesToDelete.includes(
                                                        relativePath
                                                    );

                                                return (
                                                    <div
                                                        key={index}
                                                        className={`relative rounded-lg overflow-hidden border ${
                                                            isMarkedForDeletion
                                                                ? "border-red-500 dark:border-red-400 opacity-60"
                                                                : "border-neutral-300 dark:border-neutral-600"
                                                        }`}
                                                    >
                                                        <div className="aspect-video bg-neutral-100 dark:bg-neutral-700">
                                                            <img
                                                                src={imageUrl}
                                                                alt={`Gambar ${
                                                                    index + 1
                                                                }`}
                                                                className="w-full h-full object-cover"
                                                                onError={(
                                                                    e
                                                                ) => {
                                                                    e.target.style.display =
                                                                        "none";
                                                                    e.target.parentElement.innerHTML =
                                                                        '<div class="w-full h-full flex items-center justify-center text-neutral-400">Gambar tidak ditemukan</div>';
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="p-2 bg-white dark:bg-neutral-800">
                                                            <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                                                                {relativePath ||
                                                                    imageUrl.substring(
                                                                        0,
                                                                        30
                                                                    )}
                                                                ...
                                                            </p>
                                                            {relativePath && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleRemoveImageFromContent(
                                                                            imageUrl
                                                                        )
                                                                    }
                                                                    className={`mt-2 text-xs w-full py-1 rounded ${
                                                                        isMarkedForDeletion
                                                                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                                                            : "bg-neutral-100 hover:bg-red-50 text-neutral-700 hover:text-red-700 dark:bg-neutral-700 dark:hover:bg-red-900/30 dark:text-neutral-300 dark:hover:text-red-300"
                                                                    }`}
                                                                >
                                                                    {isMarkedForDeletion
                                                                        ? "Akan Dihapus"
                                                                        : "Hapus Gambar"}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    </div>
                                    {imagesToDelete.length > 0 && (
                                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                            <p className="text-sm text-red-700 dark:text-red-300">
                                                <span className="font-medium">
                                                    {imagesToDelete.length}{" "}
                                                    gambar
                                                </span>{" "}
                                                akan dihapus permanen dari
                                                server saat artikel disimpan.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Section: Media & Kategori */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Gambar Utama */}
                            <div className="bg-white dark:bg-neutral-700/50 rounded-xl p-6 border border-neutral-200 dark:border-neutral-600">
                                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6 flex items-center">
                                    <FiImage className="mr-2 h-5 w-5 text-primary-500" />
                                    Gambar Utama
                                </h3>

                                {/* Current Image */}
                                {artikel.gambar_utama &&
                                    artikel.gambar_utama !==
                                        "default-article.jpg" &&
                                    !data.remove_gambar &&
                                    !(data.gambar_utama instanceof File) && (
                                        <div className="mb-6">
                                            <div className="relative w-full h-64 rounded-xl overflow-hidden border border-neutral-300 dark:border-neutral-600">
                                                <img
                                                    src={`/storage/${artikel.gambar_utama}`}
                                                    alt="Gambar Utama Saat Ini"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                                    <p className="text-sm font-medium">
                                                        Gambar saat ini
                                                    </p>
                                                    <p className="text-xs opacity-90">
                                                        {artikel.gambar_utama}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    className="absolute top-3 right-3 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-colors"
                                                    title="Hapus gambar"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                {/* New Image Preview */}
                                {imagePreview &&
                                    data.gambar_utama instanceof File && (
                                        <div className="mb-6">
                                            <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-primary-500 dark:border-primary-400">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview Gambar Baru"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                                    <p className="text-sm font-medium">
                                                        Preview gambar baru
                                                    </p>
                                                    <p className="text-xs opacity-90">
                                                        {data.gambar_utama.name}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveImage}
                                                    className="absolute top-3 right-3 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-colors"
                                                    title="Batal upload"
                                                >
                                                    <FiTrash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                {/* Upload Area */}
                                <div>
                                    <label className="cursor-pointer block">
                                        <div className="flex flex-col items-center justify-center px-6 py-10 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-xl hover:border-primary-500 dark:hover:border-primary-400 transition-colors bg-white dark:bg-neutral-800">
                                            <FiUpload className="h-12 w-12 text-neutral-400 mb-4" />
                                            <div className="text-center">
                                                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                                    Klik untuk upload gambar
                                                    utama
                                                </p>
                                                <p className="text-xs text-neutral-500">
                                                    PNG, JPG, GIF, WEBP (maks.
                                                    2MB)
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
                                    </label>

                                    {data.gambar_utama instanceof File && (
                                        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                            <p className="text-sm text-green-700 dark:text-green-300">
                                                File siap diupload:{" "}
                                                <span className="font-medium">
                                                    {data.gambar_utama.name}
                                                </span>{" "}
                                                (
                                                {Math.round(
                                                    data.gambar_utama.size /
                                                        1024
                                                )}{" "}
                                                KB)
                                            </p>
                                        </div>
                                    )}

                                    {data.remove_gambar && (
                                        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                                Gambar utama akan dihapus saat
                                                artikel disimpan.
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <InputError message={errors.gambar_utama} />
                            </div>

                            {/* Kategori & Status */}
                            <div className="space-y-8">
                                {/* Kategori */}
                                <div className="bg-white dark:bg-neutral-700/50 rounded-xl p-6 border border-neutral-200 dark:border-neutral-600">
                                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6 flex items-center">
                                        <FiFolder className="mr-2 h-5 w-5 text-primary-500" />
                                        Kategori
                                    </h3>

                                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                        {kategori.map((kat) => (
                                            <label
                                                key={kat.id}
                                                className="flex items-center p-3 border border-neutral-300 dark:border-neutral-600 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer group"
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
                                                <span className="ml-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                                    {kat.nama}
                                                </span>
                                                <span className="ml-auto text-xs text-neutral-500 dark:text-neutral-400 group-hover:text-primary-600">
                                                    {kat.artikel_count || 0}{" "}
                                                    artikel
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    <InputError message={errors.kategori_ids} />
                                </div>

                                {/* Status & Tanggal */}
                                <div className="bg-white dark:bg-neutral-700/50 rounded-xl p-6 border border-neutral-200 dark:border-neutral-600">
                                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6 flex items-center">
                                        <FiEye className="mr-2 h-5 w-5 text-primary-500" />
                                        Publikasi
                                    </h3>

                                    <div className="space-y-6">
                                        {/* Status */}
                                        <div>
                                            <InputLabel
                                                htmlFor="status"
                                                value="Status Artikel"
                                                required
                                            />
                                            <div className="relative">
                                                <select
                                                    id="status"
                                                    name="status"
                                                    value={data.status}
                                                    onChange={(e) =>
                                                        setData(
                                                            "status",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full px-4 py-3 pl-10 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 text-neutral-900 dark:text-white appearance-none"
                                                >
                                                    {statusOptions.map(
                                                        (option) => (
                                                            <option
                                                                key={
                                                                    option.value
                                                                }
                                                                value={
                                                                    option.value
                                                                }
                                                                className="py-2"
                                                            >
                                                                {option.label}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <FiEye className="h-5 w-5 text-primary-400" />
                                                </div>
                                            </div>
                                            <InputError
                                                message={errors.status}
                                            />
                                        </div>

                                        {/* Tanggal Diterbitkan */}
                                        <div>
                                            <InputLabel
                                                htmlFor="diterbitkan_pada"
                                                value="Tanggal & Waktu Publikasi"
                                            />
                                            <div className="relative">
                                                <input
                                                    id="diterbitkan_pada"
                                                    name="diterbitkan_pada"
                                                    type="datetime-local"
                                                    value={
                                                        data.diterbitkan_pada
                                                    }
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
                                            <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                                Kosongkan untuk menggunakan
                                                tanggal saat ini
                                            </p>
                                            <InputError
                                                message={
                                                    errors.diterbitkan_pada
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section: SEO Metadata */}
                        <div className="bg-white dark:bg-neutral-700/50 rounded-xl p-6 border border-neutral-200 dark:border-neutral-600">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6 flex items-center">
                                <FiGlobe className="mr-2 h-5 w-5 text-primary-500" />
                                Optimasi SEO
                            </h3>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <InputLabel
                                        htmlFor="meta_judul"
                                        value="Meta Title"
                                        optional
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
                                            placeholder="Judul untuk mesin pencari (jika berbeda)"
                                            className="pl-10"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiType className="h-5 w-5 text-primary-400" />
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <InputError
                                            message={errors.meta_judul}
                                        />
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                            {data.meta_judul?.length || 0}/60
                                            karakter
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="meta_deskripsi"
                                        value="Meta Description"
                                        optional
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
                                        placeholder="Deskripsi singkat untuk mesin pencari..."
                                        maxLength="160"
                                    />
                                    <div className="flex justify-between items-center mt-2">
                                        <InputError
                                            message={errors.meta_deskripsi}
                                        />
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                            {data.meta_deskripsi?.length || 0}
                                            /160 karakter
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                    💡{" "}
                                    <span className="font-medium">
                                        Tips SEO:
                                    </span>{" "}
                                    Pastikan meta title dan description relevan
                                    dengan konten, mengandung kata kunci utama,
                                    dan menarik untuk diklik di hasil pencarian.
                                </p>
                            </div>
                        </div>

                        {/* Section: Statistik & Info */}
                        <div className="bg-white dark:bg-neutral-700/50 rounded-xl p-6 border border-neutral-200 dark:border-neutral-600">
                            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">
                                Statistik & Informasi
                            </h3>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 p-4 rounded-xl">
                                    <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">
                                        Jumlah Dilihat
                                    </p>
                                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                                        {artikel.jumlah_dilihat}
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 p-4 rounded-xl">
                                    <p className="text-sm text-green-700 dark:text-green-300 mb-1">
                                        Status Saat Ini
                                    </p>
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                            artikel.status
                                        )}`}
                                    >
                                        {getStatusLabel(artikel.status)}
                                    </span>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 p-4 rounded-xl">
                                    <p className="text-sm text-purple-700 dark:text-purple-300 mb-1">
                                        Dibuat Pada
                                    </p>
                                    <p className="text-sm font-medium text-purple-900 dark:text-purple-200">
                                        {new Date(
                                            artikel.created_at
                                        ).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10 p-4 rounded-xl">
                                    <p className="text-sm text-amber-700 dark:text-amber-300 mb-1">
                                        Terakhir Diupdate
                                    </p>
                                    <p className="text-sm font-medium text-amber-900 dark:text-amber-200">
                                        {new Date(
                                            artikel.updated_at
                                        ).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-neutral-200 dark:border-neutral-700">
                            <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                <p className="flex items-center">
                                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                    Artikel akan diperbarui secara real-time.
                                    Perubahan akan segera terlihat.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link
                                    href={route("admin.artikel.index")}
                                    className="inline-flex items-center justify-center px-6 py-3 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors duration-200 font-medium"
                                >
                                    <FiArrowLeft className="mr-2" />
                                    Batal
                                </Link>
                                <PrimaryButton
                                    type="submit"
                                    disabled={processing}
                                    className="px-8 py-3 bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 flex items-center shadow-lg shadow-primary-500/25"
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
                                            <FiSave className="mr-2 h-5 w-5" />
                                            Simpan Perubahan
                                        </>
                                    )}
                                </PrimaryButton>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
