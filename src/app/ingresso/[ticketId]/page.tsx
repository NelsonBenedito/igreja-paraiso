import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Ticket, MapPin, Calendar, ChevronLeft } from 'lucide-react';
import { fetchPublicTicket } from '@/lib/events/client';
import { EventsApiError } from '@/lib/events/client';
import type { TicketStatus } from '@/lib/events/types';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<TicketStatus, { label: string; className: string }> = {
    VALID: { label: 'Válido', className: 'border-detail text-detail' },
    USED: { label: 'Já utilizado', className: 'border-hairline text-ink-muted' },
    CANCELLED: { label: 'Cancelado', className: 'border-red-600/40 text-red-600 dark:border-red-400/40 dark:text-red-400' },
    REFUNDED: { label: 'Reembolsado', className: 'border-amber-600/40 text-amber-700 dark:border-amber-400/40 dark:text-amber-400' },
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
        <div className="min-h-screen bg-paper px-5 py-16 font-display text-ink md:py-24">
            <div className="mx-auto w-full max-w-sm overflow-hidden rounded-md border border-hairline bg-paper">
                <div className="border-b border-hairline p-6">
                    <div className="flex items-start justify-between gap-3">
                        <p className="m-0 text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">
                            <span className="text-detail" aria-hidden="true">●</span> Ingresso
                        </p>
                        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] ${status.className}`}>
                            {status.label}
                        </span>
                    </div>
                    <h1 className="m-0 mt-4 text-2xl font-semibold leading-tight tracking-[-0.03em] text-ink">{ticket.event.title}</h1>
                </div>

                <div className="space-y-6 p-6">
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3 text-ink">
                            <Calendar size={16} className="shrink-0 text-ink-muted" />
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
                            <div className="flex items-center gap-3 text-ink">
                                <MapPin size={16} className="shrink-0 text-ink-muted" />
                                <span>{ticket.event.venueName}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-3 text-ink">
                            <Ticket size={16} className="shrink-0 text-ink-muted" />
                            <span>{ticket.ticketTypeName}</span>
                        </div>
                    </div>

                    <div className="space-y-1 border-t border-dashed border-hairline pt-5">
                        <p className="m-0 text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">Participante</p>
                        <p className="m-0 font-medium text-ink">{ticket.holderName}</p>
                    </div>

                    {/* Código de entrada — apresentar na portaria. */}
                    <div className="space-y-2 rounded-md border border-hairline bg-paper-soft p-5 text-center">
                        <p className="m-0 text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">
                            Código de entrada
                        </p>
                        <p className="m-0 break-all font-mono text-lg font-semibold tracking-[0.2em] text-ink">
                            {ticket.publicCode}
                        </p>
                    </div>

                    <Link
                        href={`/evento/${ticket.event.id}`}
                        className="inline-flex w-full items-center justify-center gap-1.5 py-3 text-xs font-medium uppercase tracking-[0.16em] text-ink-muted transition-colors hover:text-ink"
                    >
                        <ChevronLeft size={14} /> Ver o evento
                    </Link>
                </div>
            </div>
        </div>
    );
}
