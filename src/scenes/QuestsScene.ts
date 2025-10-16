import type { InputManager } from "../core/InputManager.js";
import type Player from "../entities/Player.js";
import { AssetManager } from "../core/AssetManager.js";
import { GenericScene } from "./GenericScene.js";

export default class QuestsScene extends GenericScene {

    constructor(protected input : InputManager, protected player : Player) {
        const assetManager = AssetManager.getInstance();
        const sprite = assetManager.getBackgroundImage("questsBackground")!;

        super(input, player, sprite)
    }

    draw(ctx : CanvasRenderingContext2D) : void {
        if (!this.sprite) return;
        ctx.drawImage(this.sprite, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }

    update(dt : number) : void {

    }

    reEnter(enteredTime : number) : void {}
}