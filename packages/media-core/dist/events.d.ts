type EventMap = {
    view: {
        type: 'image' | 'video';
        id: number;
    };
    download: {
        type: 'image' | 'video';
        id: number;
    };
    [key: string]: any;
};
type EventHandler<T> = (payload: T) => void;
export declare class EventEmitter {
    private listeners;
    constructor();
    subscribe<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void;
    unsubscribe<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void;
    emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): void;
}
export {};
