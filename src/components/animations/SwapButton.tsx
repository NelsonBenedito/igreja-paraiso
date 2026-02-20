'use client';

import React from "react";
import { ArrowRight } from "lucide-react";

interface SwapButtonProps {
    text: string;
    href?: string;
    className?: string;
    onClick?: () => void;
}

const SwapButton: React.FC<SwapButtonProps> = ({ text, href, className, onClick }) => {

    const content = (
        <div
            className={`relative overflow-hidden rounded-full font-black uppercase tracking-widest flex items-center justify-between gap-0 group transition-all duration-300 ${className}`}
            style={{ minWidth: "160px", height: "48px" }}
        >
            {/* Background Layer */}
            <div className="absolute inset-0 bg-paraiso-green transition-colors duration-300 group-hover:bg-paraiso-blue"></div>

            {/* Text Container */}
            {/* We use padding to control text position. */}
            {/* Initial: Space on right (for icon). Padding-right large. */}
            {/* Hover: Space on left (for icon). Padding-left large. */}
            <div className="relative z-10 w-full h-full flex items-center justify-center transition-all duration-500 ease-in-out pl-6 pr-14 group-hover:pl-14 group-hover:pr-6">
                <span className="text-[11px] text-white whitespace-nowrap transition-all duration-500 ease-in-out">
                    {text}
                </span>
            </div>

            {/* Circle Icon */}
            {/* Initial: Right aligned (right-1) */}
            {/* Hover: Left aligned (left-1 or right: calc(100% - 44px)) */}
            {/* 160px width. Icon is 44px (10 + padding?). Icon is w-10 (40px). 
            right-1 = 4px inside right.
            left pos = 4px inside left.
            left-1 = left-1
            Total width = 100%. 
            right: calc(100% - 44px). 
            160px - 44px = 116px from right. -> left: 4px?
            Yes. 44px includes 40px icon + 4px margin?
            Actually, let's keep the formula. It relies on icon size (40px) + margin (4px).
        */}
            <div className="absolute top-1 bottom-1 w-10 h-10 bg-white rounded-full flex items-center justify-center text-paraiso-green shadow-sm transition-all duration-500 ease-in-out
            right-1 
            group-hover:right-[calc(100%-44px)] 
            group-hover:bg-white group-hover:text-paraiso-blue"
            >
                <ArrowRight size={16} />
            </div>
        </div>
    );

    if (href) {
        return (
            <a href={href} onClick={onClick} className="inline-block no-underline">
                {content}
            </a>
        );
    }

    return (
        <button onClick={onClick} className="inline-block bg-transparent p-0 border-0">
            {content}
        </button>
    );
};

export default SwapButton;
