import { GameConfig } from "../../config/gameConfig.js";
import { HUDConfig } from "../../config/hudConfig.js";
import { EventBus } from "../../core/EventBus.js";
import type { InputManager } from "../../core/InputManager.js";
import type Player from "../../entities/Player.js";
import Rect from "../../util/rect.js";
import { ImageButton } from "../uiElements/uiButton.js";
import UIHover from "../uiElements/uiHover.js";
import type { UIManager } from "../uiManager.js";
import { UIGeneric } from "./uiGeneric.js";

export default class UITop extends UIGeneric {
    constructor(input: InputManager, player : Player, ui: UIManager) {

        const rect = new Rect(
            HUDConfig.top.xRatio * GameConfig.GAME_WIDTH,
            HUDConfig.top.yRatio * GameConfig.GAME_HEIGHT,
            HUDConfig.top.widthRatio * GameConfig.GAME_WIDTH,
            HUDConfig.top.heightRatio * GameConfig.GAME_HEIGHT
        );

        super(rect, input, player, ui);

        EventBus.on("inventory:loaded", () => this.load());
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (!this.isShown) return;

        ctx.fillStyle = "hsla(0, 0%, 10%, 0.8)";
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);

        for (const [_, button] of this.buttons) button.draw(ctx);

        for (const [_, hover] of this.hovers) hover.draw(ctx);
    }

    update(dt: number): void {
        for (const [key, button] of this.buttons) {
            button.update(dt);            
        }

        for (const [_, hover] of this.hovers) {
            hover.update(dt);

            if (UIHover.hasHover === null && hover.isOver) {
                UIHover.hasHover = hover;
            }
            else if (UIHover.hasHover !== null && UIHover.hasHover !== hover) {
                hover.isOver = false;
            }
            else if (UIHover.hasHover === hover && !hover.isOver) {
                UIHover.hasHover = null;
            }
        }
    }

    private load() {
        this.buttons.set("player_pickaxe",
            new ImageButton(this.rect, new Rect(0, 5, 50, 50), this.input, this.player.gear.pickaxe!.getSprite()!, this.player.gear.pickaxe!.getClip())
        )
        this.hovers.set("player_pickaxe", new UIHover(
            this.buttons.get("player_pickaxe")!.dRect,
            {x: 0, y: 40},
            this.input,
            this.player.gear.pickaxe!.name,
            `Damage: ${this.player.gear.pickaxe!.damage}\nDurability: ${this.player.gear.pickaxe!.durability}`
        ))

        this.buttons.set("player_sword",
            new ImageButton(this.rect, new Rect(50, 5, 50, 50), this.input, this.player.gear.sword!.getSprite()!, this.player.gear.sword!.getClip())
        )
        this.hovers.set("player_sword", new UIHover(
            this.buttons.get("player_sword")!.dRect,
            {x: 0, y: 40},
            this.input,
            this.player.gear.sword!.name,
            `Damage: ${this.player.gear.sword!.damage}\nDurability: ${this.player.gear.sword!.durability}`
        ))
    }
}