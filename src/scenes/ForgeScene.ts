import { AssetManager } from "../core/AssetManager.js";
import Rect from "../util/rect.js";
import type { InputManager } from "../core/InputManager.js";
import Furnace from "../entities/Furnace.js";
import type Player from "../entities/Player.js";
import { GenericScene } from "./GenericScene.js";
import { EventBus } from "../core/EventBus.js";
import { Fuel, Melt } from "../entities/Item.js";
import { Anvil } from "../entities/Anvil.js";
import { drawHitBox } from "../util/utils.js";

export default class ForgeScene extends GenericScene {

    private furnaces: Furnace[] = [];
    private anvils : Anvil[] = [];

    constructor(protected input: InputManager, protected player: Player) {

        const assetManager = AssetManager.getInstance();
        const sprite = assetManager.getBackgroundImage("forgeBackground");

        super(input, player, sprite!);

        this.furnaces.push(new Furnace(new Rect(220, 200, 120, 120 * 1.6)));
        this.anvils.push(new Anvil(new Rect(400, 332, 100, 60)));
    }

    draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx);

        this.drawFurnaceUI(ctx);

        for (const anvil of this.anvils) {
            anvil.draw(ctx);
        }
    }

    drawFurnaceUI(ctx: CanvasRenderingContext2D): void {
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
                ctx.drawImage(furnace.getFuel()!.item.getSprite(), ...furnace.getFuel()!.item.getClip(), furnaceUi.x + 5, furnaceUi.y + 5, 40, 40);
                ctx.fillText(furnace.getFuel()!.amount.toString(), furnaceUi.x + 40, furnaceUi.y + 45);
            }

            if (furnace.getOutput()) {
                ctx.drawImage(furnace.getOutput()!.item.getSprite(), ...furnace.getOutput()!.item.getClip(), furnaceUi.x + furnaceUi.width - 45, furnaceUi.y + 5, 40, 40);
                ctx.fillText(furnace.getOutput()!.amount.toString(), furnaceUi.x + furnaceUi.width - 10, furnaceUi.y + 45);
            }
        }
    }

    update(dt: number): void {
        for (const furnace of this.furnaces) {
            furnace.update(dt);
            if (this.input.isMouseOver(furnace.rect)) {
                EventBus.emit("set_tooltip", "Furnace");
            }
        }

        this.handleFurnaceInteraction();

        for (const anvil of this.anvils) {
            anvil.update(dt);
        }

        this.handleAnvilInteraction();
    }

    handleFurnaceInteraction() {
        for (const furnace of this.furnaces) {
            if (this.input.clicked) {
                if (furnace.rect.collide(this.input.getRect())) {
                    if (this.player.holdingItem) {
                        const {item, amount} = this.player.holdingItem;
                        if (item instanceof Fuel && furnace.addFuel(item as Fuel, amount)) {
                            this.player.removeItem(item, amount);
                        } else if (item instanceof Melt && furnace.addOutput(item as Melt, amount)) {
                            this.player.removeItem(item, amount);
                        }
                    } else {
                        EventBus.emit("scene:set", "furnace", furnace);
                    }
                    this.input.clicked = false;
                }
                this.player.holdingItem = null;
            }
        }
    }

    handleAnvilInteraction() {
        for (const anvil of this.anvils) {
            if (this.input.isMouseOver(anvil.rect)) {
                EventBus.emit("set_tooltip", "Anvil");
                if (this.input.clicked) {
                    EventBus.emit("scene:set", "anvil");
                    this.input.clicked = false;
                }
            }
        }
    }

    enter(): void {

    }

    exit(): void {

    }
}