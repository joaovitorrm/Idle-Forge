import { EventBus } from "../core/EventBus.js";
import { Item } from "./Item.js";

type Constructor<T> = abstract new (...args: any[]) => T;

export default class Inventory<T extends Item> {
    private inventory: Map<string, { item: T; amount: number }> = new Map();

    constructor(
        private allowedBaseClasses?: Constructor<T>[],
        private storageKey: string = "inventory" // ← chave padrão, pode ser sobrescrita
    ) {}

    addItem(item: T, amount: number): void {
        if (this.allowedBaseClasses) {
            const isAllowed = this.allowedBaseClasses.some(base => item instanceof base);
            if (!isAllowed) {
                throw new Error(`Tipo de item ${item.constructor.name} não permitido neste inventário.`);
            }
        }

        const existing = this.inventory.get(item.name);
        const newAmount = (existing?.amount ?? 0) + amount;
        this.inventory.set(item.name, { item, amount: newAmount });
        EventBus.emit("inventory:update");
        this.save();
    }

    getItems(): ReadonlyMap<string, { item: T; amount: number }> {
        return this.inventory;
    }

    removeItem(item: T, amount: number): void {
        const existing = this.inventory.get(item.name);
        if (!existing) return;
        const newAmount = existing.amount - amount;
        if (newAmount > 0) this.inventory.set(item.name, { item, amount: newAmount });
        else this.inventory.delete(item.name);
        EventBus.emit("inventory:update");
        this.save();
    }

    getItemAmount(item: T): number {
        return this.inventory.get(item.name)?.amount ?? 0;
    }

    save(): void {
        const plain = Array.from(this.inventory.values()).map(({ item, amount }) => ({
            itemData: item.toJSON(),
            amount,
        }));
        localStorage.setItem(this.storageKey, JSON.stringify(plain));
    }

    init(): void {
        const stored = localStorage.getItem(this.storageKey);
        if (!stored) return;

        try {
            const data: Array<{ itemData: any; amount: number }> = JSON.parse(stored);
            this.inventory = new Map(
                data.map(({ itemData, amount }) => {
                    const item = Item.fromJSON(itemData) as T;
                    return [item.name, { item, amount }];
                })
            );
        } catch (err) {
            console.error(`Falha ao carregar inventário (${this.storageKey}):`, err);
            this.inventory.clear();
        }
    }
}
