import type Rect from "./rect.js";

export function drawHitBox(ctx: CanvasRenderingContext2D, rect: Rect, color: string = "blue") : void {
    ctx.strokeStyle = color;
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
}