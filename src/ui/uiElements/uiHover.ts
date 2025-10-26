import type { InputManager } from "../../core/InputManager.js";
import Rect from "../../util/rect.js";

export default class UIHover {
    public isOver: boolean = false;
    public title: string;
    public description: string[];
    private dRect : Rect;
    constructor(public sRect: Rect, pos : {x : number, y : number}, protected input: InputManager, title: string, description: string = "") {

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;

        ctx.font = "20px MonogramFont";
        const titleWidth = ctx.measureText(title).width;

        this.title = title;
        this.description = description.split("\n").filter((d) => d !== "");

        console.log(this.description);

        this.dRect = new Rect(
            this.sRect.x + pos.x,
            this.sRect.y + pos.y,
            Math.max(titleWidth, ...this.description.map((d) => ctx.measureText(d).width)),
            20 * (this.description.length + 1)
        )
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.isOver) {
            ctx.fillStyle = "black";
            ctx.fillRect(this.dRect.x, this.dRect.y, this.dRect.width, this.dRect.height);

            ctx.font = "20px MonogramFont";
            ctx.textAlign = "center";
            ctx.textBaseline = "top";            
            ctx.fillStyle = "white";            
            ctx.fillText(this.title, this.dRect.x + this.dRect.width / 2, this.dRect.y);

            ctx.font = "16px MonogramFont";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";            
            this.description.forEach((d, i) => ctx.fillText(d, this.dRect.x + this.dRect.width / 2, this.dRect.y + 30 + (14 * i)));
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