'use client';
import React from 'react';
import Reveal from '@/components/Reveal';
import { motion } from 'framer-motion';

const MissionSection: React.FC = () => {
    return (
        <section id="sobre" className="py-32 bg-white relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-paraiso-green/5 rounded-full blur-3xl opacity-50"></div>

            <div className="container mx-auto px-6 relative z-10">
                <Reveal>
                    <div className="max-w-4xl">
                        <span className="inline-block px-4 py-1 bg-paraiso-green/10 text-paraiso-green text-[10px] font-black uppercase tracking-widest rounded-md mb-8">
                            Nossa Missão
                        </span>
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight mb-12 text-paraiso-blue">
                            Acreditamos que todo ser humano é uma obra de arte em <span className="text-paraiso-green italic">restauração</span>.
                        </h2>
                        <p className="text-2xl text-slate-500 font-medium mb-12 leading-relaxed">
                            Na Igreja Paraíso, você não é apenas um número. Você é família. Nossos grupos de vida e ministérios existem para apoiar sua caminhada e revelar seu propósito em Deus.
                        </p>
                        <h3 className="text-4xl font-black uppercase tracking-tighter mb-10 text-paraiso-blue-dark">Sua jornada começa aqui.</h3>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-6 text-paraiso-green font-black uppercase tracking-widest text-lg group"
                        >
                            <div className="w-16 h-16 rounded-full bg-paraiso-green text-white flex items-center justify-center group-hover:bg-paraiso-blue transition-all shadow-xl">
                                <span className="text-2xl">→</span>
                            </div>
                            Quero me conectar
                        </motion.button>
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

export default MissionSection;
