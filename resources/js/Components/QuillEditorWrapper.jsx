import React, { useRef, useEffect, forwardRef } from "react";
import ReactQuill from "react-quill";

const QuillEditorWrapper = forwardRef((props, ref) => {
    const quillRef = useRef(null);

    useEffect(() => {
        if (ref) {
            ref.current = {
                getEditor: () => quillRef.current?.getEditor(),
                ...quillRef.current,
            };
        }
    }, [ref]);

    return <ReactQuill ref={quillRef} {...props} />;
});

QuillEditorWrapper.displayName = "QuillEditorWrapper";

export default QuillEditorWrapper;
