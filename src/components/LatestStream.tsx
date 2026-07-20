'use client';
import React, { useEffect, useState } from 'react';
import { PlayCircle, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';
import Reveal from './Reveal';
import type { SiteYoutube } from '@/lib/site-content/types';

interface Video {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    publishedAt: string;
}

interface LatestStreamProps {
    content: SiteYoutube;
}

const LatestStream: React.FC<LatestStreamProps> = ({ content }) => {
    const [video, setVideo] = useState<Video | null>(null);
    const [loading, setLoading] = useState(true);
    const channelHandle = content.channelHandle.replace(/^@/, '');

    useEffect(() => {
        const fetchLatestVideo = async () => {
            const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

            if (!apiKey) {
                console.warn('NEXT_PUBLIC_YOUTUBE_API_KEY not found');
                setLoading(false);
                return;
            }

            try {
                const channelRes = await fetch(
                    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forHandle=${encodeURIComponent(channelHandle)}&key=${apiKey}`
                );
                const channelData = await channelRes.json();

                if (!channelData.items?.[0]) {
                    setLoading(false);
                    return;
                }

                const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

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
    }, [channelHandle]);

    if (!video && !loading) return null;

    const titleParts = content.sectionTitle.trim().split(/\s+/);
    const highlight = titleParts.length > 1 ? titleParts[titleParts.length - 1] : '';
    const titleMain = titleParts.length > 1 ? titleParts.slice(0, -1).join(' ') : content.sectionTitle;

    return (
        <section id="aovivo" className="w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] lg:w-[calc(100%-8rem)] max-w-[90rem] mx-auto bg-white dark:bg-paraiso-blue-dark rounded-[2.5rem] shadow-sm overflow-hidden bg-clip-padding my-6 md:my-10 py-16 md:py-20 px-6 md:px-12 lg:px-20 border border-slate-100 dark:border-white/5 relative">
            <div className="absolute inset-0 bg-paraiso-blue/5 pointer-events-none" />

            <div className="relative z-10">
                <Reveal>
                    <div className="flex flex-col items-center text-center mb-12">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                            <span className="text-red-600 font-black uppercase tracking-widest text-xs">Youtube</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-paraiso-blue dark:text-white leading-none mb-4">
                            {titleMain}{' '}
                            {highlight ? (
                                <>
                                    <br />
                                    <span className="text-paraiso-green italic font-serif lowercase">{highlight}</span>
                                </>
                            ) : null}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-300 font-medium max-w-2xl text-base">
                            Acompanhe nossos cultos e mensagens onde você estiver.
                        </p>
                    </div>
                </Reveal>

                <Reveal delay={0.2}>
                    {video ? (
                        <motion.div
                            whileHover={{ y: -4 }}
                            className="max-w-4xl mx-auto rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl bg-black relative group aspect-video"
                        >
                            <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-500"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600/90 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(220,38,38,0.5)] group-hover:scale-110 transition-transform duration-300">
                                        <PlayCircle size={36} className="text-white fill-white" />
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 bg-gradient-to-t from-black/90 to-transparent">
                                    <h3 className="text-white text-lg md:text-2xl font-bold line-clamp-2">{video.title}</h3>
                                    <p className="text-slate-300 mt-1 font-medium text-sm">Clique para assistir agora</p>
                                </div>
                            </a>
                        </motion.div>
                    ) : (
                        <div className="max-w-4xl mx-auto h-[300px] md:h-[400px] rounded-3xl bg-slate-200 dark:bg-white/5 flex items-center justify-center animate-pulse">
                            <Youtube size={64} className="text-slate-300 dark:text-slate-600" />
                        </div>
                    )}
                </Reveal>

                <div className="text-center mt-10">
                    <a
                        href={`https://www.youtube.com/@${channelHandle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white dark:bg-paraiso-blue border border-slate-200 dark:border-white/10 text-paraiso-blue dark:text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-paraiso-blue hover:text-white hover:border-transparent transition-all shadow-lg"
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
