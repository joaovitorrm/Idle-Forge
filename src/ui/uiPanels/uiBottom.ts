import { GameConfig } from "../../config/gameConfig.js";
import { HUDConfig } from "../../config/hudConfig.js";
import type { InputManager } from "../../core/InputManager.js";
import type Player from "../../entities/Player.js";
import Rect from "../../util/rect.js";
import { ColorButton, type Button } from "../uiElements/uiButton.js";
import { UIGeneric } from "./uiGeneric.js";

export default class UIBottom extends UIGeneric {
    constructor(input: InputManager, player: Player) {

        const rect = new Rect(
            HUDConfig.bottom.xRatio * GameConfig.GAME_WIDTH,
            HUDConfig.bottom.yRatio * GameConfig.GAME_HEIGHT,
            HUDConfig.bottom.widthRatio * GameConfig.GAME_WIDTH,
            HUDConfig.bottom.heightRatio * GameConfig.GAME_HEIGHT
        );

        super(rect, input, player);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (!this.isShown) return;

        ctx.fillStyle = "red";
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);

        for (const [_, button] of this.buttons) button.draw(ctx);
    }
    update(dt: number): void {
        for (const [_, button] of this.buttons) button.update(dt);
     }

}