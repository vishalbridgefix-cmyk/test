export class Cache {
    memoryCache = new Map();
    activeRequests = new Map();
    defaultTTL = 5 * 60 * 1000; // 5 minutes
    async getOrFetch(key, fetcher) {
        const cached = this.memoryCache.get(key);
        if (cached && cached.expiry > Date.now()) {
            return cached.data;
        }
        if (this.activeRequests.has(key)) {
            return this.activeRequests.get(key);
        }
        const request = fetcher().then((data) => {
            this.memoryCache.set(key, { data, expiry: Date.now() + this.defaultTTL });
            this.activeRequests.delete(key);
            return data;
        }, (error) => {
            this.activeRequests.delete(key);
            throw error;
        });
        this.activeRequests.set(key, request);
        return request;
    }
    clear() {
        this.memoryCache.clear();
    }
}
