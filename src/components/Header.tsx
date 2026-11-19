'use client';
import React, { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { User } from '@supabase/supabase-js';
import { PillLink } from './site/Editorial';

const noopSubscribe = () => () => {};

const subscribeScroll = (onChange: () => void) => {
    window.addEventListener('scroll', onChange, { passive: true });
    return () => window.removeEventListener('scroll', onChange);
};

const ThemeToggleButton = ({
    isDark,
    mounted,
    onToggle,
    className = '',
}: {
    isDark: boolean;
    mounted: boolean;
    onToggle: () => void;
    className?: string;
}) => (
    <button
        type="button"
        onClick={onToggle}
        aria-label="Alternar tema"
        className={`relative h-11 w-11 shrink-0 rounded-full border flex items-center justify-center transition-colors duration-300 ${className}`}
    >
        {mounted && (
            <motion.div
                key={isDark ? 'moon' : 'sun'}
                initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.25 }}
            >
                {isDark
                    ? <Moon className="w-[18px] h-[18px]" strokeWidth={1.6} />
                    : <Sun className="w-[18px] h-[18px]" strokeWidth={1.6} />
                }
            </motion.div>
        )}
    </button>
);

const Header: React.FC<{ user?: User | null }> = ({ user }) => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const scrolled = useSyncExternalStore(subscribeScroll, () => window.scrollY > 50, () => false);
    const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
    const { resolvedTheme, setTheme } = useTheme();

    if (pathname === '/login' || pathname?.startsWith('/membros')) return null;

    const isDark = resolvedTheme === 'dark';

    const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

    // Só a home começa com o Hero escuro sob o cabeçalho; nas outras páginas
    // o fundo é papel, então o cabeçalho já nasce no estilo sólido.
    const solid = scrolled || pathname !== '/';

    const cta = user
        ? { href: '/membros', label: 'Meu Painel' }
        : { href: '/login', label: 'Membros' };

    return (
        <header
            className={`fixed top-0 left-0 right-0 ${isOpen ? 'z-[70]' : 'z-50'} transition-[background-color,border-color,padding] duration-500 border-b ${solid ? 'bg-paper border-hairline text-ink py-3 md:py-4' : 'bg-transparent border-transparent text-white py-4 md:py-8'}`}
        >
            <div className="mx-auto max-w-[82rem] px-5 md:px-16 flex items-center justify-between gap-6">
                <Link
                    href="/"
                    aria-label="Igreja Paraíso — início"
                    className={`flex items-center shrink-0 transition-opacity duration-700 ${solid ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                >
                    <img
                        src={solid
                            ? (mounted && isDark ? '/LogoParaisoW.svg' : '/IgrejaParaiso.webp')
                            : '/LogoParaisoW.svg'
                        }
                        alt="Logo"
                        className="h-11 w-auto object-contain"
                    />
                </Link>

                <nav aria-label="Principal" className="hidden xl:flex items-center gap-7">
                    {NAV_ITEMS.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className={`relative group text-[13px] font-medium transition-colors ${solid ? 'text-ink hover:text-detail' : 'text-white/85 hover:text-white'}`}
                        >
                            {item.label}
                            <span className="absolute -bottom-1 left-0 h-px w-0 bg-paraiso-green transition-all duration-300 group-hover:w-full" />
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <ThemeToggleButton
                        isDark={isDark}
                        mounted={mounted}
                        onToggle={toggleTheme}
                        className={`${solid ? 'border-hairline text-ink hover:border-ink/30' : 'border-white/25 text-white hover:border-white/50'}`}
                    />

                    <PillLink
                        href={cta.href}
                        variant={solid ? 'ink' : 'glass'}
                        className="hidden sm:inline-flex"
                    >
                        {cta.label}
                    </PillLink>

                    <button
                        type="button"
                        aria-label="Abrir menu"
                        aria-expanded={isOpen}
                        className={`xl:hidden h-11 w-11 rounded-full border flex items-center justify-center transition-colors ${solid ? 'border-hairline text-ink' : 'border-white/25 text-white'}`}
                        onClick={() => setIsOpen(true)}
                    >
                        <Menu size={18} strokeWidth={1.6} />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-60 flex flex-col overflow-y-auto bg-paper text-ink font-display px-5 py-4 md:px-16 md:py-8"
                    >
                        <div className="flex items-center justify-between">
                            <img
                                src={mounted && isDark ? '/LogoParaisoW.svg' : '/IgrejaParaiso.webp'}
                                alt="Logo"
                                className="h-11 w-auto object-contain"
                            />
                            <button
                                type="button"
                                aria-label="Fechar menu"
                                className="h-11 w-11 rounded-full border border-hairline flex items-center justify-center text-ink hover:border-ink/30 transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                <X size={18} strokeWidth={1.6} />
                            </button>
                        </div>

                        <nav aria-label="Menu" className="mt-10 flex flex-col border-t border-hairline">
                            {NAV_ITEMS.map((item, index) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-baseline gap-4 border-b border-hairline py-4 text-3xl font-medium tracking-[-0.03em] text-ink transition-colors hover:text-detail"
                                >
                                    <span className="w-6 shrink-0 text-xs font-medium tracking-[0.16em] text-detail" aria-hidden="true">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    {item.label}
                                </a>
                            ))}
                        </nav>

                        <div className="mt-auto flex items-center justify-between gap-4 pt-10">
                            <ThemeToggleButton
                                isDark={isDark}
                                mounted={mounted}
                                onToggle={toggleTheme}
                                className="border-hairline text-ink hover:border-ink/30"
                            />
                            <PillLink href={cta.href} variant="ink" onClick={() => setIsOpen(false)}>
                                {cta.label}
                            </PillLink>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;
