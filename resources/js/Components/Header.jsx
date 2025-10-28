// Header.jsx - Diperbarui
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { scrollY } = useScroll();
  
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  return (
    <>
      <motion.header 
        className={`fixed w-full top-0 z-50 transition-all duration-500 px-4 sm:px-6 ${
          isScrolled 
            ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-md py-3' 
            : 'bg-transparent py-6'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <motion.div 
            className="text-xl font-medium"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            NamaAnda
          </motion.div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <a href="#about" className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-400 transition-colors">About</a>
            <a href="#portfolio" className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Work</a>
            <a href="#articles" className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Articles</a>
            <a href="#contact" className="text-sm font-medium hover:text-gray-600 dark:hover:text-gray-400 transition-colors">Contact</a>
            <motion.a 
              href="#contact" 
              className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded text-sm font-medium hover:opacity-90 transition-opacity"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Let's talk
            </motion.a>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex flex-col space-y-1.5 z-50 group"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className={`w-6 h-0.5 bg-gray-800 dark:bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-gray-800 dark:bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`w-6 h-0.5 bg-gray-800 dark:bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </motion.header>
      
      {/* Mobile Menu */}
      <motion.div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isMobileMenuOpen ? 1 : 0 }}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <motion.nav 
          className="absolute top-0 right-0 h-full w-64 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md p-8 flex flex-col space-y-6"
          initial={{ x: 300 }}
          animate={{ x: isMobileMenuOpen ? 0 : 300 }}
          transition={{ type: "spring", damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <a href="#about" className="font-medium text-lg hover:text-gray-600 dark:hover:text-gray-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>About</a>
          <a href="#portfolio" className="font-medium text-lg hover:text-gray-600 dark:hover:text-gray-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Work</a>
          <a href="#articles" className="font-medium text-lg hover:text-gray-600 dark:hover:text-gray-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Articles</a>
          <a href="#contact" className="font-medium text-lg hover:text-gray-600 dark:hover:text-gray-400 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
          <a href="#contact" className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded text-center font-medium mt-4 hover:opacity-90 transition-opacity" onClick={() => setIsMobileMenuOpen(false)}>Let's talk</a>
        </motion.nav>
      </motion.div>
    </>
  );
}