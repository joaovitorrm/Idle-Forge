import { AssetManager } from "../core/AssetManager.js";

export type OreType = "copper" | "gold" | "coal";

export abstract class Item {
    public spriteKey : string = "";
    constructor(
        public name : string,        
        public sprite : HTMLImageElement,
        public spriteClip : [number, number, number, number]
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

export abstract class Ore extends Item {
    constructor(
        name: string, 
        sprite: HTMLImageElement, 
        spriteClip: [number, number, number, number], 
        public tier : number, 
        public outputType : OreType,
        public meltTime : number
    ) {
        super(name, sprite, spriteClip);
    }
}

export abstract class Fuel extends Item {
    constructor(
        name: string, 
        sprite: HTMLImageElement, 
        spriteClip: [number, number, number, number], 
        public tier : number, 
        public burnTime : number
    ) {
        super(name, sprite, spriteClip);
    }
}

export abstract class Pickaxe extends Item {
    constructor(
        name: string, 
        sprite: HTMLImageElement, 
        spriteClip: [number, number, number, number], 
        public damage : number,
    ) {
        super(name, sprite, spriteClip);
    }
}

export abstract class Plate extends Item {
    constructor(
        name: string, 
        sprite: HTMLImageElement, 
        spriteClip: [number, number, number, number],
    ) {
        super(name, sprite, spriteClip);
    }
}

export class pPickaxeHead extends Plate {
    constructor() {

        const assetManager = AssetManager.getInstance();
        const { img, clip } = assetManager.getObjectImage("pPickaxeHead")!;

        super("Pickaxe Head Plate", img, clip);

        this.spriteKey = "pPickaxeHead";
    }
}

export class pHandle extends Plate {
    constructor() {

        const assetManager = AssetManager.getInstance();
        const { img, clip } = assetManager.getObjectImage("pHandle")!;

        super("Handle Plate", img, clip);

        this.spriteKey = "pHandle";
    }
}

export class pUnion extends Plate {
    constructor() {

        const assetManager = AssetManager.getInstance();
        const { img, clip } = assetManager.getObjectImage("pUnion")!;

        super("Union Plate", img, clip);

        this.spriteKey = "pUnion";
    }
}

export class pSwordHandler extends Plate {
    constructor() {
        
        const assetsManager = AssetManager.getInstance();
        const { img, clip } = assetsManager.getObjectImage("pSwordHandler")!;

        super("Sword Handler Plate", img, clip);

        this.spriteKey = "pSwordHandler";
    }
}

export class pSwordHead extends Plate {
    constructor() {
        
        const assetsManager = AssetManager.getInstance();
        const { img, clip } = assetsManager.getObjectImage("pSwordHead")!;

        super("Sword Head Plate", img, clip);

        this.spriteKey = "pSwordHead";
    }
}

export class StarterPickaxe extends Pickaxe {
    constructor() {
        const assetManager = AssetManager.getInstance();
        const { img, clip } = assetManager.getObjectImage("stonePickaxe")!;

        super("Stone Pickaxe", img, clip, 1);

        this.spriteKey = "stonePickaxe";
    }

    public getDamage() : number {
        return this.damage;
    }
}

export class CopperOre extends Ore {    
    constructor() {
        const assetManager = AssetManager.getInstance();
        const {img, clip} = assetManager.getObjectImage("copperOre")!;        

        super("Copper Ore", img, clip, 1, "copper", 5);

        this.spriteKey = "copperOre";
    }
}

export class GoldOre extends Ore {
    constructor() {
        const assetManager = AssetManager.getInstance();
        const {img, clip} = assetManager.getObjectImage("goldOre")!;        

        super("Gold Ore", img, clip, 2, "gold", 20);

        this.spriteKey = "goldOre";
    }
}

export class CoalOre extends Fuel{    
    constructor() {
        const assetManager = AssetManager.getInstance();
        const {img, clip} = assetManager.getObjectImage("coalOre")!;

        super("Coal Ore", img, clip, 1, 10);

        this.spriteKey = "coalOre";
    }
}