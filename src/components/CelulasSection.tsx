'use client';
import React from 'react';
import Reveal from '@/components/Reveal';
import { motion } from 'framer-motion';
import { Heart, Users, BookOpen, MapPin } from 'lucide-react';

const beneficios = [
    {
        icon: Heart,
        titulo: 'Comunhão Real',
        descricao: 'Relacionamentos genuínos construídos em torno da fé, onde cada pessoa é conhecida pelo nome.',
    },
    {
        icon: BookOpen,
        titulo: 'Crescimento Espiritual',
        descricao: 'Estudo bíblico aplicado ao cotidiano, com espaço para perguntas e reflexão em grupo.',
    },
    {
        icon: Users,
        titulo: 'Família de Verdade',
        descricao: 'Grupos pequenos onde ninguém passa por momentos difíceis sozinho. Somos família.',
    },
    {
        icon: MapPin,
        titulo: 'Perto de Você',
        descricao: 'Células espalhadas pela cidade para que você encontre uma próxima de onde você vive.',
    },
];

const CelulasSection: React.FC = () => {
    return (
        <section
            id="celulas"
            className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-8rem)] max-w-[90rem] mx-auto bg-white dark:bg-paraiso-blue-dark rounded-[2.5rem] shadow-sm overflow-hidden my-12 py-20 px-6 lg:px-20 border border-slate-100 dark:border-white/5 relative"
        >
            {/* Decoração de fundo */}
            <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-paraiso-green/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-paraiso-blue/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">

                {/* Cabeçalho */}
                <Reveal>
                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
                        {/* Texto principal */}
                        <div>
                            <span className="inline-block px-4 py-1 bg-paraiso-green/10 text-paraiso-green text-[10px] font-black uppercase tracking-widest rounded-md mb-8">
                                Grupos de Vida
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-tight mb-8 text-paraiso-blue dark:text-white">
                                A igreja{' '}
                                <span className="text-paraiso-green italic">acontece</span>{' '}
                                em células.
                            </h2>
                            <p className="text-base text-slate-500 dark:text-slate-300 font-medium leading-relaxed mb-6">
                                Células são grupos pequenos onde a vida em comunidade realmente acontece. É onde você encontra amigos, cresce na fé e descobre o seu propósito — sem grandes palcos, só presença e verdade.
                            </p>
                            <p className="text-base text-slate-500 dark:text-slate-300 font-medium leading-relaxed">
                                Acreditamos que{' '}
                                <em className="text-paraiso-blue dark:text-white not-italic font-black">
                                    ninguém deveria seguir essa caminhada sozinho.
                                </em>
                            </p>
                        </div>

                        {/* Card de destaque com citação */}
                        <div
                            className="relative rounded-3xl overflow-hidden p-10 text-white shadow-2xl"
                            style={{
                                background: 'linear-gradient(135deg, #2B4364 0%, #3d6b5a 50%, #7C9A40 100%)',
                            }}
                        >
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-paraiso-green/20 rounded-full blur-2xl" />
                            <div className="relative z-10">
                                <span className="text-6xl font-black text-white/20 leading-none">"</span>
                                <p className="text-xl font-black italic leading-snug -mt-4 mb-6">
                                    Onde dois ou três se reúnem em meu nome, ali estou eu no meio deles.
                                </p>
                                <p className="text-white/60 text-sm font-black uppercase tracking-widest">
                                    — Mateus 18:20
                                </p>
                            </div>
                        </div>
                    </div>
                </Reveal>

                {/* Cards de benefícios */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {beneficios.map((item, index) => (
                        <Reveal key={item.titulo}>
                            <motion.div
                                whileHover={{ y: -6 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                                className="bg-white dark:bg-gray-900/60 border border-slate-100 dark:border-white/10 rounded-3xl p-8 shadow-sm hover:shadow-lg transition-shadow"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-paraiso-green/10 flex items-center justify-center mb-6">
                                    <item.icon className="w-6 h-6 text-paraiso-green" />
                                </div>
                                <h3 className="text-lg font-black uppercase tracking-tight text-paraiso-blue dark:text-white mb-3">
                                    {item.titulo}
                                </h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                                    {item.descricao}
                                </p>
                            </motion.div>
                        </Reveal>
                    ))}
                </div>

                {/* CTA */}
                <Reveal>
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <motion.a
                            href="/membros"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-6 text-paraiso-green font-black uppercase tracking-widest text-lg group"
                        >
                            <div className="w-16 h-16 rounded-full bg-paraiso-green text-white flex items-center justify-center group-hover:bg-paraiso-blue transition-all shadow-xl">
                                <span className="text-2xl">→</span>
                            </div>
                            Quero encontrar uma célula
                        </motion.a>
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

export default CelulasSection;
