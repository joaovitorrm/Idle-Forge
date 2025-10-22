import { GameConfig } from "../../config/gameConfig.js";
import { HUDConfig } from "../../config/hudConfig.js";
import type { InputManager } from "../../core/InputManager.js";
import type Player from "../../entities/Player.js";
import Rect from "../../util/rect.js";
import { UIGeneric } from "./uiGeneric.js";

export default class UITop extends UIGeneric {
    constructor(input: InputManager, player : Player) {

        const rect = new Rect(
            HUDConfig.top.xRatio * GameConfig.GAME_WIDTH,
            HUDConfig.top.yRatio * GameConfig.GAME_HEIGHT,
            HUDConfig.top.widthRatio * GameConfig.GAME_WIDTH,
            HUDConfig.top.heightRatio * GameConfig.GAME_HEIGHT
        );

        super(rect, input, player);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (!this.isShown) return;

        ctx.fillStyle = "hsla(0, 0%, 10%, 0.8)";
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);

        for (const [_, button] of this.buttons) button.draw(ctx);
    }

    update(dt: number): void {
        for (const [_, button] of this.buttons) button.update(dt);
    }

}