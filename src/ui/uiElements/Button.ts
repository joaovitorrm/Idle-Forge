import type { InputManager } from "../../core/InputManager.js";
import type Rect from "../../util/rect.js";

export abstract class Button {
    constructor(public rect : Rect) {}
    abstract onClick(args? : unknown) : void;
    abstract draw(ctx : CanvasRenderingContext2D) : void;
    abstract update(dt : number) : void;
}

export class LabelButton extends Button {

    constructor(
        protected label : string, 
        protected labelColor : string, 
        protected backgroundColor : string, 
        rect : Rect
    ) {
        super(rect);
    }

    draw(ctx : CanvasRenderingContext2D) : void {
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);

        ctx.fillStyle = this.labelColor;
        ctx.textAlign = "center";
        ctx.fillText(this.label, this.rect.x + this.rect.width / 2, this.rect.y + this.rect.height / 2);
    }
    update(dt : number) : void {
    }
    onClick(args? : unknown) : void {
    }
}

export class ColorButton extends Button {
    constructor(protected color : string, rect : Rect, protected input : InputManager, protected handleClick : (args? : unknown) => void) {
        super(rect);
    }

    draw(ctx : CanvasRenderingContext2D) : void {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }

    update(dt : number) : void {
        if (this.input.isMouseOver(this.rect) && this.input.clicked) {            
            this.onClick();
            this.input.clicked = false;
        }
    }
    onClick(args? : unknown) : void {
        this.handleClick(args);
    }
}

