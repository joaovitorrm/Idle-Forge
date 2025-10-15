import { AssetManager } from "../core/AssetManager.js";
import Rect from "../util/rect.js";
import type { InputManager } from "../core/InputManager.js";
import { GameConfig } from "../config/gameConfig.js";
import { HUDConfig } from "../config/hudConfig.js";
import type { GenericObject } from "../entities/GenericObject.js";
import Furnace from "../entities/Furnace.js";

export default class ForgeScene {
    private sprite: HTMLImageElement | undefined = undefined;
    private rect : Rect;
    private objects : GenericObject[] = [];

    constructor(protected input: InputManager) {
        this.rect = new Rect(0, 0, GameConfig.GAME_WIDTH, GameConfig.GAME_HEIGHT - HUDConfig.bottom.heightRatio * GameConfig.GAME_HEIGHT);

        const assetManager = AssetManager.getInstance();
        this.sprite = assetManager.getBackgroundImage("forgeBackground");

        this.objects.push(new Furnace(new Rect(120, 200, 120, 120*1.6)));
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (!this.sprite) return;
        ctx.drawImage(this.sprite, this.rect.x, this.rect.y, this.rect.width, this.rect.height);

        for (const object of this.objects) object.draw(ctx);
    }

    update(dt: number): void {

    }
}