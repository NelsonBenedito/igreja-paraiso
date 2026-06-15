import { getPublicEvents, getRegisteredEventIdsForUser } from '@/lib/events/data';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from "lucide-react"
import MembrosEventosClient from './MembrosEventosClient'

export default async function MembersEventsPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const events = await getPublicEvents({ upcomingOnly: true })

    let registeredEventIds: string[] = []
    if (user.email) {
        registeredEventIds = await getRegisteredEventIdsForUser(user.email, user.id)
    }

    return (
        <div className="bg-slate-50 dark:bg-paraiso-blue-deep min-h-screen pb-20 pt-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="mb-12">
                    <Link href="/membros" className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 text-sm flex items-center gap-1 mb-4 transition-colors">
                        <ChevronLeft size={14} /> Voltar ao Painel
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black text-paraiso-blue-dark dark:text-white tracking-tighter">
                        Eventos
                    </h1>
                    <p className="text-slate-500 dark:text-slate-300 font-medium text-lg mt-2">
                        Inscreva-se nos próximos eventos da igreja.
                    </p>
                </div>

                <MembrosEventosClient events={events} registeredEventIds={registeredEventIds} />
            </div>
        </div>
    )
}
