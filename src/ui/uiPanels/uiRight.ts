import { GameConfig } from "../../config/gameConfig.js";
import { HUDConfig } from "../../config/hudConfig.js";
import { EventBus } from "../../core/EventBus.js";
import type { InputManager } from "../../core/InputManager.js";
import type { Inventories } from "../../entities/Player.js";
import type Player from "../../entities/Player.js";
import Rect from "../../util/rect.js";
import { drawHitBox } from "../../util/utils.js";
import { Button, ColorButton, LabelButton } from "../uiElements/uiButton.js";
import { UIGeneric } from "./uiGeneric.js";
import UIInventory, { OreInventory, PiecesInventory, PlateInventory, ToolsInventory } from "./uiInventory.js";

export default class UIRight extends UIGeneric {

    protected isReduced: boolean = false;
    private reduceBtn: Button;
    private holdAmounts: number[] = [1, 5, 15];
    public currentPage: keyof Inventories = "ores";

    private pages: Map<keyof Inventories, UIInventory> = new Map<keyof Inventories, UIInventory>(
        [
            ["ores", new OreInventory(this.input, this.player, this.rect, this.rect, 20, 60)],
            ["plates", new PlateInventory(this.input, this.player, this.rect, this.rect, 20, 40)],
            ["pieces", new PiecesInventory(this.input, this.player, this.rect, this.rect, 20, 40)],
            ["tools", new ToolsInventory(this.input, this.player, this.rect, this.rect, 20, 40)],
        ]
    );

    constructor(input: InputManager, player: Player) {

        const rect = new Rect(
            HUDConfig.right.xRatio * GameConfig.GAME_WIDTH,
            HUDConfig.right.yRatio * GameConfig.GAME_HEIGHT,
            HUDConfig.right.widthRatio * GameConfig.GAME_WIDTH,
            HUDConfig.right.heightRatio * GameConfig.GAME_HEIGHT
        );

        super(rect, input, player);

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
    }

    setPage(page : keyof Inventories) : void {
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

        ctx.fillStyle = "green";
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);

        this.pages.get(this.currentPage)!.draw(ctx);
        this.buttons.forEach((button) => button.draw(ctx));
    }

    update(dt: number): void {
        this.reduceBtn.update(dt);

        if (this.isReduced) return;

        this.pages.get(this.currentPage)!.update(dt);
        for (const [_, button] of this.buttons) button.update(dt);
    }

    private drawInventory(ctx: CanvasRenderingContext2D): void {
        if (this.isReduced) return;

        ctx.font = "16px MonogramFont";

        this.buttons.forEach((button) => button.draw(ctx));

        ctx.fillStyle = "white";

        let c = 0;
        for (const i of this.player.getInventory(this.currentPage)) {
            const inventorySlot = new Rect(this.rect.x + 40, this.rect.y + 80 + (80 * c) + (10 * c), this.rect.width - 80, 60);

            ctx.drawImage(i[1].item.getSprite(), ...i[1].item.getClip(),
                inventorySlot.x + inventorySlot.width / 2 - 50, inventorySlot.y + inventorySlot.height / 2 - 32, 64, 64);

            ctx.font = "22px MonogramFont";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";

            ctx.fillText(i[0],
                inventorySlot.x, inventorySlot.y - 12);

            ctx.font = "32px MonogramFont";
            ctx.textAlign = "right";
            ctx.textBaseline = "middle";

            ctx.fillText(i[1].amount.toString(),
                inventorySlot.x + inventorySlot.width / 2, inventorySlot.y + inventorySlot.height / 2 + 10);

            ctx.font = "16px MonogramFont";

            if (!this.buttons.has(i[0] + "x1")) {
                this.holdAmounts.forEach((amount, index) => {
                    this.buttons.set(i[0] + "x" + amount,
                        new LabelButton("x" + amount, "white", "black", 16, inventorySlot,
                            new Rect(inventorySlot.width - 30, inventorySlot.height / 3 * index, 30, inventorySlot.height / 3), this.input, () => {
                                EventBus.emit("hold_item", i[1].item, amount);
                            }));
                })
            }

            /* ctx.strokeStyle = "red";
            ctx.strokeRect(inventorySlot.x, inventorySlot.y, inventorySlot.width, inventorySlot.height); */

            c++;
        }

        for (const [_, button] of this.buttons) button.draw(ctx);

    }

}