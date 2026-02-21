'use client'

import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'
import { Sun, Moon, LogOut, Shield } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/utils/supabase/client'

interface MembrosTopBarProps {
    isAdmin?: boolean
}

const TABS = [
    { label: 'Membros', href: '/membros' },
    { label: 'Admin', href: '/admin' },
]

export default function MembrosTopBar({ isAdmin = false }: MembrosTopBarProps) {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const [signingOut, setSigningOut] = useState(false)

    // Border-Morph tab refs
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })

    useEffect(() => setMounted(true), [])
    const isDark = theme === 'dark'
    const toggleTheme = () => setTheme(isDark ? 'light' : 'dark')

    // Active tab: match /admin/* → 'Admin', /membros/* → 'Membros'
    const activeIdx = pathname.startsWith('/admin') ? 1 : 0

    // Recompute indicator whenever active tab changes
    useEffect(() => {
        const el = tabRefs.current[activeIdx]
        if (!el) return
        const { offsetLeft, offsetWidth } = el
        setIndicatorStyle({ left: offsetLeft, width: offsetWidth })
    }, [activeIdx, mounted])

    // Client-side signout (calls supabase directly, then redirects)
    const handleSignOut = async () => {
        setSigningOut(true)
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    return (
        <header className="
            hidden md:flex fixed top-0 left-0 right-0 z-50 h-16 items-center justify-between px-8
            border-b border-slate-200/60 dark:border-white/5
            bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl
        ">
            {/* ── Left: Logo ──────────────────────────────── */}
            <Link href={activeIdx === 1 ? '/admin' : '/membros'} className="flex items-center gap-3 shrink-0">
                <img
                    src={mounted && isDark ? '/LogoParaisoW.svg' : '/IgrejaParaiso.webp'}
                    alt="Igreja Paraíso"
                    className="h-9 w-auto object-contain"
                />
            </Link>

            {/* ── Center: Border-Morph Tab Switcher ───────── */}
            {isAdmin && (
                <div className="relative flex items-center gap-0.5 bg-slate-100 dark:bg-white/5 rounded-xl p-1 border border-slate-200/80 dark:border-white/8">
                    {/* Sliding indicator pill */}
                    <motion.div
                        className="absolute top-1 bottom-1 rounded-lg bg-white dark:bg-white/10 shadow-sm border border-slate-200 dark:border-white/10"
                        animate={{ left: indicatorStyle.left, width: indicatorStyle.width }}
                        initial={false}
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        style={{ position: 'absolute', top: 4, bottom: 4 }}
                    />

                    {TABS.map((tab, i) => {
                        const isActive = i === activeIdx
                        return (
                            <button
                                key={tab.href}
                                ref={(el) => { tabRefs.current[i] = el }}
                                onClick={() => router.push(tab.href)}
                                className={`
                                    relative z-10 px-5 py-1.5 rounded-lg text-[12px] font-black uppercase tracking-widest transition-colors duration-200
                                    ${isActive
                                        ? (i === 1
                                            ? 'text-violet-600 dark:text-violet-400'
                                            : 'text-paraiso-green')
                                        : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                                    }
                                `}
                            >
                                {i === 1 && <Shield size={11} className="inline mr-1.5 opacity-70" />}
                                {tab.label}
                            </button>
                        )
                    })}
                </div>
            )}

            {/* ── Right: Admin link + Theme + Signout ─────── */}
            <div className="flex items-center gap-2 shrink-0">
                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    aria-label="Alternar tema"
                    className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-200"
                >
                    <AnimatePresence mode="wait">
                        {mounted && (
                            <motion.div
                                key={isDark ? 'moon' : 'sun'}
                                initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
                                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                                exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isDark
                                    ? <Sun size={14} className="text-amber-400" />
                                    : <Moon size={14} className="text-slate-500" />
                                }
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                        {mounted ? (isDark ? 'Claro' : 'Escuro') : 'Tema'}
                    </span>
                </button>

                {/* Signout */}
                <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    aria-label="Sair"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-200 dark:hover:border-red-500/20 hover:text-red-500 text-slate-400 transition-all duration-200"
                >
                    <LogOut size={14} />
                    <span className="text-[11px] font-bold uppercase tracking-widest">
                        {signingOut ? '...' : 'Sair'}
                    </span>
                </button>
            </div>
        </header>
    )
}
