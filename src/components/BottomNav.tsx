'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    CalendarDays,
    ListChecks,
    Home,
    Radio,
    UserCircle,
    GraduationCap,
} from 'lucide-react'

/* ── Configurações de nav por seção ──────────────────────── */

const ADMIN_NAV = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/eventos', icon: CalendarDays, label: 'Eventos' },
    { href: '/admin/programacao', icon: ListChecks, label: 'Agenda' },
]

const MEMBROS_NAV = [
    { href: '/membros', icon: Home, label: 'Painel' },
    { href: '/membros/ao-vivo', icon: Radio, label: 'Ao Vivo' },
    { href: '/membros/cursos', icon: GraduationCap, label: 'Cursos' },
    { href: '/membros/perfil', icon: UserCircle, label: 'Perfil' },
]

/* ─────────────────────────────────────────────────────────── */

export default function BottomNav() {
    const pathname = usePathname()

    const isAdmin = pathname?.startsWith('/admin')
    const isMembros = pathname?.startsWith('/membros')

    if (!isAdmin && !isMembros) return null

    const nav = isAdmin ? ADMIN_NAV : MEMBROS_NAV
    const accent = isAdmin ? '#8b5cf6' : '#22c55e'

    const isActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin'
        if (href === '/membros') return pathname === '/membros'
        return pathname === href || pathname?.startsWith(href + '/')
    }

    return (
        <>
            {/* Spacer so content doesn't hide behind nav */}
            <div className="h-20 md:hidden" />

            <nav
                className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
                style={{
                    background: 'rgba(15,23,42,0.85)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                }}
            >
                <div className="flex items-stretch h-16">
                    {nav.map((item) => {
                        const active = isActive(item.href)
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className="flex-1 flex flex-col items-center justify-center gap-0.5 relative transition-all duration-200 active:scale-95"
                                style={{ color: active ? accent : 'rgba(148,163,184,0.8)' }}
                            >
                                {/* Active indicator bar */}
                                {active && (
                                    <span
                                        className="absolute top-0 left-1/4 right-1/4 h-0.5 rounded-full"
                                        style={{ background: accent }}
                                    />
                                )}

                                {/* Icon */}
                                <span
                                    className="flex items-center justify-center w-10 h-7 rounded-xl transition-all duration-200"
                                    style={{ background: active ? `${accent}20` : 'transparent' }}
                                >
                                    <Icon size={active ? 22 : 20} strokeWidth={active ? 2.5 : 1.8} />
                                </span>

                                {/* Label */}
                                <span
                                    className="text-[10px] font-bold tracking-wide leading-none"
                                    style={{ fontWeight: active ? 800 : 600 }}
                                >
                                    {item.label}
                                </span>
                            </Link>
                        )
                    })}
                </div>

                {/* Safe area for iPhone home indicator */}
                <div style={{ height: 'env(safe-area-inset-bottom)' }} />
            </nav>
        </>
    )
}
