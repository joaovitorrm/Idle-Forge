import type { InputManager } from "../../../core/InputManager.js";
import type Player from "../../../entities/Player.js";
import type Rect from "../../../util/rect.js";
import { UIGeneric } from "../../uiPanels/uiGeneric.js";
import { Page } from "./Page.js";

export abstract class UIBook extends UIGeneric {

    protected pages : Page[] = [];

    constructor(rect: Rect, input: InputManager, player: Player) {
        super(rect, input, player)
    }

    draw(ctx: CanvasRenderingContext2D) {
        for (const page of this.pages) {
            
        }
    }

    update(dt: number) {

    }
}

export class ToolsBook extends UIBook {
    constructor(rect: Rect, input: InputManager, player: Player) {
        super(rect, input, player);

        this.pages.push(new Page("test", "test"));
    }

    draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx);
    }

    update(dt: number) {
        super.update(dt);
    }
}