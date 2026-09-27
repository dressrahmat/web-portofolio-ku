import { useMemo, useState } from "react";
import { Field, inputClass } from "./ui";

/**
 * Merender satu input form berdasarkan definisi field dari backend (CvResourceController::fields()).
 */
export default function SchemaField({ field, data, setData, error, existingUrl }) {
    const id = `f_${field.name}`;
    const value = data[field.name];
    const set = (v) => setData(field.name, v);

    if (field.hideWhen && data[field.hideWhen]) {
        return null;
    }

    const wrapperClass = field.col === "half" ? "sm:col-span-1" : "sm:col-span-2";

    switch (field.type) {
        case "checkbox":
            return (
                <div className={wrapperClass}>
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                        <input
                            id={id}
                            type="checkbox"
                            checked={!!value}
                            onChange={(e) => set(e.target.checked)}
                            className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">{field.label}</span>
                    </label>
                    {error && <p className="mt-1 text-xs text-error-600">{error}</p>}
                </div>
            );

        case "textarea":
            return (
                <Field className={wrapperClass} label={field.label} htmlFor={id} error={error} help={field.help} required={field.required}>
                    <textarea
                        id={id}
                        rows={field.rows || 4}
                        value={value ?? ""}
                        placeholder={field.placeholder}
                        onChange={(e) => set(e.target.value)}
                        className={inputClass}
                    />
                </Field>
            );

        case "select":
            return (
                <Field className={wrapperClass} label={field.label} htmlFor={id} error={error} help={field.help} required={field.required}>
                    <select id={id} value={value ?? ""} onChange={(e) => set(e.target.value)} className={inputClass}>
                        {!field.required && <option value="">— Pilih —</option>}
                        {Object.entries(field.options || {}).map(([k, label]) => (
                            <option key={k} value={k}>
                                {label}
                            </option>
                        ))}
                    </select>
                </Field>
            );

        case "range":
            return (
                <Field className={wrapperClass} label={`${field.label}: ${value ?? 0}%`} htmlFor={id} error={error} help={field.help}>
                    <input
                        id={id}
                        type="range"
                        min={0}
                        max={100}
                        step={5}
                        value={value ?? 0}
                        onChange={(e) => set(parseInt(e.target.value, 10))}
                        className="w-full accent-primary-600"
                    />
                </Field>
            );

        case "list":
            return <ListField field={field} id={id} value={value} set={set} error={error} className={wrapperClass} />;

        case "image":
            return (
                <ImageField
                    field={field}
                    id={id}
                    data={data}
                    setData={setData}
                    error={error}
                    existingUrl={existingUrl}
                    className={wrapperClass}
                />
            );

        default: {
            const typeMap = { email: "email", url: "url", number: "number", date: "date", year: "text" };
            const listId = field.suggestions ? `${id}_list` : undefined;
            return (
                <Field className={wrapperClass} label={field.label} htmlFor={id} error={error} help={field.help} required={field.required}>
                    <input
                        id={id}
                        type={typeMap[field.type] || "text"}
                        value={value ?? ""}
                        placeholder={field.placeholder}
                        onChange={(e) => set(e.target.value)}
                        className={inputClass}
                        list={listId}
                    />
                    {field.suggestions && (
                        <datalist id={listId}>
                            {field.suggestions.map((s) => (
                                <option key={s} value={s} />
                            ))}
                        </datalist>
                    )}
                </Field>
            );
        }
    }
}

/**
 * Daftar teks sederhana (satu item per baris) yang disimpan sebagai array.
 * Form di-remount (lewat `key`) setiap kali item yang diedit berganti.
 */
function ListField({ field, id, value, set, error, className }) {
    const [text, setText] = useState((value || []).join("\n"));


    return (
        <Field className={className} label={field.label} htmlFor={id} error={error} help={field.help || "Satu poin per baris."}>
            <textarea
                id={id}
                rows={Math.max(3, Math.min(8, text.split("\n").length + 1))}
                value={text}
                onChange={(e) => {
                    setText(e.target.value);
                    set(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean));
                }}
                className={`${inputClass} font-mono text-[13px]`}
            />
        </Field>
    );
}

function ImageField({ field, id, data, setData, error, existingUrl, className }) {
    const file = data[field.name];
    const removed = !!data[`remove_${field.name}`];
    const preview = useMemo(() => (file instanceof File ? URL.createObjectURL(file) : null), [file]);
    const shown = preview || (!removed ? existingUrl : null);

    return (
        <Field className={className} label={field.label} htmlFor={id} error={error} help={field.help || "JPG/PNG/WebP, maks 3 MB."}>
            <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg bg-neutral-100 dark:bg-neutral-700 overflow-hidden flex items-center justify-center border border-neutral-200 dark:border-neutral-600 shrink-0">
                    {shown ? (
                        <img src={shown} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-[11px] text-neutral-400">Tidak ada</span>
                    )}
                </div>
                <div className="flex flex-col gap-2 text-sm">
                    <input
                        id={id}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            setData((d) => ({ ...d, [field.name]: e.target.files[0] || null, [`remove_${field.name}`]: false }));
                        }}
                        className="text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                    {shown && (
                        <button
                            type="button"
                            className="self-start text-error-600 hover:underline text-xs"
                            onClick={() => setData((d) => ({ ...d, [field.name]: null, [`remove_${field.name}`]: true }))}
                        >
                            Hapus gambar
                        </button>
                    )}
                </div>
            </div>
        </Field>
    );
}
