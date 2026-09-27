import { Head } from "@inertiajs/react";

export default function Maintenance({ message }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 px-6">
            <Head title="Sedang dalam perbaikan" />
            <div className="text-center max-w-md">
                <div className="text-5xl">🛠️</div>
                <h1 className="mt-6 text-2xl font-semibold">Sedang dalam perbaikan</h1>
                <p className="mt-3 text-gray-600 dark:text-gray-400">
                    {message || "Website sedang diperbarui. Silakan kembali beberapa saat lagi."}
                </p>
            </div>
        </div>
    );
}
