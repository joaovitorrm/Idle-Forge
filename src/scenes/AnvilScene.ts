import { AssetManager } from "../core/AssetManager.js";
import type { InputManager } from "../core/InputManager.js";
import type Player from "../entities/Player.js";
import { GenericScene } from "./GenericScene.js";

export class AnvilScene extends GenericScene {
    constructor(input : InputManager, player: Player) {

        const sprite = AssetManager.getInstance().getBackgroundImage("anvilBackground")!;

        super(input, player, sprite);
    }

    update(dt: number) {
        if (this.player.holdingItem) {
            if (this.input.clicked) {
                this.player.holdingItem = null;
            }
        }
    }

    enter() : void {

    }

    exit() : void {

    }
}