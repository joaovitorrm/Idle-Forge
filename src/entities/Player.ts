import Rect from "../util/rect.js";
import Inventory from "./Inventory.js";
import { type Item, StarterPickaxe } from "./Item.js";

export default class Player {
    private money: number = 0;
    private inventory : Inventory = new Inventory();
    public gear : Record<string, Item> = {};

    init() {
        this.inventory.init();

        if (localStorage.getItem("playerData")) {
            const playerData = JSON.parse(localStorage.getItem("playerData")!);
            this.money = playerData.money;
            this.gear = playerData.gear;
        } else {
            this.gear = { "pickaxe": new StarterPickaxe() };
        }        
        
    }

    getMoney() : number {
        return this.money;
    }

    setMoney(money : number) : void {
        this.money = money;
    }

    getInventory() : Map<string, {item : Item, amount : number}> {
        return this.inventory.getItems();
    }

    addItem(item : Item, amount : number) : void {
        this.inventory.addItem(item, amount);
    }

    getPickaxeDamage() : number {
        return 0;
    }
}