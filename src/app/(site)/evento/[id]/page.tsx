import type { Metadata } from 'next';
import { getPublicEventById, isUserRegisteredForEvent } from '@/lib/events/data';
import { sanitizeEventHtml } from '@/lib/events/sanitize';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import EventoClient from './EventoClient';

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { id } = await params;
    const event = await getPublicEventById(id);
    if (!event) return {};

    const title = `${event.title} | Igreja Paraíso`;
    const description = event.short_description ?? event.description ?? undefined;
    const image = event.cover_image_url ?? event.image_url;
    return {
        title,
        description,
        openGraph: { title, description, ...(image ? { images: [image] } : {}) },
    };
}

export default async function EventoPage({ params }: Params) {
    const { id } = await params;
    const event = await getPublicEventById(id);

    if (!event) {
        return notFound();
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    let isRegistered = false;

    if (user?.email) {
        try {
            isRegistered = await isUserRegisteredForEvent(event.id, user.email);
        } catch (error) {
            // Falha na consulta não pode derrubar a página: trata como "não inscrito".
            console.warn('[evento] não foi possível verificar a inscrição:', error);
        }
    }

    // Sanitiza uma vez, no servidor: o HTML bruto do painel não chega ao
    // navegador e o DOMPurify fica fora do bundle do cliente.
    const details_html = event.details_html ? sanitizeEventHtml(event.details_html) : null;

    return (
        <EventoClient event={{ ...event, details_html }} isRegisteredServer={isRegistered} />
    );
}
