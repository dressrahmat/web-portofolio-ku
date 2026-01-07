import React, { useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";

const WysiwygEditor = ({
    name,
    value = "",
    onChange,
    error,
    label,
    height = 500,
    placeholder = "Tulis konten di sini...",
}) => {
    const editorRef = useRef(null);

    // Load TinyMCE dari lokal
    useEffect(() => {
        if (typeof window !== "undefined") {
            // Pastikan TinyMCE sudah diload
            if (!window.tinymce) {
                const script = document.createElement("script");
                script.src = "/js/tinymce/tinymce.min.js";
                script.async = true;
                document.head.appendChild(script);
            }
        }
    }, []);

    const handleEditorChange = (content, editor) => {
        if (onChange) {
            onChange(content);
        }
    };

    const initConfig = {
        selector: "textarea", // default untuk self-hosted
        height: height,
        menubar: true,
        plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
        ],
        toolbar: `undo redo | formatselect | bold italic backcolor | 
                  alignleft aligncenter alignright alignjustify | 
                  bullist numlist outdent indent | removeformat | help`,
        content_style: `
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; 
                font-size: 14px; 
                line-height: 1.6; 
                color: #333; 
            }
            img { max-width: 100%; height: auto; }
            table { border-collapse: collapse; width: 100%; }
            table, th, td { border: 1px solid #ddd; }
            th, td { padding: 8px; text-align: left; }
        `,
        branding: false,
        placeholder: placeholder,
        // Nonaktifkan fitur cloud
        forced_root_block: false,
        // Konfigurasi upload gambar
        images_upload_handler: async (blobInfo, progress) => {
            return new Promise((resolve, reject) => {
                const formData = new FormData();
                formData.append("file", blobInfo.blob(), blobInfo.filename());
                formData.append(
                    "_token",
                    document.querySelector('meta[name="csrf-token"]').content
                );

                fetch("/admin/upload-image", {
                    method: "POST",
                    body: formData,
                    headers: {
                        Accept: "application/json",
                    },
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.location) {
                            resolve(data.location);
                        } else {
                            reject("Invalid response");
                        }
                    })
                    .catch((error) => {
                        reject("Upload failed: " + error.message);
                    });
            });
        },
        // Setup untuk file picker
        file_picker_types: "image",
        file_picker_callback: function (cb, value, meta) {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");

            input.onchange = function () {
                const file = this.files[0];
                const reader = new FileReader();

                reader.onload = function () {
                    const id = "blobid" + new Date().getTime();
                    const blobCache =
                        window.tinymce.activeEditor.editorUpload.blobCache;
                    const base64 = reader.result.split(",")[1];
                    const blobInfo = blobCache.create(id, file, base64);
                    blobCache.add(blobInfo);
                    cb(blobInfo.blobUri(), { title: file.name });
                };
                reader.readAsDataURL(file);
            };

            input.click();
        },
    };

    return (
        <div className="mb-4">
            {label && (
                <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">
                    {label}
                </label>
            )}

            {typeof window !== "undefined" && window.tinymce ? (
                <Editor
                    init={initConfig}
                    value={value}
                    onEditorChange={handleEditorChange}
                />
            ) : (
                <div className="border border-gray-300 rounded p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-400">
                        Loading editor...
                    </p>
                    <textarea
                        name={name}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full h-64 mt-2 p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                        placeholder={placeholder}
                    />
                </div>
            )}

            {error && (
                <p className="text-red-500 text-xs mt-1 dark:text-red-400">
                    {error}
                </p>
            )}
        </div>
    );
};

export default WysiwygEditor;
