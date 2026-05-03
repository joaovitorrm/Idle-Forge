import { GameConfig } from "../../../config/gameConfig.js";
import type { InputManager } from "../../../core/InputManager.js";
import Rect from "../../../util/rect.js";
import { Page } from "./Page.js";

export abstract class UIBook {

    protected pages : Page[] = [];
    protected actualPage : number = 0;
    protected dRect : Rect;
    protected width : number = 450;
    protected height : number = 320;
    protected margin : number = 10;
    protected middleLineWidth : number = 4;

    constructor(protected input: InputManager, protected bookColor : string) {
        this.dRect = new Rect(GameConfig.GAME_WIDTH / 2 - this.width / 2, GameConfig.GAME_HEIGHT / 2 - this.height / 2, this.width, this.height);
    }

    draw(ctx: CanvasRenderingContext2D) {

        ctx.fillStyle = this.bookColor;
        ctx.fillRect(this.dRect.x, this.dRect.y, this.dRect.width, this.dRect.height);
        
        if (this.pages[this.actualPage]) {
            ctx.fillStyle = "white";
            ctx.fillRect(this.dRect.x + this.margin - this.middleLineWidth / 2, this.dRect.y + this.margin, (this.dRect.width / 2) - this.margin, this.dRect.height - this.margin * 2);
        }

        if (this.pages[this.actualPage + 1]) {
            ctx.fillStyle = "white";
            ctx.fillRect(this.dRect.x + (this.dRect.width / 2) + this.middleLineWidth / 2, this.dRect.y + this.margin, (this.dRect.width / 2) - this.margin, this.dRect.height - this.margin * 2);
        }
        
    }

    update(dt: number) {

    }
}

export class ToolsBook extends UIBook {
    constructor(input: InputManager, bookColor: string) {
        super(input, bookColor);

        this.pages.push(new Page("test", "test"));
        this.pages.push(new Page("test", "test"));
    }

    draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx);
    }

    update(dt: number) {
        super.update(dt);
    }
}