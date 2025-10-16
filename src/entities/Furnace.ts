import { AssetManager } from "../core/AssetManager.js";
import type Rect from "../util/rect.js";
import { GenericObject } from "./GenericObject.js";

const furnaceSpriteClipAnimation : [number, number, number, number][] = [[32*2, 13*32, 32*2, 32*3], [32*4, 13*32, 32*2, 32*3], [32*6, 13*32, 32*2, 32*3]];

export default class Furnace extends GenericObject {
   
    isActive : boolean = false;
    animationStep : number = 0;

    constructor(rect : Rect) {        

        const assetManager = AssetManager.getInstance();

        const img = assetManager.getObjectImage("furnace");

        const sprite = img?.img;
        const clip = img?.clip;

        super(rect, sprite, clip!);
    }

    draw(ctx : CanvasRenderingContext2D) {
        if (!this.sprite) return;
        ctx.drawImage(this.sprite, ...this.spriteClip, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }

    update() {
        if (!this.isActive) return;

        this.animationStep = (this.animationStep + 1) % 3;
        this.spriteClip = furnaceSpriteClipAnimation[this.animationStep]!;
    }
}