import { AssetManager } from "../core/AssetManager.js";
import type { InputManager } from "../core/InputManager.js";
import type Player from "../entities/Player.js";
import type { UIManager } from "../ui/uiManager.js";
import { GenericScene } from "./GenericScene.js";

export default class SmeltScene extends GenericScene {
    constructor(protected input : InputManager, protected player : Player, protected ui : UIManager) {
        const sprite = AssetManager.getInstance().getBackgroundImage("forgeBackground")!;

        super(input, player, ui, sprite);
    }

    draw(ctx : CanvasRenderingContext2D): void {
        super.draw(ctx);
    }

    update(dt : number): void {}

    enter(): void {}

    exit() : void {}
}