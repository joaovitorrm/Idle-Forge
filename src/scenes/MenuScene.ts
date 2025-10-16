import { AssetManager } from "../core/AssetManager.js";
import MenuBackgroundPath from "../assets/images/scenes/quest_board.png";
import Rect from "../util/rect.js";
import type { InputManager } from "../core/InputManager.js";
import { GameConfig } from "../config/gameConfig.js";
import { HUDConfig } from "../config/hudConfig.js";
import { GenericScene } from "./GenericScene.js";

export default class MenuScene {
    private sprite : HTMLImageElement | undefined = undefined;
    private rect : Rect;

    constructor(protected input : InputManager) {
        this.rect = new Rect(0, 0, GameConfig.GAME_WIDTH, GameConfig.GAME_HEIGHT - HUDConfig.bottom.heightRatio * GameConfig.GAME_HEIGHT);

        const assetManager = AssetManager.getInstance();
        this.sprite = assetManager.getBackgroundImage("questsBackground");
    }

    draw(ctx : CanvasRenderingContext2D) : void {
        if (!this.sprite) return;
        ctx.drawImage(this.sprite, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }

    update(dt : number) : void {

    }
}