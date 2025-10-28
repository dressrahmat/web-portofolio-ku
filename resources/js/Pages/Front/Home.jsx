// Home.jsx - Diperbarui
import { motion } from "framer-motion";
import MainLayout from "@/Layouts/MainLayout";
import HeroSection from "@/Pages/Front/HomeSections/HeroSection";
import AboutSection from "@/Pages/Front/HomeSections/AboutSection";
import PortfolioSection from "@/Pages/Front/HomeSections/PortfolioSection";
import ArticlesSection from "@/Pages/Front/HomeSections/ArticlesSection";
import ContactSection from "@/Pages/Front/HomeSections/ContactSection";

export default function Home({
    settings,
    metaTags,
    canLogin,
    canRegister,
    laravelVersion,
    phpVersion,
}) {
    return (
        <>
            <title>{metaTags.title} - Product Designer</title>
            <meta name="description" content={metaTags.description} />
            <meta name="keywords" content={metaTags.keywords} />
            <meta name="author" content={metaTags.author} />
            {metaTags.og_image && (
                <meta property="og:image" content={metaTags.og_image} />
            )}

            <MainLayout settings={settings}>
                <HeroSection settings={settings} />
                <AboutSection settings={settings} />
                <PortfolioSection settings={settings} />
                <ArticlesSection settings={settings} />
                <ContactSection settings={settings} />
            </MainLayout>
        </>
    );
}
