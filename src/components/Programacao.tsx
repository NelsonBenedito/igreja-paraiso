'use client';
import React from 'react';
import { EditorialSection, Period, SectionTitle } from '@/components/site/Editorial';

import type { SiteSchedule } from '@/lib/events/types';

interface ProgramacaoProps {
    schedules: SiteSchedule[];
}

/** Exibe na ordem da API (`sortOrder`, dia da semana e hora), sem reordenar. */
const ProgramacaoSection: React.FC<ProgramacaoProps> = ({ schedules }) => {
    return (
        <EditorialSection id="agenda" label="Agenda">
            <SectionTitle className="mb-6">
                Programação semanal
                <Period />
            </SectionTitle>
            <p className="mb-10 max-w-xl text-base leading-relaxed text-ink-muted md:mb-14">
                Acreditamos que participar de uma comunidade é um dos melhores caminhos para encorajar o crescimento espiritual.
            </p>

            {schedules.length === 0 ? (
                <p className="m-0 border-t border-ink py-10 text-sm text-ink-muted">
                    Nenhuma programação cadastrada.
                </p>
            ) : (
                <ul className="m-0 list-none border-t border-ink p-0">
                    {schedules.map((item) => (
                        <li
                            key={item.id}
                            className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1 border-b border-hairline py-5 transition-colors hover:bg-ink/[0.02] md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_minmax(0,2fr)_2.75rem] md:items-center md:py-7"
                        >
                            <span className="text-xl font-medium tracking-[-0.02em] md:text-[1.625rem]">
                                {item.day_of_week}
                            </span>
                            <span className="text-xl font-light tabular-nums text-detail md:text-[1.625rem]">
                                {item.time_start.slice(0, 5)}
                            </span>
                            <span className="col-span-2 min-w-0 md:col-span-1">
                                <span className="block text-sm text-ink-muted md:text-[1.0625rem]">{item.title}</span>
                                {item.location && (
                                    <span className="mt-1 block text-xs uppercase tracking-[0.12em] text-ink-muted/80">
                                        {item.location}
                                    </span>
                                )}
                                {item.description && (
                                    <span className="mt-1 block text-sm text-ink-muted/80 line-clamp-1">
                                        {item.description}
                                    </span>
                                )}
                            </span>
                            <svg
                                className="hidden justify-self-end text-ink-muted md:block"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                aria-hidden="true"
                            >
                                <path d="M7 17L17 7M9 7h8v8" />
                            </svg>
                        </li>
                    ))}
                </ul>
            )}
        </EditorialSection>
    );
};

export default ProgramacaoSection;
