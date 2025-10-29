import React, { useState, useEffect, useRef } from "react";
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { useToast } from "@/Contexts/ToastContext";
import TextInput from "@/Components/TextInput";
import TextArea from "@/Components/TextArea";
import InputLabel from "@/Components/InputLabel";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import {
    FiFolder,
    FiCamera,
    FiX,
    FiGlobe,
    FiGithub,
    FiCalendar,
    FiTag,
    FiPlus,
    FiCode,
    FiList,
    FiImage,
    FiTrash2,
} from "react-icons/fi";

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

export default function EditPortfolio({ portfolio, categories }) {
    const { data, setData, errors, post, processing, reset } = useForm({
        title: portfolio.title || "",
        description: portfolio.description || "",
        short_description: portfolio.short_description || "",
        category: portfolio.category || "",
        client_name: portfolio.client_name || "",
        project_date: portfolio.project_date || "",
        project_url: portfolio.project_url || "",
        github_url: portfolio.github_url || "",
        featured_image: null,
        remove_featured_image: false,
        highlight: portfolio.highlight || false,
        status: portfolio.status || "draft",
        sort_order: portfolio.sort_order || 0,
        technologies: portfolio.technologies?.map((t) => t.technology) || [],
        features: portfolio.features?.map((f) => f.feature) || [],
        _method: "PUT", // Method spoofing
    });

    // Fungsi untuk mendapatkan URL featured image yang benar
    const getFeaturedImageUrl = () => {
        if (portfolio.featured_image && !data.remove_featured_image) {
            return getImageUrl(portfolio.featured_image);
        }
        return null;
    };

    const [previewUrl, setPreviewUrl] = useState(getFeaturedImageUrl());
    const [techInput, setTechInput] = useState("");
    const [featureInput, setFeatureInput] = useState("");
    const fileInputRef = useRef(null);
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

    // Update previewUrl ketika portfolio.featured_image atau remove_featured_image berubah
    useEffect(() => {
        if (data.featured_image) {
            const url = URL.createObjectURL(data.featured_image);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl(getFeaturedImageUrl());
        }
    }, [
        data.featured_image,
        data.remove_featured_image,
        portfolio.featured_image,
    ]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validasi file
        if (!file.type.startsWith("image/")) {
            showError("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showError("Image size must be less than 5MB");
            return;
        }

        // Validasi dimensi gambar (opsional - bisa dihapus jika tidak diperlukan)
        const img = new Image();
        img.onload = function () {
            const width = this.width;
            const height = this.height;
            const aspectRatio = width / height;
            const targetAspectRatio = 16 / 9;

            if (Math.abs(aspectRatio - targetAspectRatio) > 0.1) {
                showError(
                    "Recommended image aspect ratio is 16:9 for best display"
                );
                // Tetap lanjutkan upload, hanya warning
            }

            setData({
                ...data,
                featured_image: file,
                remove_featured_image: false,
            });
        };
        img.onerror = function () {
            // Jika tidak bisa membaca dimensi, tetap lanjutkan upload
            setData({
                ...data,
                featured_image: file,
                remove_featured_image: false,
            });
        };
        img.src = URL.createObjectURL(file);
    };

    const removeUploadedImage = () => {
        setData({
            ...data,
            featured_image: null,
            remove_featured_image: portfolio.featured_image ? true : false,
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const addTechnology = () => {
        if (techInput.trim() && !data.technologies.includes(techInput.trim())) {
            setData("technologies", [...data.technologies, techInput.trim()]);
            setTechInput("");
        }
    };

    const removeTechnology = (techToRemove) => {
        setData(
            "technologies",
            data.technologies.filter((tech) => tech !== techToRemove)
        );
    };

    const addFeature = () => {
        if (
            featureInput.trim() &&
            !data.features.includes(featureInput.trim())
        ) {
            setData("features", [...data.features, featureInput.trim()]);
            setFeatureInput("");
        }
    };

    const removeFeature = (featureToRemove) => {
        setData(
            "features",
            data.features.filter((feature) => feature !== featureToRemove)
        );
    };

    const handleTechKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTechnology();
        }
    };

    const handleFeatureKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addFeature();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("admin.portfolios.update", portfolio.id), {
            forceFormData: true,
            onSuccess: () => {
                success("Portfolio updated successfully!");
                reset("featured_image", "remove_featured_image");
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            },
            onError: (errors) => {
                showError("Failed to update portfolio. Please check the form.");
            },
        });
    };

    const triggerFileInput = () => {
        if (!processing) {
            fileInputRef.current?.click();
        }
    };

    const hasFeaturedImage =
        portfolio.featured_image && !data.remove_featured_image;
    const hasNewFeaturedImage = data.featured_image;

    return (
        <AdminLayout title="Edit Portfolio">
            <Head title="Edit Portfolio" />

            <div className="mx-auto px-1 lg:px-4 lg:pt-2">
                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl shadow-card p-6 sm:p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                            Edit Portfolio: {portfolio.title}
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                            Update portfolio project information, technologies,
                            and features.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column - Basic Info */}
                            <div className="space-y-6">
                                {/* Title Field */}
                                <div>
                                    <InputLabel
                                        htmlFor="title"
                                        value="Project Title"
                                        required
                                    />
                                    <div className="relative">
                                        <TextInput
                                            id="title"
                                            type="text"
                                            value={data.title}
                                            onChange={(e) =>
                                                setData("title", e.target.value)
                                            }
                                            error={errors.title}
                                            placeholder="Enter project title"
                                            className="pl-10"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiFolder className="h-5 w-5 text-primary-400" />
                                        </div>
                                    </div>
                                    <InputError message={errors.title} />
                                </div>

                                {/* Category Field */}
                                <div>
                                    <InputLabel
                                        htmlFor="category"
                                        value="Category"
                                        required
                                    />
                                    <div className="relative">
                                        <select
                                            id="category"
                                            value={data.category}
                                            onChange={(e) =>
                                                setData(
                                                    "category",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        >
                                            <option value="">
                                                Select a category
                                            </option>
                                            {categories.map((category) => (
                                                <option
                                                    key={category}
                                                    value={category}
                                                >
                                                    {category}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiTag className="h-5 w-5 text-primary-400" />
                                        </div>
                                    </div>
                                    <InputError message={errors.category} />
                                </div>

                                {/* Client Name */}
                                <div>
                                    <InputLabel
                                        htmlFor="client_name"
                                        value="Client Name"
                                    />
                                    <TextInput
                                        id="client_name"
                                        type="text"
                                        value={data.client_name}
                                        onChange={(e) =>
                                            setData(
                                                "client_name",
                                                e.target.value
                                            )
                                        }
                                        error={errors.client_name}
                                        placeholder="Enter client name (optional)"
                                    />
                                    <InputError message={errors.client_name} />
                                </div>

                                {/* Project Date */}
                                <div>
                                    <InputLabel
                                        htmlFor="project_date"
                                        value="Project Date"
                                    />
                                    <div className="relative">
                                        <TextInput
                                            id="project_date"
                                            type="date"
                                            value={data.project_date}
                                            onChange={(e) =>
                                                setData(
                                                    "project_date",
                                                    e.target.value
                                                )
                                            }
                                            error={errors.project_date}
                                            className="pl-10"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiCalendar className="h-5 w-5 text-primary-400" />
                                        </div>
                                    </div>
                                    <InputError message={errors.project_date} />
                                </div>
                            </div>

                            {/* Right Column - URLs & Status */}
                            <div className="space-y-6">
                                {/* Project URL */}
                                <div>
                                    <InputLabel
                                        htmlFor="project_url"
                                        value="Live Project URL"
                                    />
                                    <div className="relative">
                                        <TextInput
                                            id="project_url"
                                            type="url"
                                            value={data.project_url}
                                            onChange={(e) =>
                                                setData(
                                                    "project_url",
                                                    e.target.value
                                                )
                                            }
                                            error={errors.project_url}
                                            placeholder="https://example.com"
                                            className="pl-10"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiGlobe className="h-5 w-5 text-primary-400" />
                                        </div>
                                    </div>
                                    <InputError message={errors.project_url} />
                                </div>

                                {/* GitHub URL */}
                                <div>
                                    <InputLabel
                                        htmlFor="github_url"
                                        value="GitHub Repository"
                                    />
                                    <div className="relative">
                                        <TextInput
                                            id="github_url"
                                            type="url"
                                            value={data.github_url}
                                            onChange={(e) =>
                                                setData(
                                                    "github_url",
                                                    e.target.value
                                                )
                                            }
                                            error={errors.github_url}
                                            placeholder="https://github.com/username/repo"
                                            className="pl-10"
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FiGithub className="h-5 w-5 text-primary-400" />
                                        </div>
                                    </div>
                                    <InputError message={errors.github_url} />
                                </div>

                                {/* Status & Highlight */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel
                                            htmlFor="status"
                                            value="Status"
                                            required
                                        />
                                        <select
                                            id="status"
                                            value={data.status}
                                            onChange={(e) =>
                                                setData(
                                                    "status",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                        >
                                            <option value="draft">Draft</option>
                                            <option value="published">
                                                Published
                                            </option>
                                            <option value="archived">
                                                Archived
                                            </option>
                                        </select>
                                        <InputError message={errors.status} />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="sort_order"
                                            value="Sort Order"
                                        />
                                        <TextInput
                                            id="sort_order"
                                            type="number"
                                            value={data.sort_order}
                                            onChange={(e) =>
                                                setData(
                                                    "sort_order",
                                                    parseInt(e.target.value) ||
                                                        0
                                                )
                                            }
                                            error={errors.sort_order}
                                            placeholder="0"
                                        />
                                        <InputError
                                            message={errors.sort_order}
                                        />
                                    </div>
                                </div>

                                {/* Highlight Checkbox */}
                                <div className="flex items-center">
                                    <input
                                        id="highlight"
                                        type="checkbox"
                                        checked={data.highlight}
                                        onChange={(e) =>
                                            setData(
                                                "highlight",
                                                e.target.checked
                                            )
                                        }
                                        className="rounded border-neutral-300 text-primary-600 shadow-sm focus:ring-primary-500"
                                    />
                                    <label
                                        htmlFor="highlight"
                                        className="ml-3 text-sm font-medium text-neutral-700 dark:text-neutral-300"
                                    >
                                        Feature this project
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Featured Image dengan aspect ratio 16:9 */}
                        <div>
                            <InputLabel
                                htmlFor="featured_image"
                                value="Featured Image"
                            />
                            <div className="space-y-4">
                                <div className="flex flex-col lg:flex-row gap-6 items-start">
                                    {/* Preview Area dengan aspect ratio 16:9 */}
                                    <div className="flex-shrink-0">
                                        <div className="relative">
                                            <div
                                                className={`w-80 h-45 rounded-lg border-2 border-dashed border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 flex items-center justify-center cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors overflow-hidden ${
                                                    processing
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : ""
                                                }`}
                                                onClick={triggerFileInput}
                                                style={{ aspectRatio: "16/9" }}
                                            >
                                                {processing ? (
                                                    <div className="text-center">
                                                        <svg
                                                            className="animate-spin h-8 w-8 text-neutral-400 mx-auto"
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
                                                        <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                                            Processing...
                                                        </span>
                                                    </div>
                                                ) : previewUrl ? (
                                                    <>
                                                        <img
                                                            src={previewUrl}
                                                            alt="Featured image preview"
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                // Fallback jika gambar gagal load
                                                                e.target.style.display =
                                                                    "none";
                                                                const fallback =
                                                                    e.target.parentNode.querySelector(
                                                                        ".image-fallback"
                                                                    );
                                                                if (fallback) {
                                                                    fallback.style.display =
                                                                        "flex";
                                                                }
                                                            }}
                                                        />
                                                        <div className="image-fallback hidden w-full h-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-col">
                                                            <FiImage className="w-12 h-12 text-primary-600 dark:text-primary-400 mb-2" />
                                                            <span className="text-sm text-primary-600 dark:text-primary-400">
                                                                Image Preview
                                                            </span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeUploadedImage();
                                                            }}
                                                            className="absolute top-2 right-2 bg-error-500 text-white rounded-full p-1 hover:bg-error-600 transition-colors"
                                                            disabled={
                                                                processing
                                                            }
                                                        >
                                                            <FiX className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="text-center p-4">
                                                        <FiCamera className="w-12 h-12 text-neutral-400 mx-auto mb-2" />
                                                        <span className="text-sm text-neutral-500 dark:text-neutral-400 block">
                                                            Upload Featured
                                                            Image
                                                        </span>
                                                        <span className="text-xs text-neutral-400 dark:text-neutral-500 block mt-1">
                                                            Recommended: 16:9
                                                            aspect ratio
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Upload Info */}
                                    <div className="flex-1 space-y-3">
                                        <div>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                                                {hasFeaturedImage ||
                                                hasNewFeaturedImage
                                                    ? "Change featured image (max 5MB)"
                                                    : "Upload a featured image (max 5MB)"}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    type="button"
                                                    onClick={triggerFileInput}
                                                    className="inline-flex items-center px-4 py-2 bg-neutral-100 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-md font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-neutral-800 text-sm"
                                                    disabled={processing}
                                                >
                                                    <FiCamera className="w-4 h-4 mr-2" />
                                                    {hasFeaturedImage ||
                                                    hasNewFeaturedImage
                                                        ? "Change Image"
                                                        : "Select Image"}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Image Guidelines */}
                                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                                            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                                                Image Guidelines
                                            </h4>
                                            <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                                                <li>
                                                    • Recommended aspect ratio:
                                                    16:9
                                                </li>
                                                <li>
                                                    • Optimal resolution:
                                                    1920×1080px
                                                </li>
                                                <li>
                                                    • Maximum file size: 5MB
                                                </li>
                                                <li>
                                                    • Supported formats: JPG,
                                                    PNG, WebP
                                                </li>
                                            </ul>
                                        </div>

                                        {/* Show current image info if exists */}
                                        {hasFeaturedImage &&
                                            !hasNewFeaturedImage && (
                                                <div className="text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-700 rounded p-2">
                                                    Current image:{" "}
                                                    {portfolio.featured_image}
                                                </div>
                                            )}
                                    </div>
                                </div>

                                {/* Hidden file input */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    id="featured_image"
                                    name="featured_image"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <InputError message={errors.featured_image} />

                                {/* Remove image checkbox */}
                                {hasFeaturedImage && !hasNewFeaturedImage && (
                                    <div className="flex items-center mt-2">
                                        <input
                                            id="remove_featured_image"
                                            type="checkbox"
                                            checked={data.remove_featured_image}
                                            onChange={(e) =>
                                                setData(
                                                    "remove_featured_image",
                                                    e.target.checked
                                                )
                                            }
                                            className="rounded border-neutral-300 text-primary-600 shadow-sm focus:ring-primary-500"
                                        />
                                        <label
                                            htmlFor="remove_featured_image"
                                            className="ml-2 text-sm text-neutral-600 dark:text-neutral-400"
                                        >
                                            Remove current featured image
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description Fields */}
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <InputLabel
                                    htmlFor="short_description"
                                    value="Short Description"
                                />
                                <TextInput
                                    id="short_description"
                                    type="text"
                                    value={data.short_description}
                                    onChange={(e) =>
                                        setData(
                                            "short_description",
                                            e.target.value
                                        )
                                    }
                                    error={errors.short_description}
                                    placeholder="Brief description (max 500 characters)"
                                    maxLength={500}
                                />
                                <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                                    {data.short_description.length}/500
                                    characters
                                </div>
                                <InputError
                                    message={errors.short_description}
                                />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="description"
                                    value="Full Description"
                                    required
                                />
                                <TextArea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    error={errors.description}
                                    placeholder="Detailed description of the project..."
                                    rows={6}
                                />
                                <InputError message={errors.description} />
                            </div>
                        </div>

                        {/* Technologies Section */}
                        <div>
                            <InputLabel value="Technologies Used" />
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <TextInput
                                        type="text"
                                        value={techInput}
                                        onChange={(e) =>
                                            setTechInput(e.target.value)
                                        }
                                        onKeyPress={handleTechKeyPress}
                                        placeholder="Add a technology (e.g., React, Laravel)"
                                        className="flex-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={addTechnology}
                                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500"
                                    >
                                        <FiPlus className="w-4 h-4 mr-1" />
                                        Add
                                    </button>
                                </div>

                                {/* Technologies List */}
                                <div className="flex flex-wrap gap-2">
                                    {data.technologies.map((tech, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300"
                                        >
                                            <FiCode className="w-3 h-3 mr-1" />
                                            {tech}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeTechnology(tech)
                                                }
                                                className="ml-1 hover:text-primary-900 dark:hover:text-primary-100"
                                            >
                                                <FiX className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <InputError message={errors.technologies} />
                        </div>

                        {/* Features Section */}
                        <div>
                            <InputLabel value="Key Features" />
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <TextInput
                                        type="text"
                                        value={featureInput}
                                        onChange={(e) =>
                                            setFeatureInput(e.target.value)
                                        }
                                        onKeyPress={handleFeatureKeyPress}
                                        placeholder="Add a key feature"
                                        className="flex-1"
                                    />
                                    <button
                                        type="button"
                                        onClick={addFeature}
                                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500"
                                    >
                                        <FiPlus className="w-4 h-4 mr-1" />
                                        Add
                                    </button>
                                </div>

                                {/* Features List */}
                                <div className="flex flex-wrap gap-2">
                                    {data.features.map((feature, index) => (
                                        <span
                                            key={index}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300"
                                        >
                                            <FiList className="w-3 h-3 mr-1" />
                                            {feature}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeFeature(feature)
                                                }
                                                className="ml-1 hover:text-success-900 dark:hover:text-success-100"
                                            >
                                                <FiX className="w-3 h-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <InputError message={errors.features} />
                        </div>

                        {/* Form Actions */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                            <Link
                                href={route("admin.portfolios.index")}
                                className="inline-flex items-center justify-center px-6 py-3 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-700 transition-colors duration-200 font-medium"
                            >
                                Cancel
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
                                        Updating...
                                    </>
                                ) : (
                                    "Update Portfolio"
                                )}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
