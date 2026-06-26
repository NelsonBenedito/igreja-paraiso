'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar, Clock, MapPin, ChevronLeft, UserPlus, CheckCircle2,
    Globe, Monitor, Video, Share2, ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import EventRegistrationModal from '@/components/EventRegistrationModal';
import type { SiteEvent } from '@/lib/events/types';
import { formatEventDate } from '@/lib/events/display';

interface Props {
    event: SiteEvent;
    isRegisteredServer: boolean;
}

const FORMAT_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
    IN_PERSON: { label: 'Presencial', icon: <MapPin size={14} /> },
    ONLINE: { label: 'Online', icon: <Globe size={14} /> },
    HYBRID: { label: 'Híbrido', icon: <Monitor size={14} /> },
};

export default function EventoClient({ event, isRegisteredServer }: Props) {
    const [isRegistered, setIsRegistered] = useState(isRegisteredServer);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSuccess = () => {
        setIsRegistered(true);
    };

    const formatInfo = FORMAT_LABELS[event.format] ?? FORMAT_LABELS.IN_PERSON;

    const isRegistrationClosed = event.registration_closes_at
        ? new Date(event.registration_closes_at) < new Date()
        : false;

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            await navigator.share({ title: event.title, url });
        } else {
            await navigator.clipboard.writeText(url);
            alert('Link copiado!');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-paraiso-blue-deep pt-24 pb-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-20">
                {/* Voltar */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-paraiso-green transition-colors mb-8 text-sm font-bold uppercase tracking-widest"
                >
                    <ChevronLeft size={16} /> Voltar para o início
                </Link>

                <div className="bg-white dark:bg-paraiso-blue-dark rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-white/5">
                    {/* Hero */}
                    <div className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full">
                        {(event.cover_image_url || event.image_url) ? (
                            <img
                                src={event.cover_image_url || event.image_url!}
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-paraiso-blue via-paraiso-blue-dark to-paraiso-green/30 flex items-center justify-center">
                                <Calendar size={80} className="text-white/20" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                        <div className="absolute bottom-0 left-0 w-full p-6 sm:p-10 md:p-16">
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                {event.tag && (
                                    <span className="px-3 py-1.5 bg-paraiso-green text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                                        {event.tag}
                                    </span>
                                )}
                                <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5">
                                    {formatInfo.icon} {formatInfo.label}
                                </span>
                                {event.tags?.map(t => (
                                    <span
                                        key={t.id}
                                        className="px-3 py-1.5 bg-white/10 text-white/80 text-[10px] font-bold uppercase tracking-wider rounded-full"
                                    >
                                        {t.name}
                                    </span>
                                ))}
                            </div>

                            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                                {event.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-white/80 font-bold text-sm">
                                <div className="flex items-center gap-2">
                                    <Calendar size={18} className="text-paraiso-green" />
                                    <span>{formatEventDate(event.date)}</span>
                                </div>
                                {event.time_start && (
                                    <div className="flex items-center gap-2">
                                        <Clock size={18} className="text-paraiso-green" />
                                        <span>
                                            {event.time_start.slice(0, 5)}
                                            {event.time_end && ` - ${event.time_end.slice(0, 5)}`}
                                        </span>
                                    </div>
                                )}
                                {event.location && (
                                    <div className="flex items-center gap-2">
                                        <MapPin size={18} className="text-paraiso-green" />
                                        <span className="line-clamp-1">{event.location}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Conteúdo */}
                    <div className="p-6 sm:p-10 md:p-16 grid md:grid-cols-3 gap-8 md:gap-12">
                        {/* Coluna principal */}
                        <div className="md:col-span-2 space-y-8">
                            {/* Descrição curta */}
                            {event.short_description && (
                                <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                                    {event.short_description}
                                </p>
                            )}

                            {/* Sobre o Evento */}
                            <div>
                                <h2 className="text-xl sm:text-2xl font-black text-paraiso-blue dark:text-white uppercase tracking-widest mb-6">
                                    Sobre o Evento
                                </h2>
                                {event.details_html ? (
                                    <div
                                        className="prose prose-slate dark:prose-invert max-w-none prose-lg prose-headings:font-black prose-headings:tracking-tight prose-a:text-paraiso-green"
                                        dangerouslySetInnerHTML={{ __html: event.details_html }}
                                    />
                                ) : event.description ? (
                                    <div className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-wrap text-base sm:text-lg">
                                        {event.description}
                                    </div>
                                ) : (
                                    <p className="text-slate-400 dark:text-slate-500 italic">
                                        Nenhuma descrição fornecida para este evento.
                                    </p>
                                )}
                            </div>

                            {/* Vídeo */}
                            {event.video_url && (
                                <div>
                                    <h3 className="text-sm font-black text-paraiso-green uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Video size={16} /> Vídeo
                                    </h3>
                                    <div className="aspect-video rounded-2xl overflow-hidden bg-black">
                                        <iframe
                                            src={event.video_url}
                                            className="w-full h-full"
                                            allowFullScreen
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-slate-50 dark:bg-white/5 p-6 sm:p-8 rounded-2xl sm:rounded-3xl h-fit space-y-6 sticky top-28">
                                {/* Data e hora */}
                                <div>
                                    <h3 className="text-xs font-black text-paraiso-green uppercase tracking-widest mb-3">
                                        Data e Horário
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 text-slate-700 dark:text-white font-bold">
                                            <Calendar size={20} className="text-paraiso-green shrink-0" />
                                            <span>{formatEventDate(event.date)}</span>
                                        </div>
                                        {event.time_start && (
                                            <div className="flex items-center gap-3 text-slate-700 dark:text-white font-bold">
                                                <Clock size={20} className="text-paraiso-green shrink-0" />
                                                <span>
                                                    {event.time_start.slice(0, 5)}
                                                    {event.time_end && ` às ${event.time_end.slice(0, 5)}`}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Local */}
                                {(event.location || event.format !== 'ONLINE') && (
                                    <div>
                                        <h3 className="text-xs font-black text-paraiso-green uppercase tracking-widest mb-3">
                                            Localização
                                        </h3>
                                        <div className="flex items-start gap-3 text-slate-700 dark:text-white font-bold">
                                            <MapPin size={20} className="text-paraiso-green shrink-0 mt-0.5" />
                                            <span>{event.location || 'Local a definir'}</span>
                                        </div>
                                    </div>
                                )}

                                {/* Link online */}
                                {event.online_url && (event.format === 'ONLINE' || event.format === 'HYBRID') && (
                                    <div>
                                        <h3 className="text-xs font-black text-paraiso-green uppercase tracking-widest mb-3">
                                            Transmissão Online
                                        </h3>
                                        <a
                                            href={event.online_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-2 text-paraiso-green font-bold text-sm hover:underline"
                                        >
                                            <ExternalLink size={16} /> Acessar link
                                        </a>
                                    </div>
                                )}

                                {/* Termos */}
                                {event.terms_url && (
                                    <a
                                        href={event.terms_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block text-xs text-slate-400 hover:text-paraiso-green transition-colors underline"
                                    >
                                        Termos e condições
                                    </a>
                                )}

                                {/* Ações */}
                                <div className="pt-6 border-t border-slate-200 dark:border-white/10 space-y-3">
                                    {isRegistrationClosed ? (
                                        <div className="w-full text-center py-4 rounded-full bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest text-xs">
                                            Inscrições encerradas
                                        </div>
                                    ) : isRegistered ? (
                                        <div className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-paraiso-green/10 text-paraiso-green font-black uppercase tracking-widest text-xs border border-paraiso-green/30">
                                            <CheckCircle2 size={16} />
                                            Inscrição Confirmada
                                        </div>
                                    ) : (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setIsModalOpen(true)}
                                            className="w-full flex items-center justify-center gap-3 py-4 rounded-full bg-paraiso-green text-white font-black uppercase tracking-widest text-sm hover:bg-paraiso-blue transition-all shadow-xl"
                                        >
                                            <UserPlus size={18} />
                                            Inscrever-se Agora
                                        </motion.button>
                                    )}
                                    <button
                                        onClick={handleShare}
                                        className="w-full flex items-center justify-center gap-2 py-3 rounded-full border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider hover:border-paraiso-green hover:text-paraiso-green transition-all"
                                    >
                                        <Share2 size={14} /> Compartilhar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <EventRegistrationModal
                    event={event}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={handleSuccess}
                />
            )}
        </div>
    );
}
