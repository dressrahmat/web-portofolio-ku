import { useMemo, useState } from "react";
import { Head, router, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import ConfirmationModal from "@/Components/ConfirmationModal";
import SchemaField from "@/Components/Admin/SchemaField";
import useFlashToast from "@/Components/Admin/useFlashToast";
import {
    Badge,
    Button,
    Card,
    EmptyState,
    IconButton,
    PageHeader,
    SlideOver,
    inputClass,
} from "@/Components/Admin/ui";
import {
    FiArrowDown,
    FiArrowUp,
    FiEdit2,
    FiEye,
    FiEyeOff,
    FiPlus,
    FiSearch,
    FiTrash2,
} from "react-icons/fi";

/**
 * Halaman generik untuk mengelola satu bagian CV.
 * Form & kolom dibangun otomatis dari `schema` yang dikirim controller.
 */
export default function Manage({ items, schema, filters }) {
    useFlashToast();

    const [editing, setEditing] = useState(null); // null = tertutup, {} = baru, item = edit
    const [deleting, setDeleting] = useState(null);
    const [search, setSearch] = useState(filters.search || "");

    const routeName = (action) => `admin.cv.${schema.key}.${action}`;

    // Kolom gambar kecil, kolom judul lebar, sisanya rata
    const gridCols = schema.columns
        .map((c) => (["image", "avatar"].includes(c.type) ? "3rem" : c.type === "title" ? "minmax(0,2fr)" : "minmax(0,1fr)"))
        .join(" ");

    const groups = useMemo(() => {
        if (!schema.groupBy) return [{ name: null, items }];
        const map = new Map();
        items.forEach((item) => {
            const key = item[schema.groupBy] || "Lainnya";
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(item);
        });
        return [...map.entries()].map(([name, list]) => ({ name, items: list }));
    }, [items, schema.groupBy]);

    const move = (item, direction) => {
        const ids = items.map((i) => i.id);
        const index = ids.indexOf(item.id);
        const target = index + direction;
        if (target < 0 || target >= ids.length) return;
        [ids[index], ids[target]] = [ids[target], ids[index]];
        router.post(route(routeName("reorder")), { ids }, { preserveScroll: true, preserveState: true });
    };

    const toggle = (item) =>
        router.patch(route(routeName("toggle"), item.id), {}, { preserveScroll: true });

    const confirmDelete = () => {
        router.delete(route(routeName("destroy"), deleting.id), {
            preserveScroll: true,
            onFinish: () => setDeleting(null),
        });
    };

    const doSearch = (e) => {
        e.preventDefault();
        router.get(route(routeName("index")), search ? { search } : {}, { preserveState: true, replace: true });
    };

    return (
        <AdminLayout title={schema.title}>
            <Head title={schema.title} />

            <div className="max-w-6xl mx-auto px-2 lg:px-6 py-4">
                <PageHeader
                    title={schema.title}
                    description={schema.description}
                    actions={
                        <>
                            <form onSubmit={doSearch} className="relative">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari..."
                                    className={`${inputClass} pl-9 w-48`}
                                />
                            </form>
                            <Button onClick={() => setEditing({})}>
                                <FiPlus /> Tambah {schema.singular}
                            </Button>
                        </>
                    }
                />

                {items.length === 0 ? (
                    <EmptyState
                        title={filters.search ? "Tidak ada hasil" : `Belum ada ${schema.title.toLowerCase()}`}
                        description={filters.search ? "Coba kata kunci lain." : "Tambahkan item pertama agar tampil di website dan CV Anda."}
                        action={
                            !filters.search && (
                                <Button onClick={() => setEditing({})}>
                                    <FiPlus /> Tambah {schema.singular}
                                </Button>
                            )
                        }
                    />
                ) : (
                    <div className="space-y-6">
                        {groups.map((group) => (
                            <Card key={group.name ?? "all"} className="overflow-hidden">
                                {group.name && (
                                    <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3">
                                        {group.name} <span className="font-normal">({group.items.length})</span>
                                    </h2>
                                )}
                                <ul className="divide-y divide-neutral-100 dark:divide-neutral-700 -my-2">
                                    {group.items.map((item) => {
                                        const globalIndex = items.findIndex((i) => i.id === item.id);
                                        return (
                                            <li
                                                key={item.id}
                                                className={`flex items-center gap-4 py-3 ${item.is_visible === false ? "opacity-50" : ""}`}
                                            >
                                                <div className="flex flex-col -my-1">
                                                    <IconButton title="Naikkan" className="p-1" disabled={globalIndex === 0} onClick={() => move(item, -1)}>
                                                        <FiArrowUp className="w-3.5 h-3.5" />
                                                    </IconButton>
                                                    <IconButton title="Turunkan" className="p-1" disabled={globalIndex === items.length - 1} onClick={() => move(item, 1)}>
                                                        <FiArrowDown className="w-3.5 h-3.5" />
                                                    </IconButton>
                                                </div>

                                                <div
                                                    className="flex-1 min-w-0 grid grid-cols-1 md:[grid-template-columns:var(--cols)] gap-x-6 gap-y-1 items-center"
                                                    style={{ "--cols": gridCols }}
                                                >
                                                    {schema.columns.map((col) => (
                                                        <Cell key={col.key} col={col} item={item} />
                                                    ))}
                                                </div>

                                                <div className="flex items-center shrink-0">
                                                    {"is_visible" in item && (
                                                        <IconButton title={item.is_visible ? "Sembunyikan" : "Tampilkan"} onClick={() => toggle(item)}>
                                                            {item.is_visible ? <FiEye /> : <FiEyeOff />}
                                                        </IconButton>
                                                    )}
                                                    <IconButton title="Edit" onClick={() => setEditing(item)}>
                                                        <FiEdit2 />
                                                    </IconButton>
                                                    <IconButton title="Hapus" className="hover:!text-error-600" onClick={() => setDeleting(item)}>
                                                        <FiTrash2 />
                                                    </IconButton>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </Card>
                        ))}
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Gunakan panah ↑↓ untuk mengatur urutan tampil. Ikon mata untuk menyembunyikan item tanpa menghapusnya.
                        </p>
                    </div>
                )}
            </div>

            {editing !== null && (
                <ItemForm
                    key={editing.id ?? "new"}
                    schema={schema}
                    item={editing}
                    onClose={() => setEditing(null)}
                    routeName={routeName}
                />
            )}

            <ConfirmationModal
                isOpen={!!deleting}
                onClose={() => setDeleting(null)}
                onConfirm={confirmDelete}
                title={`Hapus ${schema.singular}?`}
                message="Data yang dihapus tidak bisa dikembalikan. Jika hanya ingin menyembunyikan, gunakan ikon mata."
                confirmText="Hapus"
                cancelText="Batal"
            />
        </AdminLayout>
    );
}

function Cell({ col, item }) {
    const value = item[col.key];

    switch (col.type) {
        case "title":
            return (
                <div className="min-w-0">
                    <p className="font-medium text-neutral-900 dark:text-neutral-100 truncate">{value}</p>
                    {col.sub && item[col.sub] && (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">{item[col.sub]}</p>
                    )}
                </div>
            );
        case "badge":
            return <div>{value ? <Badge color="primary">{value}</Badge> : null}</div>;
        case "bool":
            return <div>{value ? <Badge color="success">{col.label}</Badge> : null}</div>;
        case "level":
            return (
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                        <div className="h-full bg-primary-500" style={{ width: `${value}%` }} />
                    </div>
                    <span className="text-xs text-neutral-500">{value}%</span>
                </div>
            );
        case "image":
        case "avatar":
            return value ? (
                <img src={value} alt="" className={`w-10 h-10 object-cover ${col.type === "avatar" ? "rounded-full" : "rounded-md"}`} />
            ) : (
                <div className={`w-10 h-10 bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center text-sm font-semibold text-neutral-500 ${col.type === "avatar" ? "rounded-full" : "rounded-md"}`}>
                    {(item[col.fallback] || item.title || "?").charAt(0)}
                </div>
            );
        case "excerpt":
            return <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">{value}</p>;
        default:
            return <p className="text-sm text-neutral-600 dark:text-neutral-300">{value}</p>;
    }
}

function ItemForm({ schema, item, onClose, routeName }) {
    const isEdit = !!item.id;

    const initial = useMemo(() => {
        const d = { ...schema.defaults };
        if (isEdit) {
            schema.fields.forEach((f) => {
                if (f.type === "image") {
                    d[f.name] = null;
                    d[`remove_${f.name}`] = false;
                } else if (f.type === "list") {
                    d[f.name] = item[f.name] || [];
                } else if (f.type === "checkbox") {
                    d[f.name] = !!item[f.name];
                } else {
                    d[f.name] = item[f.name] ?? "";
                }
            });
        }
        return d;
    }, [item, schema, isEdit]);

    const form = useForm(initial);

    const submit = (e) => {
        e.preventDefault();
        const options = { forceFormData: true, preserveScroll: true, onSuccess: () => onClose() };
        if (isEdit) {
            form.transform((d) => ({ ...d, _method: "put" }));
            form.post(route(routeName("update"), item.id), options);
        } else {
            form.post(route(routeName("store")), options);
        }
    };

    return (
        <SlideOver
            open
            onClose={onClose}
            title={isEdit ? `Edit ${schema.singular}` : `Tambah ${schema.singular}`}
            footer={
                <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={onClose}>
                        Batal
                    </Button>
                    <Button type="submit" form="cv-item-form" disabled={form.processing}>
                        {form.processing ? "Menyimpan..." : "Simpan"}
                    </Button>
                </div>
            }
        >
            <form id="cv-item-form" onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {schema.fields.map((field) => (
                    <SchemaField
                        key={field.name}
                        field={field}
                        data={form.data}
                        setData={form.setData}
                        error={form.errors[field.name] || form.errors[`${field.name}.0`]}
                        existingUrl={isEdit ? item[`${field.name}_url`] : null}
                    />
                ))}
            </form>
        </SlideOver>
    );
}
