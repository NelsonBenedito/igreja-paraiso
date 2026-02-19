"use client";

import { motion, Variants } from "framer-motion";

interface StaggeredTextProps {
    text: string;
    className?: string;
    delay?: number;
    stagger?: number;
}

export default function StaggeredText({
    text,
    className,
    delay = 0,
    stagger = 0.05,
}: StaggeredTextProps) {
    const letters = text.split("");

    const container: Variants = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: stagger, delayChildren: delay * i },
        }),
    };

    const child: Variants = {
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
    };

    return (
        <motion.div
            className={className}
            variants={container}
            initial="hidden"
            animate="visible"
        >
            {letters.map((letter, index) => (
                <motion.span variants={child} key={index}>
                    {letter}
                </motion.span>
            ))}
        </motion.div>
    );
}

// Another variant for splitting by words instead of characters
export function StaggeredWords({
    text,
    className,
    delay = 0,
    stagger = 0.1,
}: StaggeredTextProps) {
    const words = text.split(" ");

    const container: Variants = {
        hidden: { opacity: 1 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: stagger, delayChildren: delay * i },
        }),
    };

    const word: Variants = {
        hidden: {
            opacity: 0,
            y: 20,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
    };

    // return (
    //     <motion.div
    //         variants={container}
    //         className={`${className} flex flex-wrap gap-2`}
    //     >
    //         {words.map((w, i) => (
    //             <motion.span key={i} variants={word} className="mr-2">
    //                 {w}
    //             </motion.span>
    //         ))}
    //     </motion.div>
    // );

    // Simpler return for now to avoid layout shift issues with flex-wrap
    return (
        <motion.span
            className={className}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            {words.map((w, index) => (
                <motion.span variants={word} key={index} className="inline-block mr-[0.2em] last:mr-0">
                    {w}
                </motion.span>
            ))}
        </motion.span>
    );

}
