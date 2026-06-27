'use client';
import React, { useState, useEffect } from 'react';
import Reveal from './Reveal';
import { motion } from 'framer-motion';
import { CalendarDays, MapPin, Clock, UserPlus, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { loadRegisteredEventIdsClient } from '@/lib/events/data-client';
import type { SiteEvent } from '@/lib/events/types';

interface NewsSectionProps {
    events: SiteEvent[];
    registeredEventIds?: string[];
}

const formatDate = (d: string) =>
    new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

const NewsSection: React.FC<NewsSectionProps> = ({ events, registeredEventIds = [] }) => {
    const router = useRouter();
    const [registeredIds, setRegisteredIds] = useState<string[]>(registeredEventIds);

    const isRegistered = (id: string) => registeredIds.includes(id);

    /* useEffect(() => {
        const fetchMyRegistrations = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user?.email) return;

            const ids = await loadRegisteredEventIdsClient(user.email, user.id);
            if (ids.length > 0) {
                setRegisteredIds(ids);
            }
        };
        fetchMyRegistrations();
    }, []); */

    return (
        <section id="eventos" className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-8rem)] max-w-[90rem] mx-auto bg-white dark:bg-paraiso-blue-dark rounded-[2.5rem] shadow-sm overflow-hidden my-6 md:my-10 py-16 md:py-20 px-6 md:px-12 lg:px-20 border border-slate-100 dark:border-white/5">
            <Reveal>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="w-10 h-[2px] bg-paraiso-green" />
                            <span className="text-paraiso-green font-black uppercase tracking-widest text-xs">Eventos</span>
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
                    <div className="text-center py-16 text-slate-400">
                        <CalendarDays size={48} className="mx-auto mb-4 opacity-30" />
                        <p className="text-lg font-bold">Nenhum evento publicado no momento.</p>
                        <p className="text-sm mt-1">Volte em breve para novidades!</p>
                    </div>
                </Reveal>
            ) : (
                <div className={`grid gap-6 md:gap-8 ${events.length === 1 ? 'max-w-lg mx-auto' : events.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
                    {events.map((item, idx) => (
                        <Reveal key={item.id} delay={idx * 0.1}>
                            <div
                                className="group cursor-pointer"
                                onClick={() => router.push(`/evento/${item.id}`)}
                            >
                                <div className="relative mb-5 overflow-hidden rounded-2xl md:rounded-3xl aspect-[4/3] shadow-lg bg-slate-100 dark:bg-slate-800">
                                    {item.image_url ? (
                                        <motion.img
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.6 }}
                                            src={item.image_url}
                                            className="w-full h-full object-cover transition-all duration-500 group-hover:brightness-75"
                                            alt={item.title}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-paraiso-blue/10 to-paraiso-green/10 flex items-center justify-center">
                                            <CalendarDays className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                                        </div>
                                    )}

                                    {/* Badges — top row */}
                                    <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                                        <div className="flex flex-wrap gap-2">
                                            {item.tag && (
                                                <span className="px-3 py-1.5 bg-paraiso-green text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-md">
                                                    {item.tag}
                                                </span>
                                            )}
                                        </div>
                                        {isRegistered(item.id) && (
                                            <span className="flex items-center gap-1 bg-white/90 dark:bg-paraiso-green text-paraiso-green dark:text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm">
                                                <CheckCircle2 size={11} />
                                                Inscrito
                                            </span>
                                        )}
                                    </div>

                                    {/* Date overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                                        <div className="flex items-center gap-3 text-white/90 text-xs font-bold">
                                            <div className="flex items-center gap-1.5">
                                                <CalendarDays size={12} />
                                                {formatDate(item.date)}
                                            </div>
                                            {item.time_start && (
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={12} />
                                                    {item.time_start.slice(0, 5)}
                                                </div>
                                            )}
                                        </div>
                                        {item.location && (
                                            <div className="flex items-center gap-1.5 text-white/70 text-xs font-medium mt-1">
                                                <MapPin size={11} />
                                                {item.location}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter mb-2 group-hover:text-paraiso-green transition-colors text-paraiso-blue dark:text-white leading-tight">
                                    {item.title}
                                </h3>
                                {item.description && (
                                    <p className="text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 text-sm mb-4">
                                        {item.description}
                                    </p>
                                )}

                                <div className="flex items-center justify-between mt-auto pt-2">
                                    <span className="flex items-center gap-3 text-paraiso-green font-black text-xs uppercase tracking-[0.15em] group-hover:gap-5 transition-all">
                                        Saiba mais <span className="text-xl">→</span>
                                    </span>
                                    {isRegistered(item.id) ? (
                                        <span className="flex items-center gap-1.5 px-4 py-2 bg-paraiso-green/10 text-paraiso-green font-black text-[10px] uppercase tracking-widest rounded-full border border-paraiso-green/30">
                                            <CheckCircle2 size={12} />
                                            Confirmada
                                        </span>
                                    ) : (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`/evento/${item.id}`);
                                            }}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-paraiso-green text-white font-black uppercase tracking-widest text-[10px] rounded-full hover:bg-paraiso-blue transition-all shadow-md"
                                        >
                                            <UserPlus size={12} />
                                            Inscrever-se
                                        </motion.button>
                                    )}
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            )}
        </section>
    );
};

export default NewsSection;
