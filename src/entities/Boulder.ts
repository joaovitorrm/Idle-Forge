import { AssetManager } from "../core/AssetManager.js";
import { EventBus } from "../core/EventBus.js";
import type { InputManager } from "../core/InputManager.js";
import Rect from "../util/rect.js";
import { CoalOre, CopperOre, GoldOre } from "./Item.js";

export abstract class OreBoulder {
    public maxHealth : number = 0;
    public health : number = 0;

    constructor(public rect: Rect, protected sprite: HTMLImageElement | undefined, protected spriteClip: [number, number, number, number]) { }
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.sprite!, ...this.spriteClip, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }

    update(dt: number): void {}
}

export class CopperOreBoulder extends OreBoulder {

    constructor(rect: Rect, private input: InputManager) {
        const assetManager = AssetManager.getInstance();
        const sprite = assetManager.getObjectImage("copperOreBoulder")!.img;
        const spriteClip = assetManager.getObjectImage("copperOreBoulder")!.clip;

        super(rect, sprite, spriteClip);

        this.health = this.maxHealth = 25;
    }

    update(dt: number): void {

        if (!this.input.isMouseOver(this.rect) || !this.input.clicked)
            return;

        this.health -= 1;

        if (this.health === 0) {
            EventBus.emit("ore_collected", this, new CopperOre());
        }

        this.input.clicked = false;
    }
}

export class GoldOreBoulder extends OreBoulder {    
    constructor(rect: Rect, private input: InputManager) {
        const assetManager = AssetManager.getInstance();
        const sprite = assetManager.getObjectImage("goldOreBoulder")!.img;
        const spriteClip = assetManager.getObjectImage("goldOreBoulder")!.clip;

        super(rect, sprite, spriteClip);

        this.health = this.maxHealth = 100;
    }

    update(dt: number): void {

        if (!this.input.isMouseOver(this.rect) || !this.input.clicked)
            return;

        this.health -= 1;

        if (this.health === 0) {
            EventBus.emit("ore_collected", this, new GoldOre());
        }

        this.input.clicked = false;
    }
}

export class CoalOreBoulder extends OreBoulder {    
    constructor(rect: Rect, private input: InputManager) {
        const assetManager = AssetManager.getInstance();
        const sprite = assetManager.getObjectImage("coalOreBoulder")!.img;
        const spriteClip = assetManager.getObjectImage("coalOreBoulder")!.clip;

        super(rect, sprite, spriteClip);

        this.health = this.maxHealth = 5;
    }

    update(dt: number): void {

        if (!this.input.isMouseOver(this.rect) || !this.input.clicked)
            return;

        this.health -= 1;

        if (this.health === 0) {
            EventBus.emit("ore_collected", this, new CoalOre());
        }

        this.input.clicked = false;
    }
}