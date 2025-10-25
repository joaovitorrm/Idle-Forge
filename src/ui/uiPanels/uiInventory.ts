import { EventBus } from "../../core/EventBus.js";
import type { InputManager } from "../../core/InputManager.js";
import type { Plate } from "../../entities/Item.js";
import type Player from "../../entities/Player.js";
import Rect from "../../util/rect.js";
import { drawHitBox } from "../../util/utils.js";
import { LabelButton, type Button } from "../uiElements/Button.js"

export default abstract class UIInventory {

    constructor(protected input: InputManager, protected player : Player, protected sRect: Rect, protected dRect: Rect, protected offsetX: number = 0, protected offsetY: number = 0) { }

    abstract draw(ctx: CanvasRenderingContext2D): void;

    abstract update(dt: number): void;
}

interface OreInventorySlotStyle {
    name: string,
    amount: string,
    sprite: HTMLImageElement,
    spriteClip: [number, number, number, number],
    rect: Rect,
    holdBtns: Map<string, Button>
}

export class OreInventory extends UIInventory {

    private slots: OreInventorySlotStyle[] = [];

    constructor(input: InputManager, player: Player, sRect: Rect, dRect: Rect, offsetX: number = 0, offsetY: number = 0) {
        super(input, player, sRect, dRect, offsetX, offsetY);

        this.setItems();

        EventBus.on("inventory:update", () => this.setItems());
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.slots.forEach((slot) => {
            ctx.fillStyle = "white";
            ctx.textAlign = "left";
            ctx.textBaseline = "bottom";
            ctx.font = "22px MonogramFont";
            ctx.fillText(slot.name, slot.rect.x, slot.rect.y);

            ctx.fillText(slot.amount, slot.rect.x, slot.rect.y + slot.rect.height);

            ctx.drawImage(slot.sprite, ...slot.spriteClip, slot.rect.x, slot.rect.y, 70, 70);
            slot.holdBtns.get("x1")!.draw(ctx);
            slot.holdBtns.get("x5")!.draw(ctx);
            slot.holdBtns.get("x15")!.draw(ctx);
        })
    }

    update(dt: number): void {
        if (this.player.getInventory("ores").size !== this.slots.length) {
            this.setItems();
        }

        this.slots.forEach((slot) => {
            slot.holdBtns.get("x1")!.update(dt);
            slot.holdBtns.get("x5")!.update(dt);
            slot.holdBtns.get("x15")!.update(dt);
        })
    }

    setItems(): void {
        const items = this.player.getInventory("ores");

        this.slots = [];

        if (items.size > 0) {
            let c = 0;
            items.forEach((item) => {
                const slotRect = new Rect(this.sRect.x + this.offsetX, this.sRect.y + this.offsetY + (90 * c), 100, 60);
                this.slots.push({
                    name: item.item.name,
                    amount: item.amount.toString(),
                    sprite: item.item.sprite,
                    spriteClip: item.item.spriteClip,
                    rect: slotRect,
                    holdBtns: new Map(
                        [
                            ["x1", new LabelButton("x1", "white", "black", 16, slotRect, new Rect(slotRect.width - 30, 0, 30, 20), this.input,
                                () => EventBus.emit("hold_item", item.item, 1))],
                            ["x5", new LabelButton("x5", "white", "black", 16, slotRect, new Rect(slotRect.width - 30, 20, 30, 20), this.input,
                                () => EventBus.emit("hold_item", item.item, 5))],
                            ["x15", new LabelButton("x15", "white", "black", 16, slotRect, new Rect(slotRect.width - 30, 40, 30, 20), this.input,
                                () => EventBus.emit("hold_item", item.item, 15))]
                        ]
                    )
                })
                c++;
            })
        }
    }
}

export class PlateInventory extends UIInventory {
    private plates: {plate: Plate, rect : Rect}[] = [];
    constructor(input: InputManager, player: Player, sRect: Rect, dRect: Rect, offsetX: number = 0, offsetY: number = 0) {
        super(input, player, sRect, dRect, offsetX, offsetY);

        this.setItems();

        EventBus.on("inventory:update", () => this.setItems());
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.plates.forEach(({plate, rect}) => {
            ctx.drawImage(plate.sprite, ...plate.spriteClip, rect.x, rect.y, rect.width, rect.height);
        })
    }

    update(dt: number) {
        this.plates.forEach(({plate, rect}) => {
            if (this.input.clicked && this.input.isMouseOver(rect)) {
                EventBus.emit("hold_item", plate, 0);
                this.input.clicked = false;
            }
        })
    }

    setItems() {
        this.plates = [];

        let c = 0;
        this.player.getInventory("plates").forEach(plate => {
            this.plates.push({plate : plate.item as Plate, rect : new Rect(this.sRect.x + this.offsetX + (50 * (c % 2)), this.sRect.y + this.offsetY + (50 * Math.floor(c/2)), 40, 40)});
            c++;
        })
    }
}

export class PiecesInventory extends UIInventory {
    constructor(input: InputManager, player: Player, sRect: Rect, dRect: Rect, offsetX: number = 0, offsetY: number = 0) {
        super(input, player, sRect, dRect, offsetX, offsetY);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        
    }

    update(dt: number): void {
        
    }
}