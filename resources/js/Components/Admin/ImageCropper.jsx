import { useCallback, useEffect, useMemo, useState } from "react";
import Cropper from "react-easy-crop";
import {
    FiMinus,
    FiPlus,
    FiRefreshCw,
    FiRotateCcw,
    FiRotateCw,
    FiX,
} from "react-icons/fi";

/**
 * Editor foto: crop, zoom (perbesar/perkecil), putar, dan ubah ukuran hasil.
 * Semua proses dilakukan di browser, jadi yang diunggah ke server hanya hasil akhirnya
 * (file kecil & sudah pas dengan tampilan website).
 *
 * Props:
 * - src        : File atau URL gambar yang akan diedit
 * - aspects    : [{ label, value }] pilihan rasio (value = lebar/tinggi, null = bebas)
 * - sizes      : [lebar px] pilihan lebar hasil
 * - round      : tampilkan area crop berbentuk lingkaran (hanya panduan visual)
 * - onCancel() / onDone(File)
 */
export default function ImageCropper({
    src,
    aspects = [{ label: "Bebas", value: null }],
    sizes = [800, 1200],
    defaultSize,
    round = false,
    fileName = "foto",
    title = "Atur Foto",
    onCancel,
    onDone,
}) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [aspect, setAspect] = useState(aspects[0].value);
    const [width, setWidth] = useState(defaultSize || sizes[0]);
    const [area, setArea] = useState(null);
    const [natural, setNatural] = useState(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);

    const url = useMemo(
        () => (src instanceof File ? URL.createObjectURL(src) : src),
        [src],
    );
    useEffect(
        () => () => src instanceof File && URL.revokeObjectURL(url),
        [src, url],
    );

    // Rasio "bebas" memakai rasio asli gambar
    const effectiveAspect =
        aspect ?? (natural ? natural.width / natural.height : 4 / 3);
    const outHeight = area
        ? Math.round(width * (area.height / area.width))
        : null;

    const onCropComplete = useCallback((_, pixels) => setArea(pixels), []);

    const reset = () => {
        setCrop({ x: 0, y: 0 });
        setZoom(1);
        setRotation(0);
    };

    // Esc untuk batal
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onCancel();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onCancel]);

    const save = async () => {
        if (!area) return;
        setBusy(true);
        setError(null);
        try {
            const blob = await renderCrop(url, area, rotation, width);
            const ext = blob.type === "image/webp" ? "webp" : "jpg";
            onDone(new File([blob], `${fileName}.${ext}`, { type: blob.type }));
        } catch (e) {
            setError("Gagal memproses gambar. Coba pilih file lain.");
        } finally {
            setBusy(false);
        }
    };

    const chip = (active) =>
        `px-3 py-1.5 rounded-full text-xs font-medium transition ${
            active
                ? "bg-primary-600 text-white"
                : "bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200"
        }`;

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
        >
            <div
                className="absolute inset-0 bg-neutral-900/70"
                onClick={onCancel}
            />
            <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-700">
                    <h2 className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {title}
                    </h2>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="p-1.5 rounded-md text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        aria-label="Tutup"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Area crop */}
                <div className="relative h-[52vh] min-h-[280px] bg-neutral-900">
                    <Cropper
                        image={url}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={effectiveAspect}
                        minZoom={1}
                        maxZoom={5}
                        zoomSpeed={0.2}
                        cropShape={round ? "round" : "rect"}
                        showGrid
                        restrictPosition
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onRotationChange={setRotation}
                        onCropComplete={onCropComplete}
                        onMediaLoaded={(m) =>
                            setNatural({
                                width: m.naturalWidth,
                                height: m.naturalHeight,
                            })
                        }
                    />
                </div>

                <div className="px-5 py-4 space-y-4 overflow-y-auto">
                    {/* Zoom */}
                    <div className="flex items-center gap-3">
                        <span className="w-16 text-xs font-medium text-neutral-500">
                            Zoom
                        </span>
                        <button
                            type="button"
                            onClick={() =>
                                setZoom((z) =>
                                    Math.max(1, +(z - 0.1).toFixed(2)),
                                )
                            }
                            className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
                            aria-label="Perkecil"
                        >
                            <FiMinus />
                        </button>
                        <input
                            type="range"
                            min={1}
                            max={5}
                            step={0.01}
                            value={zoom}
                            onChange={(e) => setZoom(+e.target.value)}
                            className="flex-1 accent-primary-600"
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setZoom((z) =>
                                    Math.min(5, +(z + 0.1).toFixed(2)),
                                )
                            }
                            className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
                            aria-label="Perbesar"
                        >
                            <FiPlus />
                        </button>
                        <span className="w-12 text-right text-xs tabular-nums text-neutral-500">
                            {Math.round(zoom * 100)}%
                        </span>
                    </div>

                    {/* Putar */}
                    <div className="flex items-center gap-3">
                        <span className="w-16 text-xs font-medium text-neutral-500">
                            Putar
                        </span>
                        <button
                            type="button"
                            onClick={() => setRotation((r) => r - 90)}
                            className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
                            aria-label="Putar kiri 90°"
                        >
                            <FiRotateCcw />
                        </button>
                        <input
                            type="range"
                            min={-180}
                            max={180}
                            step={1}
                            value={rotation}
                            onChange={(e) => setRotation(+e.target.value)}
                            className="flex-1 accent-primary-600"
                        />
                        <button
                            type="button"
                            onClick={() => setRotation((r) => r + 90)}
                            className="p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
                            aria-label="Putar kanan 90°"
                        >
                            <FiRotateCw />
                        </button>
                        <span className="w-12 text-right text-xs tabular-nums text-neutral-500">
                            {rotation}°
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                        {aspects.length > 1 && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-neutral-500">
                                    Rasio
                                </span>
                                {aspects.map((a) => (
                                    <button
                                        type="button"
                                        key={a.label}
                                        className={chip(aspect === a.value)}
                                        onClick={() => setAspect(a.value)}
                                    >
                                        {a.label}
                                    </button>
                                ))}
                            </div>
                        )}
                        {sizes.length > 1 && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-neutral-500">
                                    Ukuran hasil
                                </span>
                                {sizes.map((s) => (
                                    <button
                                        type="button"
                                        key={s}
                                        className={chip(width === s)}
                                        onClick={() => setWidth(s)}
                                    >
                                        {s}px
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <p className="text-xs text-neutral-500">
                        Geser gambar untuk mengatur posisi, scroll/cubit untuk
                        zoom.
                        {outHeight && (
                            <>
                                {" "}
                                Hasil:{" "}
                                <strong className="text-neutral-700 dark:text-neutral-300">
                                    {width} × {outHeight}px
                                </strong>
                            </>
                        )}
                    </p>
                    {error && <p className="text-xs text-error-600">{error}</p>}
                </div>

                <div className="flex items-center justify-between gap-2 px-5 py-3.5 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/40">
                    <button
                        type="button"
                        onClick={reset}
                        className="inline-flex items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-300 hover:text-primary-600"
                    >
                        <FiRefreshCw className="w-4 h-4" /> Reset
                    </button>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 rounded-lg text-sm font-medium border border-neutral-300 dark:border-neutral-600 hover:bg-white dark:hover:bg-neutral-700"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={save}
                            disabled={busy || !area}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-60"
                        >
                            {busy ? "Memproses..." : "Pakai Foto Ini"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */

const loadImage = (src) =>
    new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });

const rad = (deg) => (deg * Math.PI) / 180;

/**
 * Potong gambar sesuai area (dalam piksel gambar asli, setelah rotasi),
 * lalu ubah ukurannya menjadi `outWidth` px dengan rasio area tersebut.
 */
async function renderCrop(src, area, rotation, outWidth) {
    const image = await loadImage(src);

    // 1. Gambar versi yang sudah diputar ke kanvas sementara
    const r = rad(rotation);
    const bw =
        Math.abs(Math.cos(r) * image.width) +
        Math.abs(Math.sin(r) * image.height);
    const bh =
        Math.abs(Math.sin(r) * image.width) +
        Math.abs(Math.cos(r) * image.height);

    const rotated = document.createElement("canvas");
    rotated.width = Math.round(bw);
    rotated.height = Math.round(bh);
    const rctx = rotated.getContext("2d");
    rctx.translate(bw / 2, bh / 2);
    rctx.rotate(r);
    rctx.drawImage(image, -image.width / 2, -image.height / 2);

    // 2. Potong area & skalakan ke ukuran hasil (tidak memperbesar melebihi resolusi asli terlalu jauh)
    const outW = Math.round(outWidth);
    const outH = Math.round(outWidth * (area.height / area.width));

    const out = document.createElement("canvas");
    out.width = outW;
    out.height = outH;
    const ctx = out.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.fillStyle = "#ffffff"; // latar putih untuk PNG transparan
    ctx.fillRect(0, 0, outW, outH);
    ctx.drawImage(
        rotated,
        area.x,
        area.y,
        area.width,
        area.height,
        0,
        0,
        outW,
        outH,
    );

    // 3. Simpan sebagai WebP (fallback JPEG bila browser tidak mendukung)
    const toBlob = (type, q) => new Promise((res) => out.toBlob(res, type, q));
    let blob = await toBlob("image/webp", 0.9);
    if (!blob || blob.type !== "image/webp")
        blob = await toBlob("image/jpeg", 0.9);
    if (!blob) throw new Error("toBlob gagal");
    return blob;
}
