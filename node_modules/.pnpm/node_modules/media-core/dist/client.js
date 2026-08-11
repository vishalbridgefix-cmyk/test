import { EventEmitter } from './events';
import { Cache } from './cache';
import { handleApiError } from './errors';
export class MediaClient {
    config;
    events;
    cache;
    baseUrl = 'https://api.pexels.com/v1';
    videoBaseUrl = 'https://api.pexels.com/videos';
    constructor(config) {
        if (!config.apiKey) {
            throw new Error('API Key is required to initialize MediaClient');
        }
        this.config = config;
        this.events = new EventEmitter();
        this.cache = new Cache();
    }
    async fetch(url) {
        return this.cache.getOrFetch(url, async () => {
            try {
                const response = await fetch(url, {
                    headers: {
                        Authorization: this.config.apiKey,
                    },
                });
                if (!response.ok) {
                    handleApiError(response.status, response.statusText);
                }
                return await response.json();
            }
            catch (error) {
                if (error instanceof Error && error.name === 'TypeError') {
                    handleApiError(0, 'Network Error');
                }
                throw error;
            }
        });
    }
    // --- Photos ---
    async searchPhotos(query, page = 1, perPage = 30) {
        const url = `${this.baseUrl}/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;
        return this.fetch(url);
    }
    async getCuratedPhotos(page = 1, perPage = 30) {
        const url = `${this.baseUrl}/curated?page=${page}&per_page=${perPage}`;
        return this.fetch(url);
    }
    async getPhotoById(id) {
        const url = `${this.baseUrl}/photos/${id}`;
        return this.fetch(url);
    }
    // --- Videos ---
    async searchVideos(query, page = 1, perPage = 30) {
        const url = `${this.videoBaseUrl}/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;
        return this.fetch(url);
    }
    async getCuratedVideos(page = 1, perPage = 30) {
        const url = `${this.videoBaseUrl}/popular?page=${page}&per_page=${perPage}`;
        return this.fetch(url);
    }
    async getVideoById(id) {
        const url = `${this.videoBaseUrl}/videos/${id}`;
        return this.fetch(url);
    }
}
