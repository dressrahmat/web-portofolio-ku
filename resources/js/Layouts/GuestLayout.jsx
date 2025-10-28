import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0 w-full">

                {children}
        </div>
    );
}
