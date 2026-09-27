import { useCallback, useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiMaximize2, FiX } from "react-icons/fi";

/**
 * Galeri gambar proyek: gambar besar + thumbnail + mode layar penuh.
 */
export default function Gallery({ images = [], title }) {
    const [index, setIndex] = useState(0);
    const [zoom, setZoom] = useState(false);
    const count = images.length;

    const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
    const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

    useEffect(() => {
        if (!zoom) return;
        const onKey = (e) => {
            if (e.key === "Escape") setZoom(false);
            if (e.key === "ArrowRight") next();
            if (e.key === "ArrowLeft") prev();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [zoom, next, prev]);

    if (!count) return null;
    const current = images[index];

    return (
        <div>
            <div className="relative group aspect-video rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                <img src={current.url} alt={current.caption || `${title} ${index + 1}`} className="w-full h-full object-contain" />
                <button onClick={() => setZoom(true)} className="absolute top-3 right-3 p-2 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition" aria-label="Perbesar">
                    <FiMaximize2 />
                </button>
                {count > 1 && (
                    <>
                        <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white" aria-label="Sebelumnya">
                            <FiChevronLeft />
                        </button>
                        <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white" aria-label="Berikutnya">
                            <FiChevronRight />
                        </button>
                        <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/50 text-white text-xs">
                            {index + 1} / {count}
                        </span>
                    </>
                )}
            </div>
            {current.caption && <p className="mt-2 text-sm text-center text-gray-500">{current.caption}</p>}

            {count > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {images.map((img, i) => (
                        <button
                            key={img.url + i}
                            onClick={() => setIndex(i)}
                            className={`shrink-0 w-24 aspect-video rounded-lg overflow-hidden border-2 transition ${
                                i === index ? "border-blue-500" : "border-transparent opacity-60 hover:opacity-100"
                            }`}
                        >
                            <img src={img.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                        </button>
                    ))}
                </div>
            )}

            {zoom && (
                <div className="fixed inset-0 z-[70] bg-black/90 flex items-center justify-center p-4" onClick={() => setZoom(false)}>
                    <img src={current.url} alt="" className="max-w-full max-h-full object-contain" onClick={(e) => e.stopPropagation()} />
                    <button className="absolute top-4 right-4 p-2 text-white" aria-label="Tutup">
                        <FiX className="w-6 h-6" />
                    </button>
                </div>
            )}
        </div>
    );
}
