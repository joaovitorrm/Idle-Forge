import Inventory from "./inventory.js";

export default class Player {
    private money: number = 0;
    private inventory : Inventory = new Inventory();
    contructor() {

    }

    getMoney() : number {
        return this.money;
    }

    setMoney(money : number) : void {
        this.money = money;
    }

    getInventory() : Inventory {
        return this.inventory;
    }
}