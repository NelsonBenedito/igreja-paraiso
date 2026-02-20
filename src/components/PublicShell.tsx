'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AssistantAI from '@/components/AssistantAI'
import BottomNav from '@/components/BottomNav'
import type { User } from '@supabase/supabase-js'

export default function PublicShell({ user, children }: { user: User | null, children: React.ReactNode }) {
    const pathname = usePathname()
    const isAdmin = pathname?.startsWith('/admin')
    const isMembros = pathname?.startsWith('/membros')

    return (
        <>
            {!isAdmin && <Header user={user} />}
            {!isMembros && !isAdmin && <AssistantAI />}
            {children}
            {!isAdmin && <Footer />}
            <BottomNav />
        </>
    )
}

