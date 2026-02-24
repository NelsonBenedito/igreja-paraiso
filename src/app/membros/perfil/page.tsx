import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { User, Camera, ChevronLeft, Loader2, Save } from 'lucide-react'
import Link from 'next/link'
import ProfileClient from './ProfileClient'

export default async function MembersProfilePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="bg-slate-50 dark:bg-paraiso-blue-deep min-h-screen pb-20 pt-24">
            <div className="max-w-3xl mx-auto px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12">
                    <Link href="/membros" className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-sm flex items-center gap-1 mb-4 transition-colors">
                        <ChevronLeft size={14} /> Voltar ao Painel
                    </Link>
                    <h1 className="text-4xl font-black text-paraiso-blue-dark dark:text-white tracking-tighter">
                        Meu <span className="text-paraiso-green">Perfil</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Mantenha seus dados sempre atualizados.</p>
                </div>

                <ProfileClient user={user} />
            </div>
        </div>
    )
}
