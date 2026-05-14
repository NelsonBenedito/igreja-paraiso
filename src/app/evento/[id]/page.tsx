import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import EventoClient from './EventoClient';

export default async function EventoPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;
    
    // Buscar os dados do evento
    const { data: event, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !event) {
        return notFound();
    }

    // Verificar se o usuário está logado e já inscrito
    const { data: { user } } = await supabase.auth.getUser();
    let isRegistered = false;
    
    if (user?.email) {
        const { data: registration } = await supabase
            .from('event_registrations')
            .select('id')
            .eq('event_id', event.id)
            .eq('email', user.email.toLowerCase())
            .single();
            
        if (registration) {
            isRegistered = true;
        }
    }

    return (
        <EventoClient event={event} isRegisteredServer={isRegistered} />
    );
}
