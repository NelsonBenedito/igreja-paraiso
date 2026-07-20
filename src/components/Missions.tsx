'use client';
import React, { useRef, useEffect, useState } from 'react';
import Reveal from '@/components/Reveal';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Home, User } from 'lucide-react';
import Link from 'next/link';
import type { SiteChurches } from '@/lib/site-content/types';

interface MissionsProps {
    content: SiteChurches;
}

const Missions: React.FC<MissionsProps> = ({ content }) => {
    const [width, setWidth] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    // Sede primeiro (isHeadquarters), depois o resto na ordem da API.
    const churches = [...content.items].sort((a, b) => {
        if (a.isHeadquarters === b.isHeadquarters) return 0;
        return a.isHeadquarters ? -1 : 1;
    });

    useEffect(() => {
        const updateWidth = () => {
            if (carouselRef.current) {
                setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, [churches.length]);

    return (
        <section id="missoes" className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-8rem)] max-w-[90rem] mx-auto bg-white dark:bg-paraiso-blue-dark rounded-[2.5rem] shadow-sm overflow-hidden my-6 md:my-10 py-16 md:py-20 px-6 md:px-12 lg:px-20 border border-slate-100 dark:border-white/5 relative">
            <div className="relative z-10">
                <Reveal>
                    <div className="flex flex-col items-center text-center mb-12 md:mb-16">
                        <span className="inline-block px-4 py-1.5 bg-paraiso-green/10 text-paraiso-green text-[10px] font-black uppercase tracking-widest rounded-md mb-5">
                            {content.badge}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-paraiso-blue dark:text-white leading-none">
                            {content.titlePart1} <br />
                            <span className="text-paraiso-green-light italic font-serif lowercase">{content.titleHighlight}</span>
                        </h2>
                        <p className="mt-5 text-slate-500 dark:text-slate-300 font-medium max-w-2xl text-base">
                            {content.intro}
                        </p>
                    </div>
                </Reveal>

                <div className="relative">
                    <motion.div
                        ref={carouselRef}
                        className="cursor-grab overflow-hidden active:cursor-grabbing"
                        whileTap={{ cursor: "grabbing" }}
                    >
                        <motion.div
                            drag="x"
                            dragConstraints={{ right: 0, left: -width }}
                            className="flex gap-5 md:gap-6 pb-8"
                        >
                            {churches.map((church) => (
                                <motion.div
                                    key={church.name}
                                    className="min-w-[280px] md:min-w-[340px] bg-white dark:bg-[#0f2540] rounded-2xl md:rounded-[2rem] overflow-hidden shadow-lg dark:shadow-paraiso-green/5 border border-slate-100 dark:border-white/5 relative group select-none"
                                >
                                    <div className="relative h-[240px] md:h-[280px] overflow-hidden">
                                        <div className="absolute inset-0 bg-paraiso-blue/10 dark:bg-transparent z-10 group-hover:bg-transparent transition-colors duration-500" />
                                        <img
                                            src={church.image}
                                            alt={church.name}
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                                            draggable={false}
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-paraiso-blue-deep/90 via-paraiso-blue-deep/50 to-transparent z-20" />

                                        <div className="absolute bottom-5 left-5 right-5 z-30">
                                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-paraiso-green/90 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-widest mb-2 shadow-lg">
                                                <Home size={10} />
                                                {church.isHeadquarters ? 'Sede' : 'Igreja / Filial'}
                                            </div>
                                            <h3 className="text-lg font-black text-white uppercase tracking-tight leading-none mb-0.5">
                                                {church.name}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="p-5 md:p-6 bg-white dark:bg-[#0f2540] flex flex-col justify-between min-h-[180px]">
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-9 h-9 rounded-full bg-paraiso-green/10 flex items-center justify-center text-paraiso-green shrink-0">
                                                    <MapPin className="w-4 h-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-bold text-paraiso-blue dark:text-white text-xs uppercase tracking-widest mb-0.5">Localização</h4>
                                                    <p className="text-slate-500 dark:text-slate-300 font-medium text-sm leading-relaxed truncate">
                                                        {church.location}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <div className="w-9 h-9 rounded-full bg-paraiso-blue/10 flex items-center justify-center text-paraiso-blue dark:text-white shrink-0">
                                                    <User className="w-4 h-4 text-paraiso-green" />
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="font-bold text-paraiso-blue dark:text-white text-xs uppercase tracking-widest mb-0.5">Liderança</h4>
                                                    <p className="text-slate-500 dark:text-slate-300 font-medium text-sm leading-relaxed truncate">
                                                        {church.pastor}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <Link
                                            href="/nossas-igrejas"
                                            className="mt-5 pt-4 border-t border-slate-100 dark:border-white/10 flex justify-between items-center group/btn cursor-pointer block"
                                        >
                                            <span className="text-paraiso-blue dark:text-paraiso-green-light font-black uppercase tracking-widest text-xs group-hover/btn:text-paraiso-green dark:group-hover/btn:text-white transition-colors">
                                                Ver Todas as Igrejas
                                            </span>
                                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-paraiso-green/20 flex items-center justify-center text-paraiso-blue dark:text-paraiso-green group-hover/btn:bg-paraiso-green group-hover/btn:text-white transition-all">
                                                <ArrowRight size={14} />
                                            </div>
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    <div className="flex justify-center mt-2 gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                        <span>← Arraste para explorar →</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Missions;
