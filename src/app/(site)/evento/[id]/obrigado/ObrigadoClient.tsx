'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle, ChevronLeft, Loader2 } from 'lucide-react';
import { pollOrderPayment } from '@/lib/events/data-client';
import { fetchOrderPayment } from '@/lib/events/client';
import type { OrderPaymentStatus } from '@/lib/events/types';

interface Props {
    eventId: string;
    eventTitle: string;
    orderId: string | null;
}

const COPY: Record<OrderPaymentStatus | 'TIMEOUT', { title: string; body: string }> = {
    PENDING: {
        title: 'Aguardando confirmação',
        body: 'Recebemos seu pedido. Assim que o pagamento for compensado, sua inscrição é confirmada e os bilhetes seguem por e-mail.',
    },
    CONFIRMED: {
        title: 'Inscrição confirmada!',
        body: 'Seu pagamento foi confirmado e sua vaga está garantida. Os bilhetes foram enviados para o seu e-mail.',
    },
    FAILED: {
        title: 'Pagamento não concluído',
        body: 'Não conseguimos confirmar seu pagamento. Nenhum valor foi cobrado — você pode tentar a inscrição novamente.',
    },
    EXPIRED: {
        title: 'Cobrança expirada',
        body: 'O prazo para pagamento terminou e a reserva foi liberada. Você pode iniciar uma nova inscrição.',
    },
    TIMEOUT: {
        title: 'Ainda processando',
        body: 'A confirmação está a demorar mais do que o habitual. Você receberá um e-mail assim que o pagamento for compensado.',
    },
};

export default function ObrigadoClient({ eventId, eventTitle, orderId }: Props) {
    const [status, setStatus] = useState<OrderPaymentStatus | 'TIMEOUT'>('PENDING');
    const [isPolling, setIsPolling] = useState(!!orderId);

    useEffect(() => {
        if (!orderId) return;
        const controller = new AbortController();

        // O redirect do Asaas não é prova de pagamento — só o estado da API é.
        void fetchOrderPayment(eventId, orderId)
            .then(initial => {
                if (controller.signal.aborted) return;
                setStatus(initial.status);
                if (initial.status !== 'PENDING') {
                    setIsPolling(false);
                    return;
                }
                return pollOrderPayment(eventId, orderId, {
                    signal: controller.signal,
                    onUpdate: s => setStatus(s.status),
                }).then(final => {
                    if (controller.signal.aborted) return;
                    setStatus(final ? final.status : 'TIMEOUT');
                    setIsPolling(false);
                });
            })
            .catch(() => {
                if (!controller.signal.aborted) setIsPolling(false);
            });

        return () => controller.abort();
    }, [eventId, orderId]);

    const copy = COPY[status];
    const isError = status === 'FAILED' || status === 'EXPIRED';
    const Icon = status === 'CONFIRMED' ? CheckCircle2 : isError ? AlertCircle : Clock;
    const iconColor = status === 'CONFIRMED'
        ? 'text-paraiso-green'
        : isError ? 'text-red-500' : 'text-amber-500';

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-white dark:bg-[#0a1420]">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md text-center space-y-6"
            >
                <Icon className={`w-20 h-20 mx-auto ${iconColor}`} />

                <div className="space-y-2">
                    <h1 className="text-2xl font-black text-paraiso-blue dark:text-white">{copy.title}</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{copy.body}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 font-bold pt-2">{eventTitle}</p>
                </div>

                {isPolling && (
                    <p className="text-xs text-slate-400 flex items-center justify-center gap-2">
                        <Loader2 size={14} className="animate-spin" />
                        Verificando pagamento…
                    </p>
                )}

                {!orderId && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 p-3 rounded-xl">
                        Não recebemos a referência do pedido, por isso não conseguimos verificar o pagamento aqui.
                        Consulte seu e-mail para o comprovativo.
                    </p>
                )}

                {orderId && (
                    <p className="text-[10px] text-slate-400">Pedido: {orderId}</p>
                )}

                <Link
                    href={`/evento/${eventId}`}
                    className="inline-flex items-center gap-2 px-8 py-3 bg-paraiso-green text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-paraiso-blue transition-all"
                >
                    <ChevronLeft size={16} /> Voltar ao evento
                </Link>
            </motion.div>
        </div>
    );
}
