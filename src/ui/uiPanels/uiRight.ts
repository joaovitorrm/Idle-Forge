import { GameConfig } from "../../config/gameConfig.js";
import { HUDConfig } from "../../config/hudConfig.js";
import type { InputManager } from "../../core/InputManager.js";
import type Player from "../../entities/Player.js";
import Rect from "../../util/rect.js";
import { ColorButton } from "../uiElements/Button.js";
import { UIGeneric } from "./uiGeneric.js";

export default class UIRight extends UIGeneric {

    protected isReduced: boolean = false;

    constructor(input: InputManager, player: Player) {

        const rect = new Rect(
            HUDConfig.right.xRatio * GameConfig.GAME_WIDTH,
            HUDConfig.right.yRatio * GameConfig.GAME_HEIGHT,
            HUDConfig.right.widthRatio * GameConfig.GAME_WIDTH,
            HUDConfig.right.heightRatio * GameConfig.GAME_HEIGHT
        );

        super(rect, input, player);

        this.resize();

        this.addColorButton("reduce", "lime", new Rect(-30, 0, 30, 30), () => this.resize());
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
        
        ctx.font = "22px monospace_pixel";
        ctx.fillStyle = "white";

        let c = 0;
        for (const i of this.player.getInventory()) {
            ctx.textBaseline = "middle";
            ctx.textAlign = "left";

            ctx.drawImage(i[1].item.sprite, ...i[1].item.spriteClip, this.rect.x + 10, this.rect.y + (i[1].item.spriteClip[3] * c) + (c * 10) + 10, 30, 30);
            ctx.fillText(i[0],
                this.rect.x + i[1].item.spriteClip[2] + 10,
                this.rect.y + (i[1].item.spriteClip[3] * c) + (c * 10) + 10 + (i[1].item.spriteClip[3] / 2));
            c++;

            ctx.textAlign = "right";
            ctx.fillText(i[1].amount.toString(), 5 + this.rect.x + i[1].item.spriteClip[2], this.rect.y + (i[1].item.spriteClip[3] * c) + (c * 10));
        }


        for (const [_, button] of this.buttons) button.draw(ctx);
    }

    update(dt: number): void {
        for (const [_, button] of this.buttons) button.update(dt);
    }

}