import React, {
    useRef,
    useState,
    useEffect,
    useMemo,
    useCallback,
} from "react";

const QuillEditor = ({
    name,
    value = "",
    onChange,
    error,
    label,
    height = 400,
    placeholder = "Tulis konten di sini...",
}) => {
    const [isMounted, setIsMounted] = useState(false);
    const [ReactQuill, setReactQuill] = useState(null);
    const [internalValue, setInternalValue] = useState(value);
    const quillRef = useRef(null);

    useEffect(() => {
        setIsMounted(true);

        if (typeof window !== "undefined") {
            import("react-quill").then((module) => {
                import("react-quill/dist/quill.snow.css");
                setReactQuill(() => module.default);
            });
        }

        return () => {
            setIsMounted(false);
        };
    }, []);

    // Memoize modules untuk mencegah re-render yang tidak perlu
    const modules = useMemo(
        () => ({
            toolbar: {
                container: [
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ color: [] }, { background: [] }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ indent: "-1" }, { indent: "+1" }],
                    [{ align: [] }],
                    ["blockquote", "code-block"],
                    ["link", "image"],
                    ["clean"],
                ],
                handlers: {
                    image: function () {
                        const quill = quillRef.current?.getEditor();
                        if (!quill) return;

                        handleImageUpload()
                            .then((imageUrl) => {
                                const range = quill.getSelection();
                                quill.insertEmbed(
                                    range.index,
                                    "image",
                                    imageUrl
                                );
                            })
                            .catch((error) => {
                                console.error("Image upload failed:", error);
                                alert(error);
                            });
                    },
                },
            },
            clipboard: {
                matchVisual: false,
            },
        }),
        []
    );

    const formats = useMemo(
        () => [
            "header",
            "bold",
            "italic",
            "underline",
            "strike",
            "color",
            "background",
            "list",
            "bullet",
            "indent",
            "align",
            "blockquote",
            "code-block",
            "link",
            "image",
        ],
        []
    );

    // Handle image upload dengan useCallback
    const handleImageUpload = useCallback(() => {
        return new Promise((resolve, reject) => {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");

            input.onchange = async () => {
                const file = input.files[0];
                if (!file) {
                    reject("No file selected");
                    return;
                }

                // Validasi
                if (file.size > 2 * 1024 * 1024) {
                    reject("Ukuran gambar maksimal 2MB");
                    return;
                }

                const validTypes = [
                    "image/jpeg",
                    "image/png",
                    "image/gif",
                    "image/webp",
                ];
                if (!validTypes.includes(file.type)) {
                    reject("Format gambar harus JPG, PNG, GIF, atau WEBP");
                    return;
                }

                const formData = new FormData();
                formData.append("file", file);

                // Tambahkan CSRF token ke FormData
                const csrfToken = document.querySelector(
                    'meta[name="csrf-token"]'
                )?.content;
                if (csrfToken) {
                    formData.append("_token", csrfToken);
                }

                try {
                    const response = await fetch(route("admin.upload.image"), {
                        method: "POST",
                        body: formData,
                        headers: {
                            Accept: "application/json",
                            "X-Requested-With": "XMLHttpRequest",
                        },
                    });

                    if (!response.ok) {
                        const errorData = await response
                            .json()
                            .catch(() => ({}));
                        throw new Error(errorData.message || "Upload failed");
                    }

                    const data = await response.json();

                    let imageUrl = data.location || data.url;
                    if (imageUrl && !imageUrl.startsWith("http")) {
                        imageUrl =
                            window.location.origin +
                            (imageUrl.startsWith("/") ? "" : "/") +
                            imageUrl;
                    }

                    resolve(imageUrl);
                } catch (error) {
                    console.error("Upload error:", error);
                    reject(error.message || "Gagal mengupload gambar");
                }
            };

            input.click();
        });
    }, []);

    // Synchronize external value with internal state
    useEffect(() => {
        if (value !== internalValue) {
            setInternalValue(value);
        }
    }, [value]);

    // Handle change dengan debounce effect
    const handleChange = useCallback(
        (content, delta, source, editor) => {
            if (source === "user") {
                setInternalValue(content);
                if (onChange) {
                    onChange(content);
                }
            }
        },
        [onChange]
    );

    // Memoize editor container styles
    const editorContainerStyle = useMemo(
        () => ({
            height: `${height + 42}px`,
            minHeight: `${height + 42}px`,
        }),
        [height]
    );

    const editorStyle = useMemo(
        () => ({
            height: `${height}px`,
            border: "none",
        }),
        [height]
    );

    // Loading state
    if (!isMounted || !ReactQuill) {
        return (
            <div className="mb-4">
                {label && (
                    <label className="block text-neutral-700 dark:text-neutral-300 text-sm font-medium mb-2">
                        {label}
                        {error && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}
                <div
                    className={`bg-white dark:bg-neutral-800 rounded-lg border ${
                        error
                            ? "border-red-500"
                            : "border-neutral-300 dark:border-neutral-600"
                    }`}
                    style={editorContainerStyle}
                >
                    <div className="h-full p-4">
                        <p className="text-neutral-500 dark:text-neutral-400">
                            Loading editor...
                        </p>
                        <textarea
                            name={name}
                            value={value}
                            onChange={(e) =>
                                onChange && onChange(e.target.value)
                            }
                            placeholder={placeholder}
                            className="w-full h-64 mt-2 p-2 border rounded dark:bg-neutral-700 dark:border-neutral-600"
                            rows="10"
                        />
                    </div>
                </div>
                {error && (
                    <p className="text-red-500 text-xs mt-1 dark:text-red-400">
                        {error}
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="mb-4">
            {label && (
                <label className="block text-neutral-700 dark:text-neutral-300 text-sm font-medium mb-2">
                    {label}
                    {error && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <div
                className={`bg-white dark:bg-neutral-800 rounded-lg border ${
                    error
                        ? "border-red-500"
                        : "border-neutral-300 dark:border-neutral-600"
                }`}
                style={editorContainerStyle}
            >
                <ReactQuill
                    ref={quillRef}
                    key={`quill-${name}`} // Unique key untuk mencegah masalah fokus
                    theme="snow"
                    value={internalValue}
                    onChange={handleChange}
                    modules={modules}
                    formats={formats}
                    placeholder={placeholder}
                    style={editorStyle}
                    className="h-full quill-editor-custom"
                />
            </div>

            {error && (
                <p className="text-red-500 text-xs mt-1 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
};

// Optimize dengan React.memo untuk mencegah re-render yang tidak perlu
export default React.memo(QuillEditor);
