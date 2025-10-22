import type { InputManager } from "../../core/InputManager.js";
import type Rect from "../../util/rect.js";

export abstract class Button {
    constructor(public sRect : Rect, public dRect : Rect, protected input : InputManager, protected onClick : (args? : unknown) => void) {}
    abstract draw(ctx : CanvasRenderingContext2D) : void;
    abstract update(dt : number) : void;
}

export class LabelButton extends Button {

    constructor(
        protected label : string,
        protected labelColor : string,
        protected backgroundColor : string,
        sRect : Rect,
        dRect : Rect,
        input : InputManager,                
        onClick : (args? : unknown) => void
    ) {
        super(sRect, dRect, input, onClick);
        this.dRect.x += this.sRect.x;
        this.dRect.y += this.sRect.y;
    }

    draw(ctx : CanvasRenderingContext2D) : void {
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(this.dRect.x, this.dRect.y, this.dRect.width, this.dRect.height);

        ctx.fillStyle = this.labelColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.label, this.dRect.x + this.dRect.width / 2, this.dRect.y + this.dRect.height / 2);
    }
    update(dt : number) : void {
        if (this.input.isMouseOver(this.dRect) && this.input.clicked) {            
            this.onClick();
            this.input.clicked = false;
        }
    }
}

export class ColorButton extends Button {
    constructor(
        protected color : string,
        sRect : Rect, 
        dRect : Rect,
        input : InputManager,
        onClick : (args? : unknown) => void) {
        super(sRect, dRect, input, onClick);
        this.dRect.x += this.sRect.x;
        this.dRect.y += this.sRect.y;
    }

    draw(ctx : CanvasRenderingContext2D) : void {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.dRect.x, this.dRect.y, this.dRect.width, this.dRect.height);
    }

    update(dt : number) : void {
        if (this.input.isMouseOver(this.dRect) && this.input.clicked) {
            this.onClick();
            this.input.clicked = false;
        }
    }
}

