import type { InputManager } from "../../core/InputManager.js";
import type Rect from "../../util/rect.js";

export abstract class Button {
    protected onClick: ((args?: unknown) => void) | null = null;
    constructor(
        public sRect: Rect,
        public dRect: Rect,
        protected input: InputManager,
        onClick: ((args?: unknown) => void) | null = null
    ) {
        this.dRect.x += this.sRect.x;
        this.dRect.y += this.sRect.y;

        if (onClick !== null) this.onClick = onClick;
    }
    abstract draw(ctx: CanvasRenderingContext2D): void;
    update(dt: number): void {
        if (this.onClick === null) return;

        if (this.input.isMouseOver(this.dRect) && this.input.clicked) {
            this.onClick();
            this.input.clicked = false;
        }
    }

    setOnClick(onClick: (args?: unknown) => void): void {
        this.onClick = onClick;
    }
}

export class LabelButton extends Button {

    constructor(
        protected label: string,
        protected labelColor: string,
        protected backgroundColor: string,
        sRect: Rect,
        dRect: Rect,
        input: InputManager,
        onClick: ((args?: unknown) => void) | null = null
    ) {
        super(sRect, dRect, input, onClick);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(this.dRect.x, this.dRect.y, this.dRect.width, this.dRect.height);

        ctx.fillStyle = this.labelColor;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.label, this.dRect.x + this.dRect.width / 2, this.dRect.y + this.dRect.height / 2);
    }
    update(dt: number): void {
        super.update(dt);
    }
}

export class ColorButton extends Button {
    constructor(
        protected color: string,
        sRect: Rect,
        dRect: Rect,
        input: InputManager,
        onClick: ((args?: unknown) => void) | null = null
    ) {
        super(sRect, dRect, input, onClick);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.dRect.x, this.dRect.y, this.dRect.width, this.dRect.height);
    }

    update(dt: number): void {
        super.update(dt);
    }
}

export class ImageButton extends Button {

    protected clip: [number, number, number, number] | null = null;
    constructor(
        sRect: Rect,
        dRect: Rect,
        input: InputManager,
        protected image: HTMLImageElement,
        clip: [number, number, number, number] | null = null,
        onClick : ((args?: unknown) => void) | null = null
    ) {
        super(sRect, dRect, input, onClick);

        if (clip !== null) this.clip = clip;
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.clip === null)
            ctx.drawImage(this.image, this.dRect.x, this.dRect.y, this.dRect.width, this.dRect.height);
        else
            ctx.drawImage(this.image, ...this.clip!, this.dRect.x, this.dRect.y, this.dRect.width, this.dRect.height);
    }

    update(dt: number) {
        super.update(dt);
    }
}