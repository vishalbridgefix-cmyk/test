import { PhotosResponse, VideosResponse, EventEmitter } from 'media-core';
export declare const useMedia: () => import("media-core").MediaClient;
export declare const useSearch: () => {
    search: (query: string, page?: number, perPage?: number) => Promise<void>;
    loading: boolean;
    error: Error | null;
    photosResult: PhotosResponse | null;
    videosResult: VideosResponse | null;
};
export declare const usePhotos: () => {
    getPhotos: (query?: string, page?: number, perPage?: number) => Promise<PhotosResponse>;
    loading: boolean;
    error: Error | null;
};
export declare const useVideos: () => {
    getVideos: (query?: string, page?: number, perPage?: number) => Promise<VideosResponse>;
    loading: boolean;
    error: Error | null;
};
export declare const useEvents: () => {
    trackView: (type: "image" | "video", id: number) => void;
    trackDownload: (type: "image" | "video", id: number) => void;
    emit: (event: string, payload?: any) => void;
    events: EventEmitter;
};
