import React from 'react';
import { NavItem, ServiceTime, Ministry, Mission, Sermon, MissionChurch } from './types';
import {
    Youtube,
    Instagram,
    Facebook
} from 'lucide-react';

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
    { day: 'Quinta-feira', time: '19h', title: 'Campanha da Vitória', location: 'Templo Principal' },
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

export const MISSION_CHURCHES: MissionChurch[] = [
    {
        id: '01',
        name: 'Igreja Paraíso — Sede',
        location: 'Santa Maria de Jetibá - ES',
        address: 'Rua Helmut Gums, 438 - Virada, Santa Maria de Jetibá - ES',
        image: '/pastor.jpg',
        mapsUrl: 'https://maps.app.goo.gl/UsxnnZ69miAvFzvs6',
        pastor: 'Pr. Evandro Menezes (Presidente)'
    },
    {
        id: '02',
        name: 'Igreja Paraíso — Itaguaçu',
        location: 'Itaguaçu - ES',
        address: 'Centro, Itaguaçu - ES, CEP 29690-000',
        image: '/prRobsonJ.jpg',
        mapsUrl: 'https://maps.google.com/?q=Igreja+Paraiso+Itaguacu',
        pastor: 'Pr. Robson Jose Maria'
    },
    {
        id: '03',
        name: 'Igreja Paraíso — Santa Teresa',
        location: 'Santa Teresa - ES',
        address: 'Centro, Santa Teresa - ES, CEP 29650-000',
        image: '/pastorTiagoP.jpg',
        mapsUrl: 'https://maps.google.com/?q=Igreja+Paraiso+Santa+Teresa',
        pastor: 'Pr. Tiago Pio'
    },
    {
        id: '04',
        name: 'Igreja Paraíso — Rio Possmoser',
        location: 'Rio Possmoser - ES',
        address: 'Rio Possmoser, Santa Maria de Jetibá - ES',
        image: '/prJhefersonM.jpg',
        mapsUrl: 'https://maps.google.com/?q=Igreja+Paraiso+Rio+Possmoser',
        pastor: 'Pr. Jheferson M. Rosa'
    },
    {
        id: '05',
        name: 'Igreja Paraíso — Aracruz',
        location: 'Aracruz - ES',
        address: 'Centro, Aracruz - ES, CEP 29190-000',
        image: '/prHerbertN.jpg',
        mapsUrl: 'https://maps.google.com/?q=Igreja+Paraiso+Aracruz',
        pastor: 'Pr. Herbert Neiva'
    },
    {
        id: '06',
        name: 'Igreja Paraíso — Anchieta',
        location: 'Anchieta - ES',
        address: 'Centro, Anchieta - ES, CEP 29230-000',
        image: '/prClovesS.jpg',
        mapsUrl: 'https://maps.google.com/?q=Igreja+Paraiso+Anchieta',
        pastor: 'Pr. Cloves Souza'
    }
];

export const SOCIAL_LINKS = [
    { icon: <Youtube className="w-5 h-5" />, href: 'https://www.youtube.com/@paraisoigreja' },
    { icon: <Instagram className="w-5 h-5" />, href: 'https://www.instagram.com/paraisoigreja/' },
    { icon: <Facebook className="w-5 h-5" />, href: 'https://www.facebook.com/paraisoigreja/' }
];
