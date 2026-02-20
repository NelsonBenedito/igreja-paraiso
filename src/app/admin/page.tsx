import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CalendarDays, ListChecks, Users, Shield, ArrowRight, LayoutDashboard } from 'lucide-react'

export default async function AdminPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Count stats
    const [{ count: eventsCount }, { count: schedulesCount }, { count: membersCount }] = await Promise.all([
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('schedules').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
    ])

    const cards = [
        {
            href: '/admin/eventos',
            icon: CalendarDays,
            label: 'Eventos',
            description: 'Adicionar, editar e excluir eventos da agenda.',
            count: eventsCount ?? 0,
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
            count: schedulesCount ?? 0,
            countLabel: 'itens na programação',
            color: 'from-emerald-600 to-emerald-800',
            iconBg: 'bg-emerald-500/20',
            iconColor: 'text-emerald-200',
        },
        {
            href: '/membros',
            icon: Users,
            label: 'Membros',
            description: 'Acesse o painel de membros e gerencie cargos.',
            count: membersCount ?? 0,
            countLabel: 'membros cadastrados',
            color: 'from-violet-600 to-violet-800',
            iconBg: 'bg-violet-500/20',
            iconColor: 'text-violet-200',
        },
    ]

    return (
        <div className="min-h-screen bg-slate-950 pt-24 pb-20">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">

                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center">
                            <Shield size={20} className="text-white" />
                        </div>
                        <span className="text-violet-400 text-xs font-black uppercase tracking-widest">
                            Painel Administrativo
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                        Olá, <span className="text-violet-400">{user.user_metadata.full_name?.split(' ')[0] ?? 'Admin'}</span>
                    </h1>
                    <p className="text-slate-400 mt-2 text-lg">
                        O que você quer gerenciar hoje?
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {cards.map((card) => {
                        const Icon = card.icon
                        return (
                            <Link
                                key={card.href}
                                href={card.href}
                                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${card.color} p-7 shadow-xl hover:scale-[1.02] transition-all duration-300`}
                            >
                                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-white/10 transition-all duration-500" />

                                <div className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center mb-5`}>
                                    <Icon size={24} className={card.iconColor} />
                                </div>

                                <p className="text-3xl font-black text-white mb-1">{card.count}</p>
                                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">{card.countLabel}</p>

                                <h2 className="text-xl font-black text-white mb-1">{card.label}</h2>
                                <p className="text-white/70 text-sm leading-relaxed mb-6">{card.description}</p>

                                <div className="flex items-center gap-2 text-white/80 text-xs font-black uppercase tracking-widest group-hover:text-white transition-colors">
                                    Acessar <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        )
                    })}
                </div>

                {/* Back link */}
                <div className="text-center">
                    <Link href="/membros" className="text-slate-500 hover:text-slate-300 text-sm transition-colors inline-flex items-center gap-2">
                        ← Voltar para a área de membros
                    </Link>
                </div>
            </div>
        </div>
    )
}
