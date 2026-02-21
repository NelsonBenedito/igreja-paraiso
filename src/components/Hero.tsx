'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronUp } from 'lucide-react';
import AnimatedLogo from './AnimatedLogo';

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
                    <div className="mb-20">
                        <AnimatedLogo size={750} />
                    </div>

                </motion.div>
            </div>

            {/* Scroll Indicator - Responsivo */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 1 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
            >
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Descobrir</span>

                {/* Desktop: Mouse Wheel */}
                <div className="hidden md:flex w-6 h-10 border-2 border-white/20 rounded-full justify-center p-1.5">
                    <motion.div
                        animate={{
                            y: [0, 12, 0],
                            opacity: [1, 0.2, 1]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 2,
                            ease: "easeInOut"
                        }}
                        className="w-1 h-2 bg-paraiso-green rounded-full"
                    />
                </div>

                {/* Mobile: Swipe Up Gesture */}
                <div className="flex md:hidden flex-col items-center gap-1">
                    <motion.div
                        animate={{ y: [4, -4, 4], opacity: [0.4, 1, 0.4] }}
                        transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                    >
                        <ChevronUp className="w-5 h-5 text-paraiso-green" />
                    </motion.div>
                    <motion.div
                        animate={{ y: [4, -4, 4], opacity: [0.2, 0.7, 0.2] }}
                        transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut", delay: 0.15 }}
                    >
                        <ChevronUp className="w-5 h-5 text-paraiso-green/50 -mt-3" />
                    </motion.div>
                </div>

                <motion.div
                    animate={{ y: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                    className="w-px h-12 bg-gradient-to-b from-paraiso-green to-transparent"
                ></motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
