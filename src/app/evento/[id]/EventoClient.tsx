'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, ChevronLeft, CheckCircle2, UserPlus } from 'lucide-react';
import Link from 'next/link';
import EventRegistrationModal from '@/components/EventRegistrationModal';
import { eventRequiresPayment, formatEventPriceBrl } from '@/lib/events/types';

interface Event {
    id: string;
    title: string;
    description: string | null;
    date: string;
    time_start: string | null;
    time_end: string | null;
    location: string | null;
    image_url: string | null;
    tag: string | null;
    registration_price?: number | null;
}

interface Props {
    event: Event;
    isRegisteredServer: boolean;
    paymentReturnOk?: boolean;
}

const formatDate = (d: string) =>
    new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });

export default function EventoClient({ event, isRegisteredServer, paymentReturnOk = false }: Props) {
    const [isRegistered, setIsRegistered] = useState(isRegisteredServer);
    const [showModal, setShowModal] = useState(false);
    const requiresPayment = eventRequiresPayment(event.registration_price);

    useEffect(() => {
        if (paymentReturnOk) setIsRegistered(true);
    }, [paymentReturnOk]);

    const handleSuccess = () => {
        setIsRegistered(true);
        setShowModal(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-paraiso-blue-deep pt-24 pb-32">
            <div className="container mx-auto px-6 lg:px-20">
                {/* Voltar */}
                <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-paraiso-green transition-colors mb-8 text-sm font-bold uppercase tracking-widest">
                    <ChevronLeft size={16} /> Voltar para o início
                </Link>

                <div className="bg-white dark:bg-paraiso-blue-dark rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-white/5">
                    {/* Hero Section do Evento */}
                    <div className="relative h-[400px] md:h-[500px] w-full">
                        {event.image_url ? (
                            <img
                                src={event.image_url}
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-paraiso-blue/10 dark:bg-white/5 flex items-center justify-center">
                                <Calendar size={80} className="text-paraiso-blue/20 dark:text-white/20" />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                        
                        <div className="absolute bottom-0 left-0 w-full p-10 md:p-16">
                            {event.tag && (
                                <span className="inline-block px-4 py-2 bg-paraiso-green text-white text-xs font-black uppercase tracking-widest rounded-full mb-6">
                                    {event.tag}
                                </span>
                            )}
                            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-4">
                                {event.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-white/80 font-bold">
                                <div className="flex items-center gap-2">
                                    <Calendar size={18} className="text-paraiso-green" />
                                    <span>{formatDate(event.date)}</span>
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
                            </div>
                        </div>
                    </div>

                    {/* Detalhes do Evento */}
                    <div className="p-10 md:p-16 grid md:grid-cols-3 gap-12">
                        <div className="md:col-span-2">
                            <h2 className="text-2xl font-black text-paraiso-blue dark:text-white uppercase tracking-widest mb-6">
                                Sobre o Evento
                            </h2>
                            <div className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-wrap text-lg">
                                {event.description || 'Nenhuma descrição fornecida para este evento.'}
                            </div>
                        </div>

                        <div className="space-y-8 bg-slate-50 dark:bg-white/5 p-8 rounded-3xl h-fit">
                            <div>
                                <h3 className="text-sm font-black text-paraiso-green uppercase tracking-widest mb-4">
                                    Localização
                                </h3>
                                <div className="flex items-start gap-3 text-slate-700 dark:text-white font-bold">
                                    <MapPin size={24} className="text-paraiso-green shrink-0" />
                                    <span>{event.location || 'Local a definir'}</span>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-200 dark:border-white/10">
                                {paymentReturnOk && (
                                    <div className="mb-6 p-4 rounded-2xl bg-paraiso-green/10 border border-paraiso-green/30 text-paraiso-green text-xs font-bold leading-relaxed">
                                        Obrigado! Se o pagamento foi concluído, sua inscrição será confirmada em instantes.
                                    </div>
                                )}
                                {requiresPayment && !isRegistered && (
                                    <p className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-4">
                                        Inscrição: {formatEventPriceBrl(event.registration_price!)}
                                    </p>
                                )}
                                {isRegistered ? (
                                    <div className="w-full flex items-center justify-center gap-2 py-4 rounded-full bg-paraiso-green/10 text-paraiso-green font-black uppercase tracking-widest text-xs border border-paraiso-green/30">
                                        <CheckCircle2 size={16} />
                                        Inscrição Confirmada
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="w-full flex items-center justify-center gap-2 py-4 bg-paraiso-green text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-paraiso-blue transition-all shadow-md"
                                    >
                                        <UserPlus size={16} />
                                        Inscrever-se
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal multi-step de inscrição */}
            <EventRegistrationModal
                event={showModal ? event : null}
                onClose={() => setShowModal(false)}
                onSuccess={handleSuccess}
            />
        </div>
    );
}
