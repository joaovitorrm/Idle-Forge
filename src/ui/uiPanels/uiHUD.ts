import type { InputManager } from "../../core/InputManager.js";
import type { UIGeneric } from "./uiGeneric.js";
import UIBottom from "./uiBottom.js";
import UILeft from "./uiLeft.js";
import UIRight from "./uiRight.js";
import UITop from "./uiTop.js";
import type Player from "../../entities/Player.js";
import { EventBus } from "../../core/EventBus.js";
import type { Item } from "../../entities/Item.js";
import type Rect from "../../util/rect.js";

type HUDSection = "left" | "right" | "top" | "bottom";

export class uiHUD {

    public sections: Map<HUDSection, UIGeneric>;

    constructor(protected input: InputManager, protected player: Player) {
        this.sections = new Map<HUDSection, UIGeneric>([
            ["left", new UILeft(input, player)],
            ["right", new UIRight(input, player)],
            ["top", new UITop(input, player)],
            ["bottom", new UIBottom(input, player)],
        ]);
    }

    draw(ctx: CanvasRenderingContext2D) {
        for (const section of this.sections.values()) {
            section.draw(ctx);
        }
        
        if (this.player.holdingItem) {
            ctx.drawImage(this.player.holdingItem!.item.sprite, ...this.player.holdingItem!.item.spriteClip, this.input.x - 32, this.input.y - 32, 64, 64);

            ctx.fillStyle = "white";
            ctx.font = "24px MonogramFont";

            ctx.fillText(this.player.holdingItem!.amount.toString(), this.input.x + 16, this.input.y + 16);
        }
    }

    update(dt: number) {
        for (const section of this.sections.values()) {
            section.update(dt);
        }
    }
}