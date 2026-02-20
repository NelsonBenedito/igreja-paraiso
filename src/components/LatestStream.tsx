'use client';
import React, { useEffect, useState } from 'react';
import { PlayCircle, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';
import Reveal from './Reveal';

interface Video {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    publishedAt: string;
}

const LatestStream: React.FC = () => {
    const [video, setVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestVideo = async () => {
            // Note: In a real production app, you should proxy these requests 
            // through your own backend to hide the API key.
            // Using process.env.NEXT_PUBLIC_YOUTUBE_API_KEY for standard Next.js env vars
            const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
            const channelHandle = 'ibrejetibaoficial';

            if (!apiKey) {
                console.warn('NEXT_PUBLIC_YOUTUBE_API_KEY not found');
                setLoading(false);
                return;
            }

            try {
                // 1. Get Channel ID
                const channelRes = await fetch(
                    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${channelHandle}&key=${apiKey}`
                );
                const channelData = await channelRes.json();

                if (!channelData.items?.[0]) {
                    setLoading(false);
                    return;
                }

                const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

                // 2. Get latest video
                const playlistRes = await fetch(
                    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=1&key=${apiKey}`
                );
                const playlistData = await playlistRes.json();

                if (playlistData.items?.[0]) {
                    const item = playlistData.items[0].snippet;
                    setVideo({
                        id: item.resourceId.videoId,
                        title: item.title,
                        description: item.description,
                        thumbnail: item.thumbnails.high?.url || item.thumbnails.medium?.url,
                        publishedAt: item.publishedAt
                    });
                }
            } catch (error) {
                console.error('Error fetching YouTube:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestVideo();
    }, []);

    if (!video && !loading) return null;

    return (
        <section id="aovivo" className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background Decorative */}
            <div className="absolute inset-0 bg-paraiso-blue/5"></div>

            <div className="container mx-auto px-6 relative z-10">
                <Reveal>
                    <div className="flex flex-col items-center text-center mb-16">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                            <span className="text-red-600 font-black uppercase tracking-widest text-xs">Youtube</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-paraiso-blue leading-none mb-6">
                            Transmissões <br />
                            <span className="text-paraiso-green italic font-serif lowercase">online</span>
                        </h2>
                        <p className="text-slate-500 font-medium max-w-2xl text-lg">
                            Acompanhe nossos cultos e mensagens onde você estiver.
                        </p>
                    </div>
                </Reveal>

                <Reveal delay={0.2}>
                    {video ? (
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-black relative group aspect-video"
                        >
                            <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-500"
                                />

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-20 h-20 bg-red-600/90 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.5)] group-hover:scale-110 transition-transform duration-300">
                                        <PlayCircle size={40} className="text-white fill-white" />
                                    </div>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 to-transparent">
                                    <h3 className="text-white text-2xl font-bold line-clamp-2 md:text-3xl">{video.title}</h3>
                                    <p className="text-slate-300 mt-2 font-medium text-sm line-clamp-1">Clique para assistir agora</p>
                                </div>
                            </a>
                        </motion.div>
                    ) : (
                        <div className="max-w-4xl mx-auto h-[400px] rounded-3xl bg-slate-200 flex items-center justify-center animate-pulse">
                            <Youtube size={64} className="text-slate-300" />
                        </div>
                    )}
                </Reveal>

                <div className="text-center mt-12">
                    <a
                        href="https://www.youtube.com/@ibrejetibaoficial"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 text-paraiso-blue rounded-full font-black uppercase tracking-widest text-xs hover:bg-paraiso-blue hover:text-white hover:border-transparent transition-all shadow-lg"
                    >
                        <Youtube size={18} />
                        Ver Canal Completo
                    </a>
                </div>
            </div>
        </section>
    );
};

export default LatestStream;
