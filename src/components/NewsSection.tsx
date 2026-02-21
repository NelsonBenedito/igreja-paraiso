'use client';
import React from 'react';
import { NEWS_ITEMS } from '../constants';
import Reveal from './Reveal';
import { motion } from 'framer-motion';

const NewsSection: React.FC = () => {
    return (
        <section id="mensagens" className="py-32 bg-white dark:bg-paraiso-blue-dark overflow-hidden">
            <div className="container mx-auto px-6">
                <Reveal>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <span className="w-12 h-[2px] bg-paraiso-green"></span>
                                <span className="text-paraiso-green font-black uppercase tracking-widest text-xs">Novidades</span>
                            </div>
                            <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-paraiso-blue dark:text-white leading-none">
                                ACONTECE NA <br />PARAÍSO
                            </h2>
                        </div>
                        <p className="text-slate-500 dark:text-slate-300 font-bold uppercase tracking-widest text-sm max-w-[200px] leading-tight">
                            Fique por dentro de tudo que move nossa casa.
                        </p>
                    </div>
                </Reveal>

                <div className="grid lg:grid-cols-3 gap-12">
                    {NEWS_ITEMS.map((item, idx) => (
                        <Reveal key={item.id} delay={idx * 0.2}>
                            <div className="group cursor-pointer">
                                <div className="relative mb-8 overflow-hidden rounded-[2.5rem] h-[450px] shadow-2xl">
                                    <motion.img
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.8 }}
                                        src={item.image}
                                        className="w-full h-full object-cover transition-all duration-700 group-hover:brightness-75"
                                        alt={item.title}
                                    />
                                    {/* Número Estilo Igreja da Cidade */}
                                    <div className="absolute top-8 left-8">
                                        <span className="text-7xl font-black text-white opacity-20 group-hover:opacity-100 transition-opacity">
                                            {item.id}
                                        </span>
                                    </div>
                                    <div className="absolute top-10 right-10">
                                        <span className="px-4 py-2 bg-paraiso-green text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                                            {item.tag}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 group-hover:text-paraiso-green transition-colors text-paraiso-blue dark:text-white leading-tight">
                                    {item.title}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 font-medium">
                                    {item.description}
                                </p>

                                <div className="mt-8 flex items-center gap-4 text-paraiso-green font-black text-xs uppercase tracking-[0.2em] group-hover:gap-6 transition-all">
                                    Saiba mais <span className="text-2xl">→</span>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewsSection;
