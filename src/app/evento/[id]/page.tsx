import { getPublicEventById, isUserRegisteredForEvent } from '@/lib/events/data';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import EventoClient from './EventoClient';

export default async function EventoPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const event = await getPublicEventById(id);

    if (!event) {
        return notFound();
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    let isRegistered = false;

    if (user?.email) {
        isRegistered = await isUserRegisteredForEvent(event.id, user.email);
    }

    return (
        <EventoClient event={event} isRegisteredServer={isRegistered} />
    );
}
