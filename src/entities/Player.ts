import { EventBus } from "../core/EventBus.js";
import Inventory from "./Inventory.js";
import { Fuel, type Item, Ore, StarterPickaxe } from "./Item.js";

type CanHold = Fuel | Ore;

export default class Player {
    private money: number = 0;
    private inventory: Inventory = new Inventory();
    public gear: Record<string, Item> = {};
    public holdingItem: { item: CanHold, amount: number } | null = null;
    //public unlockedPlates : Map<string, Plate> = new Map();


    init() {
        this.inventory.init();

        if (localStorage.getItem("playerData")) {
            const playerData = JSON.parse(localStorage.getItem("playerData")!);
            this.money = playerData.money;
            this.gear = playerData.gear;
        } else {
            this.gear = { "pickaxe": new StarterPickaxe() };
        }

        this.initEvents();
    }

    initEvents(): void {
        EventBus.on("hold_item", (item: CanHold, amount: number) => {
            if (this.getItemAmount(item) < (this.holdingItem ? this.holdingItem.amount : 0) + amount) return;

            if (this.holdingItem !== null && this.holdingItem.item.name === item.name) {
                this.holdingItem.amount += amount;
                return;
            }

            this.holdingItem = { item, amount };
        })
    }

    getMoney(): number {
        return this.money;
    }

    setMoney(money: number): void {
        this.money = money;
    }

    getInventory(): Map<string, { item: Item, amount: number }> {
        return this.inventory.getItems();
    }

    addItem(item: Item, amount: number): void {
        this.inventory.addItem(item, amount);
    }

    removeItem(item: Item, amount: number): void {
        this.inventory.removeItem(item, amount);
    }

    getPickaxeDamage(): number {
        return 0;
    }

    getItemAmount(item: Item): number {
        return this.inventory.getItemAmount(item);
    }
}