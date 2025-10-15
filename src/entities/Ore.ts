import spritePath from "../assets/ore.png";
import type Rect from "../util/rect.js";


class Ore {

    protected sprite : HTMLImageElement;
    protected spriteClip : [number, number, number, number];
    constructor(sprite : HTMLImageElement, spriteClip : [number, number, number, number]) {
        this.sprite = sprite;
        this.spriteClip = spriteClip;
    }

    draw(ctx : CanvasRenderingContext2D, rect : Rect ) : void {
        ctx.drawImage(this.sprite, ...this.spriteClip, rect.x, rect.y, rect.width, rect.height);
    };
}

export class CopperOre extends Ore {

    constructor() {
        const sprite = new Image();
        sprite.src = spritePath;
        const spriteClip : [number, number, number, number] = [3*32, 9*32, 32, 32];
        super(sprite, spriteClip);
    }
}

export class CopperBoulder extends Ore {
    constructor() {
        const sprite = new Image();
        sprite.src = spritePath;
        const spriteClip : [number, number, number, number] = [3*32, 0*32, 32, 32];
        super(sprite, spriteClip);
    }
}

