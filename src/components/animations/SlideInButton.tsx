'use client';


import React from "react";
import { ArrowRight } from "lucide-react";

interface SlideInButtonProps {
    text: string;
    href?: string;
    className?: string;
    onClick?: () => void;
}

const SlideInButton: React.FC<SlideInButtonProps> = ({ text, href, className, onClick }) => {

    const content = (
        <div
            className={`relative overflow-hidden rounded-full border border-current text-[11px] font-black uppercase tracking-widest px-8 py-3 flex items-center justify-center group transition-all duration-300 ${className}`}
        >
            <span className="relative z-10 transition-all duration-300 group-hover:text-white group-hover:-translate-x-2 whitespace-nowrap">
                {text}
            </span>

            {/* Icon: Absolute positioned, slides in from right */}
            <ArrowRight
                size={14}
                className="absolute right-5 z-10 text-white opacity-0 translate-x-4 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:translate-x-0"
            />

            {/* Fill Effect - Expanding Circle from Bottom Center */}
            {/* Circle positioned at bottom center, initially scaled to 0 */}
            <div className="absolute left-1/2 -bottom-[100%] -translate-x-1/2 w-[300%] aspect-square bg-paraiso-blue rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 ease-out z-0"></div>
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

export default SlideInButton;
