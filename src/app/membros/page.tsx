
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { User, Calendar, BookOpen, Heart, Radio } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RoleBadgeList } from "@/components/membros/RoleBadge"
import { getYouTubeData } from '@/services/youtubeService'
import type { Role } from '@/types'

async function getUserRoles(supabase: Awaited<ReturnType<typeof createClient>>, userId: string): Promise<Role[]> {
    // Step 1: get the role IDs for this user
    const { data: userRoleData } = await supabase
        .from('user_roles')
        .select('role_id')
        .eq('user_id', userId)

    const roleIds = userRoleData?.map((r: any) => r.role_id) ?? []

    // Short-circuit: avoid .in('id', []) which causes a PostgREST 500
    if (roleIds.length === 0) return []

    // Step 2: fetch the role details
    const { data, error } = await supabase
        .from('roles')
        .select('id, name, label, color, description')
        .in('id', roleIds)

    if (error || !data) return []
    return data as Role[]
}

export default async function MembersPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const userName = user.user_metadata.full_name || user.email?.split('@')[0] || "Membro";
    const firstName = userName.split(' ')[0];

    // Fetch user's roles server-side
    const userRoles = await getUserRoles(supabase, user.id)
    const isAdmin = userRoles.some((r) => r.name === 'admin')

    // Fetch YouTube live status
    const youtube = await getYouTubeData()
    const isLive = !!youtube?.live

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-paraiso-blue-deep pb-20 pt-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                {/* Welcome Section */}
                <div className="mb-12">
                    {/* Cargo Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                        <RoleBadgeList roles={userRoles} emptyLabel="Membro" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-paraiso-blue-dark dark:text-white tracking-tighter">
                        OLÁ, <span className="text-paraiso-green uppercase">{firstName}</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-300 font-medium text-lg mt-2">
                        Que bom ter você aqui! O que vamos fazer hoje?
                    </p>
                </div>

                {/* Dashboard Grid - Bento Style */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* Main Feature Card - Live Stream */}
                    <div className="md:col-span-2 lg:col-span-2 row-span-2 relative group overflow-hidden rounded-[2.5rem] bg-paraiso-blue-dark shadow-xl">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2673&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-30 transition-opacity duration-700 group-hover:scale-105 transform"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-paraiso-blue-dark via-transparent to-transparent"></div>

                        <div className="relative h-full p-8 flex flex-col justify-end items-start text-white">
                            {isLive && (
                                <div className="absolute top-8 right-8 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest py-1 px-3 rounded-full animate-pulse flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-white"></span>
                                    Ao Vivo Agora
                                </div>
                            )}

                            <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 leading-tight">Culto de Celebração</h2>
                            <p className="text-white/80 mb-6 font-medium max-w-md">Acompanhe nossa transmissão ao vivo e adore conosco de onde estiver.</p>

                            <Link href="/membros/ao-vivo">
                                <Button className="bg-paraiso-green hover:bg-white hover:text-paraiso-green text-white font-black uppercase tracking-widest rounded-full py-6 px-8 transition-all duration-300 shadow-lg hover:shadow-xl">
                                    Assistir Culto
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Profile Card */}
                    <div className="group relative overflow-hidden rounded-[2rem] bg-white dark:bg-white/[0.04] dark:backdrop-blur-sm p-6 shadow-sm dark:shadow-none border border-slate-100 dark:border-white/[0.08] hover:shadow-xl dark:hover:border-white/20 hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity text-paraiso-blue dark:text-white">
                            <User size={80} strokeWidth={1} />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-paraiso-blue/10 dark:bg-white/10 flex items-center justify-center text-paraiso-blue dark:text-white mb-4 group-hover:bg-paraiso-blue dark:group-hover:bg-white/20 group-hover:text-white transition-colors duration-300 overflow-hidden">
                                {user.user_metadata.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={24} />
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{userName}</h3>
                            <p className="text-slate-400 dark:text-slate-400 text-sm mb-4">Atualize seus dados e preferências.</p>
                            <Link href="/membros/perfil" className="inline-flex items-center text-xs font-black uppercase tracking-widest text-paraiso-blue dark:text-paraiso-green hover:text-paraiso-green dark:hover:text-white transition-colors">
                                Editar Perfil <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                    </div>

                    {/* Events Card */}
                    <div className="group relative overflow-hidden rounded-[2rem] bg-white dark:bg-white/[0.04] dark:backdrop-blur-sm p-6 shadow-sm dark:shadow-none border border-slate-100 dark:border-white/[0.08] hover:shadow-xl dark:hover:border-white/20 hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity text-paraiso-green">
                            <Calendar size={80} strokeWidth={1} />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-paraiso-green/10 dark:bg-paraiso-green/15 flex items-center justify-center text-paraiso-green mb-4 group-hover:bg-paraiso-green group-hover:text-white transition-colors duration-300">
                                <Calendar size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Eventos</h3>
                            <p className="text-slate-400 dark:text-slate-400 text-sm mb-4">Inscrições abertas para o Retiro 2026.</p>
                            <Link href="/membros/eventos" className="inline-flex items-center text-xs font-black uppercase tracking-widest text-paraiso-green hover:text-paraiso-blue dark:hover:text-white transition-colors">
                                Ver Agenda <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                    </div>

                    {/* Contribution Card - Highlighted */}
                    <div
                        className="md:col-span-2 bg-paraiso-green bg-gradient-to-r from-paraiso-green to-emerald-500 rounded-[2rem] p-8 relative overflow-hidden shadow-lg group"
                        style={{ backgroundColor: '#22c55e' }} // Fallback para Safari Mobile
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2 flex-wrap sm:flex-nowrap">
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter truncate">Contribuição Online</h3>
                                    <span className="text-[9px] font-black bg-white/20 text-white px-3 py-0.5 rounded-full uppercase tracking-widest backdrop-blur-sm border border-white/30 whitespace-nowrap shrink-0">Em Breve</span>
                                </div>
                                <p className="text-white/90 font-medium max-w-sm">
                                    "Cada um dê conforme determinou em seu coração, não com pesar ou por obrigação, pois Deus ama quem dá com alegria."
                                </p>
                            </div>
                            <Button disabled className="bg-white/50 text-emerald-950 cursor-not-allowed font-black uppercase tracking-widest py-6 px-8 rounded-xl shadow-lg transition-all duration-300 shrink-0">
                                Dizimar Agora
                            </Button>
                        </div>
                    </div>

                    {/* Courses/Small Groups */}
                    <div className="group relative overflow-hidden rounded-[2rem] bg-white dark:bg-white/[0.04] dark:backdrop-blur-sm p-6 shadow-sm dark:shadow-none border border-slate-100 dark:border-white/[0.08] hover:shadow-xl dark:hover:border-white/20 hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity text-orange-500">
                            <BookOpen size={80} strokeWidth={1} />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 dark:bg-orange-500/15 flex items-center justify-center text-orange-500 mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                                <BookOpen size={24} />
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Polo FLMU</h3>
                                <span className="text-[10px] font-black bg-orange-100 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full uppercase tracking-widest">Educação</span>
                            </div>
                            <p className="text-slate-400 dark:text-slate-400 text-sm mb-4 leading-tight">Curso Intermediário em Teologia pela FLMU.</p>
                            <Link href="/membros/cursos" className="inline-flex items-center text-xs font-black uppercase tracking-widest text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors">
                                Acessar Lições <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                    </div>

                    {/* Prayer Requests */}
                    <div className="group relative overflow-hidden rounded-[2rem] bg-white dark:bg-white/[0.04] dark:backdrop-blur-sm p-6 shadow-sm dark:shadow-none border border-slate-100 dark:border-white/[0.08] hover:shadow-xl dark:hover:border-white/20 hover:-translate-y-1 transition-all duration-300 opacity-80">
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-red-500/10 dark:bg-red-500/15 flex items-center justify-center text-red-500 mb-4 group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
                                <Heart size={24} />
                            </div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Cuidado</h3>
                                <span className="text-[10px] font-black bg-slate-100 dark:bg-white/10 text-slate-400 dark:text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-widest whitespace-nowrap shrink-0">Em breve</span>
                            </div>
                            <p className="text-slate-400 dark:text-slate-400 text-sm mb-4">Compartilhe seus pedidos de oração conosco.</p>
                        </div>
                    </div>



                </div>

                {/* Footer Note */}
                <div className="mt-16 text-center opacity-30 hover:opacity-100 transition-opacity">
                    <p className="text-xs text-slate-400 uppercase tracking-widest">Painel do Membro v2.0 • Igreja Paraíso</p>
                </div>

            </div>
        </div>
    )
}
