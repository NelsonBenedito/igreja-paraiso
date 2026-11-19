'use client';
import React, { useState, useEffect } from 'react';
import Reveal from './Reveal';
import ImageWithFallback from './ImageWithFallback';
import { motion } from 'framer-motion';
import { CalendarDays, CheckCircle2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { loadRegisteredEventIdsClient } from '@/lib/events/data-client';
import type { SiteEvent } from '@/lib/events/types';
import { eventCardContent } from '@/lib/events/display';
import { EditorialSection, SectionTitle, Period, TextLink } from '@/components/site/Editorial';

interface NewsSectionProps {
    events: SiteEvent[];
    registeredEventIds?: string[];
}

const formatDate = (d: string) =>
    new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

const NewsSection: React.FC<NewsSectionProps> = ({ events, registeredEventIds = [] }) => {
    const router = useRouter();
    const [registeredIds, setRegisteredIds] = useState<string[]>(registeredEventIds);

    const isRegistered = (id: string) => registeredIds.includes(id);

    // Auto-guarda: sem eventos ativos, a seção não existe no DOM.
    // Nada de "espaço em branco" nem mensagem de "sem eventos".
    if (!events || events.length === 0) return null;

    /* useEffect(() => {
        const fetchMyRegistrations = async () => {
            const ids = await loadRegisteredEventIdsClient();
            if (ids.length > 0) {
                setRegisteredIds(ids);
            }
        };
        fetchMyRegistrations();
    }, []); */

    return (
        <EditorialSection id="eventos" label="Eventos" layout="stack">
            <Reveal>
                <div className="mb-12 flex flex-wrap items-end justify-between gap-x-12 gap-y-6 md:mb-14">
                    <SectionTitle>
                        Acontece na Paraíso<Period />
                    </SectionTitle>
                    <TextLink href="/eventos">Ver todos os eventos</TextLink>
                </div>
            </Reveal>

            <div className={`grid gap-8 ${events.length === 1 ? 'max-w-lg' : events.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'}`}>
                    {events.map((item, idx) => {
                        const card = eventCardContent(item);
                        return (
                        <Reveal key={item.id} delay={idx * 0.1}>
                            <article
                                className="group flex h-full cursor-pointer flex-col"
                                onClick={() => router.push(`/evento/${item.id}`)}
                            >
                                <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-md border border-hairline bg-paper-soft">
                                    <ImageWithFallback
                                        src={card.imageUrl}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                        alt={item.title}
                                        fallback={
                                            <div className="flex h-full w-full items-center justify-center bg-paper-soft">
                                                <CalendarDays className="h-10 w-10 text-ink-muted/50" />
                                            </div>
                                        }
                                    />

                                    {isRegistered(item.id) && (
                                        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full border border-hairline bg-paper px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] text-detail">
                                            <CheckCircle2 size={11} />
                                            Inscrito
                                        </span>
                                    )}
                                </div>

                                <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium uppercase tracking-[0.14em] text-ink-muted">
                                    <span>
                                        <span className="text-detail" aria-hidden="true">●</span>{' '}
                                        {formatDate(item.date)}
                                    </span>
                                    {item.time_start && <span>{item.time_start.slice(0, 5)}</span>}
                                    {item.location && <span>{item.location}</span>}
                                </div>

                                <h3 className="m-0 mb-2 text-2xl font-medium leading-tight tracking-[-0.02em] text-ink transition-colors group-hover:text-detail">
                                    {item.title}
                                </h3>
                                {card.text && (
                                    <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-ink-muted">
                                        {card.text}
                                    </p>
                                )}

                                <div className="mt-auto flex items-center justify-between gap-4 border-t border-hairline pt-4">
                                    <span className="text-[15px] text-ink-muted">
                                        {card.tag ?? 'Saiba mais'}
                                    </span>
                                    {isRegistered(item.id) ? (
                                        <span className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-detail">
                                            <CheckCircle2 size={14} />
                                            Confirmada
                                        </span>
                                    ) : (
                                        <motion.button
                                            whileTap={{ scale: 0.97 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push(`/evento/${item.id}`);
                                            }}
                                            className="inline-flex min-h-11 items-center gap-2.5 text-sm font-medium text-ink transition-colors hover:text-detail"
                                        >
                                            Inscrever-se
                                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-paraiso-green text-white">
                                                <ArrowRight size={12} strokeWidth={2.2} />
                                            </span>
                                        </motion.button>
                                    )}
                                </div>
                            </article>
                        </Reveal>
                        );
                    })}
            </div>
        </EditorialSection>
    );
};

export default NewsSection;
