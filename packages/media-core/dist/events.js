export class EventEmitter {
    listeners = new Map();
    constructor() {
        // Default listeners
        this.subscribe('view', (payload) => {
            console.log(`Viewed ${payload.type} ${payload.id}`);
        });
        this.subscribe('download', (payload) => {
            console.log(`Downloaded ${payload.type} ${payload.id}`);
        });
    }
    subscribe(event, handler) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(handler);
    }
    unsubscribe(event, handler) {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            eventListeners.delete(handler);
        }
    }
    emit(event, payload) {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            eventListeners.forEach((handler) => handler(payload));
        }
    }
}
