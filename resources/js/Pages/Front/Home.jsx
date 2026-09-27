import { usePage } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import HeroSection from "./HomeSections/HeroSection";
import AboutSection from "./HomeSections/AboutSection";
import ServicesSection from "./HomeSections/ServicesSection";
import ExperienceSection from "./HomeSections/ExperienceSection";
import SkillsSection from "./HomeSections/SkillsSection";
import PortfolioSection from "./HomeSections/PortfolioSection";
import TestimonialsSection from "./HomeSections/TestimonialsSection";
import ArticlesSection from "./HomeSections/ArticlesSection";
import ContactSection from "./HomeSections/ContactSection";

/**
 * Beranda: seluruh isi diambil dari panel admin.
 * Section yang datanya kosong otomatis disembunyikan.
 */
export default function Home({
    meta,
    services,
    experiences,
    educations,
    skills,
    featuredSkills,
    achievements,
    testimonials,
    portfolios,
    portfolioCount,
    articles,
}) {
    const { profile = {} } = usePage().props;

    return (
        <MainLayout meta={meta}>
            <HeroSection profile={profile} featuredSkills={featuredSkills} />
            <AboutSection profile={profile} />
            <ServicesSection services={services} />
            <PortfolioSection portfolios={portfolios} total={portfolioCount} />
            <ExperienceSection experiences={experiences} educations={educations} achievements={achievements} />
            <SkillsSection skills={skills} />
            <TestimonialsSection testimonials={testimonials} />
            <ArticlesSection articles={articles} />
            <ContactSection profile={profile} />
        </MainLayout>
    );
}
