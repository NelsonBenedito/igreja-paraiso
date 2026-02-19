"use client";

import { motion } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import { VariantProps } from "class-variance-authority";

interface AnimatedButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean;
    scaleOnHover?: boolean;
    className?: string;
}

const MotionButton = motion.create(Button);

export default function AnimatedButton({
    className,
    variant,
    size,
    asChild = false,
    scaleOnHover = true,
    children,
    ...props
}: AnimatedButtonProps) {
    // Omit onDrag to avoid conflict between HTML drag events and Framer Motion drag events
    const { onDrag, ...motionProps } = props as any;

    return (
        <MotionButton
            variant={variant}
            size={size}
            className={cn(className)}
            whileHover={scaleOnHover ? { scale: 1.05 } : {}}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            asChild={asChild}
            {...motionProps}
        >
            {children}
        </MotionButton>
    );
}
