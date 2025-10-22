import { AssetManager } from "../core/AssetManager.js";
import Rect from "../util/rect.js";
import type { InputManager } from "../core/InputManager.js";
import Furnace from "../entities/Furnace.js";
import type Player from "../entities/Player.js";
import { GenericScene } from "./GenericScene.js";
import { EventBus } from "../core/EventBus.js";
import { Fuel, Ore } from "../entities/Item.js";

export default class ForgeScene extends GenericScene {

    private furnaces: Furnace[] = [];

    constructor(protected input: InputManager, protected player: Player) {

        const assetManager = AssetManager.getInstance();
        const sprite = assetManager.getBackgroundImage("forgeBackground");

        super(input, player, sprite!);

        this.furnaces.push(new Furnace(new Rect(120, 200, 120, 120 * 1.6)));
    }

    draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx);

        for (const furnace of this.furnaces) {
            furnace.draw(ctx);

            const furnaceUi = new Rect(furnace.rect.x, furnace.rect.y - 50, furnace.rect.width, 50);

            ctx.fillStyle = "white";
            ctx.fillRect(furnaceUi.x, furnaceUi.y, furnaceUi.width, furnaceUi.height);

            ctx.font = "20px MonogramFont";

            if (furnace.isActive) {
                ctx.fillStyle = "orange";
                ctx.fillRect(furnaceUi.x + 5, furnaceUi.y + 5 + 40 - (40 * furnace.temperature / furnace.getFuel()!.item.burnTime), 40, (40 * furnace.temperature / furnace.getFuel()!.item.burnTime));
            }

            ctx.strokeStyle = "black";
            ctx.fillStyle = "black";
            ctx.textAlign = "right";
            ctx.textBaseline = "bottom";

            ctx.strokeRect(furnaceUi.x + 5, furnaceUi.y + 5, 40, 40);
            ctx.strokeRect(furnaceUi.x + furnaceUi.width - 45, furnaceUi.y + 5, 40, 40);

            if (furnace.getFuel()) {
                ctx.drawImage(furnace.getFuel()!.item.sprite, ...furnace.getFuel()!.item.spriteClip, furnaceUi.x + 5, furnaceUi.y + 5, 40, 40);
                ctx.fillText(furnace.getFuel()!.amount.toString(), furnaceUi.x + 40, furnaceUi.y + 45);
            }

            if (furnace.getOutput()) {
                ctx.drawImage(furnace.getOutput()!.item.sprite, ...furnace.getOutput()!.item.spriteClip, furnaceUi.x + furnaceUi.width - 45, furnaceUi.y + 5, 40, 40);
                ctx.fillText(furnace.getOutput()!.amount.toString(), furnaceUi.x + furnaceUi.width - 10, furnaceUi.y + 45);
            }
        };
    }

    update(dt: number): void {
        for (const furnace of this.furnaces) furnace.update(dt);

        for (const furnace of this.furnaces) {
            if (this.input.clicked) {
                if (furnace.rect.collide(this.input.getRect())) {
                    if (this.player.holdingItem) {
                        if (this.player.holdingItem.item instanceof Fuel) {
                            if (furnace.addFuel(this.player.holdingItem.item as Fuel, this.player.holdingItem.amount))
                                this.player.removeItem(this.player.holdingItem.item, this.player.holdingItem.amount);
                        } else if (this.player.holdingItem.item instanceof Ore) {
                            if (furnace.addOutput(this.player.holdingItem.item as Ore, this.player.holdingItem.amount))
                                this.player.removeItem(this.player.holdingItem.item, this.player.holdingItem.amount);
                        }
                        this.input.clicked = false;
                    } else {
                        EventBus.emit("open_furnace", furnace);
                    }                    
                }
                this.player.holdingItem = null;
            }
        }
    }

    enter(): void {

    }

    exit(): void {

    }
}