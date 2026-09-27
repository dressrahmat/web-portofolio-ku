import { Link } from "@inertiajs/react";
import { FiArrowRight } from "react-icons/fi";
import Section from "@/Components/Front/Section";
import PortfolioCard from "@/Components/Front/PortfolioCard";

export default function PortfolioSection({ portfolios = [], total = 0 }) {
    if (!portfolios.length) return null;

    return (
        <Section id="karya" eyebrow="Portofolio" title="Karya pilihan" subtitle="Beberapa proyek yang pernah saya kerjakan beserta hasil yang dicapai." tinted>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolios.map((p, i) => (
                    <PortfolioCard key={p.id} item={p} index={i} />
                ))}
            </div>
            {total > portfolios.length && (
                <div className="mt-12 text-center">
                    <Link
                        href={route("portfolio.index")}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-700 font-medium text-sm hover:bg-white dark:hover:bg-gray-900 transition"
                    >
                        Lihat semua {total} karya <FiArrowRight />
                    </Link>
                </div>
            )}
        </Section>
    );
}
