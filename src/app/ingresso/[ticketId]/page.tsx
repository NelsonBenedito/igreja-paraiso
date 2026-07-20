import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Ticket, MapPin, Calendar, ChevronLeft } from 'lucide-react';
import { fetchPublicTicket } from '@/lib/events/client';
import { EventsApiError } from '@/lib/events/client';
import type { TicketStatus } from '@/lib/events/types';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<TicketStatus, { label: string; className: string }> = {
    VALID: { label: 'Válido', className: 'bg-paraiso-green text-white' },
    USED: { label: 'Já utilizado', className: 'bg-slate-400 text-white' },
    CANCELLED: { label: 'Cancelado', className: 'bg-red-500 text-white' },
    REFUNDED: { label: 'Reembolsado', className: 'bg-amber-500 text-white' },
};

/** Bilhete emitido — aceita o UUID ou o `publicCode` na URL. */
export default async function IngressoPage({
    params,
}: {
    params: Promise<{ ticketId: string }>;
}) {
    const { ticketId } = await params;

    let ticket;
    try {
        ticket = await fetchPublicTicket(ticketId);
    } catch (error) {
        // 404 cobre bilhete inexistente e pedido ainda não confirmado.
        if (error instanceof EventsApiError && error.status === 404) return notFound();
        throw error;
    }

    const status = STATUS_LABEL[ticket.status] ?? STATUS_LABEL.VALID;
    const startsAt = new Date(ticket.event.startsAt);

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-slate-50 dark:bg-[#0a1420]">
            <div className="w-full max-w-sm bg-white dark:bg-[#0f1a2a] rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-br from-paraiso-blue to-paraiso-green p-6 text-white">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/70">Ingresso</p>
                            <h1 className="text-xl font-black leading-tight mt-1">{ticket.event.title}</h1>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shrink-0 ${status.className}`}>
                            {status.label}
                        </span>
                    </div>
                </div>

                <div className="p-6 space-y-5">
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                            <Calendar size={16} className="text-paraiso-green shrink-0" />
                            <span>
                                {startsAt.toLocaleString('pt-BR', {
                                    day: '2-digit', month: 'long', year: 'numeric',
                                    hour: '2-digit', minute: '2-digit',
                                    // `startsAt` é derivado de `date` + `timeStart`, ou seja hora de
                                    // parede do evento. Converter para o fuso do visitante mostraria
                                    // uma hora diferente da que a página do evento anuncia.
                                    timeZone: 'UTC',
                                })}
                            </span>
                        </div>
                        {ticket.event.venueName && (
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                <MapPin size={16} className="text-paraiso-green shrink-0" />
                                <span>{ticket.event.venueName}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                            <Ticket size={16} className="text-paraiso-green shrink-0" />
                            <span>{ticket.ticketTypeName}</span>
                        </div>
                    </div>

                    <div className="border-t border-dashed border-slate-200 dark:border-white/10 pt-5 space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Participante</p>
                        <p className="font-bold text-slate-800 dark:text-white">{ticket.holderName}</p>
                    </div>

                    {/* Código de entrada — apresentar na portaria. */}
                    <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-5 text-center space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Código de entrada
                        </p>
                        <p className="font-mono text-lg font-black tracking-[0.2em] text-paraiso-blue dark:text-white break-all">
                            {ticket.publicCode}
                        </p>
                    </div>

                    <Link
                        href={`/evento/${ticket.event.id}`}
                        className="w-full inline-flex items-center justify-center gap-2 py-3 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 hover:text-paraiso-green transition-colors"
                    >
                        <ChevronLeft size={14} /> Ver o evento
                    </Link>
                </div>
            </div>
        </div>
    );
}
