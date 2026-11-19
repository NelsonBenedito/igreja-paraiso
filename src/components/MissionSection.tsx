'use client';
import React from 'react';
import Reveal from '@/components/Reveal';
import { EditorialSection, Highlight, Period, SectionTitle } from '@/components/site/Editorial';
import type { SiteMission } from '@/lib/site-content/types';

interface MissionSectionProps {
    content: SiteMission;
}

/**
 * Título em 3 partes (a do meio em destaque). O "." final vira o <Period /> verde;
 * se a última parte termina em outra pontuação (?, !), o ponto não é acrescentado.
 */
function EditorialTitleParts({ part1, highlight, part2 }: { part1: string; highlight: string; part2: string }) {
    const parts = [
        { text: part1, highlight: false },
        { text: highlight, highlight: true },
        { text: part2, highlight: false },
    ].filter((p) => p.text.trim() !== '');
    if (parts.length === 0) return null;
    const last = parts.length - 1;
    const lastText = parts[last].text.trimEnd();
    const period = !/[!?…]$/.test(lastText);
    parts[last] = { ...parts[last], text: lastText.replace(/\.$/, '') };
    return (
        <>
            {parts.map((p, i) => (
                <React.Fragment key={i}>
                    {i > 0 && ' '}
                    {p.highlight ? <Highlight>{p.text}</Highlight> : p.text}
                </React.Fragment>
            ))}
            {period && <Period />}
        </>
    );
}

const MissionSection: React.FC<MissionSectionProps> = ({ content }) => {
    return (
        <EditorialSection id="sobre" label={content.badge || undefined}>
            <Reveal>
                <SectionTitle size="xl" className="mb-10 md:mb-14">
                    <EditorialTitleParts
                        part1={content.titlePart1}
                        highlight={content.titleHighlight}
                        part2={content.titlePart2}
                    />
                </SectionTitle>

                {(content.paragraph1 || content.paragraph2) && (
                    <div className="flex max-w-[56.25rem] flex-col gap-4 text-base leading-relaxed text-ink-muted md:flex-row md:gap-14 md:text-lg">
                        {content.paragraph1 && <p className="m-0 md:flex-1">{content.paragraph1}</p>}
                        {content.paragraph2 && <p className="m-0 md:flex-1">{content.paragraph2}</p>}
                    </div>
                )}

                {content.quote && (
                    <figure className="m-0 mt-12 flex flex-col gap-4 border-t border-hairline pt-7 md:mt-24 md:flex-row md:gap-8 md:pt-10">
                        <span
                            aria-hidden="true"
                            className="text-6xl font-light leading-[0.7] text-detail md:text-8xl"
                        >
                            &ldquo;
                        </span>
                        <div className="min-w-0 flex-1">
                            <blockquote className="m-0 text-[1.375rem] font-light leading-[1.35] tracking-[-0.02em] md:text-[2.125rem] md:leading-[1.3]">
                                {content.quote}
                            </blockquote>
                            {content.signature && (
                                <figcaption className="mt-6 text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">
                                    {content.signature}
                                </figcaption>
                            )}
                        </div>
                    </figure>
                )}
            </Reveal>
        </EditorialSection>
    );
};

export default MissionSection;
