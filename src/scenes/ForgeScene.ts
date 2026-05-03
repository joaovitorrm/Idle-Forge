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
import type { UIManager } from "../ui/uiManager.js";

export default class ForgeScene extends GenericScene {

    private furnaces: Furnace[] = [];
    private anvils : Anvil[] = [];

    constructor(protected input: InputManager, protected player: Player, protected ui: UIManager) {

        const assetManager = AssetManager.getInstance();
        const sprite = assetManager.getBackgroundImage("forgeBackground");

        super(input, player, ui, sprite!);

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
                if (furnace.getSmelting()) {
                    ctx.fillStyle = "red";
                    ctx.fillRect(furnaceUi.x + furnaceUi.width - 45, furnaceUi.y + 5 + 40 - (40 * furnace.getSmeltProgress() / furnace.getSmelting()!.item.meltTime), 40, (40 * furnace.getSmeltProgress() / furnace.getSmelting()!.item.meltTime));
                }
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

            if (furnace.getSmelting()) {
                ctx.drawImage(furnace.getSmelting()!.item.getSprite(), ...furnace.getSmelting()!.item.getClip(), furnaceUi.x + furnaceUi.width - 45, furnaceUi.y + 5, 40, 40);
                ctx.fillText(furnace.getSmelting()!.amount.toString(), furnaceUi.x + furnaceUi.width - 10, furnaceUi.y + 45);
            }
        }
    }

    update(dt: number): void {
        this.handleFurnaceInteraction(dt);
        this.handleAnvilInteraction(dt);
    }

    handleFurnaceInteraction(dt: number) {
        for (const furnace of this.furnaces) {
            furnace.update(dt);
            if (this.input.isMouseOver(furnace.rect)) {
                this.ui.setToolTip("Furnace");
                if (this.input.clicked) {
                    if (this.ui.isHolding()) {
                        const {item, amount} = this.ui.getHolding()!;
                        if (item instanceof Fuel && furnace.addFuel(item as Fuel, amount)) {
                            this.player.removeItem(item, amount);
                        } else if (item instanceof Melt && furnace.addSmelting(item as Melt, amount)) {
                            this.player.removeItem(item, amount);
                        }
                    } else {
                        EventBus.emit("scene:set", "furnace", furnace);
                    }
                    this.input.clicked = false;
                }
            }
        }
    }

    handleAnvilInteraction(dt: number) {
        for (const anvil of this.anvils) {
            anvil.update(dt);

            if (this.input.isMouseOver(anvil.rect)) {
                this.ui.setToolTip("Anvil");
                if (this.input.clicked) {
                    EventBus.emit("scene:set", "anvil");
                    this.input.clicked = false;
                }
            }
        }
    }

    enter(): void {
        const enteredTime = this.exitedTime === 0 ? 0 : (Date.now() - this.exitedTime) / 1000;

        if (enteredTime > 0) {
            this.furnaces.forEach(furnace => furnace.passTime((enteredTime)));
        }
        
    }

    exit(): void {
        this.exitedTime = Date.now();
    }
}