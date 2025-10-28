// Home.jsx - Diperbarui
import { motion } from 'framer-motion';
import MainLayout from '@/Layouts/MainLayout';
import HeroSection from '@/Pages/Front/HomeSections/HeroSection';
import AboutSection from '@/Pages/Front/HomeSections/AboutSection';
import PortfolioSection from '@/Pages/Front/HomeSections/PortfolioSection';
import ArticlesSection from '@/Pages/Front/HomeSections/ArticlesSection';
import ContactSection from '@/Pages/Front/HomeSections/ContactSection';

export default function Home() {
    return (
        <>
            <title>Nama Anda - Product Designer</title>
            <MainLayout>
                <HeroSection />
                <AboutSection />
                <PortfolioSection />
                <ArticlesSection />
                <ContactSection />
            </MainLayout>
        </>
    );
}