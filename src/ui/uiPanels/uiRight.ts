import { GameConfig } from "../../config/gameConfig.js";
import { HUDConfig } from "../../config/hudConfig.js";
import { EventBus } from "../../core/EventBus.js";
import type { InputManager } from "../../core/InputManager.js";
import type { Inventories } from "../../entities/Player.js";
import type Player from "../../entities/Player.js";
import Rect from "../../util/rect.js";
import { drawHitBox } from "../../util/utils.js";
import { Button, ColorButton, LabelButton } from "../uiElements/uiButton.js";
import type { UIManager } from "../uiManager.js";
import { UIGeneric } from "./uiGeneric.js";
import UIInventory, { OreInventory, PiecesInventory, PlateInventory, ToolsInventory } from "./uiInventory.js";

export default class UIRight extends UIGeneric {

    protected isReduced: boolean = false;
    private reduceBtn: Button;
    public currentPage: keyof Inventories = "ores";

    private pages: Map<keyof Inventories, UIInventory>;

    constructor(input: InputManager, player: Player, ui: UIManager) {

        const rect = new Rect(
            HUDConfig.right.xRatio * GameConfig.GAME_WIDTH,
            HUDConfig.right.yRatio * GameConfig.GAME_HEIGHT,
            HUDConfig.right.widthRatio * GameConfig.GAME_WIDTH,
            HUDConfig.right.heightRatio * GameConfig.GAME_HEIGHT
        );

        super(rect, input, player, ui);

        this.resize();

        this.reduceBtn = new ColorButton("lime", this.rect, new Rect(-30, 0, 30, 30), this.input, () => this.resize());

        this.buttons.set("ores",
            new LabelButton("Ores", "black", "white", 16, this.rect, new Rect(0, 0, 30, 30), this.input, () => this.setPage("ores")));

        this.buttons.set("plates",
            new LabelButton("Plates", "black", "white", 16, this.rect, new Rect(30, 0, 50, 30), this.input, () => this.setPage("plates")));

        this.buttons.set("pieces",
            new LabelButton("Pieces", "black", "white", 16, this.rect, new Rect(80, 0, 40, 30), this.input, () => this.setPage("pieces")));

        this.buttons.set("tools",
            new LabelButton("Tools", "black", "white", 16, this.rect, new Rect(120, 0, 40, 30), this.input, () => this.setPage("tools")));

        this.pages = new Map<keyof Inventories, UIInventory>(
            [
                ["ores", new OreInventory(this.input, this.player, this.ui, this.rect, new Rect(0, 30, this.rect.width, this.rect.height - 30))],
                ["plates", new PlateInventory(this.input, this.player, this.ui, this.rect, new Rect(0, 30, this.rect.width, this.rect.height - 30))],
                ["pieces", new PiecesInventory(this.input, this.player, this.ui, this.rect, new Rect(0, 30, this.rect.width, this.rect.height - 30))],
                ["tools", new ToolsInventory(this.input, this.player, this.ui, this.rect, new Rect(0, 30, this.rect.width, this.rect.height - 30))],
            ]
        )
    }

    setPage(page: keyof Inventories): void {
        this.currentPage = page;
        EventBus.emit("inventory:update");
    }

    resize(): void {
        if (!this.reduceBtn) return;

        if (!this.isReduced) {

            this.reduceBtn.dRect.x += this.rect.width;

            this.rect.width = 0;
            this.rect.x = GameConfig.GAME_WIDTH;

            this.isReduced = true;
        } else {
            this.rect.width = GameConfig.GAME_WIDTH * HUDConfig.right.widthRatio;
            this.rect.x = GameConfig.GAME_WIDTH - this.rect.width;

            this.reduceBtn.dRect.x -= this.rect.width;

            this.isReduced = false;

            EventBus.emit("inventory:update");
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {
        if (!this.isShown) return;

        this.reduceBtn.draw(ctx);

        if (this.isReduced) return;

        this.pages.get(this.currentPage)!.draw(ctx);
        this.buttons.forEach((button) => button.draw(ctx));
    }

    update(dt: number): void {
        this.reduceBtn.update(dt);

        if (this.isReduced) return;

        for (const [_, button] of this.buttons) button.update(dt);
        this.pages.get(this.currentPage)!.update(dt);
    }

}