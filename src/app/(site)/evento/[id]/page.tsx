import type { Metadata } from 'next';
import { getPublicEventById, isUserRegisteredForEvent } from '@/lib/events/data';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import EventoClient from './EventoClient';

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { id } = await params;
    const event = await getPublicEventById(id);
    if (!event) return {};

    const image = event.cover_image_url ?? event.image_url;
    return {
        title: `${event.title} | Igreja Paraíso`,
        description: event.short_description ?? event.description ?? undefined,
        ...(image ? { openGraph: { images: [image] } } : {}),
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

    return (
        <EventoClient event={event} isRegisteredServer={isRegistered} />
    );
}
