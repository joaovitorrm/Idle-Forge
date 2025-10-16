import { AssetManager } from "../core/AssetManager.js";
import type { objectsAssets } from "../data/assets.js";

export abstract class Item {
    public spriteKey : string = "";
    constructor(
        public name : string,        
        public sprite : HTMLImageElement,
        public spriteClip : [number, number, number, number],
    ) {}

    toJSON() {
        return {
            name: this.name,
            spriteKey: this.spriteKey,
            spriteClip: this.spriteClip,
        };
    }

    static fromJSON(name: string) : Item {

        const registry: Record<string, new () => Item> = {
            "stonePickaxe": StarterPickaxe,
            "copperOre": CopperOre,
            "goldOre": GoldOre,
            "coalOre": CoalOre
        };

        const ClassRef = registry[name];
        if (!ClassRef) throw new Error(`Item type "${name}" não registrado.`);

        const instance = new ClassRef();

        return instance;
    }

}

export class StarterPickaxe extends Item {
    private damage : number = 1;

    constructor() {
        const assetManager = AssetManager.getInstance();
        const sprite = assetManager.getObjectImage("stonePickaxe")!.img;
        const spriteClip = assetManager.getObjectImage("stonePickaxe")!.clip;

        super("Stone Pickaxe", sprite, spriteClip);

        this.spriteKey = "stonePickaxe";
    }

    public getDamage() : number {
        return this.damage;
    }
}

export class CopperOre extends Item {
    constructor() {
        const assetManager = AssetManager.getInstance();
        const sprite = assetManager.getObjectImage("copperOre")!.img;
        const spriteClip = assetManager.getObjectImage("copperOre")!.clip;

        super("Copper Ore", sprite, spriteClip);

        this.spriteKey = "copperOre";
    }
}

export class GoldOre extends Item {
    constructor() {
        const assetManager = AssetManager.getInstance();
        const sprite = assetManager.getObjectImage("goldOre")!.img;
        const spriteClip = assetManager.getObjectImage("goldOre")!.clip;

        super("Gold Ore", sprite, spriteClip);

        this.spriteKey = "goldOre";
    }
}

export class CoalOre extends Item {
    constructor() {
        const assetManager = AssetManager.getInstance();
        const sprite = assetManager.getObjectImage("coalOre")!.img;
        const spriteClip = assetManager.getObjectImage("coalOre")!.clip;

        super("Coal Ore", sprite, spriteClip);

        this.spriteKey = "coalOre";
    }
}