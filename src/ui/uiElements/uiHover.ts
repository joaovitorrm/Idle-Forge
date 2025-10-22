import type { InputManager } from "../../core/InputManager.js";
import type Rect from "../../util/rect.js";

export default class UIHover {
    public isOver: boolean = false;
    constructor(public sRect: Rect, public dRect: Rect, protected input: InputManager, protected title: string, protected description: string = "") {
        this.dRect.x += this.sRect.x;
        this.dRect.y += this.sRect.y;
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.isOver) {
            ctx.fillStyle = "black";
            ctx.fillRect(this.dRect.x, this.dRect.y, this.dRect.width, this.dRect.height);

            ctx.textAlign = "center";
            ctx.textBaseline = "top";

            ctx.fillStyle = "white";
            ctx.font = "20px MonogramFont";
            ctx.fillText(this.title, this.dRect.x + this.dRect.width / 2, this.dRect.y);

            if (this.description === "") return;

            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            ctx.font = "16px MonogramFont";
            ctx.fillText(this.description, this.dRect.x + this.dRect.width / 2, this.dRect.y + this.dRect.height - 2);
        }
    }

    update(dt: number) {
        if (this.input.isMouseOver(this.sRect) || (this.input.isMouseOver(this.dRect) && this.isOver)) {
            this.isOver = true;
        } else {
            this.isOver = false;
        }
    }
}