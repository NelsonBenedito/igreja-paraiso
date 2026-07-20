import { NavItem, ServiceTime, Ministry } from './types';

export const NAV_ITEMS: NavItem[] = [
    { label: 'Início', href: '/' },
    { label: 'A Igreja', href: '/#sobre' },
    { label: 'Eventos', href: '/#eventos' },
    { label: 'Agenda', href: '/#agenda' },
    { label: 'Missões', href: '/#missoes' },
    { label: 'Time Pastoral', href: '/time-pastoral' },
    { label: 'Nossas Igrejas', href: '/nossas-igrejas' },
    { label: 'Ofertório', href: '/#ofertorio' },
    { label: 'Cotas', href: '/cotas/campus' }
];

/**
 * Fallbacks de conteúdo institucional vivem em
 * `src/lib/site-content/fallbacks.ts` (API `GET .../site-content`).
 *
 * Abaixo só restam constantes usadas por componentes órfãos
 * (Ministries / ServiceInfo — fora do escopo desta migração).
 * Horários "a sério" vêm de `schedules`; noite de domingo confirmada: 18h.
 */

/** @deprecated Preferir `schedules` da API. Noite: 18h. */
export const SERVICE_TIMES: ServiceTime[] = [
    { day: 'Domingo', time: '09h', type: 'Escola Bíblica' },
    { day: 'Domingo', time: '18h', type: 'Culto de Celebração' },
    { day: 'Terça-feira', time: '20h', type: 'Doutrina e Oração' }
];

/** Fora do escopo — Ministries.tsx não está montado. Espelho em site-content/fallbacks. */
export const MINISTRIES: Ministry[] = [
    {
        id: 'kids',
        name: 'Ignição',
        description: 'Ministério infantil: Ensinando os pequenos no caminho em que devem andar com alegria e cor.',
        image: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?q=80&w=600',
        icon: 'Heart'
    },
    {
        id: 'youth',
        name: 'Eleve',
        description: 'Juventude: Uma geração apaixonada por Jesus que busca transformar o mundo.',
        image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=600',
        icon: 'Music'
    },
    {
        id: 'women',
        name: 'Diamante',
        description: 'Ministério de Mulheres: Preciosas para Deus, brilhando em todas as áreas da vida.',
        image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=600',
        icon: 'Users'
    }
];
