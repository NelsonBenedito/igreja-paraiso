import { createClient } from '@/utils/supabase/server'
import { isRegistrationConfirmed } from '@/lib/events/types'
import { ChevronLeft } from "lucide-react"
import Link from 'next/link'
import MembrosEventosClient from './MembrosEventosClient'

export default async function MembersEventsPage() {
    const supabase = await createClient()

    // Usuário logado
    const { data: { user } } = await supabase.auth.getUser()

    // Eventos futuros publicados
    const { data: events } = await supabase
        .from('events')
        .select('*')
        .eq('published', true)
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })

    // Inscrições do usuário autenticado (pelo e-mail)
    // Se logado, busca quais event_ids ele já está inscrito
    let registeredEventIds: string[] = []
    if (user?.email) {
        const { data: registrations } = await supabase
            .from('event_registrations')
            .select('event_id, payment_status')
            .eq('email', user.email.toLowerCase())

        registeredEventIds = (registrations ?? [])
            .filter((r) => isRegistrationConfirmed(r.payment_status))
            .map((r) => r.event_id)
    }

    return (
        <div className="bg-slate-50 dark:bg-paraiso-blue-deep min-h-screen pb-20 pt-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                {/* Header */}
                <div className="mb-12">
                    <Link href="/membros" className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-1 mb-4 transition-colors">
                        <ChevronLeft size={14} /> Voltar ao Painel
                    </Link>
                    <h1 className="text-4xl font-black text-paraiso-blue-dark dark:text-white tracking-tighter">
                        Agenda de <span className="text-paraiso-green">Eventos</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-300 mt-2">
                        Confira o que preparamos para você e sua família.
                    </p>
                </div>

                <MembrosEventosClient
                    events={events ?? []}
                    registeredEventIds={registeredEventIds}
                />
            </div>
        </div>
    )
}
