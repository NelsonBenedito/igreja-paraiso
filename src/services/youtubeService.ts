const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = 'UCRQysiJodC97_iA87WHcVYw';

export interface YouTubeCache {
    live: any | null;
    videos: any[];
    lastFetched: number;
}

// Em Next.js, fetch() com tags permite revalidação sob demanda
// ou baseada em tempo (ISR)
export async function getYouTubeData() {
    if (!YOUTUBE_API_KEY) {
        console.error("YouTube API Key not found");
        return { live: null, videos: [] };
    }

    try {
        // Usamos o cache nativo do Next.js (Data Cache)
        // revalidate: 3600 (1 hora) como fallback, mas podemos forçar revalidação
        const fetchOptions = {
            next: { 
                revalidate: 1800, // Revalida a cada 30 minutos em background
                tags: ['youtube-data'] 
            }
        };

        // 1. Check for Live
        const liveRes = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&type=video&eventType=live&key=${YOUTUBE_API_KEY}`,
            fetchOptions
        );
        const liveData = await liveRes.json();
        const activeLive = liveData.items && liveData.items.length > 0 ? liveData.items[0] : null;

        // 2. Get 5 latest videos
        const videosRes = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&order=date&type=video&maxResults=5&key=${YOUTUBE_API_KEY}`,
            fetchOptions
        );
        const videosData = await videosRes.json();
        const videos = videosData.items || [];

        return {
            live: activeLive,
            videos: videos
        };
    } catch (error) {
        console.error("Error fetching YouTube data:", error);
        return { live: null, videos: [] };
    }
}

export async function getYouTubeCourses() {
    if (!YOUTUBE_API_KEY) return [];

    try {
        const res = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&q=FLMU&type=video&maxResults=10&order=date&key=${YOUTUBE_API_KEY}`,
            { next: { revalidate: 3600, tags: ['youtube-courses'] } }
        );
        const data = await res.json();
        return data.items || [];
    } catch (error) {
        console.error("Error fetching YouTube courses:", error);
        return [];
    }
}
