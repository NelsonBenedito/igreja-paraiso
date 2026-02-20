'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const Hero: React.FC = () => {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-paraiso-blue-deep">
            {/* Background Cinematográfico */}
            <motion.div
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 2.5, ease: "easeOut" }}
                className="absolute inset-0"
            >
                <img
                    src="/BgIgrejaParaiso.webp"
                    alt="Igreja Paraíso"
                    className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-paraiso-blue-deep/60 via-transparent to-paraiso-blue-deep/95"></div>
            </motion.div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.5 }}
                >
                    <div className="inline-block px-4 py-1.5 bg-paraiso-green text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-full mb-10 shadow-2xl">
                        Casa de Deus, minha família
                    </div>

                    <h1 className="text-7xl md:text-[10rem] font-black text-white leading-[0.8] tracking-tighter mb-12 flex flex-col items-center">
                        <span className="text-2xl md:text-4xl font-bold tracking-[0.8em] text-paraiso-green-light mb-4">IGREJA</span>
                        <span>PARAÍSO</span>
                    </h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="flex flex-wrap justify-center gap-6"
                    >
                        <button className="group px-10 py-5 bg-paraiso-green text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-paraiso-blue hover:shadow-[0_0_40px_rgba(124,154,64,0.4)] transition-all flex items-center gap-2">
                            Assista Online <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-10 py-5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white/20 transition-all">
                            Seja um Voluntário
                        </button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
                <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-paraiso-green to-transparent"></div>
            </motion.div>
        </section>
    );
};

export default Hero;
