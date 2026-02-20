
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { signout } from '@/app/auth/actions'
import { Button } from "@/components/ui/button"
import { LogOut, User, Calendar, BookOpen, Heart, Radio, MapPin, Search, Bell, Settings } from "lucide-react"
import EditProfileModal from "@/components/membros/EditProfileModal"

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

    return (
        <div className="min-h-screen bg-slate-50 pb-20 pt-24">
            {/* Top Bar (Mobile/Desktop) - blending with main header but adding dashboard specific context if needed. 
                Actually, since the transparent header is fixed, we need padding-top. 
                The main header is visible. We will create a dashboard container.
            */}

            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-12 gap-6 relative">
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 rounded-full bg-paraiso-green/10 text-paraiso-green text-xs font-black uppercase tracking-widest border border-paraiso-green/20">
                                Membro
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-paraiso-blue-dark tracking-tighter">
                            OLÁ, <span className="text-paraiso-green uppercase">{firstName}</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-lg mt-2">
                            Que bom ter você aqui! O que vamos fazer hoje?
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <form action={signout}>
                            <Button variant="ghost" className="space-x-2 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                <LogOut size={18} />
                                <span className="font-bold uppercase tracking-widest text-xs hidden sm:inline">Sair</span>
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Dashboard Grid - Bento Style */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    {/* Main Feature Card - Live Stream or Daily Devotional */}
                    <div className="md:col-span-2 lg:col-span-2 row-span-2 relative group overflow-hidden rounded-[2.5rem] bg-paraiso-blue-dark shadow-xl">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2673&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-30 transition-opacity duration-700 group-hover:scale-105 transform"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-paraiso-blue-dark via-transparent to-transparent"></div>

                        <div className="relative h-full p-8 flex flex-col justify-end items-start text-white">
                            <div className="absolute top-8 right-8 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest py-1 px-3 rounded-full animate-pulse flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-white"></span>
                                Ao Vivo Agora
                            </div>

                            <h2 className="text-3xl font-black uppercase tracking-tighter mb-2 leading-tight">Culto de Celebração</h2>
                            <p className="text-white/80 mb-6 font-medium max-w-md">Acompanhe nossa transmissão ao vivo e adore conosco de onde estiver.</p>

                            <Button className="bg-paraiso-green hover:bg-white hover:text-paraiso-green text-white font-black uppercase tracking-widest rounded-full py-6 px-8 transition-all duration-300 shadow-lg hover:shadow-xl">
                                Assistir Culto
                            </Button>
                        </div>
                    </div>

                    {/* Profile Card */}
                    <div className="group relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity text-paraiso-blue">
                            <User size={80} strokeWidth={1} />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-paraiso-blue/10 flex items-center justify-center text-paraiso-blue mb-4 group-hover:bg-paraiso-blue group-hover:text-white transition-colors duration-300 overflow-hidden">
                                {user.user_metadata.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={24} />
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-1">{userName}</h3>
                            <p className="text-slate-400 text-sm mb-4">Atualize seus dados e preferências.</p>

                            <EditProfileModal user={user} />
                        </div>
                    </div>

                    {/* Events Card */}
                    <div className="group relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity text-paraiso-green">
                            <Calendar size={80} strokeWidth={1} />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-paraiso-green/10 flex items-center justify-center text-paraiso-green mb-4 group-hover:bg-paraiso-green group-hover:text-white transition-colors duration-300">
                                <Calendar size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-1">Eventos</h3>
                            <p className="text-slate-400 text-sm mb-4">Inscrições abertas para o Retiro 2026.</p>
                            <a href="#" className="inline-flex items-center text-xs font-black uppercase tracking-widest text-paraiso-blue group-hover:text-paraiso-green transition-colors">
                                Ver Agenda <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </a>
                        </div>
                    </div>

                    {/* Contribution Card - Highlighted */}
                    <div className="md:col-span-2 bg-gradient-to-r from-paraiso-green to-emerald-500 rounded-[2rem] p-8 relative overflow-hidden shadow-lg group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">Contribuição Online</h3>
                                <p className="text-white/90 font-medium max-w-sm">
                                    "Cada um dê conforme determinou em seu coração, não com pesar ou por obrigação, pois Deus ama quem dá com alegria."
                                </p>
                            </div>
                            <Button className="bg-white text-paraiso-green hover:bg-paraiso-blue hover:text-white font-black uppercase tracking-widest py-6 px-8 rounded-xl shadow-lg transition-all duration-300 shrink-0">
                                Dizimar Agora
                            </Button>
                        </div>
                    </div>

                    {/* Courses/Small Groups */}
                    <div className="group relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                                <BookOpen size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-1">EBD & Cursos</h3>
                            <p className="text-slate-400 text-sm mb-4">Continue seus estudos bíblicos.</p>
                        </div>
                    </div>

                    {/* Prayer Requests */}
                    <div className="group relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 mb-4 group-hover:bg-red-500 group-hover:text-white transition-colors duration-300">
                                <Heart size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-1">Pedidos de Oração</h3>
                            <p className="text-slate-400 text-sm mb-4">Compartilhe seus pedidos conosco.</p>
                        </div>
                    </div>

                </div>

                {/* Dev/Admin Note - Hidden or subtle */}
                <div className="mt-16 text-center opacity-30 hover:opacity-100 transition-opacity">
                    <p className="text-xs text-slate-400 uppercase tracking-widest">Painel do Membro v2.0 • Igreja Paraíso</p>
                </div>

            </div>
        </div>
    )
}
