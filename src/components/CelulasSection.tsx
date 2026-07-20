'use client';
import React from 'react';
import Reveal from '@/components/Reveal';
import { motion } from 'framer-motion';
import SiteIcon from '@/components/SiteIcon';
import type { SiteCelulas } from '@/lib/site-content/types';

interface CelulasSectionProps {
    content: SiteCelulas;
}

const CelulasSection: React.FC<CelulasSectionProps> = ({ content }) => {
    return (
        <section
            id="celulas"
            className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-8rem)] max-w-[90rem] mx-auto bg-white dark:bg-paraiso-blue-dark rounded-[2.5rem] shadow-sm overflow-hidden my-6 md:my-10 py-16 md:py-20 px-6 md:px-12 lg:px-20 border border-slate-100 dark:border-white/5 relative"
        >
            <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-paraiso-green/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-paraiso-blue/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
                <Reveal>
                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-14">
                        <div>
                            <span className="inline-block px-4 py-1 bg-paraiso-green/10 text-paraiso-green text-[10px] font-black uppercase tracking-widest rounded-md mb-6">
                                {content.badge}
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-tight mb-6 text-paraiso-blue dark:text-white">
                                {content.titlePart1}{' '}
                                <span className="text-paraiso-green italic">{content.titleHighlight}</span>{' '}
                                {content.titlePart2}
                            </h2>
                            <p className="text-base text-slate-500 dark:text-slate-300 font-medium leading-relaxed mb-4">
                                {content.paragraph1}
                            </p>
                            <p className="text-base text-slate-500 dark:text-slate-300 font-medium leading-relaxed">
                                {content.paragraph2}
                            </p>
                        </div>

                        <div
                            className="relative rounded-3xl overflow-hidden p-8 md:p-10 text-white shadow-2xl"
                            style={{
                                background: 'linear-gradient(135deg, #2B4364 0%, #3d6b5a 50%, #7C9A40 100%)',
                            }}
                        >
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-paraiso-green/20 rounded-full blur-2xl" />
                            <div className="relative z-10">
                                <span className="text-5xl font-black text-white/20 leading-none">&ldquo;</span>
                                <p className="text-lg md:text-xl font-black italic leading-snug -mt-2 mb-4">
                                    {content.verseText}
                                </p>
                                <p className="text-white/60 text-sm font-black uppercase tracking-widest">
                                    — {content.verseReference}
                                </p>
                            </div>
                        </div>
                    </div>
                </Reveal>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
                    {content.benefits.map((item) => (
                        <Reveal key={item.titulo}>
                            <motion.div
                                whileHover={{ y: -4 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl p-6 md:p-8 hover:shadow-md transition-shadow"
                            >
                                <div className="w-11 h-11 rounded-xl bg-paraiso-green/10 flex items-center justify-center mb-5">
                                    <SiteIcon name={item.icon} className="w-5 h-5 text-paraiso-green" />
                                </div>
                                <h3 className="text-base font-black uppercase tracking-tight text-paraiso-blue dark:text-white mb-2">
                                    {item.titulo}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                    {item.descricao}
                                </p>
                            </motion.div>
                        </Reveal>
                    ))}
                </div>

                <Reveal>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <motion.a
                            href={content.ctaUrl}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-5 text-paraiso-green font-black uppercase tracking-widest text-sm group"
                        >
                            <div className="w-14 h-14 rounded-full bg-paraiso-green text-white flex items-center justify-center group-hover:bg-paraiso-blue transition-all shadow-xl">
                                <span className="text-xl">→</span>
                            </div>
                            {content.ctaLabel}
                        </motion.a>
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

export default CelulasSection;
