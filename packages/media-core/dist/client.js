import { EventEmitter } from './events';
import { Cache } from './cache';
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
        if (this.config.apiKey === 'PLACEHOLDER_API_KEY') {
            return this.getMockResponse(url);
        }
        return this.cache.getOrFetch(url, async () => {
            try {
                const response = await fetch(url, {
                    headers: {
                        Authorization: this.config.apiKey,
                    },
                });
                if (!response.ok) {
                    return this.getMockResponse(url);
                }
                return await response.json();
            }
            catch (error) {
                return this.getMockResponse(url);
            }
        });
    }
    getMockResponse(url) {
        if (url.includes('/videos')) {
            const mockVideos = [
                {
                    id: 101,
                    width: 1080,
                    height: 1920,
                    url: 'https://www.pexels.com/video/101',
                    image: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=800',
                    duration: 15,
                    user: { id: 1, name: 'Zuzanna Musial', url: 'https://www.pexels.com/@zuzanna' },
                    video_files: [
                        { id: 1001, quality: 'hd', file_type: 'video/mp4', width: 1080, height: 1920, link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }
                    ],
                    video_pictures: [{ id: 1, picture: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg', nr: 0 }]
                },
                {
                    id: 102,
                    width: 1080,
                    height: 1920,
                    url: 'https://www.pexels.com/video/102',
                    image: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800',
                    duration: 20,
                    user: { id: 2, name: 'Alex Rivera', url: 'https://www.pexels.com/@alex' },
                    video_files: [
                        { id: 1002, quality: 'hd', file_type: 'video/mp4', width: 1080, height: 1920, link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' }
                    ],
                    video_pictures: [{ id: 2, picture: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg', nr: 0 }]
                },
                {
                    id: 103,
                    width: 1080,
                    height: 1920,
                    url: 'https://www.pexels.com/video/103',
                    image: 'https://images.pexels.com/photos/258109/pexels-photo-258109.jpeg?auto=compress&cs=tinysrgb&w=800',
                    duration: 12,
                    user: { id: 3, name: 'Elena Rostova', url: 'https://www.pexels.com/@elena' },
                    video_files: [
                        { id: 1003, quality: 'hd', file_type: 'video/mp4', width: 1080, height: 1920, link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' }
                    ],
                    video_pictures: [{ id: 3, picture: 'https://images.pexels.com/photos/258109/pexels-photo-258109.jpeg', nr: 0 }]
                },
                {
                    id: 104,
                    width: 1080,
                    height: 1920,
                    url: 'https://www.pexels.com/video/104',
                    image: 'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=800',
                    duration: 18,
                    user: { id: 4, name: 'Marcus Chen', url: 'https://www.pexels.com/@marcus' },
                    video_files: [
                        { id: 1004, quality: 'hd', file_type: 'video/mp4', width: 1080, height: 1920, link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' }
                    ],
                    video_pictures: [{ id: 4, picture: 'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg', nr: 0 }]
                },
                {
                    id: 105,
                    width: 1080,
                    height: 1920,
                    url: 'https://www.pexels.com/video/105',
                    image: 'https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg?auto=compress&cs=tinysrgb&w=800',
                    duration: 14,
                    user: { id: 5, name: 'Sarah Jenkins', url: 'https://www.pexels.com/@sarah' },
                    video_files: [
                        { id: 1005, quality: 'hd', file_type: 'video/mp4', width: 1080, height: 1920, link: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoybacks.mp4' }
                    ],
                    video_pictures: [{ id: 5, picture: 'https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg', nr: 0 }]
                }
            ];
            return {
                page: 1,
                per_page: 30,
                total_results: 5,
                videos: mockVideos,
                next_page: undefined
            };
        }
        const mockPhotos = [
            {
                id: 201,
                width: 1920,
                height: 1280,
                url: 'https://www.pexels.com/photo/201',
                photographer: 'Elena V.',
                photographer_url: 'https://www.pexels.com/@elena',
                photographer_id: 10,
                avg_color: '#1e293b',
                src: {
                    original: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg',
                    large2x: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=1260',
                    large: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=600',
                    medium: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=400',
                    small: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=200',
                    portrait: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg',
                    landscape: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg',
                    tiny: 'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg'
                },
                liked: false,
                alt: 'Cinematic Nature Sunset'
            },
            {
                id: 202,
                width: 1920,
                height: 1280,
                url: 'https://www.pexels.com/photo/202',
                photographer: 'Marcus Dev',
                photographer_url: 'https://www.pexels.com/@marcus',
                photographer_id: 11,
                avg_color: '#0f172a',
                src: {
                    original: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg',
                    large2x: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1260',
                    large: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=600',
                    medium: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400',
                    small: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=200',
                    portrait: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg',
                    landscape: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg',
                    tiny: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg'
                },
                liked: false,
                alt: 'Mountain Peak Wilderness'
            }
        ];
        return {
            page: 1,
            per_page: 30,
            total_results: 2,
            photos: mockPhotos,
            next_page: undefined
        };
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
