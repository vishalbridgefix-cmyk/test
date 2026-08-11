export class Cache {
  private memoryCache: Map<string, { data: any; expiry: number }> = new Map();
  private activeRequests: Map<string, Promise<any>> = new Map();
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes

  async getOrFetch<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = this.memoryCache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data as T;
    }

    if (this.activeRequests.has(key)) {
      return this.activeRequests.get(key) as Promise<T>;
    }

    const request = fetcher().then(
      (data) => {
        this.memoryCache.set(key, { data, expiry: Date.now() + this.defaultTTL });
        this.activeRequests.delete(key);
        return data;
      },
      (error) => {
        this.activeRequests.delete(key);
        throw error;
      }
    );

    this.activeRequests.set(key, request);
    return request;
  }

  clear() {
    this.memoryCache.clear();
  }
}
