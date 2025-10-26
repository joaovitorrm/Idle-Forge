import { AssetManager } from "../core/AssetManager.js";
import type Rect from "../util/rect.js";

export class Anvil {
    protected sprite: {img: HTMLImageElement, clip: [number, number, number, number]};    
    constructor(public rect : Rect) {
        const assetManager = AssetManager.getInstance();
        this.sprite = assetManager.getObjectImage("anvil")!;
    }

    draw(ctx: CanvasRenderingContext2D) : void {
        ctx.drawImage(this.sprite.img, ...this.sprite.clip, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }

    update(dt : number) : void {

    }
}