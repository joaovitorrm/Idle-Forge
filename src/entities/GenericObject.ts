import type Rect from "../util/rect.js";

export abstract class GenericObject {
    constructor(public rect : Rect, protected sprite : HTMLImageElement | undefined, protected spriteClip : [number, number, number, number]) {}
    abstract draw(ctx : CanvasRenderingContext2D) : void;
    abstract update(dt : number) : void;
}