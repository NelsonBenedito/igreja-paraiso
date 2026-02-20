import { getYouTubeData } from '@/services/youtubeService'
import { Play, Calendar, ChevronLeft, Radio, Clock, Share2, Youtube } from 'lucide-react'
import Link from 'next/link'

export default async function MembersLivePage({ 
    searchParams 
}: { 
    searchParams: Promise<{ video?: string }> 
}) {
    const { video: selectedVideoId } = await searchParams
    const data = await getYouTubeData()
    
    // Fallback static ID se o serviço falhar ou não encontrar vídeos
    const videos = data?.videos || []
    const live = data?.live

    // Se houver live, ela é o destaque. 
    // Se não, o primeiro vídeo da lista (o mais recente) é o destaque.
    // Mas se o usuário CLICOU em um vídeo da lista, o selectedVideoId ganha.
    const videosList = [...videos]
    let featuredVideo = live || (videosList.length > 0 ? videosList[0] : null)
    
    // Se houver um ID na URL, buscamos esse vídeo na lista para mostrar no player
    if (selectedVideoId) {
        const found = videosList.find(v => v.id.videoId === selectedVideoId)
        if (found) featuredVideo = found
    }

    const otherVideos = videosList.length > 0 
        ? (live 
            ? videosList.slice(0, 4) 
            : videosList.filter(v => v.id.videoId !== (featuredVideo?.id?.videoId)).slice(0, 4)
          ) 
        : []

    const featuredId = selectedVideoId || featuredVideo?.id?.videoId
    const featuredTitle = featuredVideo?.snippet?.title
    const featuredDate = featuredVideo?.snippet?.publishedAt 
        ? new Date(featuredVideo.snippet.publishedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
        : ''

    return (
        <div className="bg-slate-50 min-h-screen pb-20 pt-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <Link href="/membros" className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-1 mb-4 transition-colors">
                            <ChevronLeft size={14} /> Voltar ao Painel
                        </Link>
                        <h1 className="text-4xl font-black text-paraiso-blue-dark tracking-tighter">
                            Canal <span className="text-red-600">Ao Vivo</span>
                        </h1>
                        <p className="text-slate-500 mt-2">Assista nossos cultos e estudos bíblicos em tempo real.</p>
                    </div>
                    
                    <a 
                        href="https://youtube.com/@paraisoigreja" 
                        target="_blank" 
                        className="bg-red-600 hover:bg-black text-white px-6 py-3 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-xs transition-all shadow-lg hover:shadow-red-600/20"
                    >
                        <Youtube size={18} /> Inscrever-se no Canal
                    </a>
                </div>

                {!live && (
                    <div className="mb-12 bg-white border border-slate-100 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-6 shadow-sm overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-2 h-full bg-slate-200"></div>
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                            <Radio size={32} className="text-slate-400" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">Não estamos ao vivo no momento</h3>
                            <p className="text-slate-500 text-sm mt-1">Aproveite para assistir nossas últimas celebrações e estudos bíblicos logo abaixo.</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest">
                            <span className="px-4 py-2 bg-slate-50 rounded-full text-slate-400 border border-slate-100 flex items-center gap-2">
                                <Clock size={14} /> Próximo Culto: Domingo 18h
                            </span>
                        </div>
                    </div>
                )}

                {/* Main Video Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Featured Video Player */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="relative aspect-video rounded-[2.5rem] overflow-hidden bg-black shadow-2xl border-4 border-white">
                            {featuredId ? (
                                <iframe 
                                    className="absolute inset-0 w-full h-full"
                                    src={`https://www.youtube.com/embed/${featuredId}?autoplay=0`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/40 p-12 text-center">
                                    <Radio size={64} className="mb-4 opacity-20" />
                                    <p className="text-xl font-bold">Nenhum vídeo disponível no momento.</p>
                                    <p className="text-sm mt-2">Verifique sua conexão ou tente mais tarde.</p>
                                </div>
                            )}

                            {live && (
                                <div className="absolute top-6 right-6 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest py-1.5 px-4 rounded-full animate-pulse flex items-center gap-2 shadow-lg">
                                    <span className="w-2 h-2 rounded-full bg-white"></span>
                                    Ao Vivo Agora
                                </div>
                            )}
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Radio size={120} strokeWidth={1} />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 text-red-600 font-black text-[10px] uppercase tracking-widest mb-3">
                                    <Clock size={14} />
                                    <span>Transmitido em {featuredDate}</span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-black text-paraiso-blue-dark tracking-tighter leading-tight mb-4">
                                    {featuredTitle || 'Carregando transmissão...'}
                                </h2>
                                <div className="flex flex-wrap gap-4">
                                     <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-paraiso-green transition-colors">
                                        <Share2 size={16} /> Compartilhar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Latest Videos */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="font-black uppercase tracking-widest text-xs text-slate-400">Últimas Transmissões</h3>
                            <div className="h-px flex-1 bg-slate-200 ml-4"></div>
                        </div>

                        <div className="space-y-4">
                            {otherVideos.length > 0 ? otherVideos.map((vid: any, i: number) => (
                                <a 
                                    key={vid.id.videoId}
                                    href={`/membros/ao-vivo?video=${vid.id.videoId}`}
                                    className="group flex gap-4 p-4 rounded-3xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100"
                                >
                                    <div className="relative w-32 h-20 shrink-0 rounded-2xl overflow-hidden bg-slate-200">
                                        <img 
                                            src={vid.snippet.thumbnails.medium.url} 
                                            alt="" 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Play size={20} className="text-white fill-white" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center min-w-0">
                                        <h4 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-paraiso-blue-dark transition-colors">
                                            {vid.snippet.title}
                                        </h4>
                                        <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-wide">
                                            Há {i + 1} semana
                                        </p>
                                    </div>
                                </a>
                            )) : (
                                <p className="text-xs text-slate-400 text-center py-10 italic">Nenhum vídeo adicional encontrado.</p>
                            )}
                        </div>

                        <Link 
                            href="https://youtube.com/@paraisoigreja" 
                            target="_blank"
                            className="block w-full text-center py-5 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:border-red-600 hover:text-red-600 transition-all"
                        >
                            Ver todos no YouTube
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    )
}
