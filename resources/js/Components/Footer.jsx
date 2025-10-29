// Footer.jsx - Diperbarui
export default function Footer({ settings }) {
    return (
        <footer className="py-12 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 max-w-6xl mx-auto px-4">
            <p>
                © {new Date().getFullYear()}{" "}
                {settings?.site_name || "Nama Website"}. All rights reserved.
            </p>
            <div className="mt-4 flex justify-center space-x-6">
                {settings?.twitter_url && (
                    <a
                        href={settings.twitter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                        Twitter
                    </a>
                )}
                {settings?.linkedin_url && (
                    <a
                        href={settings.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                        LinkedIn
                    </a>
                )}
                {settings?.instagram_url && (
                    <a
                        href={settings.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                        Instagram
                    </a>
                )}
                {settings?.facebook_url && (
                    <a
                        href={settings.facebook_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                        Facebook
                    </a>
                )}
            </div>
        </footer>
    );
}
