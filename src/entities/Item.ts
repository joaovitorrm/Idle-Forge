import { AssetManager } from "../core/AssetManager.js";
import type { objectsAssets } from "../data/assets.js";
import Rect from "../util/rect.js";

export type OreType = "Copper" | "Gold" | "Coal";

type SpriteKey = keyof typeof objectsAssets;

type PieceType = "Pickaxe Head" | "Sword Head" | "Sword Handle" | "Union" | "Handle";

// MAIN ITEM CLASS

export abstract class Item {
    protected sprite: { img: HTMLImageElement | ImageBitmap, clip: [number, number, number, number] };
    constructor(
        public name: string,
        public spriteKey: SpriteKey,
        public combinedSprite : ImageBitmap | null = null
    ) {
        if (combinedSprite) {
            this.sprite = { img: combinedSprite, clip: [0, 0, combinedSprite.width, combinedSprite.height] };
        } else {
            const assetManager = AssetManager.getInstance();
            this.sprite = assetManager.getObjectImage(spriteKey)!;
        }
        
    }

    getSprite() : HTMLImageElement | ImageBitmap {
        return this.sprite.img;
    }

    getClip() : [number, number, number, number] {
        return this.sprite.clip;
    }

    toJSON() {
        return {
            name: this.name,
            spriteKey: this.spriteKey,
            spriteClip: this.sprite.clip,
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
        instance.sprite.clip = data.spriteClip;
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
// PLATE CLASS

export abstract class Plate extends Item {
    constructor(
        name: string,
        spriteKey: SpriteKey,
        public oreNeededAmount: number
    ) {
        super(name, spriteKey);
    }

    abstract getPiece(ore: Ore): Piece;
}

//========================================================
// TOOL CLASS

export abstract class Tool extends Item {
    constructor(
        name: string,
        spriteKey: SpriteKey,
        combinedSprite : ImageBitmap
    ) {
        super(name, spriteKey, combinedSprite);
    }
}

//========================================================
// PIECE CLASS

export abstract class Piece extends Item {
    constructor(
        public oreType: OreType,
        public pieceType: PieceType
    ) {
        const name = `${oreType} ${pieceType}`;
        const spriteKey = `${oreType.toLocaleLowerCase()}${pieceType.split(" ").join("")}` as SpriteKey;

        super(name, spriteKey);
    }
}

//========================================================
/*                      ORES                            */

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
/*                      TOOLS                           */

export class Pickaxe extends Tool {
    protected constructor(
        name: string | null,
        spriteKey: SpriteKey,
        combinedSprite: ImageBitmap,
        public head: pickaxeHeadPiece,
        public handle: handlePiece,
        public union: unionPiece
    ) {

        if (name === null) {
            name = `${head.oreType} Pickaxe`;
        }

        super(name, spriteKey, combinedSprite);
    }

    static async create(name: string, head: pickaxeHeadPiece, handle: handlePiece, union: unionPiece) : Promise<Pickaxe> {
        const combined = await AssetManager.getInstance().getCombinedImage(
            [
                { spriteKey: handle.spriteKey, pos: new Rect(0, 0, 32, 32) },
                { spriteKey: head.spriteKey, pos: new Rect(7, -7, 32, 32) },
                { spriteKey: union.spriteKey, pos: new Rect(9, -9, 32, 32) }
                
            ],
            32, 32
        );

        return new Pickaxe(
            name ?? `${head.oreType} Pickaxe`,
            head.spriteKey,
            combined,
            head,
            handle,
            union
        );
    }
}

export class StarterPickaxe extends Pickaxe {
    private constructor(name : string, key : SpriteKey, sprite : ImageBitmap, head : pickaxeHeadPiece, handle : handlePiece, union : unionPiece) {
        super(name, key, sprite, head, handle, union);
    }

    static async create() {
        const head = new pickaxeHeadPiece("Copper");
        const handle = new handlePiece("Copper");
        const union = new unionPiece("Gold");
        return await Pickaxe.create("Starter Pickaxe", head, handle, union);
    }

    getDamage() { return 1; }
}

//========================================================
/*                      PIECES                          */

export class pickaxeHeadPiece extends Piece {
    constructor(
        oreType: OreType
    ) {
        super(oreType, "Pickaxe Head");
    }
}

export class handlePiece extends Piece {
    constructor(
        oreType: OreType
    ) {
        super(oreType, "Handle");
    }
}

export class unionPiece extends Piece {
    constructor(
        oreType: OreType
    ) {
        super(oreType, "Union");
    }
}

export class swordHeadPiece extends Piece {
    constructor(
        oreType: OreType
    ) {
        super(oreType, "Pickaxe Head");
    }
}

export class swordHandlePiece extends Piece {
    constructor(
        oreType: OreType
    ) {
        super(oreType, "Sword Handle");
    }
}

//========================================================
/*                      PLATES                          */

export class pickaxeHeadPlate extends Plate {
    constructor() { super("Pickaxe Head Plate", "pPickaxeHead", 3) }
    getPiece(ore: Melt) { return new pickaxeHeadPiece(ore.outputType) }
}
Item.register("Pickaxe Head Plate", pickaxeHeadPlate);

export class handlePlate extends Plate {
    constructor() { super("Handle Plate", "pHandle", 2) }
    getPiece(ore: Melt) { return new handlePiece(ore.outputType) }
}
Item.register("Handle Plate", handlePlate);

export class unionPlate extends Plate {
    constructor() { super("Union Plate", "pUnion", 3) }
    getPiece(ore: Melt) { return new handlePiece(ore.outputType) }
}
Item.register("Union Plate", unionPlate);

export class swordHandlerPlate extends Plate {
    constructor() { super("Sword Handler Plate", "pSwordHandle", 1) }
    getPiece(ore: Melt) { return new handlePiece(ore.outputType) }
}
Item.register("Sword Handler Plate", swordHandlerPlate);

export class swordHeadPlate extends Plate {
    constructor() { super("Sword Head Plate", "pSwordHead", 3) }
    getPiece(ore: Melt) { return new handlePiece(ore.outputType) }
}
Item.register("Sword Head Plate", swordHeadPlate);

//========================================================
/*                      MELTS                          */

export class CopperOre extends Melt {
    constructor() { super("Copper Ore", "copperOre", 1, "Copper", 5, 10) }
}
Item.register("Copper Ore", CopperOre);

export class GoldOre extends Melt {
    constructor() { super("Gold Ore", "goldOre", 2, "Gold", 20, 15) }
}
Item.register("Gold Ore", GoldOre);

//========================================================
/*                      FUELS                          */

export class CoalOre extends Fuel {
    constructor() { super("Coal Ore", "coalOre", 1, 10) }
}
Item.register("Coal Ore", CoalOre);


//========================================================
/*                      PIECES                          */

export class CopperPickaxeHead extends Piece {
    constructor() {
        super("Copper", "Pickaxe Head");
    }
}
Item.register("Copper Pickaxe Head", CopperPickaxeHead);

export class CopperHandle extends Piece {
    constructor() {
        super("Copper", "Handle");
    }
}
Item.register("Copper Handle", CopperHandle);

export class CopperUnion extends Piece {
    constructor() {
        super("Copper", "Union");
    }
}
Item.register("Copper Union", CopperUnion);

export class GoldPickaxeHead extends Piece {
    constructor() {
        super("Gold", "Pickaxe Head");
    }
}
Item.register("Gold Pickaxe Head", GoldPickaxeHead);

export class GoldHandle extends Piece {
    constructor() {
        super("Gold", "Handle");
    }
}
Item.register("Gold Handle", GoldHandle);

export class GoldUnion extends Piece {
    constructor() {
        super("Gold", "Union");
    }
}
Item.register("Gold Union", GoldUnion);

