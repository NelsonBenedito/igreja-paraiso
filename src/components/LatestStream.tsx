'use client';
import React, { useEffect, useState } from 'react';
import Reveal from './Reveal';
import { EditorialSection, Period, SectionTitle, TextLink } from '@/components/site/Editorial';
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

function formatDate(iso: string): string {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
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

    const sectionTitle = content.sectionTitle.trim().replace(/\.$/, '');
    const channelUrl = `https://www.youtube.com/@${channelHandle}`;
    const publishedLabel = video ? formatDate(video.publishedAt) : '';

    return (
        <EditorialSection id="aovivo" label="Ao vivo" layout="stack">
            <Reveal>
                <div className="mb-14 flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
                    <div className="min-w-0">
                        <SectionTitle>
                            {sectionTitle}
                            <Period />
                        </SectionTitle>
                        <p className="mt-5 max-w-2xl text-base text-ink-muted">
                            Acompanhe nossos cultos e mensagens onde você estiver.
                        </p>
                    </div>
                    <TextLink href={channelUrl}>youtube.com/@{channelHandle}</TextLink>
                </div>
            </Reveal>

            <Reveal delay={0.2}>
                {video ? (
                    <a
                        href={`https://www.youtube.com/watch?v=${video.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block"
                    >
                        <div className="relative aspect-video overflow-hidden rounded-md bg-ink">
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-85"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-paraiso-green transition-transform duration-300 group-hover:scale-105">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
                            <h3 className="m-0 line-clamp-2 text-lg font-medium text-ink md:text-xl">{video.title}</h3>
                            {publishedLabel ? (
                                <p className="m-0 shrink-0 text-sm text-ink-muted">{publishedLabel}</p>
                            ) : null}
                        </div>
                    </a>
                ) : (
                    <div className="aspect-video animate-pulse rounded-md bg-ink/5" aria-hidden="true" />
                )}
            </Reveal>
        </EditorialSection>
    );
};

export default LatestStream;
