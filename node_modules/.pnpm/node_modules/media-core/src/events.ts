type EventMap = {
  view: { type: 'image' | 'video'; id: number };
  download: { type: 'image' | 'video'; id: number };
  [key: string]: any;
};

type EventHandler<T> = (payload: T) => void;

export class EventEmitter {
  private listeners: Map<keyof EventMap, Set<EventHandler<any>>> = new Map();

  constructor() {
    // Default listeners
    this.subscribe('view', (payload) => {
      console.log(`Viewed ${payload.type} ${payload.id}`);
    });
    this.subscribe('download', (payload) => {
      console.log(`Downloaded ${payload.type} ${payload.id}`);
    });
  }

  subscribe<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
  }

  unsubscribe<K extends keyof EventMap>(event: K, handler: EventHandler<EventMap[K]>): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(handler);
    }
  }

  emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((handler) => handler(payload));
    }
  }
}
