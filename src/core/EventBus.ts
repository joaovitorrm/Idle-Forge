type Listener = (...args: any[]) => void;

export class EventBus {
    private static events = new Map<string, Listener[]>();

    private constructor() {}

    static on(event: string, listener: Listener) {
        if (!this.events.has(event)) this.events.set(event, []);
        this.events.get(event)!.push(listener);
    }

    static off(event: string, listener: Listener) {
        const list = this.events.get(event);
        if (!list) return;
        const index = list.indexOf(listener);
        if (index !== -1) list.splice(index, 1);
    }

    static emit(event: string, ...args: any[]) {
        const list = this.events.get(event);
        if (!list) return;
        for (const l of list) l(...args);
    }
}
