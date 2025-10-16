import { Item } from "./Item.js";

export default class Inventory {
    private inventory : Map<string, {item : Item, amount : number}> = new Map();
    constructor() {
        
    }

    addItem(item : Item, amount : number) : void {
        const existing = this.inventory.get(item.name);
        const newAmount = existing ? existing.amount + amount : amount;

        this.inventory.set(item.name, { item, amount: newAmount });
        this.save();
    }

    getItems() : typeof this.inventory {
        return this.inventory;
    }

    private save(): void {
        // salva apenas dados simples, não o objeto Item em si
        const plainInventory = Array.from(this.inventory.entries()).map(([name, { item, amount }]) => ({
            name,
            itemData: item.toJSON(),
            amount,
        }));

        localStorage.setItem("inventory", JSON.stringify(plainInventory));
    }

    public init(): void {
        const stored = localStorage.getItem("inventory");
        if (!stored) return;

        try {
            const data: Array<{ name: string; itemData: any; amount: number }> = JSON.parse(stored);
            this.inventory = new Map(
                data.map(({ name, itemData, amount }) => {
                    const item: Item = this.restoreItem(itemData.spriteKey);
                    return [name, { item, amount }];
                })
            );
        } catch (err) {
            console.error("Falha ao carregar inventário:", err);
            this.inventory.clear();
        }
    }

    private restoreItem(data: string): Item {
        return Item.fromJSON(data);
    }

}