'use client';
import React, { useRef, useEffect, useState } from 'react';
import Reveal from '@/components/Reveal';
import { motion } from 'framer-motion';
import ImageWithFallback from '@/components/ImageWithFallback';
import type { SiteChurches } from '@/lib/site-content/types';
import { EditorialSection, SectionTitle, Highlight, Period, TextLink } from '@/components/site/Editorial';

interface MissionsProps {
    content: SiteChurches;
}

/** "Igreja Paraíso — Caramuru" → "Caramuru": o prefixo se repete em todo cartão. */
function shortName(name: string): string {
    const parts = name.split(/\s+[—–-]\s+/);
    return parts.length > 1 ? parts.slice(1).join(' — ') : name;
}

/** Esconde a cidade quando ela só repete o nome ("Caramuru" / "Caramuru"). */
function showLocation(name: string, location: string): boolean {
    const loc = location.trim();
    if (!loc) return false;
    const short = shortName(name).toLowerCase();
    return !loc.toLowerCase().startsWith(short);
}

const Missions: React.FC<MissionsProps> = ({ content }) => {
    const [width, setWidth] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

    // Sede primeiro (isHeadquarters), depois o resto na ordem da API.
    const churches = [...content.items].sort((a, b) => {
        if (a.isHeadquarters === b.isHeadquarters) return 0;
        return a.isHeadquarters ? -1 : 1;
    });

    useEffect(() => {
        const updateWidth = () => {
            if (carouselRef.current) {
                setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, [churches.length]);

    // Sem igrejas publicadas (ou API fora): a seção não existe.
    if (churches.length === 0) return null;

    return (
        <EditorialSection id="missoes" label={content.badge} layout="split">
            <Reveal>
                <div className="mb-12 md:mb-14">
                    <SectionTitle className="mb-6">
                        {content.titlePart1} <Highlight>{content.titleHighlight}</Highlight>
                        <Period />
                    </SectionTitle>
                    <p className="m-0 max-w-[40rem] text-[17px] leading-[1.65] text-ink-muted">
                        {content.intro}
                    </p>
                </div>
            </Reveal>

            <div className="relative">
                <motion.div
                    ref={carouselRef}
                    className="cursor-grab overflow-hidden active:cursor-grabbing"
                    whileTap={{ cursor: "grabbing" }}
                >
                    <motion.div
                        drag="x"
                        dragConstraints={{ right: 0, left: -width }}
                        className="flex gap-6 pb-6"
                    >
                        {churches.map((church) => (
                            <motion.div
                                key={church.name}
                                className="group flex min-w-[260px] select-none flex-col md:min-w-[300px]"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden rounded-md border border-hairline bg-paper-soft">
                                    <ImageWithFallback
                                        src={church.image}
                                        alt={church.name}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                        draggable={false}
                                    />
                                </div>

                                {/* Missões = sobre o lugar. O time pastoral vive em /time-pastoral. */}
                                <div className="mt-5 flex flex-1 flex-col gap-3 border-t border-hairline pt-5">
                                    <span
                                        className={`text-[11px] font-medium uppercase tracking-[0.16em] ${church.isHeadquarters ? 'text-detail' : 'text-detail-blue'}`}
                                    >
                                        {church.isHeadquarters ? 'Sede' : 'Filial'}
                                    </span>
                                    <span>
                                        <span className="block text-[22px] font-medium leading-tight tracking-[-0.01em] text-ink">
                                            {shortName(church.name)}
                                        </span>
                                        {showLocation(church.name, church.location) && (
                                            <span className="mt-1.5 block truncate text-sm text-ink-muted">
                                                {church.location}
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                <div className="mt-4 border-t border-hairline pt-6">
                    <TextLink href="/nossas-igrejas">Ver todas as igrejas</TextLink>
                </div>
            </div>
        </EditorialSection>
    );
};

export default Missions;
