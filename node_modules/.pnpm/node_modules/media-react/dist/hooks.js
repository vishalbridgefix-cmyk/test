import { useState, useCallback } from 'react';
import { useMediaClient } from './MediaProvider';
export const useMedia = () => {
    const client = useMediaClient();
    return client;
};
export const useSearch = () => {
    const client = useMediaClient();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [photosResult, setPhotosResult] = useState(null);
    const [videosResult, setVideosResult] = useState(null);
    const search = useCallback(async (query, page = 1, perPage = 30) => {
        setLoading(true);
        setError(null);
        try {
            const [photos, videos] = await Promise.all([
                client.searchPhotos(query, page, perPage),
                client.searchVideos(query, page, perPage),
            ]);
            setPhotosResult(prev => {
                if (page === 1 || !prev)
                    return photos;
                const existingIds = new Set(prev.photos.map(p => p.id));
                const newPhotos = photos.photos.filter(p => !existingIds.has(p.id));
                return { ...photos, photos: [...prev.photos, ...newPhotos] };
            });
            setVideosResult(prev => {
                if (page === 1 || !prev)
                    return videos;
                const existingIds = new Set(prev.videos.map(v => v.id));
                const newVideos = videos.videos.filter(v => !existingIds.has(v.id));
                return { ...videos, videos: [...prev.videos, ...newVideos] };
            });
        }
        catch (err) {
            setError(err);
        }
        finally {
            setLoading(false);
        }
    }, [client]);
    return { search, loading, error, photosResult, videosResult };
};
export const usePhotos = () => {
    const client = useMediaClient();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const getPhotos = useCallback(async (query, page = 1, perPage = 30) => {
        setLoading(true);
        setError(null);
        try {
            if (query) {
                return await client.searchPhotos(query, page, perPage);
            }
            else {
                return await client.getCuratedPhotos(page, perPage);
            }
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [client]);
    return { getPhotos, loading, error };
};
export const useVideos = () => {
    const client = useMediaClient();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const getVideos = useCallback(async (query, page = 1, perPage = 30) => {
        setLoading(true);
        setError(null);
        try {
            if (query) {
                return await client.searchVideos(query, page, perPage);
            }
            else {
                return await client.getCuratedVideos(page, perPage);
            }
        }
        catch (err) {
            setError(err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    }, [client]);
    return { getVideos, loading, error };
};
export const useEvents = () => {
    const client = useMediaClient();
    const trackView = useCallback((type, id) => {
        client.events.emit('view', { type, id });
    }, [client]);
    const trackDownload = useCallback((type, id) => {
        client.events.emit('download', { type, id });
    }, [client]);
    return { trackView, trackDownload, events: client.events };
};
