import { GameConfig } from "../../config/gameConfig.js";
import { HUDConfig } from "../../config/hudConfig.js";
import type { InputManager } from "../../core/InputManager.js";
import Rect from "../../util/rect.js";
import { ColorButton, type Button } from "../uiElements/Button.js";
import { UIGeneric } from "./uiGeneric.js";

export default class UIRight extends UIGeneric {

    protected isReduced: boolean = false;

    constructor(protected input: InputManager) {

        const rect = new Rect(
            HUDConfig.right.xRatio * GameConfig.GAME_WIDTH,
            HUDConfig.right.yRatio * GameConfig.GAME_HEIGHT,
            HUDConfig.right.widthRatio * GameConfig.GAME_WIDTH,
            HUDConfig.right.heightRatio * GameConfig.GAME_HEIGHT
        );

        super(rect);

        this.resize();

        this.addColorButton("reduce", "lime", new Rect(-40, 0, 40, 60), () => this.resize());
    }

    addColorButton(name: string, color: string, rect: Rect, handleClick: (args?: unknown) => void): void {
        rect.x += this.rect.x;
        rect.y += this.rect.y;
        this.buttons.set(name, new ColorButton(color, rect, this.input, handleClick));
    }


    resize(): void {        
        if (!this.isReduced) {
            if (this.buttons.has("reduce"))
                this.buttons.get("reduce")!.rect.x += this.rect.width;

            this.rect.width = 0;
            this.rect.x = GameConfig.GAME_WIDTH;

            this.isReduced = true;
        } else {
            this.rect.width = GameConfig.GAME_WIDTH * HUDConfig.right.widthRatio;
            this.rect.x = GameConfig.GAME_WIDTH - this.rect.width;
            
            if (this.buttons.has("reduce"))
                this.buttons.get("reduce")!.rect.x -= this.rect.width;

            this.isReduced = false;
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (!this.isShown) return;

        ctx.fillStyle = "green";
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);

        for (const [_, button] of this.buttons) button.draw(ctx);
    }

    update(dt: number): void {
        for (const [_, button] of this.buttons) button.update(dt);
    }

}