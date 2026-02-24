'use client';
import React from 'react';
import Reveal from '@/components/Reveal';
import { motion } from 'framer-motion';

const MissionSection: React.FC = () => {
    return (
        <section id="sobre" className="py-32 bg-white dark:bg-paraiso-blue-deep relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-paraiso-green rounded-full blur-3xl opacity-50" />

            <div className="container px-20 py-20 bg-gray-100/50 dark:bg-gray-900/50 border mx-auto backdrop-blur-3xl rounded-4xl relative z-10">
                <Reveal>
                    <div className="max-w-4xl">
                        <span className="inline-block px-4 py-1 bg-paraiso-green/10 text-paraiso-green text-[10px] font-black uppercase tracking-widest rounded-md mb-8">
                            Nossa Missão
                        </span>

                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight mb-10 text-paraiso-blue dark:text-white">
                            O mesmo povo.{' '}
                            <span className="text-paraiso-green italic">A mesma fé.</span>{' '}
                            Um nome novo.
                        </h2>

                        <p className="text-xl text-slate-500 dark:text-slate-300 font-medium mb-6 leading-relaxed">
                            Agora, somos a <strong className="text-paraiso-blue dark:text-white font-black">Igreja Paraíso</strong>. O mesmo povo, a mesma igreja, com um novo nome, uma nova mentalidade e uma visão renovada.
                        </p>

                        <p className="text-xl text-slate-500 dark:text-slate-300 font-medium mb-12 leading-relaxed">
                            E o nosso compromisso permanece:{' '}
                            <em className="text-paraiso-blue dark:text-slate-100 not-italic font-bold">
                                alcançar todos a quem o Senhor nos enviar.
                            </em>
                        </p>

                        <blockquote className="border-l-4 border-paraiso-green pl-6 mb-10">
                            <p className="text-2xl md:text-3xl font-black italic text-paraiso-blue dark:text-white leading-snug">
                                "Paraíso é a casa de Deus, o lugar da presença, onde a minha família se reúne, onde Deus habita."
                            </p>
                        </blockquote>

                        <p className="text-paraiso-green font-black uppercase tracking-widest text-sm mb-10">
                            Igreja Paraíso — Casa de Deus. Minha família.
                        </p>

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
