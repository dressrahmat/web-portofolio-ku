import React, { useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useForm } from "@inertiajs/react";

const WysiwygEditor = ({
    name,
    value = "",
    onChange,
    error,
    label,
    height = 500,
}) => {
    const editorRef = useRef(null);

    const handleEditorChange = (content, editor) => {
        if (onChange) {
            onChange(content);
        }
    };

    return (
        <div className="mb-4">
            {label && (
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    {label}
                </label>
            )}

            <Editor
                init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "code",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                        "help",
                        "wordcount",
                    ],
                    toolbar:
                        "undo redo | blocks | " +
                        "bold italic forecolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "removeformat | help | image media link",

                    // Konfigurasi upload gambar TANPA cloud TinyMCE
                    images_upload_handler: async (blobInfo, progress) => {
                        // Gunakan endpoint Laravel Anda sendiri
                        const formData = new FormData();
                        formData.append(
                            "file",
                            blobInfo.blob(),
                            blobInfo.filename()
                        );

                        const response = await axios.post(
                            "/api/upload-image",
                            formData
                        );
                        return response.data.location;
                    },
                }}
            />

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default WysiwygEditor;
