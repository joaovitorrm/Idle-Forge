import { AssetManager } from "../core/AssetManager.js";
import type { InputManager } from "../core/InputManager.js";
import type Furnace from "../entities/Furnace.js";
import { pHandle, pPickaxeHead, pSwordHandler, pSwordHead, pUnion, type Plate } from "../entities/Item.js";
import type Player from "../entities/Player.js";
import Rect from "../util/rect.js";
import { GenericScene } from "./GenericScene.js";

export default class FurnaceScene extends GenericScene {

    private plates : {plate : Plate, pos : Rect}[] = [];
    private activePlate : Plate | null = null;

    constructor(input : InputManager, player : Player, private furnace : Furnace) {

        const assetManager = AssetManager.getInstance();
        const sprite = assetManager.getBackgroundImage("furnaceBackground")!;

        super(input, player, sprite);
    }

    draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx);

        if (this.activePlate)
            ctx.drawImage(this.activePlate.sprite, ...this.activePlate.spriteClip, this.rect.width / 2 - 90, 150, 180, 180);

        console.log(this.furnace.content);
    }

    update(dt: number) {
        for (const plate of this.plates) {
            
        }
    }

    enter() {
        
    }

    exit() {
        
    }
}