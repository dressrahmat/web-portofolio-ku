/**
 * Komponen UI kecil yang dipakai berulang di halaman admin CMS.
 */
export const inputClass =
    "block w-full rounded-lg border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-sm shadow-sm focus:border-primary-500 focus:ring-primary-500 placeholder:text-neutral-400";

export function PageHeader({ title, description, actions }) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
            <div>
                <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                    {title}
                </h1>
                {description && (
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 max-w-2xl">
                        {description}
                    </p>
                )}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
    );
}

export function Card({ children, className = "", title, description, actions }) {
    return (
        <section
            className={`bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm ${className}`}
        >
            {(title || actions) && (
                <div className="flex items-start justify-between gap-4 px-5 pt-5">
                    <div>
                        {title && (
                            <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                                {description}
                            </p>
                        )}
                    </div>
                    {actions}
                </div>
            )}
            <div className="p-5">{children}</div>
        </section>
    );
}

export function Button({ variant = "primary", className = "", children, ...props }) {
    const variants = {
        primary:
            "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 disabled:opacity-60",
        secondary:
            "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700",
        danger: "bg-error-600 text-white hover:bg-error-700",
        ghost: "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700",
    };
    return (
        <button
            type="button"
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export function IconButton({ title, className = "", children, ...props }) {
    return (
        <button
            type="button"
            title={title}
            aria-label={title}
            className={`p-2 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-700 disabled:opacity-30 disabled:pointer-events-none transition-colors ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

export function Badge({ children, color = "neutral" }) {
    const colors = {
        neutral: "bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200",
        primary: "bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-200",
        success: "bg-success-100 text-success-700 dark:bg-success-900/40 dark:text-success-300",
        warning: "bg-warning-100 text-warning-800 dark:bg-warning-900/40 dark:text-warning-300",
        error: "bg-error-100 text-error-700 dark:bg-error-900/40 dark:text-error-300",
    };
    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}>
            {children}
        </span>
    );
}

export function Field({ label, htmlFor, error, help, required, children, className = "" }) {
    return (
        <div className={className}>
            {label && (
                <label
                    htmlFor={htmlFor}
                    className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
                >
                    {label}
                    {required && <span className="text-error-500 ml-0.5">*</span>}
                </label>
            )}
            {children}
            {help && !error && (
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{help}</p>
            )}
            {error && <p className="mt-1 text-xs text-error-600">{error}</p>}
        </div>
    );
}

export function EmptyState({ title, description, action }) {
    return (
        <div className="text-center py-14 px-6 border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-xl">
            <p className="font-medium text-neutral-800 dark:text-neutral-200">{title}</p>
            {description && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-md mx-auto">
                    {description}
                </p>
            )}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}

/**
 * Panel geser dari kanan untuk form tambah/edit.
 */
export function SlideOver({ open, onClose, title, children, footer }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-neutral-900/50" onClick={onClose} />
            <div className="relative w-full max-w-xl h-full bg-white dark:bg-neutral-800 shadow-2xl flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{title}</h2>
                    <IconButton title="Tutup" onClick={onClose}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </IconButton>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
                {footer && (
                    <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/40">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
