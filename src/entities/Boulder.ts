import { AssetManager } from "../core/AssetManager.js";
import Rect from "../util/rect.js";
import { CoalOre, CopperOre, Fuel, GoldOre, type Ore } from "./Item.js";

export abstract class OreBoulder {
    public health: number;
    constructor(
        public rect: Rect, 
        protected sprite: HTMLImageElement | undefined, 
        protected spriteClip: [number, number, number, number], 
        public name : string,
        public maxHealth : number = 0, 
        public drop : Ore | Fuel
    ) {
        this.health = maxHealth;
    }
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.sprite!, ...this.spriteClip, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }
}

export class CopperOreBoulder extends OreBoulder {

    constructor(rect: Rect) {
        const assetManager = AssetManager.getInstance();
        const sprite = assetManager.getObjectImage("copperOreBoulder")!.img;
        const spriteClip = assetManager.getObjectImage("copperOreBoulder")!.clip;

        super(rect, sprite, spriteClip, "Copper Boulder", 25, new CopperOre());
    }
}

export class GoldOreBoulder extends OreBoulder {    
    constructor(rect: Rect) {
        const assetManager = AssetManager.getInstance();
        const sprite = assetManager.getObjectImage("goldOreBoulder")!.img;
        const spriteClip = assetManager.getObjectImage("goldOreBoulder")!.clip;

        super(rect, sprite, spriteClip, "Gold Boulder", 100, new GoldOre());
    }
}

export class CoalOreBoulder extends OreBoulder {    
    constructor(rect: Rect) {
        const assetManager = AssetManager.getInstance();
        const sprite = assetManager.getObjectImage("coalOreBoulder")!.img;
        const spriteClip = assetManager.getObjectImage("coalOreBoulder")!.clip;

        super(rect, sprite, spriteClip, "Coal Boulder", 5, new CoalOre());
    }
}