// MainLayout.jsx - Diperbarui
import { motion } from "framer-motion";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";

export default function MainLayout({ children, settings }) {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200 font-sans">
            <Header settings={settings} />
            <main className="relative">{children}</main>
            <Footer settings={settings} />
        </div>
    );
}
