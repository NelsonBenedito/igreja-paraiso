"use client";

import { motion } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { VariantProps } from "class-variance-authority";

interface PremiumButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    href?: string;
    target?: React.HTMLAttributeAnchorTarget;
    rel?: string;
    children: React.ReactNode;
}

export default function PremiumButton({
    children,
    className,
    variant = "default",
    size = "lg",
    href,
    ...props
}: PremiumButtonProps) {

    // The inner content structure
    const InnerContent = (
        <>
            <span className="relative z-10 flex items-center gap-2">
                {children}
                <motion.span
                    variants={{
                        initial: { x: 0 },
                        hover: { x: 4 },
                        tap: { x: 0 }
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                    <ArrowRight className="w-4 h-4" />
                </motion.span>
            </span>

            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                variants={{
                    initial: { x: "-100%" },
                    hover: {
                        x: "200%",
                        transition: {
                            repeat: Infinity,
                            duration: 1.5,
                            ease: "linear",
                            repeatDelay: 0.5
                        }
                    }
                }}
                style={{ skewX: -20 }}
            />
        </>
    );

    const buttonClass = cn(
        buttonVariants({ variant, size, className }),
        "relative overflow-hidden group"
    );

    if (href) {
        return (
            <motion.div
                whileHover="hover"
                initial="initial"
                whileTap="tap"
                className="inline-block"
            >
                {/* Cast props to any to avoid TS conflicts between element types, accepting that we trust the user to pass valid anchor props when using href */}
                <Link href={href} className={buttonClass} {...(props as any)}>
                    {InnerContent}
                </Link>
            </motion.div>
        );
    }

    return (
        <motion.div
            whileHover="hover"
            initial="initial"
            whileTap="tap"
            className="inline-block"
        >
            <Button
                variant={variant}
                size={size}
                className={cn("relative overflow-hidden group", className)}
                {...props}
            >
                {InnerContent}
            </Button>
        </motion.div>
    );
}
