'use client';
import React from 'react';
import ImageWithFallback from '@/components/ImageWithFallback';
import { EditorialSection, Highlight, Period, PillLink, SectionTitle } from '@/components/site/Editorial';
import type { SiteCelulas } from '@/lib/site-content/types';

const CELULAS_WHATSAPP_URL =
    'https://wa.me/5527998757008?text=Olá,+gostaria+de+falar+com+o+setor+de+secretaria+de+células!+';

/** Máximo de fotos no arco (desktop); no celular as das pontas somem (7). */
const MAX_PHOTOS = 9;

interface CelulasSectionProps {
    content: SiteCelulas;
    /**
     * URLs das fotos do arco 3D. O contrato do painel ainda não manda fotos de
     * células, então hoje chega sempre vazio e a galeria não aparece.
     */
    photos?: string[];
}

/** Título em 3 partes; o "." final vira o <Period /> verde (outra pontuação final dispensa o ponto). */
function TitleParts({ part1, highlight, part2 }: { part1: string; highlight: string; part2: string }) {
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
                    {/* A 3.ª parte quebra linha no desktop, como no layout aprovado. */}
                    {i > 0 && (i === 2 ? <><br className="hidden md:block" /> </> : ' ')}
                    {p.highlight ? <Highlight>{p.text}</Highlight> : p.text}
                </React.Fragment>
            ))}
            {period && <Period />}
        </>
    );
}

/** Fotos em arco, como o interior de um cilindro. Sem fotos, não renderiza nada. */
function PhotoArc({ photos }: { photos: string[] }) {
    const list = photos.filter((p) => p.trim() !== '').slice(0, MAX_PHOTOS);
    if (list.length === 0) return null;
    const center = (list.length - 1) / 2;
    return (
        <div className="mx-auto mt-14 flex h-[21.25rem] w-full items-center justify-center gap-2.5 md:mt-6 md:h-[40rem] md:gap-[22px]">
            {list.map((src, k) => {
                const i = k - center;
                const a = Math.abs(i);
                const style = {
                    '--w': `${150 + a * 22}px`,
                    '--h': `${230 + a * 54}px`,
                    transform: `perspective(900px) rotateY(${-i * 11}deg)`,
                } as React.CSSProperties;
                return (
                    <div
                        key={`${k}-${src}`}
                        style={style}
                        className={`relative h-[calc(var(--h)*0.6)] w-[calc(var(--w)*0.6)] shrink-0 overflow-hidden rounded-[12px] border border-hairline bg-paper-soft md:h-[var(--h)] md:w-[var(--w)] md:rounded-[18px] ${a > 3 ? 'hidden md:block' : ''}`}
                    >
                        <ImageWithFallback
                            src={src}
                            alt="Foto de célula"
                            fill
                            sizes="(min-width: 768px) 240px, 150px"
                            className="object-cover"
                        />
                    </div>
                );
            })}
        </div>
    );
}

const CelulasSection: React.FC<CelulasSectionProps> = ({ content, photos = [] }) => {
    return (
        <EditorialSection
            id="celulas"
            label={content.badge || undefined}
            layout="stack"
            className="overflow-hidden"
            innerClassName="flex flex-col items-center text-center"
        >
            <SectionTitle size="xl" className="mb-7 lg:text-[6.5rem] lg:leading-[0.95] lg:tracking-[-0.05em]">
                <TitleParts
                    part1={content.titlePart1}
                    highlight={content.titleHighlight}
                    part2={content.titlePart2}
                />
            </SectionTitle>

            {content.paragraph1 && (
                <p className="m-0 max-w-[42.5rem] text-base leading-relaxed text-ink-muted md:text-lg">
                    {content.paragraph1}
                </p>
            )}
            {content.paragraph2 && !content.paragraph1.includes(content.paragraph2.trim()) && (
                <p className="m-0 mt-3 max-w-[42.5rem] text-base leading-relaxed text-ink-muted md:text-lg">
                    {content.paragraph2}
                </p>
            )}

            {content.ctaLabel && (
                <PillLink href={CELULAS_WHATSAPP_URL} variant="soft" className="mt-10">
                    {content.ctaLabel}
                </PillLink>
            )}

            <PhotoArc photos={photos} />

            {content.benefits.length > 0 && (
                <div className="mt-14 grid w-full grid-cols-1 border-t border-hairline text-left sm:grid-cols-2 lg:grid-cols-4">
                    {content.benefits.map((item, idx) => (
                        <div
                            key={`${idx}-${item.titulo}`}
                            className="flex flex-col gap-2.5 border-b border-hairline py-5 pr-6 sm:border-b-0 sm:pt-7"
                        >
                            <span className="text-xs font-medium tracking-[0.16em] text-detail">
                                {String(idx + 1).padStart(2, '0')}
                            </span>
                            <h3 className="m-0 text-lg font-medium tracking-[-0.01em] md:text-[1.1875rem]">
                                {item.titulo}
                            </h3>
                            {item.descricao && (
                                <p className="m-0 text-sm leading-relaxed text-ink-muted">{item.descricao}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {content.verseText && (
                <p className="mx-auto mb-0 mt-16 max-w-[40rem] text-center text-xl font-light italic leading-normal md:mt-[4.5rem] md:text-[1.375rem]">
                    &ldquo;{content.verseText}&rdquo;
                    {content.verseReference && (
                        <span className="mt-3 block text-xs font-medium not-italic uppercase tracking-[0.16em] text-ink-muted">
                            {content.verseReference}
                        </span>
                    )}
                </p>
            )}
        </EditorialSection>
    );
};

export default CelulasSection;
