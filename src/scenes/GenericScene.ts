import { GameConfig } from "../config/gameConfig.js";
import { HUDConfig } from "../config/hudConfig.js";
import type { InputManager } from "../core/InputManager.js";
import type Player from "../entities/Player.js";
import Rect from "../util/rect.js";

export abstract class GenericScene {
    public exitedTime : number = 0;

    protected rect : Rect = new Rect(0, 0, GameConfig.GAME_WIDTH, GameConfig.GAME_HEIGHT - HUDConfig.bottom.heightRatio * GameConfig.GAME_HEIGHT);
    constructor(protected input : InputManager, protected player : Player, protected sprite : HTMLImageElement) {}
    draw(ctx : CanvasRenderingContext2D) : void {
        if (!this.sprite) return;
        ctx.drawImage(this.sprite, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }

    abstract update(dt : number) : void

    abstract enter() : void

    abstract exit() : void
}