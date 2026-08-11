import { MediaConfig, PhotosResponse, VideosResponse, Photo, Video } from './types';
import { EventEmitter } from './events';
export declare class MediaClient {
    private config;
    events: EventEmitter;
    private cache;
    private baseUrl;
    private videoBaseUrl;
    constructor(config: MediaConfig);
    private fetch;
    searchPhotos(query: string, page?: number, perPage?: number): Promise<PhotosResponse>;
    getCuratedPhotos(page?: number, perPage?: number): Promise<PhotosResponse>;
    getPhotoById(id: number): Promise<Photo>;
    searchVideos(query: string, page?: number, perPage?: number): Promise<VideosResponse>;
    getCuratedVideos(page?: number, perPage?: number): Promise<VideosResponse>;
    getVideoById(id: number): Promise<Video>;
}
