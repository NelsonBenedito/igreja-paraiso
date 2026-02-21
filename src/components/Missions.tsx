'use client';
import React, { useRef, useEffect, useState } from 'react';
import { MISSIONS } from '../constants';
import Reveal from '@/components/Reveal';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, User } from 'lucide-react';

const Missions: React.FC = () => {
    const [width, setWidth] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateWidth = () => {
            if (carouselRef.current) {
                setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    return (
        <section id="missoes" className="py-32 bg-slate-50 dark:bg-paraiso-blue-deep relative overflow-hidden">
            {/* Background Element */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cube-coat.png')] opacity-[0.03]"></div>

            <div className="container mx-auto px-6 relative z-10">
                <Reveal>
                    <div className="flex flex-col items-center text-center mb-20">
                        <div className="inline-block px-4 py-1.5 bg-paraiso-green/10 text-paraiso-green text-[10px] font-black uppercase tracking-widest rounded-md mb-6">
                            Ide & Pregai
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-paraiso-blue dark:text-white leading-none">
                            NOSSAS <br />
                            <span className="text-paraiso-green-light italic font-serif lowercase">missões</span>
                        </h2>
                        <p className="mt-8 text-slate-500 dark:text-slate-300 font-medium max-w-2xl text-lg">
                            Conheça os líderes que cuidam das nossas igrejas filiais e missões, levando o amor de Deus a cada comunidade.
                        </p>
                    </div>
                </Reveal>

                <div className="relative">
                    {/* Carousel Container */}
                    <motion.div
                        ref={carouselRef}
                        className="cursor-grab overflow-hidden active:cursor-grabbing"
                        whileTap={{ cursor: "grabbing" }}
                    >
                        <motion.div
                            drag="x"
                            dragConstraints={{ right: 0, left: -width }}
                            className="flex gap-8 pb-12" // pb-12 for shadow space
                        >
                            {MISSIONS.map((m, idx) => (
                                <motion.div
                                    key={m.id}
                                    className="min-w-[320px] md:min-w-[400px] bg-white dark:bg-[#0f2540] rounded-[2.5rem] overflow-hidden shadow-xl dark:shadow-paraiso-green/5 border border-slate-100 dark:border-white/5 relative group select-none dark:[box-shadow:0_0_0_1px_rgba(255,255,255,0.05),0_25px_50px_-12px_rgba(0,0,0,0.6)]"
                                >
                                    {/* Image Wrapper */}
                                    <div className="relative h-[450px] overflow-hidden">
                                        <div className="absolute inset-0 bg-paraiso-blue/10 dark:bg-transparent z-10 group-hover:bg-transparent transition-colors duration-500"></div>
                                        <img
                                            src={m.image}
                                            alt={m.name}
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                            draggable={false}
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-paraiso-blue-deep/90 via-paraiso-blue-deep/50 to-transparent z-20"></div>

                                        <div className="absolute bottom-6 left-6 right-6 z-30">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-paraiso-green/90 backdrop-blur-sm text-white text-[10px] font-black uppercase tracking-widest mb-3 shadow-lg">
                                                <User size={12} />
                                                Líder
                                            </div>
                                            <h3 className="text-2xl font-black text-white uppercase tracking-tight leading-none mb-1">
                                                {m.name}
                                            </h3>
                                            <p className="text-paraiso-green-light font-bold text-sm tracking-wide mb-4">
                                                {m.role}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-8 relative bg-white dark:bg-[#0f2540] border-t-2 border-transparent dark:border-paraiso-green/30">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-paraiso-green/10 dark:bg-paraiso-green/15 flex items-center justify-center text-paraiso-green shrink-0">
                                                <MapPin className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-paraiso-blue dark:text-white text-sm uppercase tracking-widest mb-1">Localização</h4>
                                                <p className="text-slate-500 dark:text-slate-300 font-medium leading-relaxed">
                                                    {m.location}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/10 flex justify-between items-center group/btn cursor-pointer">
                                            <span className="text-paraiso-blue dark:text-paraiso-green-light font-black uppercase tracking-widest text-xs group-hover/btn:text-paraiso-green dark:group-hover/btn:text-white transition-colors">
                                                Saiba Mais
                                            </span>
                                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-paraiso-green/20 flex items-center justify-center text-paraiso-blue dark:text-paraiso-green group-hover/btn:bg-paraiso-green group-hover/btn:text-white transition-all">
                                                <ArrowRight size={14} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Visual hint for scrolling if needed, or simple instruction */}
                    <div className="flex justify-center mt-4 gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                        <span>← Arraste para explorar →</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Missions;
