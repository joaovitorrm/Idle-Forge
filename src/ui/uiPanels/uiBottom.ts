import { GameConfig } from "../../config/gameConfig.js";
import { HUDConfig } from "../../config/hudConfig.js";
import { EventBus } from "../../core/EventBus.js";
import type { InputManager } from "../../core/InputManager.js";
import type Player from "../../entities/Player.js";
import Rect from "../../util/rect.js";
import { ColorButton } from "../uiElements/uiButton.js";
import UIHover from "../uiElements/uiHover.js";
import type { UIManager } from "../uiManager.js";
import { UIGeneric } from "./uiGeneric.js";

export default class UIBottom extends UIGeneric {
    constructor(input: InputManager, player: Player, ui: UIManager) {

        const rect = new Rect(
            HUDConfig.bottom.xRatio * GameConfig.GAME_WIDTH,
            HUDConfig.bottom.yRatio * GameConfig.GAME_HEIGHT,
            HUDConfig.bottom.widthRatio * GameConfig.GAME_WIDTH,
            HUDConfig.bottom.heightRatio * GameConfig.GAME_HEIGHT
        );

        super(rect, input, player, ui);

        this.buttons.set("cave",
            new ColorButton("purple", this.rect, new Rect(10, (this.rect.height - 30) / 2, 30, 30), this.input, () => EventBus.emit("scene:set", "cave"))
        );
        this.hovers.set("cave",
            new UIHover(this.buttons.get("cave")!.dRect, { x: -6, y: -20 }, this.input, "Cave")
        );

        this.buttons.set("forge",
            new ColorButton("black", this.rect, new Rect(50, (this.rect.height - 30) / 2, 30, 30), this.input, () => EventBus.emit("scene:set", "forge"))
        );
        this.hovers.set("forge",
            new UIHover(this.buttons.get("forge")!.dRect, { x: -8, y: -20 }, this.input, "Forge")
        );

        this.buttons.set("tools_book",
            new ColorButton("green",
                this.rect, new Rect(this.rect.width - 40, (this.rect.height - 30) / 2, 30, 30), this.input, () => this.ui.toggleBook("tools"))
        );
        this.hovers.set("tools_book",
            new UIHover(this.buttons.get("tools_book")!.dRect, { x: -50, y: -20 }, this.input, "Tools Book")
        );
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (!this.isShown) return;

        ctx.fillStyle = "red";
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);

        for (const [_, button] of this.buttons) button.draw(ctx);

        for (const [_, hover] of this.hovers) hover.draw(ctx);
    }
    update(dt: number): void {
        for (const [_, button] of this.buttons) button.update(dt);

        for (const [_, hover] of this.hovers) hover.update(dt);
    }

}