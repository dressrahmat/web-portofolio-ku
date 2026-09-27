import { Link } from "@inertiajs/react";
import { FiArrowRight } from "react-icons/fi";
import Section from "@/Components/Front/Section";
import ArticleCard from "@/Components/Front/ArticleCard";

export default function ArticlesSection({ articles = [] }) {
    if (!articles.length) return null;

    return (
        <Section id="blog" eyebrow="Blog" title="Tulisan terbaru" tinted>
            <div className="grid md:grid-cols-3 gap-6">
                {articles.map((a, i) => (
                    <ArticleCard key={a.id} article={a} index={i} />
                ))}
            </div>
            <div className="mt-10 text-center">
                <Link href={route("blog.index")} className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
                    Baca semua tulisan <FiArrowRight />
                </Link>
            </div>
        </Section>
    );
}
