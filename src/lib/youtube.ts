
import { google } from 'googleapis';

export async function getLastStream() {
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey || apiKey === 'your_api_key_here') {
        console.warn('YOUTUBE_API_KEY is missing or invalid. YouTube integration disabled.');
        return null;
    }

    const youtube = google.youtube({
        version: 'v3',
        auth: apiKey,
    });

    const channelHandle = 'ibrejetibaoficial';

    try {
        // 1. Get Channel ID from Handle
        const channelResponse = await youtube.channels.list({
            part: ['contentDetails'],
            forHandle: channelHandle,
        });

        if (!channelResponse.data.items || channelResponse.data.items.length === 0) {
            console.error('Channel not found');
            return null;
        }

        const uploadsPlaylistId = channelResponse.data.items[0].contentDetails?.relatedPlaylists?.uploads;

        if (!uploadsPlaylistId) {
            console.error('Uploads playlist not found');
            return null;
        }

        // 2. Get latest video from uploads playlist (most reliable way to get latest content including streams that just ended)
        const playlistResponse = await youtube.playlistItems.list({
            part: ['snippet'],
            playlistId: uploadsPlaylistId,
            maxResults: 1,
        });

        if (!playlistResponse.data.items || playlistResponse.data.items.length === 0) {
            return null;
        }

        const latestVideo = playlistResponse.data.items[0].snippet;
        return {
            id: latestVideo?.resourceId?.videoId,
            title: latestVideo?.title,
            description: latestVideo?.description,
            thumbnail: latestVideo?.thumbnails?.high?.url || latestVideo?.thumbnails?.medium?.url,
            publishedAt: latestVideo?.publishedAt
        };

    } catch (error) {
        console.error('Error fetching YouTube data:', error);
        return null;
    }
}
