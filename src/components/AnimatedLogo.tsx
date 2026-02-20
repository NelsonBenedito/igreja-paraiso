'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';

interface AnimatedLogoProps {
    className?: string;
    size?: number;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ className = "", size = 600 }) => {
    const colorVerde = "#708836";
    const colorWhite = "#FFFFFF";

    // Variantes compartilhadas
    const fadeInVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const growVariants: Variants = {
        hidden: { scale: 0, opacity: 0 },
        visible: { scale: 1, opacity: 1 },
    };

    const pathDrawVariants: Variants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: { pathLength: 1, opacity: 1 },
    };

    const oliveiraGroupVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.35, delayChildren: 0.9 },
        },
    };

    const folhaVariants: Variants = {
        hidden: { scale: 0.3, opacity: 0, rotate: -8, originX: 0.5, originY: 0.8 },
        visible: {
            scale: 1,
            opacity: 1,
            rotate: 0,
            transition: { duration: 2.0, ease: [0.34, 1.56, 0.64, 1] },
        },
    };

    const frutoVariants: Variants = {
        hidden: { scale: 0.2, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { duration: 1.6, ease: "easeOut" },
        },
    };

    // Variante de slide da esquerda para direita (usada por ambos os textos)
    const slideLeftToRight: Variants = {
        hidden: {
            opacity: 0,
            x: -120,
            filter: "blur(6px)",
        },
        visible: {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
        },
    };

    return (
        <div className={`relative flex flex-col items-center justify-center w-full px-4 ${className}`}>
            <div className="w-full flex justify-center">
                <motion.svg
                    style={{ width: '100%', maxWidth: size, height: 'auto' }}
                    viewBox="-10 -10 435.13 155.65"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    initial="hidden"
                    animate="visible"
                    className="overflow-visible relative z-10"
                >
                    {/* Textos com slide da esquerda para direita (Pintados primeiro para ficarem atrás do círculo) */}
                    <motion.g variants={fadeInVariants} transition={{ delay: 2.0 }}>
                        {/* Igreja - slide da esquerda (começa primeiro) */}
                        <motion.g variants={slideLeftToRight} transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}>
                            <path fill={colorWhite} d="M334.96,44.6h-21.04l-3.88,10.73h-6.64l17.44-47.96h7.27l17.37,47.96h-6.64l-3.88-10.73ZM333.17,39.48l-8.72-24.36-8.72,24.36h17.44Z" />
                            <rect fill={colorWhite} x="147.29" y="7.36" width="6.26" height="47.96" />
                            <path fill={colorWhite} d="M196.05,21.26c-1.33-2.8-3.26-4.96-5.78-6.5-2.52-1.54-5.46-2.31-8.81-2.31s-6.36.77-9.05,2.31c-2.68,1.54-4.79,3.74-6.33,6.61-1.54,2.87-2.31,6.18-2.31,9.94s.77,7.06,2.31,9.91c1.54,2.85,3.65,5.04,6.33,6.57,2.68,1.54,5.7,2.31,9.05,2.31,4.68,0,8.53-1.4,11.56-4.2,3.03-2.8,4.79-6.58,5.3-11.35h-19.13v-5.09h25.8v4.82c-.37,3.95-1.61,7.56-3.72,10.84-2.11,3.28-4.89,5.87-8.33,7.78-3.44,1.9-7.27,2.86-11.49,2.86-4.45,0-8.51-1.04-12.18-3.13-3.67-2.09-6.57-4.99-8.71-8.71-2.13-3.72-3.2-7.91-3.2-12.59s1.07-8.89,3.2-12.63c2.13-3.74,5.04-6.65,8.71-8.74,3.67-2.09,7.73-3.13,12.18-3.13,5.09,0,9.6,1.26,13.52,3.78,3.92,2.52,6.78,6.08,8.57,10.67h-7.5Z" />
                            <path fill={colorWhite} d="M235.04,55.32l-11.42-19.61h-7.57v19.61h-6.26V7.36h15.48c3.62,0,6.69.62,9.19,1.86,2.5,1.24,4.37,2.91,5.61,5.02,1.24,2.11,1.86,4.52,1.86,7.23,0,3.3-.95,6.22-2.86,8.74-1.9,2.52-4.76,4.2-8.57,5.02l12.04,20.09h-7.5ZM216.04,30.69h9.22c3.39,0,5.94-.84,7.64-2.51,1.7-1.67,2.55-3.91,2.55-6.71s-.84-5.05-2.51-6.61-4.23-2.34-7.67-2.34h-9.22v18.17Z" />
                            <path fill={colorWhite} d="M302.09,7.36v35.44c0,3.95-1.22,7.1-3.65,9.46-2.43,2.36-5.64,3.54-9.63,3.54s-7.27-1.2-9.7-3.61c-2.43-2.41-3.65-5.7-3.65-9.87h6.26c.05,2.34.65,4.24,1.82,5.71,1.17,1.47,2.92,2.2,5.26,2.2s4.08-.7,5.23-2.1c1.15-1.4,1.72-3.18,1.72-5.33V7.36h6.33Z" />
                            <polygon fill={colorWhite} points="271.92 12.45 271.92 7.29 246.11 7.29 246.11 55.32 271.92 55.32 271.92 50.16 252.37 50.16 252.37 33.65 265.2 33.65 266.85 28.49 252.37 28.49 252.37 12.45 271.92 12.45" />
                        </motion.g>

                        {/* Paraíso - slide da esquerda com delay maior */}
                        <motion.g
                            variants={slideLeftToRight}
                            transition={{
                                delay: 2.8,
                                duration: 1.2,
                                ease: [0.25, 0.46, 0.45, 0.94],
                            }}
                        >
                            <path fill={colorWhite} d="M179.83,87.49c-1.21,2.23-3.1,4.03-5.67,5.4-2.57,1.37-5.82,2.05-9.74,2.05h-8v18.32h-9.57v-47.71h17.57c3.69,0,6.83.64,9.43,1.91,2.6,1.28,4.55,3.03,5.84,5.26,1.3,2.23,1.95,4.76,1.95,7.59,0,2.55-.6,4.94-1.81,7.18M169.89,85.4c1.28-1.21,1.91-2.9,1.91-5.09,0-4.65-2.6-6.97-7.79-6.97h-7.59v13.88h7.59c2.64,0,4.6-.6,5.88-1.81" />
                            <path fill={colorWhite} d="M250.2,113.25l-10.52-18.59h-4.51v18.59h-9.57v-47.71h17.91c3.69,0,6.84.65,9.43,1.95,2.6,1.3,4.54,3.05,5.84,5.26,1.3,2.21,1.95,4.68,1.95,7.42,0,3.14-.91,5.98-2.73,8.51-1.82,2.53-4.53,4.27-8.13,5.23l11.41,19.34h-11.07ZM235.16,87.49h8c2.6,0,4.53-.63,5.81-1.88,1.27-1.25,1.91-3,1.91-5.23s-.64-3.89-1.91-5.09c-1.28-1.21-3.21-1.81-5.81-1.81h-8v14.01Z" />
                            <rect fill={colorWhite} x="313.97" y="65.55" width="9.57" height="47.71" />
                            <path fill={colorWhite} d="M337.45,112.13c-2.67-1.14-4.77-2.78-6.32-4.92-1.55-2.14-2.35-4.67-2.39-7.59h10.25c.14,1.96.83,3.51,2.08,4.65,1.25,1.14,2.97,1.71,5.16,1.71s3.99-.53,5.26-1.61c1.28-1.07,1.91-2.47,1.91-4.2,0-1.41-.43-2.57-1.3-3.49-.87-.91-1.95-1.63-3.25-2.15-1.3-.52-3.09-1.1-5.37-1.74-3.1-.91-5.62-1.81-7.55-2.7-1.94-.89-3.6-2.23-4.99-4.03-1.39-1.8-2.08-4.2-2.08-7.21,0-2.83.71-5.28,2.12-7.38,1.41-2.1,3.39-3.7,5.95-4.82,2.55-1.12,5.47-1.67,8.75-1.67,4.92,0,8.92,1.2,11.99,3.59,3.08,2.39,4.77,5.73,5.09,10.01h-10.53c-.09-1.64-.79-2.99-2.08-4.07-1.3-1.07-3.02-1.61-5.16-1.61-1.87,0-3.36.48-4.48,1.44-1.12.96-1.67,2.35-1.67,4.17,0,1.28.42,2.34,1.27,3.18.84.84,1.89,1.53,3.14,2.05,1.25.52,3.02,1.13,5.3,1.81,3.1.91,5.63,1.82,7.59,2.73,1.96.91,3.65,2.28,5.06,4.1,1.34,1.72,2.04,3.96,2.11,6.7.04,1.37-.11,2.74-.48,4.06-1.07,3.91-3.51,6.82-7.31,8.76-2.55,1.3-5.58,1.95-9.09,1.95-3.33,0-6.32-.57-8.99-1.71" />
                            <path fill={colorWhite} d="M378.43,110.69c-3.74-2.09-6.7-5-8.89-8.71-2.19-3.71-3.28-7.92-3.28-12.61s1.09-8.83,3.28-12.54c2.19-3.71,5.15-6.62,8.89-8.72,3.73-2.09,7.84-3.14,12.3-3.14s8.62,1.05,12.34,3.14c3.71,2.1,6.65,5,8.82,8.72,2.16,3.71,3.25,7.89,3.25,12.54s-1.08,8.9-3.25,12.61c-2.17,3.71-5.12,6.62-8.85,8.71-3.74,2.1-7.84,3.14-12.3,3.14s-8.57-1.05-12.3-3.14M398.31,103.34c2.19-1.3,3.9-3.15,5.13-5.57,1.23-2.41,1.85-5.22,1.85-8.41s-.61-5.98-1.85-8.37c-1.23-2.39-2.94-4.23-5.13-5.5-2.19-1.28-4.72-1.91-7.59-1.91s-5.41.64-7.62,1.91c-2.21,1.28-3.93,3.11-5.16,5.5-1.23,2.39-1.85,5.18-1.85,8.37s.62,5.99,1.85,8.41c1.23,2.42,2.95,4.27,5.16,5.57,2.21,1.3,4.75,1.95,7.62,1.95s5.4-.65,7.59-1.95" />
                            <polyline fill={colorWhite} points="296.44 104.2 299.58 113.29 309.7 113.29 292.54 65.51 281.4 65.51 264.24 113.29 274.29 113.29 277.44 104.2 280.03 96.54 286.94 76.59 293.84 96.54" />
                            <path fill={colorWhite} d="M289.39,103.2c-4.25,2.11-8.6,4.43-12.62-.65,1.81.65,3.31,1.14,5.01.31,4.64-2.28,7.73-8.44,12.57-7.46l2.82,6.25c-2.93-.73-5.15.26-7.78,1.56" />
                            <polyline fill={colorWhite} points="209.28 104.23 212.42 113.32 222.54 113.32 205.38 65.55 194.24 65.55 177.08 113.32 187.13 113.32 190.27 104.23 192.87 96.58 199.77 76.62 206.68 96.58" />
                            <path fill={colorWhite} d="M202.23,103.23c-4.25,2.11-8.6,4.43-12.62-.65,1.81.65,3.31,1.14,5.01.31,4.64-2.29,7.73-8.44,12.57-7.46l2.82,6.25c-2.93-.73-5.15.26-7.78,1.56" />
                            <polygon fill={colorWhite} points="321.53 54.64 328.01 57.46 321.58 63.39 316.04 63.39 321.53 54.64" />
                        </motion.g>
                    </motion.g>

                    {/* Círculo verde (Fica na frente do texto para esconder o slide inicial) */}
                    <motion.ellipse
                        cx="59.05"
                        cy="58.82"
                        rx="59.05"
                        ry="58.82"
                        fill={colorVerde}
                        variants={growVariants}
                        transition={{ duration: 1.3, ease: [0.34, 1.56, 0.64, 1] }}
                    />

                    {/* Rio */}
                    <motion.g variants={fadeInVariants} transition={{ delay: 0.7 }}>
                        <motion.path
                            d="M49.02,95.71c-12.05,1.86-25.94-8.03-36.97-1-1.05-1.37-2.04-2.8-2.96-4.27,8.4-4.21,15.88-1.56,24.08,1.1,5.11,2.06,10.24,3.03,15.85,4.17Z"
                            fill={colorWhite}
                            variants={pathDrawVariants}
                            transition={{ duration: 1.6, ease: "easeInOut" }}
                        />
                        <motion.path
                            d="M112.7,83.63c-.96,2.1-2.04,4.13-3.24,6.09-9.05-2.03-20.11,2.62-28.6,5.3-7.95,2.51-17.25,4.18-24.84.32-.22-.11-.57-.45-.68-.56-.11-.1.61-.39.81-.36,13.57,2.07,26.23-7.96,39.29-10.87,7.58-1.69,9.71-1.74,17.26.08Z"
                            fill={colorWhite}
                            variants={pathDrawVariants}
                            transition={{ duration: 1.6, ease: "easeInOut", delay: 0.3 }}
                        />
                    </motion.g>

                    {/* Oliveira */}
                    <motion.g variants={oliveiraGroupVariants}>
                        {/* Tronco */}
                        <motion.path
                            d="M60.67,64.26c-.13-.62-.13-1.25-.36-1.76-.31.69-.72,1.17-1.98.76l5.88-10.65c-.6-.22-1.13-.52-1.59-.93-6.3,7.75-10.45,16.92-12.33,26.91-.42-1.16-.61-3.06-.31-4.32.02-.08.04-.16.06-.24-.68.39-1.06,1.57-1.62,1.9,2.11,3.09.85,11.22,1.79,16.47,1.12,6.25,3.58,12.59,8.98,16.09-3.57-4.97-3.99-7.1-5.7-12.62-.61-1.98-1.89-3.8.07-6.12.04-.01.09-.03.13-.05-.26-.33-.42-.66-.52-1-.01.5-.13.86-.86.97-.47-7.25.98-14.77,3.76-21.25.84-1.97,2.65-3.67,4.6-4.15Z"
                            fill={colorWhite}
                            variants={{
                                hidden: { pathLength: 0, opacity: 0, scaleY: 0.1, originY: 1 },
                                visible: { pathLength: 1, opacity: 1, scaleY: 1, originY: 1 },
                            }}
                            transition={{ duration: 3.0, ease: [0.25, 0.1, 0.25, 1] }}
                        />

                        {/* Folhas e fruto */}
                        <motion.path d="M50.04,74.02c3.6-13.69,4.23-26.91-3.42-39.54-.12-.24-.78-.53-1-.42-.17.08-.6.44-.68.65-5.83,13.73-6.77,28.9,3.37,41.04.04.05.07.12.11.17.56-.32.94-1.51,1.62-1.9Z" fill={colorWhite} variants={folhaVariants} />
                        <motion.path d="M80.14,63.94c-.31-.11-1.06-.13-1.4.02-10.88,4.43-23.06,10.89-25.5,23.57-.08.43-.05.83-.06,1.16.1.33.26.66.52,1,8.38-2.82,15.82-7.89,21.07-15.05.87-1.19,7.51-9.96,5.37-10.7Z" fill={colorWhite} variants={folhaVariants} />
                        <motion.path d="M64.26,52.52c-.51-3.55-.19-7.01.93-10.42.95-2.92,1.14-5.69,1.4-8.71l.93,2.72,3.28-6.17c.46-.86.88-1.69,1.76-2.24l-4.17,9.6c-1.58,3.78-4.67,10.31-3.24,14.24,10.15-5.33,15.88-16.5,14.82-27.74-.17-1.78-.98-8.4-2.94-8.59-1.63-.15-6.09,4.24-7.59,5.69-8.01,7.78-12.04,20.32-6.83,30.76,0,0,0,0,0,0,.46.41.99.72,1.59.93l.05-.09Z" fill={colorWhite} variants={folhaVariants} />
                        <motion.path d="M60.81,64.22c3.71,3.7,15.09-2.94,13.1-7.14-1.41-2.97-10.16-1.08-13.14,4.4-.18.34-.31.69-.46,1.01.22.51.23,1.14.36,1.76.05-.01.09-.03.14-.04Z" fill={colorWhite} variants={frutoVariants} />
                    </motion.g>
                </motion.svg>
            </div>

            {/* Referência em Estilo Badge - Premium e Sincronizada */}
            <motion.div
                className="mt-6 px-6 md:px-10 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-center gap-4 md:gap-6 w-[95%] max-w-[400px]"
                variants={fadeInVariants}
                transition={{ delay: 5.0, duration: 1.5 }}
            >
                <div className="h-px flex-1 bg-linear-to-r from-transparent via-white/10 to-transparent" />
                <span className="text-[10px] md:text-sm text-white/40 uppercase tracking-[0.4em] md:tracking-[0.8em] font-light whitespace-nowrap ml-[0.4em] md:ml-[0.8em]">
                    Apocalipse 22:1-2
                </span>
                <div className="h-px flex-1 bg-linear-to-l from-transparent via-white/10 to-transparent" />
            </motion.div>

            {/* Aura de fundo Otimizada (Evita Glitch no iOS) */}
            <motion.div
                className="absolute inset-0 bg-[radial-gradient(circle,rgba(112,136,54,0.15)_0%,transparent_70%)] blur-3xl -z-10 transform-gpu"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 3, delay: 0.8 }}
            />
        </div>
    );
};

export default AnimatedLogo;
