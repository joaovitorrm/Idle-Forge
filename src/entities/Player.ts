import { EventBus } from "../core/EventBus.js";
import Inventory from "./Inventory.js";
import { handlePlate, type Item, Ore, Pickaxe, pickaxeHeadPlate, Piece, Plate, StarterPickaxe, swordHandlerPlate, swordHeadPlate, Tool, unionPlate } from "./Item.js";

interface Gear {
    "pickaxe": Pickaxe | null,
}

export interface Inventories {
    ores: Inventory<Ore>;
    plates: Inventory<Plate>;
    pieces: Inventory<Piece>;
    tools: Inventory<Tool>;
}

export default class Player {
    private money: number = 0;
    private inventories : Inventories = {
        ores : new Inventory<Ore>([Ore], "ores"),
        plates : new Inventory<Plate>([Plate], "plates"),
        pieces : new Inventory<Piece>([Piece], "pieces"),
        tools : new Inventory<Tool>([Tool], "tools")
    };
    public gear: Gear = {
        "pickaxe": null,
    };
    public holdingItem: { item: Item, amount: number } | null = null;
    //public unlockedPlates : Map<string, Plate> = new Map();


    async init() {
        if (localStorage.getItem("playerData")) {
            const playerData = JSON.parse(localStorage.getItem("playerData")!);
            this.money = playerData.money;
            this.gear = playerData.gear;
        } else {
            this.gear = { "pickaxe": await StarterPickaxe.create() };
            this.inventories.plates.addItem(new pickaxeHeadPlate(), 1);
            this.inventories.plates.addItem(new handlePlate(), 1);
            this.inventories.plates.addItem(new unionPlate(), 1);
            this.inventories.plates.addItem(new swordHeadPlate(), 1);
            this.inventories.plates.addItem(new swordHandlerPlate(), 1);
        }

        Object.values(this.inventories).forEach(inventory => inventory.init());

        this.initEvents();
    }

    initEvents(): void {
        EventBus.on("hold_item", (item: Item, amount: number) => {
            if (this.getItemAmount(item) < (this.holdingItem ? this.holdingItem.amount : 0) + amount) return;

            if (this.holdingItem !== null && this.holdingItem.item.name === item.name) {
                this.holdingItem.amount += amount;
                return;
            }

            this.holdingItem = { item, amount };
        })

        EventBus.emit("inventory:loaded");
    }

    addItem(item: Item, amount: number): void {
        if (item instanceof Ore) this.inventories.ores.addItem(item, amount);
        if (item instanceof Plate) this.inventories.plates.addItem(item, amount);
        if (item instanceof Piece) this.inventories.pieces.addItem(item, amount);
        if (item instanceof Tool) this.inventories.tools.addItem(item, amount);
    }

    removeItem(item: Item, amount: number): void {
        if (item instanceof Ore) this.inventories.ores.removeItem(item, amount);
        if (item instanceof Plate) this.inventories.plates.removeItem(item, amount);
        if (item instanceof Piece) this.inventories.pieces.removeItem(item, amount);
        if (item instanceof Tool) this.inventories.tools.removeItem(item, amount);
    }

    getMoney(): number {
        return this.money;
    }

    setMoney(money: number): void {
        this.money = money;
    }

    getInventory(key : keyof typeof this.inventories): ReadonlyMap<string, { item: Item, amount: number }> {
        return this.inventories[key].getItems();
    }

    getItemAmount(item: Item): number {
        if (item instanceof Ore) return this.inventories.ores.getItemAmount(item);
        if (item instanceof Plate) return this.inventories.plates.getItemAmount(item);
        if (item instanceof Piece) return this.inventories.pieces.getItemAmount(item);
        return 0;
    }

    getPickaxeDamage(): number {
        return 1;
    }
}