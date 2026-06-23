'use client';
import React, { useState, useEffect } from 'react';
import Reveal from './Reveal';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, Clock, UserPlus, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { isRegistrationConfirmed } from '@/lib/events/types';

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
    published: boolean;
    registration_price?: number | null;
}

interface NewsSectionProps {
    events: Event[];
    registeredEventIds?: string[];
}

const formatDate = (d: string) =>
    new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

const NewsSection: React.FC<NewsSectionProps> = ({ events, registeredEventIds = [] }) => {
    const router = useRouter();
    const [registeredIds, setRegisteredIds] = useState<string[]>(registeredEventIds);

    const isRegistered = (id: string) => registeredIds.includes(id);

    // Hydration client-side: garante que as inscrições sejam buscadas
    // mesmo que o servidor não tenha conseguido via RLS
    useEffect(() => {
        const fetchMyRegistrations = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Busca por user_id (mais confiável) com fallback por email
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

    return (
        <section id="eventos" className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-8rem)] max-w-[90rem] mx-auto bg-white dark:bg-paraiso-blue-dark rounded-[2.5rem] shadow-sm overflow-hidden my-12 py-20 px-6 lg:px-12 border border-slate-100 dark:border-white/5">
            <div className="container mx-auto px-20">
                <Reveal>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <span className="w-12 h-[2px] bg-paraiso-green"></span>
                                <span className="text-paraiso-green font-black uppercase tracking-widest text-xs">Novidades</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-paraiso-blue dark:text-white leading-none">
                                ACONTECE NA <br />PARAÍSO
                            </h2>
                        </div>
                        <p className="text-slate-500 dark:text-slate-300 font-bold uppercase tracking-widest text-xs max-w-[200px] leading-tight">
                            Fique por dentro de tudo que move nossa casa.
                        </p>
                    </div>
                </Reveal>

                {events.length === 0 ? (
                    <Reveal>
                        <div className="text-center py-20 text-slate-400">
                            <CalendarDays size={48} className="mx-auto mb-4 opacity-30" />
                            <p className="text-lg font-bold">Nenhum evento publicado no momento.</p>
                            <p className="text-sm mt-1">Volte em breve para novidades!</p>
                        </div>
                    </Reveal>
                ) : (
                    <div className="grid lg:grid-cols-3 gap-12">
                        {events.map((item, idx) => (
                            <Reveal key={item.id} delay={idx * 0.2}>
                                <div
                                    className="group cursor-pointer"
                                    onClick={() => router.push(`/evento/${item.id}`)}
                                >
                                    <div className="relative mb-8 overflow-hidden rounded-[2.5rem] aspect-video shadow-2xl bg-slate-100 dark:bg-slate-800">
                                        {item.image_url ? (
                                            <motion.img
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.8 }}
                                                src={item.image_url}
                                                className="w-full h-full object-cover transition-all duration-700 group-hover:brightness-75"
                                                alt={item.title}
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <CalendarDays className="w-16 h-16 text-slate-300 dark:text-slate-600" />
                                            </div>
                                        )}

                                        {/* Número do card */}
                                        <div className="absolute top-8 left-8">
                                            <span className="text-7xl font-black text-white opacity-20 group-hover:opacity-100 transition-opacity">
                                                {String(idx + 1).padStart(2, '0')}
                                            </span>
                                        </div>

                                        {/* Badge inscrito */}
                                        {isRegistered(item.id) && (
                                            <div className="absolute top-8 right-8">
                                                <span className="flex items-center gap-1.5 bg-paraiso-green text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
                                                    <CheckCircle2 size={11} />
                                                    Inscrito
                                                </span>
                                            </div>
                                        )}

                                        {/* Tag */}
                                        {item.tag && (
                                            <div className="absolute top-10 right-10">
                                                <span className="px-4 py-2 bg-paraiso-green text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                                    {item.tag}
                                                </span>
                                            </div>
                                        )}

                                        {/* Data overlay on hover */}
                                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="flex items-center gap-2 text-white/80 text-xs font-bold">
                                                <CalendarDays size={12} />
                                                {formatDate(item.date)}
                                                {item.time_start && (
                                                    <>
                                                        <Clock size={12} className="ml-2" />
                                                        {item.time_start.slice(0, 5)}
                                                    </>
                                                )}
                                            </div>
                                            {item.location && (
                                                <div className="flex items-center gap-2 text-white/80 text-xs font-bold mt-1">
                                                    <MapPin size={12} />
                                                    {item.location}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 group-hover:text-paraiso-green transition-colors text-paraiso-blue dark:text-white leading-tight">
                                        {item.title}
                                    </h3>
                                    {item.description && (
                                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 font-medium text-sm">
                                            {item.description}
                                        </p>
                                    )}

                                    <div className="mt-8 flex items-center justify-between">
                                        <div className="flex items-center gap-4 text-paraiso-green font-black text-xs uppercase tracking-[0.2em] group-hover:gap-6 transition-all">
                                            Saiba mais <span className="text-2xl">→</span>
                                        </div>
                                        {isRegistered(item.id) ? (
                                            <div className="flex items-center gap-2 px-5 py-2.5 bg-paraiso-green/10 text-paraiso-green font-black text-[10px] uppercase tracking-widest rounded-full border border-paraiso-green/30">
                                                <CheckCircle2 size={13} />
                                                Inscrição confirmada
                                            </div>
                                        ) : (
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/evento/${item.id}`);
                                                }}
                                                className="flex items-center gap-2 px-5 py-2.5 bg-paraiso-green text-white font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-paraiso-blue transition-all shadow-md"
                                            >
                                                <UserPlus size={13} />
                                                Inscrever-se
                                            </motion.button>
                                        )}
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                )}
            </div>

        </section>
    );
};

export default NewsSection;
