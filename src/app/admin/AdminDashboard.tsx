'use client'

import { Users, Shield, ArrowRight } from 'lucide-react'
import ManageRolesModal from '@/components/membros/ManageRolesModal'
import type { User } from '@supabase/supabase-js'
import RevalidateYoutubeButton from '@/components/admin/RevalidateYoutubeButton'

interface AdminDashboardProps {
    user: User
    membersCount: number
}

export default function AdminDashboard({ user, membersCount }: AdminDashboardProps) {
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
                    <div className="h-full">
                        <ManageRolesModal
                            currentUserId={user.id}
                            trigger={
                                <div className="h-full group relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 to-violet-800 p-7 shadow-xl hover:scale-[1.02] transition-all duration-300 text-left w-full border-0 cursor-pointer">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-white/10 transition-all duration-500" />

                                    <div className="w-12 h-12 rounded-2xl bg-violet-500/20 flex items-center justify-center mb-5">
                                        <Users size={24} className="text-violet-200" />
                                    </div>

                                    <p className="text-3xl font-black text-white mb-1">{membersCount}</p>
                                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-4">membros no banco</p>

                                    <h2 className="text-xl font-black text-white mb-1">Membros</h2>
                                    <p className="text-white/70 text-sm leading-relaxed mb-6">Gerencie cargos e níveis de acesso dos membros.</p>

                                    <div className="flex items-center gap-2 text-white/80 text-xs font-black uppercase tracking-widest group-hover:text-white transition-colors">
                                        Gerenciar <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            }
                        />
                    </div>
                </div>

            </div>
        </div>
    )
}
