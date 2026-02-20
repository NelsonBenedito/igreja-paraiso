'use client';
import React from 'react';
import { MINISTRIES } from '../constants';
import Reveal from './Reveal';
import { motion } from 'framer-motion';

const Ministries: React.FC = () => {
    return (
        <section id="ministerios" className="py-32 bg-white">
            <div className="container mx-auto px-6">
                <Reveal>
                    <div className="flex flex-col items-center text-center mb-24">
                        <div className="inline-block px-4 py-1.5 bg-paraiso-green/10 text-paraiso-green text-[10px] font-black uppercase tracking-widest rounded-md mb-6">
                            Serviço & Propósito
                        </div>
                        <h2 className="text-6xl md:text-9xl font-black uppercase tracking-tighter text-paraiso-blue leading-none">
                            NOSSOS <br />
                            <span className="text-paraiso-green-light italic font-serif lowercase">ministérios</span>
                        </h2>
                    </div>
                </Reveal>

                <div className="grid md:grid-cols-3 gap-12">
                    {MINISTRIES.map((m, idx) => (
                        <Reveal key={m.id} delay={idx * 0.15}>
                            <motion.div
                                whileHover={{ y: -20 }}
                                className="group relative overflow-hidden rounded-[3rem] h-[600px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] bg-paraiso-blue"
                            >
                                <img
                                    src={m.image}
                                    alt={m.name}
                                    className="absolute inset-0 w-full h-full object-cover opacity-80 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-paraiso-blue-dark via-paraiso-blue/30 to-transparent"></div>

                                <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
                                    <div className="mb-6 w-16 h-[2px] bg-paraiso-green group-hover:w-full transition-all duration-700"></div>
                                    <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 group-hover:text-paraiso-green transition-colors">
                                        {m.name}
                                    </h3>
                                    <div className="max-h-0 group-hover:max-h-40 transition-all duration-700 overflow-hidden">
                                        <p className="text-slate-300 font-medium text-lg mb-8 leading-relaxed">
                                            {m.description}
                                        </p>
                                        <button className="text-white font-black text-xs uppercase tracking-widest border-b-2 border-paraiso-green pb-1">
                                            Quero servir
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Ministries;
