'use client'

import Link from 'next/link'
import { CalendarDays, ListChecks, Users, Shield, ArrowRight, UserPlus } from 'lucide-react'
import ManageRolesModal from '@/components/membros/ManageRolesModal'
import RevalidateYoutubeButton from '@/components/admin/RevalidateYoutubeButton'

interface AdminDashboardProps {
    user: any
    stats: {
        eventsCount: number
        schedulesCount: number
        membersCount: number
        registrationsCount: number
    }
}

export default function AdminDashboard({ user, stats }: AdminDashboardProps) {
    const cards = [
        {
            href: '/admin/eventos',
            icon: CalendarDays,
            label: 'Eventos',
            description: 'Adicionar, editar e excluir eventos da agenda.',
            count: stats.eventsCount,
            countLabel: 'eventos cadastrados',
            color: 'from-blue-600 to-blue-800',
            iconBg: 'bg-blue-500/20',
            iconColor: 'text-blue-200',
        },
        {
            href: '/admin/programacao',
            icon: ListChecks,
            label: 'Programação',
            description: 'Gerenciar os cultos e atividades da semana.',
            count: stats.schedulesCount,
            countLabel: 'itens na programação',
            color: 'from-emerald-600 to-emerald-800',
            iconBg: 'bg-emerald-500/20',
            iconColor: 'text-emerald-200',
        },
        {
            href: '/admin/inscricoes',
            icon: UserPlus,
            label: 'Inscrições',
            description: 'Ver e exportar inscrições recebidas nos eventos.',
            count: stats.registrationsCount,
            countLabel: 'inscrições recebidas',
            color: 'from-paraiso-green to-green-800',
            iconBg: 'bg-green-400/20',
            iconColor: 'text-green-200',
        },
        {
            icon: Users,
            label: 'Membros',
            description: 'Gerencie cargos e níveis de acesso dos membros.',
            count: stats.membersCount,
            countLabel: 'membros no banco',
            color: 'from-violet-600 to-violet-800',
            iconBg: 'bg-violet-500/20',
            iconColor: 'text-violet-200',
            isModal: true,
        },
    ]

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">

                {/* Header */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center">
                                <Shield size={20} className="text-white" />
                            </div>
                            <span className="text-violet-400 text-xs font-black uppercase tracking-widest">
                                Painel Administrativo
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tighter">
                            Olá, <span className="text-violet-600 dark:text-violet-400">{user.user_metadata.full_name?.split(' ')[0] ?? 'Admin'}</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                            O que você quer gerenciar hoje?
                        </p>
                    </div>

                    <div className="shrink-0">
                        <RevalidateYoutubeButton />
                    </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {cards.map((card, i) => {
                        const Icon = card.icon

                        const content = (
                            <div className={`h-full group relative overflow-hidden rounded-3xl bg-gradient-to-br ${card.color} p-7 shadow-xl hover:scale-[1.02] transition-all duration-300 text-left w-full border-0 cursor-pointer`}>
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-white/10 transition-all duration-500" />

                                <div className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center mb-5`}>
                                    <Icon size={24} className={card.iconColor} />
                                </div>

                                <p className="text-3xl font-black text-white mb-1">{card.count}</p>
                                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">{card.countLabel}</p>

                                <h2 className="text-xl font-black text-white mb-1">{card.label}</h2>
                                <p className="text-white/70 text-sm leading-relaxed mb-6">{card.description}</p>

                                <div className="flex items-center gap-2 text-white/80 text-xs font-black uppercase tracking-widest group-hover:text-white transition-colors">
                                    {card.isModal ? 'Gerenciar' : 'Acessar'} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        )

                        if (card.isModal) {
                            return (
                                <div key={i} className="h-full">
                                    <ManageRolesModal
                                        currentUserId={user.id}
                                        trigger={content}
                                    />
                                </div>
                            )
                        }

                        return (
                            <Link
                                key={card.href}
                                href={card.href!}
                                className="h-full"
                            >
                                {content}
                            </Link>
                        )
                    })}
                </div>

            </div>
        </div>
    )
}
