'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar, MapPin, ChevronLeft, CheckCircle2, ArrowRight,
    Globe, Monitor, Video, Share2, ExternalLink, UserPlus,
} from 'lucide-react';
import Link from 'next/link';
import EventRegistrationModal from '@/components/EventRegistrationModal';
import type { SiteEvent } from '@/lib/events/types';
import { eventCardContent, formatEventDate, isEventFinished, toEmbedUrl } from '@/lib/events/display';

interface Props {
    /** `details_html` chega já sanitizado pelo servidor (`page.tsx`). */
    event: SiteEvent;
    isRegisteredServer: boolean;
}

const FORMAT_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
    IN_PERSON: { label: 'Presencial', icon: <MapPin size={13} /> },
    ONLINE: { label: 'Online', icon: <Globe size={13} /> },
    HYBRID: { label: 'Híbrido', icon: <Monitor size={13} /> },
};

export default function EventoClient({ event, isRegisteredServer }: Props) {
    const [isRegistered, setIsRegistered] = useState(isRegisteredServer);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSuccess = () => {
        setIsRegistered(true);
    };

    const formatInfo = FORMAT_LABELS[event.format] ?? FORMAT_LABELS.IN_PERSON;
    const { imageUrl: heroImageUrl, tag: heroTag } = eventCardContent(event);

    const isFinished = isEventFinished(event);
    // Espaço nas pontas (vindo do painel) não pode esconder o vídeo.
    const videoUrl = event.video_url?.trim() ?? '';
    const videoEmbedUrl = videoUrl ? toEmbedUrl(videoUrl) : null;
    // Sem embed conhecido, só um link http(s) em nova aba; outro esquema não aparece.
    const videoLinkUrl = !videoEmbedUrl && /^https?:\/\//i.test(videoUrl) ? videoUrl : null;

    const isRegistrationClosed = event.registration_closes_at
        ? new Date(event.registration_closes_at) < new Date()
        : false;

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            await navigator.share({ title: event.title, url });
        } else {
            await navigator.clipboard.writeText(url);
            alert('Link copiado.');
        }
    };

    const timeLabel = event.time_start
        ? `${event.time_start.slice(0, 5)}${event.time_end ? ` – ${event.time_end.slice(0, 5)}` : ''}`
        : null;
    const placeLabel = event.location || (event.format !== 'ONLINE' ? 'Local a definir' : null);

    return (
        <div className="min-h-screen bg-paper text-ink">
            <div className="mx-auto max-w-[82rem] px-5 pb-24 pt-32 md:px-16 md:pb-32 md:pt-40">
                {/* Voltar */}
                <Link
                    href="/"
                    className="mb-10 inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.16em] text-ink-muted transition-colors hover:text-ink"
                >
                    <ChevronLeft size={14} /> Início
                </Link>

                {/* Cabeçalho */}
                <header className="border-b border-hairline pb-10 md:pb-14">
                    <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">
                        {heroTag && (
                            <span className="text-detail">{heroTag}</span>
                        )}
                        <span className="inline-flex items-center gap-1.5">
                            {formatInfo.icon} {formatInfo.label}
                        </span>
                        {/* A primeira tag já é a etiqueta em destaque. */}
                        {event.tags.slice(1).map(t => (
                            <span key={t.id}>{t.name}</span>
                        ))}
                    </div>

                    <h1 className="m-0 max-w-5xl text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.04em] text-ink md:text-[4.5rem]">
                        {event.title}
                    </h1>

                    <dl className="mt-10 grid gap-6 sm:grid-cols-3 sm:gap-10">
                        <div>
                            <dt className="mb-1.5 text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">Data</dt>
                            <dd className="m-0 text-lg font-medium text-ink">{formatEventDate(event.date)}</dd>
                        </div>
                        {timeLabel && (
                            <div>
                                <dt className="mb-1.5 text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">Horário</dt>
                                <dd className="m-0 text-lg font-medium text-ink">{timeLabel}</dd>
                            </div>
                        )}
                        {placeLabel && (
                            <div>
                                <dt className="mb-1.5 text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">Local</dt>
                                <dd className="m-0 text-lg font-medium text-ink">{placeLabel}</dd>
                            </div>
                        )}
                    </dl>
                </header>

                {/* Capa */}
                <div className="mt-10 aspect-[16/9] w-full overflow-hidden rounded-md border border-hairline bg-paper-soft md:mt-14 md:aspect-[21/9]">
                    {heroImageUrl ? (
                        <img
                            src={heroImageUrl}
                            alt={event.title}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <Calendar size={56} className="text-ink-muted/40" />
                        </div>
                    )}
                </div>

                {/* Conteúdo */}
                <div className="mt-14 grid gap-12 md:mt-20 lg:grid-cols-3 lg:gap-16">
                    {/* Coluna principal */}
                    <div className="space-y-12 lg:col-span-2">
                        {/* Descrição curta */}
                        {event.short_description && (
                            <p className="m-0 text-xl font-medium leading-relaxed tracking-[-0.01em] text-ink md:text-2xl">
                                {event.short_description}
                            </p>
                        )}

                        {/* Sobre o evento */}
                        <div>
                            <h2 className="mb-6 text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">
                                <span className="text-detail" aria-hidden="true">●</span> Sobre o evento
                            </h2>
                            {/* Sem o plugin de typography, `prose` não aplica nada: cores explícitas. */}
                            {event.details_html ? (
                                <div
                                    className="text-ink-muted leading-relaxed [&_a]:text-detail [&_a]:underline [&_p]:mb-4 [&_strong]:text-ink"
                                    dangerouslySetInnerHTML={{ __html: event.details_html }}
                                />
                            ) : event.description ? (
                                <div className="whitespace-pre-wrap text-base leading-relaxed text-ink-muted sm:text-lg">
                                    {event.description}
                                </div>
                            ) : (
                                <p className="text-ink-muted">
                                    Sem descrição por enquanto.
                                </p>
                            )}
                        </div>

                        {/* Vídeo */}
                        {(videoEmbedUrl || videoLinkUrl) && (
                            <div>
                                <h3 className="mb-6 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">
                                    <Video size={14} className="text-detail" /> Vídeo
                                </h3>
                                {videoEmbedUrl ? (
                                    <div className="aspect-video overflow-hidden rounded-md border border-hairline bg-black">
                                        <iframe
                                            src={videoEmbedUrl}
                                            title={`Vídeo: ${event.title}`}
                                            className="w-full h-full"
                                            allowFullScreen
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        />
                                    </div>
                                ) : videoLinkUrl ? (
                                    <a
                                        href={videoLinkUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 border-b border-current pb-1 text-sm font-medium text-ink transition-colors hover:text-detail"
                                    >
                                        <ExternalLink size={14} /> Assistir ao vídeo
                                    </a>
                                ) : null}
                            </div>
                        )}
                    </div>

                    {/* Lateral */}
                    <aside>
                        <div className="sticky top-28 space-y-6 border-t border-ink pt-6">
                            {/* Link online */}
                            {event.online_url && (event.format === 'ONLINE' || event.format === 'HYBRID') && (
                                <div>
                                    <h3 className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">
                                        Online
                                    </h3>
                                    <a
                                        href={event.online_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 border-b border-current pb-1 text-sm font-medium text-ink transition-colors hover:text-detail"
                                    >
                                        <ExternalLink size={14} /> Acessar transmissão
                                    </a>
                                </div>
                            )}

                            {/* Ações */}
                            <div className="space-y-3">
                                {isFinished || isRegistrationClosed ? (
                                    <div className="w-full rounded-full border border-hairline bg-paper-soft py-4 text-center text-sm font-medium text-ink-muted">
                                        {isFinished ? 'Evento encerrado' : 'Inscrições encerradas'}
                                    </div>
                                ) : isRegistered ? (
                                    <>
                                        <div className="flex w-full items-center justify-center gap-2 rounded-full border border-hairline bg-paper-soft py-4 text-sm font-medium text-detail">
                                            <CheckCircle2 size={16} />
                                            Inscrição confirmada
                                        </div>
                                        {/* O mesmo e-mail pode inscrever familiares e amigos. */}
                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-hairline text-sm font-medium text-ink transition-colors hover:border-ink/30"
                                        >
                                            <UserPlus size={14} /> Inscrever outra pessoa
                                        </button>
                                    </>
                                ) : (
                                    <motion.button
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setIsModalOpen(true)}
                                        className="flex min-h-12 w-full items-center gap-3.5 rounded-full bg-ink py-1.5 pl-1.5 pr-6 text-sm font-medium text-paper transition-opacity hover:opacity-90"
                                    >
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paraiso-green text-white">
                                            <ArrowRight size={15} />
                                        </span>
                                        Inscrever-se
                                    </motion.button>
                                )}
                                <button
                                    onClick={handleShare}
                                    className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-hairline bg-paper-soft text-sm font-medium text-ink transition-colors hover:border-ink/30"
                                >
                                    <Share2 size={14} /> Compartilhar
                                </button>
                            </div>

                            {/* Termos */}
                            {event.terms_url && (
                                <a
                                    href={event.terms_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block text-xs text-ink-muted underline transition-colors hover:text-ink"
                                >
                                    Termos e condições
                                </a>
                            )}
                        </div>
                    </aside>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && !isFinished && (
                <EventRegistrationModal
                    event={event}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    );
}
