import { useMemo, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import QuillEditor from "@/Components/QuillEditor";
import ImageCropper from "@/Components/Admin/ImageCropper";
import useFlashToast from "@/Components/Admin/useFlashToast";
import {
    Button,
    Card,
    Field,
    PageHeader,
    inputClass,
} from "@/Components/Admin/ui";
import {
    FiCrop,
    FiDownload,
    FiExternalLink,
    FiFileText,
    FiPlus,
    FiTrash2,
    FiUpload,
    FiX,
} from "react-icons/fi";

/**
 * Profil publik: identitas, bio, kontak, foto, file CV, tag hero, dan statistik.
 */
export default function Profile({ profile }) {
    useFlashToast();

    const form = useForm({
        full_name: profile.full_name ?? "",
        nickname: profile.nickname ?? "",
        headline: profile.headline ?? "",
        tagline: profile.tagline ?? "",
        short_bio: profile.short_bio ?? "",
        about: profile.about ?? "",
        location: profile.location ?? "",
        email: profile.email ?? "",
        phone: profile.phone ?? "",
        whatsapp: profile.whatsapp ?? "",
        website: profile.website ?? "",
        github_url: profile.github_url ?? "",
        linkedin_url: profile.linkedin_url ?? "",
        instagram_url: profile.instagram_url ?? "",
        youtube_url: profile.youtube_url ?? "",
        tiktok_url: profile.tiktok_url ?? "",
        open_to_work: !!profile.open_to_work,
        availability_text: profile.availability_text ?? "",
        hero_tags: profile.hero_tags ?? [],
        stats: profile.stats ?? [],
        photo: null,
        remove_photo: false,
        cv_file: null,
        remove_cv_file: false,
    });
    const { data, setData, errors, processing } = form;

    const [tagInput, setTagInput] = useState("");
    // Sumber asli foto (file mentah / URL foto lama) untuk dibuka di editor crop
    const [photoSource, setPhotoSource] = useState(null);
    const [cropping, setCropping] = useState(false);
    const photoPreview = useMemo(
        () =>
            data.photo instanceof File ? URL.createObjectURL(data.photo) : null,
        [data.photo],
    );
    const shownPhoto =
        photoPreview || (!data.remove_photo ? profile.photo_url : null);
    const hasCv =
        data.cv_file instanceof File ||
        (profile.cv_file && !data.remove_cv_file);

    const submit = (e) => {
        e.preventDefault();
        form.transform((d) => ({ ...d, _method: "put" }));
        form.post(route("admin.cv.profile.update"), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setPhotoSource(null);
                setData((d) => ({
                    ...d,
                    photo: null,
                    cv_file: null,
                    remove_photo: false,
                    remove_cv_file: false,
                }));
            },
        });
    };

    const addTag = () => {
        const t = tagInput.trim();
        if (t && !data.hero_tags.includes(t))
            setData("hero_tags", [...data.hero_tags, t]);
        setTagInput("");
    };

    const setStat = (i, key, value) =>
        setData(
            "stats",
            data.stats.map((s, idx) =>
                idx === i ? { ...s, [key]: value } : s,
            ),
        );

    const text = (name, label, props = {}) => (
        <Field
            label={label}
            htmlFor={name}
            error={errors[name]}
            help={props.help}
            required={props.required}
        >
            <input
                id={name}
                type={props.type || "text"}
                value={data[name]}
                placeholder={props.placeholder}
                onChange={(e) => setData(name, e.target.value)}
                className={inputClass}
            />
        </Field>
    );

    return (
        <AdminLayout title="Profil & Kontak">
            <Head title="Profil & Kontak" />

            <form
                onSubmit={submit}
                className="max-w-6xl mx-auto px-2 lg:px-6 py-4"
            >
                <PageHeader
                    title="Profil & Kontak"
                    description="Informasi utama yang tampil di hero, bagian Tentang, footer, dan halaman CV."
                    actions={
                        <>
                            <a
                                href={route("cv")}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Button variant="secondary">
                                    <FiExternalLink /> Lihat CV
                                </Button>
                            </a>
                            <Button type="submit" disabled={processing}>
                                {processing ? "Menyimpan..." : "Simpan Profil"}
                            </Button>
                        </>
                    }
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Kolom kiri */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card
                            title="Identitas"
                            description="Nama dan posisi yang ingin Anda tonjolkan."
                        >
                            <div className="grid sm:grid-cols-2 gap-4">
                                {text("full_name", "Nama lengkap", {
                                    required: true,
                                })}
                                {text("nickname", "Nama panggilan", {
                                    placeholder: "Dedy",
                                })}
                                <div className="sm:col-span-2">
                                    {text("headline", "Headline / profesi", {
                                        placeholder:
                                            "Web Developer & Digital Marketing",
                                        help: "Tampil sebagai judul besar di hero dan di bawah nama pada CV.",
                                    })}
                                </div>
                                <div className="sm:col-span-2">
                                    <Field
                                        label="Tagline"
                                        htmlFor="tagline"
                                        error={errors.tagline}
                                        help="1–2 kalimat nilai yang Anda tawarkan."
                                    >
                                        <textarea
                                            id="tagline"
                                            rows={2}
                                            value={data.tagline}
                                            onChange={(e) =>
                                                setData(
                                                    "tagline",
                                                    e.target.value,
                                                )
                                            }
                                            className={inputClass}
                                        />
                                    </Field>
                                </div>
                                {text("location", "Lokasi", {
                                    placeholder: "Malang, Jawa Timur",
                                })}
                                {text(
                                    "availability_text",
                                    "Status ketersediaan",
                                    {
                                        placeholder:
                                            "Terbuka untuk proyek freelance",
                                    },
                                )}
                                <label className="sm:col-span-2 inline-flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                                    <input
                                        type="checkbox"
                                        checked={data.open_to_work}
                                        onChange={(e) =>
                                            setData(
                                                "open_to_work",
                                                e.target.checked,
                                            )
                                        }
                                        className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    Tampilkan lencana "tersedia" di website
                                </label>
                            </div>
                        </Card>

                        <Card title="Tentang Saya">
                            <div className="space-y-4">
                                <Field
                                    label="Ringkasan profesional"
                                    htmlFor="short_bio"
                                    error={errors.short_bio}
                                    help="3–4 kalimat. Dipakai sebagai ringkasan di halaman CV dan meta deskripsi."
                                >
                                    <textarea
                                        id="short_bio"
                                        rows={4}
                                        value={data.short_bio}
                                        onChange={(e) =>
                                            setData("short_bio", e.target.value)
                                        }
                                        className={inputClass}
                                    />
                                </Field>
                                <QuillEditor
                                    name="about"
                                    label="Cerita lengkap (bagian Tentang di beranda)"
                                    value={data.about}
                                    onChange={(v) => setData("about", v)}
                                    error={errors.about}
                                    height={260}
                                    placeholder="Ceritakan latar belakang, cara kerja, dan apa yang membuat Anda berbeda..."
                                />
                            </div>
                        </Card>

                        <Card
                            title="Kontak & Sosial Media"
                            description="Kosongkan yang tidak ingin ditampilkan."
                        >
                            <div className="grid sm:grid-cols-2 gap-4">
                                {text("email", "Email", { type: "email" })}
                                {text("whatsapp", "WhatsApp", {
                                    placeholder: "6281234567890",
                                    help: "Format internasional tanpa +. Tombol 'Hubungi' akan membuka WhatsApp.",
                                })}
                                {text("phone", "Telepon (opsional)")}
                                {text("website", "Website", {
                                    type: "url",
                                    placeholder: "https://",
                                })}
                                {text("linkedin_url", "LinkedIn", {
                                    type: "url",
                                    placeholder: "https://linkedin.com/in/...",
                                })}
                                {text("github_url", "GitHub", {
                                    type: "url",
                                    placeholder: "https://github.com/...",
                                })}
                                {text("instagram_url", "Instagram", {
                                    type: "url",
                                })}
                                {text("youtube_url", "YouTube", {
                                    type: "url",
                                })}
                                {text("tiktok_url", "TikTok", { type: "url" })}
                            </div>
                        </Card>
                    </div>

                    {/* Kolom kanan */}
                    <div className="space-y-6">
                        <Card title="Foto Profil">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-40 h-48 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
                                    {shownPhoto ? (
                                        <img
                                            src={shownPhoto}
                                            alt="Foto profil"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-sm text-neutral-400">
                                            Belum ada foto
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-wrap justify-center gap-2">
                                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-primary-50 text-primary-700 hover:bg-primary-100 cursor-pointer">
                                        <FiUpload className="w-4 h-4" />{" "}
                                        {shownPhoto
                                            ? "Ganti foto"
                                            : "Pilih foto"}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                e.target.value = "";
                                                if (!file) return;
                                                if (
                                                    !file.type.startsWith(
                                                        "image/",
                                                    )
                                                )
                                                    return;
                                                setPhotoSource(file);
                                                setCropping(true);
                                            }}
                                        />
                                    </label>
                                    {shownPhoto && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPhotoSource(
                                                    (src) =>
                                                        src ||
                                                        profile.photo_url,
                                                );
                                                setCropping(true);
                                            }}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                                        >
                                            <FiCrop className="w-4 h-4" /> Atur
                                            crop
                                        </button>
                                    )}
                                </div>
                                {shownPhoto && (
                                    <button
                                        type="button"
                                        className="text-xs text-error-600 hover:underline"
                                        onClick={() => {
                                            setPhotoSource(null);
                                            setData((d) => ({
                                                ...d,
                                                photo: null,
                                                remove_photo: true,
                                            }));
                                        }}
                                    >
                                        Hapus foto
                                    </button>
                                )}
                                {data.photo instanceof File && (
                                    <p className="text-xs text-warning-700">
                                        Foto baru belum disimpan — klik "Simpan
                                        Profil".
                                    </p>
                                )}
                                {errors.photo && (
                                    <p className="text-xs text-error-600">
                                        {errors.photo}
                                    </p>
                                )}
                                <p className="text-xs text-neutral-500 text-center">
                                    Foto bisa di-crop, diperbesar/diperkecil,
                                    dan diputar sebelum disimpan. Hasil otomatis
                                    dikompres.
                                </p>
                            </div>
                        </Card>

                        <Card
                            title="File CV (PDF)"
                            description="Muncul sebagai tombol 'Unduh CV'. Jika kosong, pengunjung tetap bisa mencetak halaman /cv."
                        >
                            {hasCv ? (
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-700">
                                    <FiFileText className="w-6 h-6 text-error-500 shrink-0" />
                                    <div className="flex-1 min-w-0 text-sm">
                                        <p className="truncate font-medium">
                                            {data.cv_file instanceof File
                                                ? data.cv_file.name
                                                : "CV terunggah"}
                                        </p>
                                        {profile.cv_url &&
                                            !(data.cv_file instanceof File) && (
                                                <a
                                                    href={profile.cv_url}
                                                    className="text-primary-600 text-xs inline-flex items-center gap-1 hover:underline"
                                                >
                                                    <FiDownload /> Unduh
                                                </a>
                                            )}
                                    </div>
                                    <button
                                        type="button"
                                        title="Hapus file CV"
                                        className="p-1.5 text-neutral-400 hover:text-error-600"
                                        onClick={() =>
                                            setData((d) => ({
                                                ...d,
                                                cv_file: null,
                                                remove_cv_file: true,
                                            }))
                                        }
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            ) : null}
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) =>
                                    setData((d) => ({
                                        ...d,
                                        cv_file: e.target.files[0] || null,
                                        remove_cv_file: false,
                                    }))
                                }
                                className="mt-3 text-sm w-full file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-primary-50 file:text-primary-700"
                            />
                            {errors.cv_file && (
                                <p className="mt-1 text-xs text-error-600">
                                    {errors.cv_file}
                                </p>
                            )}
                        </Card>

                        <Card
                            title="Tag Hero"
                            description="Kata kunci keahlian yang tampil di hero."
                        >
                            <div className="flex flex-wrap gap-2 mb-3">
                                {data.hero_tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center gap-1 pl-2.5 pr-1 py-1 rounded-full bg-primary-50 dark:bg-primary-900/40 text-primary-700 dark:text-primary-200 text-xs"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setData(
                                                    "hero_tags",
                                                    data.hero_tags.filter(
                                                        (t) => t !== tag,
                                                    ),
                                                )
                                            }
                                            className="p-0.5 hover:text-error-600"
                                            aria-label={`Hapus ${tag}`}
                                        >
                                            <FiX className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    value={tagInput}
                                    onChange={(e) =>
                                        setTagInput(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            addTag();
                                        }
                                    }}
                                    placeholder="Ketik lalu Enter"
                                    className={inputClass}
                                />
                                <Button variant="secondary" onClick={addTag}>
                                    <FiPlus />
                                </Button>
                            </div>
                        </Card>

                        <Card
                            title="Angka Sorotan"
                            description="Maks 6. Mis. 3+ / Tahun / Pengalaman coding."
                        >
                            <div className="space-y-3">
                                {data.stats.map((stat, i) => (
                                    <div
                                        key={i}
                                        className="grid grid-cols-[4rem_1fr_auto] gap-2 items-start"
                                    >
                                        <input
                                            value={stat.value}
                                            onChange={(e) =>
                                                setStat(
                                                    i,
                                                    "value",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="3+"
                                            className={inputClass}
                                        />
                                        <div className="space-y-1.5">
                                            <input
                                                value={stat.label}
                                                onChange={(e) =>
                                                    setStat(
                                                        i,
                                                        "label",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Tahun"
                                                className={inputClass}
                                            />
                                            <input
                                                value={stat.caption}
                                                onChange={(e) =>
                                                    setStat(
                                                        i,
                                                        "caption",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Keterangan"
                                                className={`${inputClass} text-xs`}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            className="p-2 text-neutral-400 hover:text-error-600"
                                            onClick={() =>
                                                setData(
                                                    "stats",
                                                    data.stats.filter(
                                                        (_, idx) => idx !== i,
                                                    ),
                                                )
                                            }
                                            aria-label="Hapus"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                ))}
                                {data.stats.length < 6 && (
                                    <Button
                                        variant="secondary"
                                        className="w-full"
                                        onClick={() =>
                                            setData("stats", [
                                                ...data.stats,
                                                {
                                                    value: "",
                                                    label: "",
                                                    caption: "",
                                                },
                                            ])
                                        }
                                    >
                                        <FiPlus /> Tambah angka
                                    </Button>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <Button type="submit" disabled={processing}>
                        {processing ? "Menyimpan..." : "Simpan Profil"}
                    </Button>
                </div>
            </form>

            {cropping && photoSource && (
                <ImageCropper
                    src={photoSource}
                    title="Atur Foto Profil"
                    aspects={[
                        { label: "Potret 4:5 (beranda)", value: 4 / 5 },
                        { label: "Persegi 1:1", value: 1 },
                    ]}
                    sizes={[600, 800, 1200]}
                    defaultSize={800}
                    fileName="foto-profil"
                    onCancel={() => setCropping(false)}
                    onDone={(file) => {
                        setData((d) => ({
                            ...d,
                            photo: file,
                            remove_photo: false,
                        }));
                        setCropping(false);
                    }}
                />
            )}
        </AdminLayout>
    );
}
