import type Rect from "../util/rect.js";

export abstract class GenericObject {
    constructor(public rect : Rect, protected sprite : HTMLImageElement | undefined, protected spriteClip : [number, number, number, number]) {}
    abstract draw(ctx : CanvasRenderingContext2D) : void;
    abstract update(dt : number) : void;
}

export abstract class GenericDefaultObject {
    constructor(public rect : Rect, protected sprite : HTMLImageElement | undefined, protected spriteClip : [number, number, number, number]) {}
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.drawImage(this.sprite!, ...this.spriteClip, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }
    update(dt: number): void {}
}