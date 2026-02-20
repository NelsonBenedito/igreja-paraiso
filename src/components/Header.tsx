'use client';
import React, { useState, useEffect } from 'react';
import { Menu, X, Leaf } from 'lucide-react';
import { NAV_ITEMS } from '../constants';

import { motion, AnimatePresence } from 'framer-motion';
import SlideInButton from './animations/SlideInButton';
import SwapButton from './animations/SwapButton';
import { usePathname } from 'next/navigation';


import { User } from '@supabase/supabase-js';

const Header: React.FC<{ user?: User | null }> = ({ user }) => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (pathname === '/login' || pathname?.startsWith('/membros')) return null;

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white shadow-xl py-2 md:py-4' : 'bg-transparent py-4 md:py-8'}`}>
            <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
                <a 
                    href="/" 
                    className={`flex items-center gap-3 group shrink-0 transition-all duration-700 ${scrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    <div className="flex items-center justify-center transition-all duration-500">
                        <img
                            src={scrolled ? "/IgrejaParaiso.webp" : "/LogoParaisoW.svg"}
                            alt="Logo"
                            className="h-12 md:h-16 w-auto object-contain transition-all duration-500"
                        />
                    </div>
                </a>

                <nav className="hidden xl:flex items-center gap-4">
                    {NAV_ITEMS.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className={`text-[12px] font-bold uppercase tracking-widest transition-all hover:text-paraiso-green relative group ${scrolled ? 'text-paraiso-blue' : 'text-white'}`}
                        >
                            {item.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-paraiso-green transition-all group-hover:w-full"></span>
                        </a>
                    ))}
                </nav>
                <div className="flex items-center gap-4 ml-4">
                    {user ? (
                        <SwapButton
                            href="/membros"
                            text="Meu Painel"
                            className="bg-paraiso-green"
                        />
                    ) : (
                        <SwapButton
                            href="/login"
                            text="Membros"
                        />
                    )}
                </div>
                <button className="xl:hidden p-2" onClick={() => setIsOpen(true)}>
                    <Menu className={scrolled ? 'text-paraiso-blue' : 'text-white'} size={24} />
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 bg-white z-[60] flex flex-col p-4 md:p-8"
                    >
                        <div className="flex justify-between items-center mb-8 md:mb-12">
                            <div className="flex items-center gap-2">
                                <img src="/IgrejaParaiso.webp" alt="Logo" className="w-8 h-8 md:w-12 md:h-12 object-contain" />
                                <span className="font-black text-paraiso-blue text-xl md:text-2xl uppercase">PARAÍSO</span>
                            </div>
                            <button onClick={() => setIsOpen(false)}><X size={32} className="text-paraiso-blue" /></button>
                        </div>
                        <div className="flex flex-col gap-4 md:gap-6">
                            {NAV_ITEMS.map((item) => (
                                <a key={item.label} href={item.href} onClick={() => setIsOpen(false)} className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-paraiso-blue hover:text-paraiso-green transition-colors">
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
