'use client';
import React, { useState } from 'react';
import Reveal from '@/components/Reveal';
import { Copy, Check } from 'lucide-react';
import {
    EditorialSection,
    Highlight,
    Period,
    PillLink,
    SectionTitle,
} from '@/components/site/Editorial';
import type { SiteGiving } from '@/lib/site-content/types';

interface OfertorioSectionProps {
    content: SiteGiving;
}

const ROW = 'flex items-center justify-between gap-4 border-b border-hairline py-6';
const TERM = 'text-xs font-medium uppercase tracking-[0.16em] text-ink-muted';
const VALUE = 'm-0 min-w-0 text-right text-base font-medium text-ink break-words';

const OfertorioSection: React.FC<OfertorioSectionProps> = ({ content }) => {
    const [copied, setCopied] = useState(false);

    // Conta/CNPJ vazios = não mostrar os dados bancários (placeholders não devem parecer reais).
    const showBankTransfer = Boolean(content.account.trim() && content.holderDocument.trim());
    const showPix = Boolean(content.pixKey.trim());

    const handleCopyPix = () => {
        navigator.clipboard.writeText(content.pixKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const bankLabel = [content.bankName.trim(), content.bankCode.trim()].filter(Boolean).join(' · ');
    const bankRows: Array<[string, string]> = showBankTransfer
        ? (
              [
                  ['Banco', bankLabel],
                  ['Agência', content.agency.trim()],
                  ['Conta', content.account.trim()],
                  ['Favorecido', content.holderName.trim()],
                  ['CNPJ', content.holderDocument.trim()],
              ] as Array<[string, string]>
          ).filter(([, value]) => value)
        : [];

    const titlePart2 = content.titlePart2.trim().replace(/\.$/, '');

    return (
        <EditorialSection id="ofertorio" label={content.badge} tone="soft" layout="split">
            <div className="flex flex-wrap gap-14">
                <div className="min-w-0 flex-[1_1_22rem]">
                    <Reveal>
                        <SectionTitle className="mb-8">
                            {content.titlePart1} <Highlight>{content.titleHighlight}</Highlight>{' '}
                            {titlePart2}
                            <Period />
                        </SectionTitle>
                        <p className="mb-10 text-[1.0625rem] leading-relaxed text-ink-muted">{content.intro}</p>

                        {/* Campanha de cotas — fora do contrato site-content; mantida local */}
                        <div className="border-t border-hairline pt-8">
                            <h3 className="m-0 mb-2 text-xl font-semibold tracking-tight text-ink">
                                Campus Paraíso
                            </h3>
                            <p className="mb-8 text-sm leading-relaxed text-ink-muted md:text-base">
                                Cotas mensais para construir o novo campus.
                            </p>
                            <PillLink href="/cotas/campus" variant="ink">
                                Ver as cotas
                            </PillLink>
                        </div>
                    </Reveal>
                </div>

                {showPix || bankRows.length > 0 ? (
                    <div className="min-w-0 flex-[1_1_22rem]">
                        <Reveal delay={0.1}>
                            <dl className="m-0 border-t border-ink">
                                {/* TODO: confirmar chave com a tesouraria (domínio antigo) */}
                                {showPix ? (
                                    <div className={ROW}>
                                        <dt className={TERM}>Chave PIX</dt>
                                        <dd className="m-0 flex min-w-0 items-center gap-3 text-base font-medium text-ink">
                                            <span className="min-w-0 break-all text-right">{content.pixKey}</span>
                                            <button
                                                type="button"
                                                onClick={handleCopyPix}
                                                aria-label="Copiar chave PIX"
                                                title="Copiar chave PIX"
                                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-hairline text-ink transition-colors hover:border-ink/40"
                                            >
                                                {copied ? (
                                                    <Check className="h-4 w-4 text-detail" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </button>
                                        </dd>
                                    </div>
                                ) : null}
                                {bankRows.map(([term, value]) => (
                                    <div key={term} className={ROW}>
                                        <dt className={TERM}>{term}</dt>
                                        <dd className={VALUE}>{value}</dd>
                                    </div>
                                ))}
                            </dl>
                        </Reveal>
                    </div>
                ) : null}
            </div>
        </EditorialSection>
    );
};

export default OfertorioSection;
