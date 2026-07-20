import { getPublicEventById } from '@/lib/events/data';
import { notFound } from 'next/navigation';
import ObrigadoClient from './ObrigadoClient';

/**
 * Retorno do checkout (`successUrl` do Asaas).
 * O redirect não prova pagamento — o estado real vem do polling no cliente.
 */
export default async function ObrigadoPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ orderId?: string }>;
}) {
    const { id } = await params;
    const { orderId } = await searchParams;
    const event = await getPublicEventById(id);

    if (!event) return notFound();

    return (
        <ObrigadoClient
            eventId={event.id}
            eventTitle={event.title}
            orderId={orderId ?? null}
        />
    );
}
