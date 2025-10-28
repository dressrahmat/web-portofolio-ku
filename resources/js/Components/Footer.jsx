// Footer.jsx - Diperbarui
export default function Footer() {
    return (
        <footer className="py-12 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 max-w-6xl mx-auto px-4">
            <p>© {new Date().getFullYear()} Nama Anda. All rights reserved.</p>
            <div className="mt-4 flex justify-center space-x-6">
                <a href="#" className="hover:text-gray-800 dark:hover:text-gray-200 transition-colors">Twitter</a>
                <a href="#" className="hover:text-gray-800 dark:hover:text-gray-200 transition-colors">LinkedIn</a>
                <a href="#" className="hover:text-gray-800 dark:hover:text-gray-200 transition-colors">Instagram</a>
                <a href="#" className="hover:text-gray-800 dark:hover:text-gray-200 transition-colors">GitHub</a>
            </div>
        </footer>
    );
}