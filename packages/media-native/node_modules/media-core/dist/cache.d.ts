export declare class Cache {
    private memoryCache;
    private activeRequests;
    private readonly defaultTTL;
    getOrFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T>;
    clear(): void;
}
