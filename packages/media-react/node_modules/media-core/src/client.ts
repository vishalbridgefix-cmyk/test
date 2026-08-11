import { MediaConfig, PhotosResponse, VideosResponse, Photo, Video } from './types';
import { EventEmitter } from './events';
import { Cache } from './cache';
import { handleApiError } from './errors';

export class MediaClient {
  private config: MediaConfig;
  public events: EventEmitter;
  private cache: Cache;
  private baseUrl = 'https://api.pexels.com/v1';
  private videoBaseUrl = 'https://api.pexels.com/videos';

  constructor(config: MediaConfig) {
    if (!config.apiKey) {
      throw new Error('API Key is required to initialize MediaClient');
    }
    this.config = config;
    this.events = new EventEmitter();
    this.cache = new Cache();
  }

  private async fetch<T>(url: string): Promise<T> {
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
      } catch (error) {
        if (error instanceof Error && error.name === 'TypeError') {
          handleApiError(0, 'Network Error');
        }
        throw error;
      }
    });
  }

  // --- Photos ---

  async searchPhotos(query: string, page = 1, perPage = 30): Promise<PhotosResponse> {
    const url = `${this.baseUrl}/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;
    return this.fetch<PhotosResponse>(url);
  }

  async getCuratedPhotos(page = 1, perPage = 30): Promise<PhotosResponse> {
    const url = `${this.baseUrl}/curated?page=${page}&per_page=${perPage}`;
    return this.fetch<PhotosResponse>(url);
  }

  async getPhotoById(id: number): Promise<Photo> {
    const url = `${this.baseUrl}/photos/${id}`;
    return this.fetch<Photo>(url);
  }

  // --- Videos ---

  async searchVideos(query: string, page = 1, perPage = 30): Promise<VideosResponse> {
    const url = `${this.videoBaseUrl}/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;
    return this.fetch<VideosResponse>(url);
  }

  async getCuratedVideos(page = 1, perPage = 30): Promise<VideosResponse> {
    const url = `${this.videoBaseUrl}/popular?page=${page}&per_page=${perPage}`;
    return this.fetch<VideosResponse>(url);
  }

  async getVideoById(id: number): Promise<Video> {
    const url = `${this.videoBaseUrl}/videos/${id}`;
    return this.fetch<Video>(url);
  }
}
