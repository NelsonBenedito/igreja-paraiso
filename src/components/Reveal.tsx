'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface RevealProps {
    children: React.ReactNode;
    width?: "fit-content" | "100%";
    delay?: number;
    direction?: "up" | "down" | "left" | "right";
}

const Reveal: React.FC<RevealProps> = ({ children, width = "fit-content", delay = 0, direction = "up" }) => {
    const directions = {
        up: { y: 40, x: 0 },
        down: { y: -40, x: 0 },
        left: { x: 40, y: 0 },
        right: { x: -40, y: 0 }
    };

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, ...directions[direction] },
                visible: { opacity: 1, y: 0, x: 0 },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1], delay }}
            style={{ width }}
        >
            {children}
        </motion.div>
    );
};

export default Reveal;
