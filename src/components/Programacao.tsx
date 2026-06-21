'use client';
import React from 'react';
import Reveal from './Reveal';
import { ChevronRight, Calendar, ListChecks } from 'lucide-react';
import { motion } from 'framer-motion';

import type { SiteSchedule } from '@/lib/events/types';

interface ProgramacaoProps {
    schedules: SiteSchedule[];
}

const DAYS_ORDER = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

const ProgramacaoSection: React.FC<ProgramacaoProps> = ({ schedules }) => {
    const sorted = [...schedules].sort((a, b) => {
        const dayDiff = DAYS_ORDER.indexOf(a.day_of_week) - DAYS_ORDER.indexOf(b.day_of_week);
        if (dayDiff !== 0) return dayDiff;
        return a.time_start.localeCompare(b.time_start);
    });

    return (
        <section id="agenda" className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-8rem)] max-w-[90rem] mx-auto bg-white dark:bg-paraiso-blue-dark rounded-[2.5rem] shadow-sm overflow-hidden my-6 md:my-10 py-16 md:py-20 px-6 md:px-12 lg:px-20 border border-slate-100 dark:border-white/5 relative">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-paraiso-green/[0.03] skew-x-12 translate-x-20 pointer-events-none" />

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 relative z-10">
                <div className="lg:w-1/3 lg:sticky lg:top-28 lg:self-start">
                    <Reveal direction="left">
                        <div className="flex items-center gap-3 mb-5">
                            <Calendar className="text-paraiso-green" size={22} />
                            <span className="text-paraiso-green font-black uppercase tracking-widest text-xs">A Igreja em Movimento</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-[0.85] text-paraiso-blue dark:text-white">
                            NOSSA <br />
                            <span className="text-paraiso-green italic font-serif lowercase">agenda</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-300 text-base mb-8 leading-relaxed font-medium">
                            Acreditamos que participar de uma comunidade é um dos melhores caminhos para encorajar o crescimento espiritual.
                        </p>
                        <button className="flex items-center gap-3 px-8 py-4 bg-paraiso-blue text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-paraiso-green transition-all group shadow-xl">
                            TODA NOSSA AGENDA <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Reveal>
                </div>

                <div className="lg:w-2/3">
                    {sorted.length === 0 ? (
                        <Reveal>
                            <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-4">
                                <ListChecks size={40} className="opacity-30" />
                                <p className="font-bold uppercase tracking-widest text-xs">Nenhuma programação cadastrada.</p>
                            </div>
                        </Reveal>
                    ) : (
                        <div className="space-y-1">
                            {sorted.map((item, idx) => (
                                <Reveal key={item.id} delay={idx * 0.04} width="100%">
                                    <motion.div
                                        whileHover={{ x: 6 }}
                                        className="flex flex-col sm:flex-row sm:items-center py-6 md:py-8 px-4 md:px-6 border-b border-slate-100 dark:border-white/5 group cursor-pointer rounded-xl transition-all hover:bg-slate-50 dark:hover:bg-white/[0.03]"
                                    >
                                        <div className="w-40 mb-2 sm:mb-0 shrink-0">
                                            <span className="text-paraiso-green font-black uppercase tracking-widest text-xs block mb-0.5">
                                                {item.day_of_week}
                                            </span>
                                            <span className="text-slate-400 font-bold text-lg">
                                                {item.time_start.slice(0, 5)}
                                            </span>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-paraiso-blue dark:text-white group-hover:text-paraiso-green transition-colors truncate">
                                                {item.title}
                                            </h4>
                                            {item.location && (
                                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
                                                    {item.location}
                                                </p>
                                            )}
                                            {item.description && (
                                                <p className="text-slate-400 text-sm mt-1 font-medium line-clamp-1">
                                                    {item.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="hidden sm:block sm:opacity-0 group-hover:opacity-100 transition-all ml-4 shrink-0">
                                            <div className="w-10 h-10 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-paraiso-green">
                                                <ChevronRight size={18} />
                                            </div>
                                        </div>
                                    </motion.div>
                                </Reveal>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProgramacaoSection;
