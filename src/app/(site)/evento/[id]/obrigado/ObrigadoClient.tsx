'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle, ChevronLeft, Loader2 } from 'lucide-react';
import { pollOrderPayment } from '@/lib/events/data-client';
import { fetchOrderPayment } from '@/lib/events/client';
import type { OrderPaymentStatus } from '@/lib/events/types';
import { Period } from '@/components/site/Editorial';

interface Props {
    eventId: string;
    eventTitle: string;
    orderId: string | null;
}

const COPY: Record<OrderPaymentStatus | 'TIMEOUT', { title: string; body: string }> = {
    PENDING: {
        title: 'Aguardando confirmação',
        body: 'Recebemos seu pedido. Quando o pagamento for compensado, a inscrição é confirmada e os ingressos chegam por e-mail.',
    },
    CONFIRMED: {
        title: 'Inscrição confirmada',
        body: 'Pagamento confirmado. Os ingressos foram enviados para o seu e-mail.',
    },
    FAILED: {
        title: 'Pagamento não concluído',
        body: 'Não conseguimos confirmar o pagamento e nada foi cobrado. Você pode tentar de novo.',
    },
    EXPIRED: {
        title: 'Cobrança expirada',
        body: 'O prazo de pagamento terminou e a reserva foi liberada. Faça uma nova inscrição.',
    },
    TIMEOUT: {
        title: 'Ainda processando',
        body: 'A confirmação está demorando. Você recebe um e-mail quando o pagamento for compensado.',
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
        ? 'text-detail'
        : isError ? 'text-red-600 dark:text-red-400' : 'text-ink-muted';

    return (
        <div className="min-h-screen bg-paper text-ink px-5 pb-24 pt-32 md:px-16 md:pt-40">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto w-full max-w-xl space-y-8"
            >
                <Icon className={`h-10 w-10 ${iconColor}`} strokeWidth={1.5} />

                <div className="space-y-4 border-b border-hairline pb-8">
                    <p className="m-0 text-xs font-medium uppercase tracking-[0.16em] text-ink-muted">{eventTitle}</p>
                    <h1 className="m-0 text-[2.375rem] font-semibold leading-none tracking-[-0.04em] text-ink md:text-[3.5rem]">
                        {copy.title}<Period />
                    </h1>
                    <p className="m-0 text-base leading-relaxed text-ink-muted md:text-lg">{copy.body}</p>
                </div>

                {isPolling && (
                    <p className="flex items-center gap-2 text-sm text-ink-muted">
                        <Loader2 size={14} className="animate-spin" />
                        Verificando pagamento…
                    </p>
                )}

                {!orderId && (
                    <p className="border-l-2 border-detail pl-4 text-sm leading-relaxed text-ink-muted">
                        Não recebemos o número do pedido, então não dá para verificar o pagamento aqui.
                        Confira seu e-mail.
                    </p>
                )}

                {orderId && (
                    <p className="text-xs text-ink-muted">Pedido: {orderId}</p>
                )}

                <Link
                    href={`/evento/${eventId}`}
                    className="inline-flex min-h-12 items-center gap-3.5 rounded-full bg-ink py-1.5 pl-1.5 pr-6 text-sm font-medium text-paper transition-opacity hover:opacity-90"
                >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paraiso-green text-white">
                        <ChevronLeft size={16} />
                    </span>
                    Voltar ao evento
                </Link>
            </motion.div>
        </div>
    );
}
