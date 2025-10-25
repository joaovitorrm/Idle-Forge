import { AssetManager } from "../core/AssetManager.js";
import type { objectsAssets } from "../data/assets.js";

export type OreType = "copper" | "gold" | "coal";

type SpriteKey = keyof typeof objectsAssets;

// MAIN ITEM CLASS

export abstract class Item {
    public sprite: HTMLImageElement;
    public spriteClip: [number, number, number, number];
    constructor(
        public name: string,
        public spriteKey: SpriteKey
    ) {
        const assetManager = AssetManager.getInstance();
        const { img, clip } = assetManager.getObjectImage(spriteKey)!;

        this.sprite = img;
        this.spriteClip = clip;
    }

    toJSON() {
        return {
            name: this.name,
            spriteKey: this.spriteKey,
            spriteClip: this.spriteClip,
        };
    }

    static registry: Record<string, new () => Item> = {};

    static register(key: string, ctor: new () => Item) {
        Item.registry[key] = ctor;
    }

    static fromJSON(data: { name: string; spriteKey: SpriteKey; spriteClip: [number, number, number, number] }): Item {
        const ClassRef = Item.registry[data.name];
        if (!ClassRef) throw new Error(`Item type "${data.name}" não registrado.`);
        const instance = new ClassRef();
        instance.spriteKey = data.spriteKey;
        instance.spriteClip = data.spriteClip;
        return instance;
    }
}
//========================================================
// ORE CLASS

export abstract class Ore extends Item {
    constructor(
        name: string,
        spriteKey: SpriteKey,
        public tier: number,
    ) {
        super(name, spriteKey);
    }
}

//========================================================
// FUEL CLASS

export abstract class Fuel extends Ore {
    constructor(
        name: string,
        spriteKey: SpriteKey,
        tier: number,
        public burnTime: number
    ) {
        super(name, spriteKey, tier);
    }
}

//========================================================
// MELT CLASS

export abstract class Melt extends Ore {
    constructor(
        name: string,
        spriteKey: SpriteKey,
        tier: number,
        public outputType: OreType,
        public meltTime: number,
        public timeToSolidify: number
    ) {
        super(name, spriteKey, tier);
    }
}

//========================================================
// TEMP PICKAXE CLASS

export abstract class Pickaxe extends Item {
    constructor(
        name: string,
        spriteKey: SpriteKey,
        public damage: number,
    ) {
        super(name, spriteKey);
    }
}

//========================================================
// PLATE CLASS

export abstract class Plate extends Item {
    constructor(
        name: string,
        spriteKey: SpriteKey,
        public oreNeededAmount: number
    ) {
        super(name, spriteKey);
    }
}

//========================================================
// TOOL CLASS

export abstract class Tool extends Item {
    constructor(
        name: string,
        spriteKey: SpriteKey,
        public damage: number,
    ) {
        super(name, spriteKey);
    }
}

//========================================================
// PIECE CLASS

export abstract class Piece extends Item {
    constructor(
        name: string,
        spriteKey: SpriteKey
    ) {
        super(name, spriteKey);
    }
}

export class pickaxeHeadPiece extends Piece {
    constructor(
        public material : Ore,
    ) {
        const name = `${material.name.split(" ")[0]} Pickaxe Head`
        const spriteKey = `${material.name.split(" ")[0]!.toLocaleLowerCase}PickaxeHead`;
        super(name, spriteKey as SpriteKey);
    }
}

export class handlePiece extends Piece {
    constructor(
        name: string,
        spriteKey: SpriteKey
    ) {
        super(name, spriteKey);
    }
}

//========================================================
// PLATES

export class pickaxeHeadPlate extends Plate {
    constructor() { super("Pickaxe Head Plate", "pPickaxeHead", 3) }
    getPiece(ore: Ore) { return new pickaxeHeadPiece(ore) }
}
Item.register("Pickaxe Head Plate", pickaxeHeadPlate);

export class handlePlate extends Plate {
    constructor() { super("Handle Plate", "pHandle", 2) }
}
Item.register("Handle Plate", handlePlate);

export class unionPlate extends Plate {
    constructor() { super("Union Plate", "pUnion", 3) }
}
Item.register("Union Plate", unionPlate);

export class swordHandlerPlate extends Plate {
    constructor() { super("Sword Handler Plate", "pSwordHandler", 1) }
}
Item.register("Sword Handler Plate", swordHandlerPlate);

export class swordHeadPlate extends Plate {
    constructor() { super("Sword Head Plate", "pSwordHead", 3) }
}
Item.register("Sword Head Plate", swordHeadPlate);

//========================================================
// PICKAXES

export class StarterPickaxe extends Pickaxe {
    constructor() { super("Stone Pickaxe", "stonePickaxe", 1) }

    public getDamage(): number {
        return this.damage;
    }
}
Item.register("Stone Pickaxe", StarterPickaxe);

//========================================================
// MELTABLES

export class CopperOre extends Melt {
    constructor() { super("Copper Ore", "copperOre", 1, "copper", 5, 10) }
}
Item.register("Copper Ore", CopperOre);

export class GoldOre extends Melt {
    constructor() { super("Gold Ore", "goldOre", 2, "gold", 20, 15) }
}
Item.register("Gold Ore", GoldOre);

//========================================================
// FUELS

export class CoalOre extends Fuel {
    constructor() { super("Coal Ore", "coalOre", 1, 10) }
}
Item.register("Coal Ore", CoalOre);


export class CopperPickaxeHead extends Piece {
    constructor() {
        super("Copper Pickaxe Head", "copperPickaxeHead");
    }
}
Item.register("Copper Pickaxe Head", CopperPickaxeHead);

export class CopperHandle extends Piece {
    constructor() {
        super("Copper Handle", "copperHandle");
    }
}
Item.register("Copper Handle", CopperHandle);

export class CopperUnion extends Piece {
    constructor() {
        super("Copper Union", "copperUnion");
    }
}
Item.register("Copper Union", CopperUnion);

export class GoldPickaxeHead extends Piece {
    constructor() {
        super("Gold Pickaxe Head", "goldPickaxeHead");
    }
}
Item.register("Gold Pickaxe Head", GoldPickaxeHead);

export class GoldHandle extends Piece {
    constructor() {
        super("Gold Handle", "goldHandle");
    }
}
Item.register("Gold Handle", GoldHandle);

export class GoldUnion extends Piece {
    constructor() {
        super("Gold Union", "goldUnion");
    }
}
Item.register("Gold Union", GoldUnion);

