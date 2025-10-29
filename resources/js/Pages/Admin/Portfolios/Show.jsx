import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import DangerButton from "@/Components/DangerButton";
import ConfirmationModal from "@/Components/ConfirmationModal";
import { useToast } from "@/Contexts/ToastContext";
import {
    FiFolder,
    FiGlobe,
    FiGithub,
    FiCalendar,
    FiTag,
    FiCode,
    FiList,
    FiImage,
    FiEdit,
    FiTrash2,
    FiArrowLeft,
    FiStar,
    FiEye,
    FiEyeOff,
} from "react-icons/fi";

export default function ShowPortfolio({ portfolio }) {
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        portfolioId: null,
        portfolioTitle: "",
    });
    const { success, error } = useToast();

    const openDeleteModal = () => {
        setDeleteModal({
            isOpen: true,
            portfolioId: portfolio.id,
            portfolioTitle: portfolio.title,
        });
    };

    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            portfolioId: null,
            portfolioTitle: "",
        });
    };

    const handleDelete = () => {
        if (deleteModal.portfolioId) {
            router.delete(
                route("admin.portfolios.destroy", deleteModal.portfolioId),
                {
                    onSuccess: () => {
                        success("Portfolio deleted successfully!");
                        closeDeleteModal();
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
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            published: { color: "success", label: "Published", icon: FiEye },
            draft: { color: "warning", label: "Draft", icon: FiEyeOff },
            archived: { color: "error", label: "Archived", icon: FiEyeOff },
        };

        const config = statusConfig[status] || statusConfig.draft;
        const Icon = config.icon;

        return (
            <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${config.color}-100 text-${config.color}-800 dark:bg-${config.color}-900/30 dark:text-${config.color}-300`}
            >
                <Icon className="w-3 h-3 mr-1" />
                {config.label}
            </span>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <AdminLayout title="Portfolio Details">
            <Head title="Portfolio Details" />

            {/* Confirmation Modal for delete */}
            <ConfirmationModal
                isOpen={deleteModal.isOpen}
                onClose={closeDeleteModal}
                onConfirm={handleDelete}
                title="Confirm Delete"
                message={`Are you sure you want to delete portfolio "${deleteModal.portfolioTitle}"? This action cannot be undone.`}
                confirmText="Delete Portfolio"
                cancelText="Cancel"
            />

            <div className="mx-auto px-1 lg:px-4 lg:pt-2">
                <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl shadow-card overflow-hidden">
                    {/* Header dengan gradient dan tombol action */}
                    <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-5 text-white flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <h2 className="text-2xl font-bold">
                                Portfolio Details
                            </h2>
                            <p className="text-primary-100 opacity-90 mt-1">
                                Detailed information about the portfolio project
                            </p>
                        </div>

                        {/* Tombol Action di Kanan Atas (Desktop Only) */}
                        <div className="hidden md:flex items-center space-x-3">
                            {/* Tombol Back to List */}
                            <Link
                                href={route("admin.portfolios.index")}
                                className="inline-flex items-center justify-center px-4 py-2 bg-neutral-50/20 hover:bg-neutral-50/30 border border-neutral-50/30 rounded-lg text-white shadow-sm transition-all duration-200"
                            >
                                <FiArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Link>

                            {/* Tombol Edit Portfolio */}
                            <Link
                                href={route(
                                    "admin.portfolios.edit",
                                    portfolio.id
                                )}
                            >
                                <PrimaryButton className="flex items-center px-4 py-2">
                                    <FiEdit className="w-4 h-4 mr-2" />
                                    Edit
                                </PrimaryButton>
                            </Link>

                            {/* Tombol Delete Portfolio */}
                            <DangerButton
                                onClick={openDeleteModal}
                                className="flex items-center px-4 py-2"
                            >
                                <FiTrash2 className="w-4 h-4 mr-2" />
                                Delete
                            </DangerButton>
                        </div>
                    </div>

                    <div className="p-4 md:p-8">
                        <div className="flex flex-col md:flex-row gap-6 mb-8">
                            {/* Featured Image */}
                            <div className="flex-shrink-0">
                                <div className="relative">
                                    {portfolio.featured_image_url ? (
                                        <img
                                            src={portfolio.featured_image_url}
                                            alt={portfolio.title}
                                            className="w-32 h-32 rounded-xl object-cover border-4 border-neutral-50 dark:border-neutral-700 shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white border-4 border-neutral-50 dark:border-neutral-700 shadow-lg">
                                            <FiFolder className="w-12 h-12" />
                                        </div>
                                    )}
                                    {portfolio.highlight && (
                                        <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1.5 border-2 border-neutral-50 dark:border-neutral-800">
                                            <FiStar className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Informasi Portfolio */}
                            <div className="flex-grow">
                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
                                        {portfolio.title}
                                    </h1>
                                    {portfolio.highlight && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                                            <FiStar className="w-3 h-3 mr-1" />
                                            Featured
                                        </span>
                                    )}
                                    {getStatusBadge(portfolio.status)}
                                </div>

                                <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-4">
                                    {portfolio.short_description ||
                                        portfolio.description?.substring(
                                            0,
                                            100
                                        )}
                                    ...
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                                        <FiTag className="w-3 h-3 mr-1" />
                                        {portfolio.category}
                                    </span>
                                    {portfolio.client_name && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300">
                                            <FiFolder className="w-3 h-3 mr-1" />
                                            {portfolio.client_name}
                                        </span>
                                    )}
                                    {portfolio.project_date && (
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300">
                                            <FiCalendar className="w-3 h-3 mr-1" />
                                            {formatDate(portfolio.project_date)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left Column - Project Details */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Project Description */}
                                <div className="bg-neutral-50 dark:bg-neutral-700/50 p-6 rounded-xl">
                                    <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-4 flex items-center">
                                        <FiFolder className="w-5 h-5 mr-2 text-primary-500" />
                                        Project Description
                                    </h3>
                                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                                        {portfolio.description}
                                    </p>
                                </div>

                                {/* Technologies Used */}
                                {portfolio.technologies &&
                                    portfolio.technologies.length > 0 && (
                                        <div className="bg-neutral-50 dark:bg-neutral-700/50 p-6 rounded-xl">
                                            <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-4 flex items-center">
                                                <FiCode className="w-5 h-5 mr-2 text-primary-500" />
                                                Technologies Used
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {portfolio.technologies.map(
                                                    (tech, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300"
                                                        >
                                                            <FiCode className="w-3 h-3 mr-2" />
                                                            {tech.technology}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {/* Key Features */}
                                {portfolio.features &&
                                    portfolio.features.length > 0 && (
                                        <div className="bg-neutral-50 dark:bg-neutral-700/50 p-6 rounded-xl">
                                            <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-4 flex items-center">
                                                <FiList className="w-5 h-5 mr-2 text-primary-500" />
                                                Key Features
                                            </h3>
                                            <div className="space-y-3">
                                                {portfolio.features.map(
                                                    (feature, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-start"
                                                        >
                                                            <div className="flex-shrink-0 w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3"></div>
                                                            <div>
                                                                <p className="font-medium text-neutral-900 dark:text-white">
                                                                    {
                                                                        feature.feature
                                                                    }
                                                                </p>
                                                                {feature.description && (
                                                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                                                        {
                                                                            feature.description
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                            </div>

                            {/* Right Column - Project Metadata */}
                            <div className="space-y-6">
                                {/* Project Links */}
                                <div className="bg-neutral-50 dark:bg-neutral-700/50 p-6 rounded-xl">
                                    <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-4 flex items-center">
                                        <FiGlobe className="w-5 h-5 mr-2 text-primary-500" />
                                        Project Links
                                    </h3>
                                    <div className="space-y-3">
                                        {portfolio.project_url && (
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                                    Live Project
                                                </label>
                                                <a
                                                    href={portfolio.project_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline break-all"
                                                >
                                                    <FiGlobe className="w-4 h-4 mr-1" />
                                                    Visit Website
                                                </a>
                                            </div>
                                        )}
                                        {portfolio.github_url && (
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                                    Source Code
                                                </label>
                                                <a
                                                    href={portfolio.github_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline break-all"
                                                >
                                                    <FiGithub className="w-4 h-4 mr-1" />
                                                    View on GitHub
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Project Information */}
                                <div className="bg-neutral-50 dark:bg-neutral-700/50 p-6 rounded-xl">
                                    <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-4 flex items-center">
                                        <FiFolder className="w-5 h-5 mr-2 text-primary-500" />
                                        Project Information
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                                Project ID
                                            </label>
                                            <p className="text-lg font-medium text-neutral-900 dark:text-white">
                                                #{portfolio.id}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                                Category
                                            </label>
                                            <p className="text-lg font-medium text-neutral-900 dark:text-white">
                                                {portfolio.category}
                                            </p>
                                        </div>

                                        {portfolio.client_name && (
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                                    Client
                                                </label>
                                                <p className="text-lg font-medium text-neutral-900 dark:text-white">
                                                    {portfolio.client_name}
                                                </p>
                                            </div>
                                        )}

                                        {portfolio.project_date && (
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                                    Project Date
                                                </label>
                                                <p className="text-lg font-medium text-neutral-900 dark:text-white">
                                                    {formatDate(
                                                        portfolio.project_date
                                                    )}
                                                </p>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                                Sort Order
                                            </label>
                                            <p className="text-lg font-medium text-neutral-900 dark:text-white">
                                                {portfolio.sort_order}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Timeline Information */}
                                <div className="bg-neutral-50 dark:bg-neutral-700/50 p-6 rounded-xl">
                                    <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-4 flex items-center">
                                        <FiCalendar className="w-5 h-5 mr-2 text-primary-500" />
                                        Timeline
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                                Created
                                            </label>
                                            <p className="text-sm text-neutral-900 dark:text-white">
                                                {formatDate(
                                                    portfolio.created_at
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                                                Last Updated
                                            </label>
                                            <p className="text-sm text-neutral-900 dark:text-white">
                                                {formatDate(
                                                    portfolio.updated_at
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Project Images */}
                                {portfolio.images &&
                                    portfolio.images.length > 0 && (
                                        <div className="bg-neutral-50 dark:bg-neutral-700/50 p-6 rounded-xl">
                                            <h3 className="font-semibold text-lg text-neutral-900 dark:text-white mb-4 flex items-center">
                                                <FiImage className="w-5 h-5 mr-2 text-primary-500" />
                                                Project Images (
                                                {portfolio.images.length})
                                            </h3>
                                            <div className="grid grid-cols-2 gap-2">
                                                {portfolio.images
                                                    .slice(0, 4)
                                                    .map((image, index) => (
                                                        <div
                                                            key={index}
                                                            className="relative"
                                                        >
                                                            <img
                                                                src={
                                                                    image.image_url
                                                                }
                                                                alt={
                                                                    image.caption ||
                                                                    `Project image ${
                                                                        index +
                                                                        1
                                                                    }`
                                                                }
                                                                className="w-full h-20 object-cover rounded-lg"
                                                            />
                                                            {image.is_primary && (
                                                                <div className="absolute top-1 right-1 bg-primary-500 text-white rounded-full p-1">
                                                                    <FiStar className="w-2 h-2" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                {portfolio.images.length >
                                                    4 && (
                                                    <div className="bg-neutral-200 dark:bg-neutral-600 rounded-lg flex items-center justify-center text-neutral-500 dark:text-neutral-400 text-sm">
                                                        +
                                                        {portfolio.images
                                                            .length - 4}{" "}
                                                        more
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                            </div>
                        </div>

                        {/* Tombol Action untuk mobile - di bagian bawah */}
                        <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700 flex flex-col space-y-3 md:hidden">
                            <Link
                                href={route(
                                    "admin.portfolios.edit",
                                    portfolio.id
                                )}
                                className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-xl text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                            >
                                <FiEdit className="w-5 h-5 mr-2" />
                                Edit Portfolio
                            </Link>

                            <DangerButton
                                onClick={openDeleteModal}
                                className="inline-flex items-center justify-center w-full px-6 py-3"
                            >
                                <FiTrash2 className="w-5 h-5 mr-2" />
                                Delete Portfolio
                            </DangerButton>

                            <Link
                                href={route("admin.portfolios.index")}
                                className="inline-flex items-center justify-center w-full px-6 py-3 bg-neutral-50 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded-xl text-neutral-700 dark:text-neutral-300 shadow-sm hover:bg-neutral-100 dark:hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200"
                            >
                                <FiArrowLeft className="w-5 h-5 mr-2" />
                                Back to List
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
