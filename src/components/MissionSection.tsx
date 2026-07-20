'use client';
import React from 'react';
import Reveal from '@/components/Reveal';
import type { SiteMission } from '@/lib/site-content/types';

interface MissionSectionProps {
    content: SiteMission;
}

const MissionSection: React.FC<MissionSectionProps> = ({ content }) => {
    return (
        <section id="sobre" className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-8rem)] max-w-[90rem] mx-auto bg-white dark:bg-paraiso-blue-dark rounded-[2.5rem] shadow-sm overflow-hidden bg-clip-padding my-6 md:my-10 py-16 md:py-20 px-6 md:px-12 lg:px-20 border border-slate-100 dark:border-white/5 relative">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-paraiso-green rounded-full blur-3xl opacity-10 pointer-events-none" />

            <div className="relative z-10">
                <Reveal>
                    <div className="max-w-4xl">
                        <span className="inline-block px-4 py-1 bg-paraiso-green/10 text-paraiso-green text-[10px] font-black uppercase tracking-widest rounded-md mb-6">
                            {content.badge}
                        </span>

                        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-tight mb-6 text-paraiso-blue dark:text-white">
                            {content.titlePart1}{' '}
                            <span className="text-paraiso-green italic">{content.titleHighlight}</span>{' '}
                            {content.titlePart2}
                        </h2>

                        <p className="text-base md:text-lg text-slate-500 dark:text-slate-300 font-medium mb-4 leading-relaxed">
                            {content.paragraph1}
                        </p>

                        <p className="text-base md:text-lg text-slate-500 dark:text-slate-300 font-medium mb-10 leading-relaxed">
                            {content.paragraph2}
                        </p>

                        <blockquote className="border-l-4 border-paraiso-green pl-6 mb-8">
                            <p className="text-lg md:text-2xl font-black italic text-paraiso-blue dark:text-white leading-snug">
                                &ldquo;{content.quote}&rdquo;
                            </p>
                        </blockquote>

                        <p className="text-paraiso-green font-black uppercase tracking-widest text-sm">
                            {content.signature}
                        </p>
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

export default MissionSection;
