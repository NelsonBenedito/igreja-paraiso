'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Tag, UserPlus, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { isRegistrationConfirmed } from '@/lib/events/types';
import EventRegistrationModal from '@/components/EventRegistrationModal';

interface Event {
    id: string;
    title: string;
    description: string | null;
    date: string;
    time_start: string | null;
    time_end: string | null;
    location: string | null;
    image_url: string | null;
    tag: string | null;
    registration_price?: number | null;
}

interface Props {
    events: Event[];
    /** IDs dos eventos em que o usuário já está inscrito */
    registeredEventIds: string[];
}

const formatDate = (d: string) =>
    new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

type ModalStatus = 'idle' | 'loading' | 'success' | 'duplicate' | 'table_missing' | 'error' | 'payment_error';
type ErrorDetail = { code?: string; message?: string } | null;

export default function MembrosEventosClient({ events, registeredEventIds }: Props) {
    const supabase = createClient();

    // Mantém localmente quais eventos já estão inscritos (inicia com o que virou do server)
    const [registeredIds, setRegisteredIds] = useState<string[]>(registeredEventIds);

    // Modal
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    // Hydration client-side: re-busca inscrições ao montar
    // garante que inscrições existentes sejam refletidas mesmo que
    // o servidor não tenha conseguido via RLS
    useEffect(() => {
        const fetchMyRegistrations = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from('event_registrations')
                .select('event_id, payment_status')
                .or(`user_id.eq.${user.id},email.eq.${user.email?.toLowerCase() ?? ''}`);

            if (data && data.length > 0) {
                setRegisteredIds(
                    data
                        .filter((r) => isRegistrationConfirmed(r.payment_status))
                        .map((r) => r.event_id),
                );
            }
        };
        fetchMyRegistrations();
    }, []);

    const openModal = (event: Event) => setSelectedEvent(event);
    const closeModal = () => setSelectedEvent(null);

    const handleSuccess = (eventId: string) => {
        setRegisteredIds((prev) => [...prev, eventId]);
    };

    const isRegistered = (id: string) => registeredIds.includes(id);

    return (
        <>
            {/* Events Grid */}
            {events.length === 0 ? (
                <div className="text-center py-24 text-slate-400 bg-white dark:bg-paraiso-blue rounded-[2.5rem] border border-slate-100 dark:border-white/10 shadow-sm">
                    <Calendar size={56} className="mx-auto mb-4 opacity-30" />
                    <p className="text-xl font-bold">Nenhum evento programado no momento.</p>
                    <p className="text-sm mt-2">Fique atento às notificações!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => {
                        const registered = isRegistered(event.id);
                        return (
                            <div
                                key={event.id}
                                onClick={() => { window.location.href = `/evento/${event.id}`; }}
                                className="group cursor-pointer bg-white dark:bg-paraiso-blue rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 dark:border-white/10 hover:-translate-y-1 transition-all duration-300 flex flex-col"
                            >
                                {/* Imagem */}
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
                                    {/* Badge de inscrito */}
                                    {registered && (
                                        <span className="absolute top-6 right-6 flex items-center gap-1.5 bg-paraiso-green text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
                                            <CheckCircle2 size={11} />
                                            Inscrito
                                        </span>
                                    )}
                                </div>

                                {/* Conteúdo */}
                                <div className="p-8 flex flex-col grow">
                                    <div className="flex items-center gap-2 text-paraiso-green font-black text-xs uppercase tracking-widest mb-4">
                                        <Calendar size={14} />
                                        <span>{formatDate(event.date)}</span>
                                    </div>

                                    <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-3 group-hover:text-paraiso-blue-dark dark:group-hover:text-paraiso-green transition-colors leading-tight">
                                        {event.title}
                                    </h2>

                                    {event.description && (
                                        <p className="text-slate-500 dark:text-slate-300 text-sm leading-relaxed mb-6 grow line-clamp-3">
                                            {event.description}
                                        </p>
                                    )}

                                    {/* Horário / Local */}
                                    <div className="space-y-2 pt-6 border-t border-slate-100 dark:border-white/10 text-xs font-bold text-slate-400 dark:text-slate-300 mb-6">
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

                                    {/* Botão */}
                                    {registered ? (
                                        <div className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-paraiso-green/10 text-paraiso-green font-black text-xs uppercase tracking-widest border border-paraiso-green/20">
                                            <CheckCircle2 size={15} />
                                            Inscrição confirmada
                                        </div>
                                    ) : (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openModal(event);
                                            }}
                                            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-paraiso-green text-white font-black text-xs uppercase tracking-widest hover:bg-paraiso-blue transition-all shadow-md mt-auto"
                                        >
                                            <UserPlus size={15} />
                                            Inscrever-se
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── Modal de inscrição (multi-step) ── */}
            <EventRegistrationModal
                event={selectedEvent}
                onClose={closeModal}
                onSuccess={handleSuccess}
            />
        </>
    );
}
