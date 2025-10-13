import spritePath from "../assets/ore.png";
import type Rect from "../util/rect.js";
import { drawHitBox } from "../util/utils.js";


const furnaceSpriteClip : [number, number, number, number] = [0, 13*32, 32*2, 32*3];
const furnaceSpriteClipAnimation : [number, number, number, number][] = [[32*2, 13*32, 32*2, 32*3], [32*4, 13*32, 32*2, 32*3], [32*6, 13*32, 32*2, 32*3]];

export default class Furnace {
   
    rect: Rect;
    sprite: HTMLImageElement;
    spriteClip : [number, number, number, number];
    isActive : boolean = false;
    animationStep : number = 0;

    constructor(rect : Rect) {
        this.rect = rect;
        this.sprite = new Image();
        this.sprite.src = spritePath;
        this.spriteClip = furnaceSpriteClip;
    }

    draw(ctx : CanvasRenderingContext2D) {
        ctx.drawImage(this.sprite, ...this.spriteClip, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }

    update() {
        if (!this.isActive) return;

        this.animationStep = (this.animationStep + 1) % 3;
        this.spriteClip = furnaceSpriteClipAnimation[this.animationStep]!;
    }
}