"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface FadeInProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
    delay?: number;
    direction?: "up" | "down" | "left" | "right";
    fullWidth?: boolean;
}

export default function FadeIn({
    children,
    delay = 0,
    direction = "up",
    fullWidth = false,
    className,
    ...props
}: FadeInProps) {
    const directions = {
        up: { y: 40, x: 0 },
        down: { y: -40, x: 0 },
        left: { x: 40, y: 0 },
        right: { x: -40, y: 0 },
    };

    return (
        <motion.div
            initial={{
                opacity: 0,
                ...directions[direction]
            }}
            whileInView={{
                opacity: 1,
                x: 0,
                y: 0
            }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{
                duration: 0.7,
                delay: delay,
                ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className={`${fullWidth ? "w-full" : ""} ${className || ""}`}
            {...props}
        >
            {children}
        </motion.div>
    );
}
