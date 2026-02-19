import { getLastStream } from '@/lib/youtube';
import { PlayCircle } from 'lucide-react';
import Image from 'next/image';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function LatestStream() {
    const video = await getLastStream();

    if (!video) {
        return null; // Or render a fallback/skeleton
    }

    return (
        <section className="w-full py-12 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-full md:w-1/2 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-semibold tracking-wide uppercase">
                            <PlayCircle className="w-4 h-4" />
                            Última Transmissão
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground leading-tight">
                            Acompanhe nossos Cultos Online
                        </h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Perdeu o último culto ou quer rever uma mensagem impactante?
                            Assista agora à nossa última transmissão e seja edificado.
                        </p>
                        <div className="pt-2">
                            <Button asChild size="lg" className="bg-red-600 hover:bg-red-700 text-white gap-2 shadow-lg hover:shadow-xl transition-all">
                                <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer">
                                    <PlayCircle className="w-5 h-5" />
                                    Assistir no YouTube
                                </a>
                            </Button>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2">
                        <Card className="overflow-hidden border-none shadow-2xl rounded-2xl group cursor-pointer bg-black">
                            <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" className="block relative aspect-video">
                                {video.thumbnail ? (
                                    <Image
                                        src={video.thumbnail}
                                        alt={video.title || "Última transmissão"}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                                        <PlayCircle className="w-16 h-16 text-white/20" />
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                        <h3 className="text-white font-bold text-lg md:text-xl line-clamp-2 drop-shadow-md">
                                            {video.title}
                                        </h3>
                                        <p className="text-white/80 text-sm mt-2 font-medium">
                                            Clique para assistir
                                        </p>
                                    </div>
                                </div>

                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                        <PlayCircle className="w-8 h-8 text-white fill-white" />
                                    </div>
                                </div>
                            </a>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}
