'use client';
import React from 'react';
import { PROGRAMACAO } from '../constants';
import Reveal from './Reveal';
import { ChevronRight, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const ProgramacaoSection: React.FC = () => {
    return (
        <section id="agenda" className="py-32 bg-slate-50 dark:bg-paraiso-blue-deep relative overflow-hidden">
            {/* Elemento Decorativo */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-paraiso-blue/5 skew-x-12 translate-x-32"></div>

            <div className="container mx-auto px-6 flex flex-col lg:flex-row gap-24 relative z-10">
                <div className="lg:w-1/3">
                    <Reveal direction="left">
                        <div className="flex items-center gap-4 mb-6">
                            <Calendar className="text-paraiso-green" size={24} />
                            <span className="text-paraiso-green font-black uppercase tracking-widest text-xs">A Igreja em Movimento</span>
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-10 leading-[0.85] text-paraiso-blue dark:text-white">
                            NOSSA <br />
                            <span className="text-paraiso-green italic font-serif lowercase">agenda</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-300 text-lg mb-12 leading-relaxed font-medium">
                            Acreditamos que participar de uma comunidade é um dos melhores caminhos para encorajar o crescimento espiritual.
                        </p>
                        <button className="flex items-center gap-4 px-10 py-5 bg-paraiso-blue text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-paraiso-green transition-all group shadow-2xl">
                            TODOS OS EVENTOS <ChevronRight size={18} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </Reveal>
                </div>

                <div className="lg:w-2/3">
                    <div className="space-y-2">
                        {PROGRAMACAO.map((item, idx) => (
                            <Reveal key={idx} delay={idx * 0.05} width="100%">
                                <motion.div
                                    whileHover={{ x: 10 }}
                                    className="flex flex-col md:flex-row md:items-center py-10 px-8 border-b border-slate-200 dark:border-white/10 group cursor-pointer rounded-2xl transition-all hover:bg-white dark:hover:bg-paraiso-blue"
                                >
                                    <div className="w-48 mb-4 md:mb-0">
                                        <span className="text-paraiso-green font-black uppercase tracking-widest text-xs block mb-1">
                                            {item.day}
                                        </span>
                                        <span className="text-slate-400 font-bold text-lg italic">
                                            {item.time}
                                        </span>
                                    </div>

                                    <div className="flex-1">
                                        <h4 className="text-3xl font-black uppercase tracking-tighter text-paraiso-blue dark:text-white group-hover:text-paraiso-green transition-colors">
                                            {item.title}
                                        </h4>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">
                                            Local: {item.location}
                                        </p>
                                    </div>

                                    <div className="mt-6 md:mt-0 md:opacity-0 group-hover:opacity-100 transition-all">
                                        <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-paraiso-green">
                                            <ChevronRight size={20} />
                                        </div>
                                    </div>
                                </motion.div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProgramacaoSection;
