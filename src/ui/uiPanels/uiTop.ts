import { GameConfig } from "../../config/gameConfig.js";
import { HUDConfig } from "../../config/hudConfig.js";
import type { InputManager } from "../../core/InputManager.js";
import Rect from "../../util/rect.js";
import { ColorButton, type Button } from "../uiElements/Button.js";
import { UIGeneric } from "./uiGeneric.js";

export default class UITop extends UIGeneric {
    constructor(protected input: InputManager) {

        const rect = new Rect(
            HUDConfig.top.xRatio * GameConfig.GAME_WIDTH,
            HUDConfig.top.yRatio * GameConfig.GAME_HEIGHT,
            HUDConfig.top.widthRatio * GameConfig.GAME_WIDTH,
            HUDConfig.top.heightRatio * GameConfig.GAME_HEIGHT
        );

        super(rect);
    }

    addColorButton(name: string, color: string, rect: Rect, handleClick: (args?: unknown) => void): void {
        rect.x += this.rect.x;
        rect.y += this.rect.y;
        this.buttons.set(name, new ColorButton(color, rect, this.input, handleClick));
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (!this.isShown) return;
        
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }
    update(dt: number, input: InputManager): void { }

}