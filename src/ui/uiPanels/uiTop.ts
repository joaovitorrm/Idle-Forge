import { GameConfig } from "../../config/gameConfig.js";
import { HUDConfig } from "../../config/hudConfig.js";
import type { InputManager } from "../../core/InputManager.js";
import type Player from "../../entities/Player.js";
import Rect from "../../util/rect.js";
import { ColorButton, type Button } from "../uiElements/Button.js";
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

    addColorButton(name: string, color: string, rect: Rect, handleClick: (args?: unknown) => void): void {
        rect.x += this.rect.x;
        rect.y += this.rect.y;
        this.buttons.set(name, new ColorButton(color, rect, this.input, handleClick));
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (!this.isShown) return;

        ctx.fillStyle = "hsla(0, 0%, 10%, 0.8)";
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);

        if (this.player.gear.pickaxe)
            ctx.drawImage(this.player.gear.pickaxe.sprite, ...this.player.gear.pickaxe.spriteClip, this.rect.x + 10, this.rect.y + 10, 30, 30);
        }



    update(dt: number): void { }

}