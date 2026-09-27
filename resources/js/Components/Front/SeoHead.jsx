import { Head } from "@inertiajs/react";

/**
 * Meta tag SEO & Open Graph. Data `meta` disiapkan oleh BerandaController::meta().
 */
export default function SeoHead({ meta = {} }) {
    return (
        <Head>
            <title>{meta.title || ""}</title>
            {meta.description && <meta head-key="description" name="description" content={meta.description} />}
            {meta.keywords && <meta head-key="keywords" name="keywords" content={meta.keywords} />}
            {meta.author && <meta head-key="author" name="author" content={meta.author} />}
            {meta.url && <link head-key="canonical" rel="canonical" href={meta.url} />}
            <meta head-key="og:type" property="og:type" content={meta.type || "website"} />
            <meta head-key="og:title" property="og:title" content={meta.title || ""} />
            {meta.description && <meta head-key="og:description" property="og:description" content={meta.description} />}
            {meta.url && <meta head-key="og:url" property="og:url" content={meta.url} />}
            {meta.image && <meta head-key="og:image" property="og:image" content={meta.image} />}
            <meta head-key="twitter:card" name="twitter:card" content={meta.image ? "summary_large_image" : "summary"} />
        </Head>
    );
}
