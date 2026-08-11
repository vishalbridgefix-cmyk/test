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
    const search = useCallback(async (query, page = 1) => {
        setLoading(true);
        setError(null);
        try {
            const [photos, videos] = await Promise.all([
                client.searchPhotos(query, page),
                client.searchVideos(query, page),
            ]);
            setPhotosResult(photos);
            setVideosResult(videos);
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
    const getPhotos = useCallback(async (query, page = 1) => {
        setLoading(true);
        setError(null);
        try {
            if (query) {
                return await client.searchPhotos(query, page);
            }
            else {
                return await client.getCuratedPhotos(page);
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
    const getVideos = useCallback(async (query, page = 1) => {
        setLoading(true);
        setError(null);
        try {
            if (query) {
                return await client.searchVideos(query, page);
            }
            else {
                return await client.getCuratedVideos(page);
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
