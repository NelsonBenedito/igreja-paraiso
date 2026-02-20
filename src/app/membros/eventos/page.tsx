import { createClient } from '@/utils/supabase/server'
import { Calendar, Clock, MapPin, Tag, ChevronLeft } from "lucide-react"
import Link from 'next/link'

export default async function MembersEventsPage() {
    const supabase = await createClient()

    const { data: events } = await supabase
        .from('events')
        .select('*')
        .eq('published', true)
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })

    const formatDate = (d: string) =>
        new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', {
            day: 'numeric', month: 'long', year: 'numeric',
        })

    return (
        <div className="bg-slate-50 min-h-screen pb-20 pt-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                {/* Header */}
                <div className="mb-12">
                     <Link href="/membros" className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-1 mb-4 transition-colors">
                        <ChevronLeft size={14} /> Voltar ao Painel
                    </Link>
                    <h1 className="text-4xl font-black text-paraiso-blue-dark tracking-tighter">
                        Agenda de <span className="text-paraiso-green">Eventos</span>
                    </h1>
                    <p className="text-slate-500 mt-2">Confira o que preparamos para você e sua família.</p>
                </div>

                {/* Events Grid */}
                {!events || events.length === 0 ? (
                    <div className="text-center py-24 text-slate-400 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <Calendar size={56} className="mx-auto mb-4 opacity-30" />
                        <p className="text-xl font-bold">Nenhum evento programado no momento.</p>
                        <p className="text-sm mt-2">Fique atento às notificações!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 hover:-translate-y-1 transition-all duration-300 flex flex-col"
                            >
                                <div className="relative h-52 w-full overflow-hidden">
                                    {event.image_url ? (
                                        <img
                                            src={event.image_url}
                                            alt={event.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-paraiso-blue-dark/5">
                                            <Calendar size={40} className="text-paraiso-blue-dark/20" />
                                        </div>
                                    )}
                                    {event.tag && (
                                        <span className="absolute top-6 left-6 flex items-center gap-1 bg-white/95 backdrop-blur-sm text-paraiso-blue-dark text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-sm">
                                            <Tag size={10} className="text-paraiso-green" />
                                            {event.tag}
                                        </span>
                                    )}
                                </div>

                                <div className="p-8 flex flex-col grow">
                                    <div className="flex items-center gap-2 text-paraiso-green font-black text-xs uppercase tracking-widest mb-4">
                                        <Calendar size={14} />
                                        <span>{formatDate(event.date)}</span>
                                    </div>

                                    <h2 className="text-2xl font-black text-slate-800 mb-3 group-hover:text-paraiso-blue-dark transition-colors leading-tight">
                                        {event.title}
                                    </h2>

                                    {event.description && (
                                        <p className="text-slate-500 text-sm leading-relaxed mb-6 grow line-clamp-3">
                                            {event.description}
                                        </p>
                                    )}

                                    <div className="space-y-2 mt-auto pt-6 border-t border-slate-100 text-xs font-bold text-slate-400">
                                        {(event.time_start || event.time_end) && (
                                            <div className="flex items-center gap-2">
                                                <Clock size={14} className="text-paraiso-green" />
                                                <span>
                                                    {event.time_start?.slice(0, 5)}
                                                    {event.time_end && ` – ${event.time_end.slice(0, 5)}`}
                                                </span>
                                            </div>
                                        )}
                                        {event.location && (
                                            <div className="flex items-center gap-2">
                                                <MapPin size={14} className="text-paraiso-green" />
                                                <span className="truncate">{event.location}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
