import React from 'react';
import { NavItem, ServiceTime, Ministry, Mission, Sermon } from './types';
import {
    Youtube,
    Instagram,
    Facebook
} from 'lucide-react';

export const NAV_ITEMS: NavItem[] = [
    { label: 'Início', href: '/' },
    { label: 'A Igreja', href: '/#sobre' },
    { label: 'Ao Vivo', href: '/#aovivo' },
    { label: 'Agenda', href: '/#agenda' },
    { label: 'Missões', href: '/#missoes' },
    { label: 'Localização', href: '/#onde' }
];

export const NEWS_ITEMS = [
    {
        id: '01',
        title: 'Festa das Águas',
        description: 'Um tempo profético de renovo e cura para toda a família Paraíso. Reserve sua data!',
        image: '/FestaDasAguas.png',
        tag: 'Especial'
    },
    {
        id: '02',
        title: 'Conferência de Famílias',
        description: 'Um tempo precioso de edificação e fortalecimento para o seu lar. Traga sua família!',
        image: '/ConferenciaDeFamilias.jpg',
        tag: 'Família'
    },
    {
        id: '03',
        title: 'Retiro de Casais',
        description: 'Invista no seu casamento! Dias inesquecíveis de comunhão, aprendizado e renovação.',
        image: '/RetiroDeCasais.jpg',
        tag: 'Casais'
    }
];

export const SERVICE_TIMES: ServiceTime[] = [
    { day: 'Domingo', time: '09h', type: 'Escola Bíblica' },
    { day: 'Domingo', time: '18:30', type: 'Culto de Celebração' },
    { day: 'Terça-feira', time: '20h', type: 'Doutrina e Oração' }
];

export const PROGRAMACAO = [
    { day: 'Quarta-feira', time: '20h', title: 'Campanha da Vitória', location: 'Templo Principal' },
    { day: 'Sábado', time: '19h', title: 'Juventude Eleve', location: 'Templo Principal' },
    { day: 'Domingo', time: '10h', title: 'Celebração Dominical (Manhã)', location: 'Templo Principal' },
    { day: 'Domingo', time: '18h', title: 'Celebração Dominical (Noite)', location: 'Templo Principal' }
];

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

export const MISSIONS: Mission[] = [
    {
        id: '01',
        name: 'Pr. Clétson Barros',
        role: 'Pastor Auxiliar - Sede',
        location: 'Santa Maria de Jetibá - ES',
        image: '/prCletsonB.jpg'
    },
    {
        id: '02',
        name: 'Pr. Leandro Hins de Brito',
        role: 'Pastor Auxiliar - Sede',
        location: 'Santa Maria de Jetibá - ES',
        image: '/prLeandroB.jpg'
    },
    {
        id: '03',
        name: 'Pr. Robson Jose Maria',
        role: 'Pastor Local',
        location: 'Itaguaçu - ES',
        image: '/prRobsonJ.jpg'
    },
    {
        id: '04',
        name: 'Pr. Tiago Pio',
        role: 'Pastor Local',
        location: 'Santa Teresa - ES',
        image: '/pastorTiagoP.jpg'
    },
    {
        id: '05',
        name: 'Pr. Jheferson M. Rosa',
        role: 'Pastor Local',
        location: 'Rio Possmoser - ES',
        image: '/prJhefersonM.jpg'
    },
    {
        id: '06',
        name: 'Pr. Herbert Neiva',
        role: 'Pastor Local',
        location: 'Aracruz - ES',
        image: '/prHerbertN.jpg'
    },
    {
        id: '07',
        name: 'Pr. Cloves Souza',
        role: 'Pastor Local',
        location: 'Anchieta - ES',
        image: '/prClovesS.jpg'
    }
];

export const SOCIAL_LINKS = [
    { icon: <Youtube className="w-5 h-5" />, href: '#' },
    { icon: <Instagram className="w-5 h-5" />, href: '#' },
    { icon: <Facebook className="w-5 h-5" />, href: '#' }
];
