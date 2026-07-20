'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

/**
 * Botão flutuante "Voltar ao Topo".
 * - Fixo no canto inferior direito.
 * - Só aparece após o scroll inicial (> 400px).
 * - Some nas áreas internas (/membros, /admin, /login) onde o BottomNav ocupa a base.
 */
const SCROLL_THRESHOLD = 400;

const BackToTop: React.FC = () => {
    const pathname = usePathname();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => setVisible(window.scrollY > SCROLL_THRESHOLD);
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const hiddenRoute =
        pathname === '/login' ||
        pathname?.startsWith('/membros') ||
        pathname?.startsWith('/admin');

    if (hiddenRoute) return null;

    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    aria-label="Voltar ao topo"
                    title="Voltar ao topo"
                    initial={{ opacity: 0, scale: 0.6, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.6, y: 12 }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-paraiso-green text-white shadow-xl shadow-paraiso-green/25 ring-1 ring-white/20 transition-colors hover:bg-paraiso-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-paraiso-green focus-visible:ring-offset-2 md:bottom-8 md:right-8 md:h-14 md:w-14"
                >
                    <ArrowUp className="h-5 w-5 md:h-6 md:w-6" strokeWidth={2.5} />
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default BackToTop;
