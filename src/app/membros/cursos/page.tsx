import { getYouTubeCourses } from '@/services/youtubeService'
import { BookOpen, Play, ChevronLeft, GraduationCap, Clock, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default async function CoursesPage() {
    const courseVideos = await getYouTubeCourses()

    return (
        <div className="bg-slate-50 min-h-screen pb-20 pt-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                
                {/* Header */}
                <div className="mb-12">
                    <Link href="/membros" className="text-slate-500 hover:text-slate-700 text-sm flex items-center gap-1 mb-4 transition-colors">
                        <ChevronLeft size={14} /> Voltar ao Painel
                    </Link>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Polo FLMU</span>
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Igreja Paraíso</span>
                            </div>
                            <h1 className="text-4xl font-black text-paraiso-blue-dark tracking-tighter">
                                Curso Intermediário em <span className="text-orange-600">Teologia</span>
                            </h1>
                            <p className="text-slate-500 mt-2 max-w-2xl">
                                Estude as Escrituras com profundidade e clareza. Nosso polo FLMU oferece formação teológica de excelência.
                            </p>
                        </div>
                        <a 
                            href="https://flmu.education/" 
                            target="_blank"
                            className="bg-white border-2 border-slate-100 hover:border-orange-500 text-slate-700 px-6 py-3 rounded-2xl flex items-center gap-3 font-black uppercase tracking-widest text-[10px] transition-all shadow-sm"
                        >
                            Site Oficial FLMU <ExternalLink size={14} />
                        </a>
                    </div>
                </div>

                {/* Course Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* Main Content Area */}
                    <div className="lg:col-span-3 space-y-8">
                        
                        {/* Featured Info Box */}
                        <div 
                            className="bg-orange-600 bg-gradient-to-r from-orange-600 to-orange-500 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-xl"
                            style={{ backgroundColor: '#ea580c' }} // Fallback para Safari Mobile
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                            <div className="relative z-10">
                                <GraduationCap size={48} className="mb-6 opacity-30" />
                                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter mb-4">Sobre o Curso</h2>
                                <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-3xl mb-8">
                                    O Curso Intermediário em Teologia é desenhado para quem deseja avançar no conhecimento bíblico e doutrinário. 
                                    Aqui você encontrará as lições gravadas, materiais de apoio e as transmissões das aulas presenciais do nosso polo.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-xl text-xs font-bold">
                                        Modulares • Semanal
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-xl text-xs font-bold">
                                        Certificação FLMU
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Video Lessons Section */}
                        <div>
                            <div className="flex items-center justify-between mb-8 px-2">
                                <h3 className="font-black uppercase tracking-widest text-xs text-slate-400">Lições e Transmissões</h3>
                                <div className="h-px flex-1 bg-slate-200 ml-6"></div>
                            </div>

                            {!courseVideos || courseVideos.length === 0 ? (
                                <div className="bg-white rounded-[2rem] border border-slate-100 p-16 text-center text-slate-400 shadow-sm">
                                    <Play size={48} className="mx-auto mb-4 opacity-10" />
                                    <p className="font-bold">Nenhuma lição gravada no momento.</p>
                                    <p className="text-xs mt-1">As aulas serão listadas automaticamente conforme postadas no YouTube.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {courseVideos.map((video: any) => (
                                        <a 
                                            key={video.id.videoId}
                                            href={`/membros/ao-vivo?video=${video.id.videoId}`}
                                            className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                        >
                                            <div className="relative aspect-video overflow-hidden">
                                                <img 
                                                    src={video.snippet.thumbnails.high.url} 
                                                    alt={video.snippet.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                                    <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center text-white shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                                        <Play size={20} fill="white" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-600 mb-2">
                                                    <BookOpen size={12} />
                                                    Teologia Intermediária
                                                </div>
                                                <h4 className="font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
                                                    {video.snippet.title}
                                                </h4>
                                                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={12} /> {new Date(video.snippet.publishedAt).toLocaleDateString('pt-BR')}
                                                    </span>
                                                    <span>Assistir Lição</span>
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
                            <h3 className="font-black uppercase tracking-widest text-xs text-slate-800 mb-6 border-b border-slate-50 pb-4">
                                Material de Apoio
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 group cursor-pointer">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                                        <BookOpen size={16} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Ementa do Curso (PDF)</span>
                                </li>
                                <li className="flex items-center gap-3 group cursor-pointer">
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                                        <BookOpen size={16} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Bibliografia Sugerida</span>
                                </li>
                            </ul>
                        </div>

                        <div 
                            className="bg-orange-600 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-lg group cursor-pointer"
                            style={{ backgroundColor: '#ea580c' }} // Fallback para Safari Mobile
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Suporte do Polo</p>
                            <h4 className="font-bold text-lg leading-tight mb-4">Tem alguma dúvida sobre as lições?</h4>
                            <button 
                                className="w-full py-3 bg-white !text-orange-600 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-orange-50 transition-colors shadow-sm"
                                style={{ color: '#ea580c' }} // Forçar cor de texto no Safari Mobile
                            >
                                Falar com Tutor
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
