import { AssetManager } from "../core/AssetManager.js";
import Rect from "../util/rect.js";
import type { InputManager } from "../core/InputManager.js";
import type { GenericObject } from "../entities/GenericObject.js";
import Furnace from "../entities/Furnace.js";
import type Player from "../entities/Player.js";
import { GenericScene } from "./GenericScene.js";

export default class ForgeScene extends GenericScene {

    private objects : GenericObject[] = [];

    constructor(protected input: InputManager, protected player: Player) {

        const assetManager = AssetManager.getInstance();
        const sprite = assetManager.getBackgroundImage("forgeBackground");

        super(input, player, sprite!);
        
        this.objects.push(new Furnace(new Rect(120, 200, 120, 120*1.6)));
    }

    draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx);

        for (const object of this.objects) object.draw(ctx);
    }

    update(dt: number): void {

    }

    reEnter(enteredTime: number): void {
        
    }
}