import { EventBus } from "../../core/EventBus.js";
import type { InputManager } from "../../core/InputManager.js";
import type { Piece, Plate, Tool } from "../../entities/Item.js";
import type Player from "../../entities/Player.js";
import Rect from "../../util/rect.js";
import { drawHitBox } from "../../util/utils.js";
import { LabelButton, type Button } from "../uiElements/uiButton.js"
import type { UIManager } from "../uiManager.js";

export default abstract class UIInventory {

    constructor(
        protected input: InputManager,
        protected player: Player,
        protected ui: UIManager,
        protected sRect: Rect,
        protected dRect: Rect
    ) {
        this.dRect.x += this.sRect.x;
        this.dRect.y += this.sRect.y;
    }

    abstract draw(ctx: CanvasRenderingContext2D): void;

    abstract update(dt: number): void;
}

interface OreInventorySlotStyle {
    name: string,
    amount: string,
    sprite: HTMLImageElement | ImageBitmap,
    spriteClip: [number, number, number, number],
    rect: Rect,
    holdBtns: Map<string, Button>
}

export class OreInventory extends UIInventory {

    private slots: OreInventorySlotStyle[] = [];

    constructor(input: InputManager, player: Player, ui: UIManager, sRect: Rect, dRect: Rect) {
        super(input, player, ui, sRect, dRect);

        EventBus.on("inventory:loaded", () => this.setItems());
        EventBus.on("inventory:updated", () => this.setItems());
    }

    draw(ctx: CanvasRenderingContext2D): void {

        ctx.fillStyle = "brown";
        ctx.fillRect(this.dRect.x, this.dRect.y, this.dRect.width, this.dRect.height);

        this.slots.forEach((slot) => {

            ctx.fillStyle = "grey";
            ctx.fillRect(slot.rect.x, slot.rect.y, slot.rect.width, slot.rect.height);

            ctx.fillStyle = "white";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            ctx.font = "22px MonogramFont";
            ctx.fillText(slot.name, slot.rect.x, slot.rect.y);

            ctx.textBaseline = "bottom";
            ctx.fillText(slot.amount, slot.rect.x, slot.rect.y + slot.rect.height);

            ctx.drawImage(slot.sprite, ...slot.spriteClip, slot.rect.x, slot.rect.y + 10, 70, 70);
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

        if (this.input.clicked && this.input.isMouseOver(this.dRect)) {
            this.input.clicked = false;
            this.ui.removeHolding();
        }
    }

    setItems(): void {
        const items = this.player.getInventory("ores");

        this.slots = [];

        if (items.size > 0) {
            let c = 0;
            items.forEach(({ item, amount }) => {
                const slotRect = new Rect(this.dRect.x + this.dRect.width / 2 - 50, this.dRect.y + (90 * c) + 10, 100, 80);
                this.slots.push({
                    name: item.name,
                    amount: amount.toString(),
                    sprite: item.getSprite(),
                    spriteClip: item.getClip(),
                    rect: slotRect,
                    holdBtns: new Map(
                        [1, 5, 15].map((selectAmount, i) => {
                            return ["x" + selectAmount, new LabelButton("x" + selectAmount, "white", "black", 16, slotRect, new Rect(slotRect.width - 30, 20 * i + 20, 30, 20), this.input,
                                () => {
                                    if (selectAmount > amount) return;
                                    if (this.ui.getHolding() !== null && (this.ui.getHolding()!.amount + selectAmount) > amount) return;
                                    this.ui.setHolding(item, selectAmount, { width: 64, height: 64 }, true);
                                    this.input.clicked = false;
                                })]
                        })
                    )
                })
                c++;
            })
        }
    }
}

export class PlateInventory extends UIInventory {
    private plates: { plate: Plate, rect: Rect }[] = [];
    constructor(input: InputManager, player: Player, ui: UIManager, sRect: Rect, dRect: Rect) {
        super(input, player, ui, sRect, dRect);

        EventBus.on("inventory:loaded", () => this.setItems());
        EventBus.on("inventory:updated", () => this.setItems());
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "black";
        ctx.fillRect(this.dRect.x, this.dRect.y, this.dRect.width, this.dRect.height);
        this.plates.forEach(({ plate, rect }) => {
            ctx.fillStyle = "grey";
            ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
            ctx.drawImage(plate.getSprite(), ...plate.getClip(), rect.x + 5, rect.y + 5, rect.width - 10, rect.height - 10);
        })
    }

    update(dt: number) {
        if (this.input.isMouseOver(this.dRect)) {
            this.plates.forEach(({ plate, rect }) => {
                if (this.input.isMouseOver(rect)) {
                    if (this.input.clicked) {
                        this.ui.setHolding(plate, 0, { width: 128, height: 128 });
                        this.input.clicked = false;
                    }
                }
            })
            if (this.input.clicked && this.ui.isHolding()) {
                this.ui.removeHolding();
                this.input.clicked = false;
            }
        }

    }

    setItems() {
        this.plates = [];

        let c = 0;
        this.player.getInventory("plates").forEach(plate => {
            this.plates.push({
                plate: plate.item as Plate,
                rect: new Rect(this.dRect.x + (65 * (c % 2)), this.dRect.y + (65 * Math.floor(c / 2)), 55, 55)
            });
            c++;
        })
    }
}

export class PiecesInventory extends UIInventory {
    private pieces: { piece: Piece, rect: Rect, amount: number }[] = [];
    constructor(input: InputManager, player: Player, ui: UIManager, sRect: Rect, dRect: Rect) {
        super(input, player, ui, sRect, dRect);

        EventBus.on("inventory:loaded", () => this.setItems());
        EventBus.on("inventory:updated", () => this.setItems());
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.pieces.forEach(({ piece, rect, amount }) => {
            ctx.fillStyle = "white";
            ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
            ctx.drawImage(piece.getSprite(), ...piece.getClip(), rect.x, rect.y, rect.width, rect.height);

            ctx.font = "16px MonogramFont";
            ctx.fillStyle = "black";
            ctx.textAlign = "left";
            ctx.textBaseline = "bottom";
            ctx.fillText(amount.toString(), rect.x, rect.y + rect.height);
        })
    }

    update(dt: number) {
        if (this.input.isMouseOver(this.dRect)) {
            this.pieces.forEach(({ piece, rect }) => {
                if (this.input.isMouseOver(rect)) {
                    this.ui.setToolTip(piece.name);
                    if (this.input.clicked) {
                        this.ui.setHolding(piece, 0, { width: 128, height: 128 });
                        this.input.clicked = false;
                        return;
                    }
                }
            })
            if (this.input.clicked && this.ui.isHolding()) {
                this.ui.removeHolding();
                this.input.clicked = false;
            }
        }

    }

    setItems() {
        this.pieces = [];

        let c = 0;
        this.player.getInventory("pieces").forEach(piece => {
            this.pieces.push({
                piece: piece.item as Piece,
                rect: new Rect(this.dRect.x + (65 * (c % 2)), this.dRect.y + (65 * Math.floor(c / 2)), 55, 55),
                amount: piece.amount
            });
            c++;
        })
    }
}

export class ToolsInventory extends UIInventory {
    private tools: { tool: Tool, rect: Rect }[] = [];
    constructor(input: InputManager, player: Player, ui: UIManager, sRect: Rect, dRect: Rect) {
        super(input, player, ui, sRect, dRect);

        EventBus.on("inventory:loaded", () => this.setItems());
        EventBus.on("inventory:updated", () => this.setItems());
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.tools.forEach(({ tool, rect }) => {
            ctx.fillStyle = "grey";
            ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
            ctx.drawImage(tool.getSprite(), ...tool.getClip(), rect.x + 5, rect.y + 5, rect.width - 10, rect.height - 10);
        })
    }

    update(dt: number) {
        this.tools.forEach(({ tool, rect }) => {
            if (this.input.isMouseOver(rect)) {
                EventBus.emit("set_tooltip", tool.name);
                if (this.input.clicked) {
                    EventBus.emit("hold_item", tool, 0);
                    this.input.clicked = false;
                }
            }
        })
    }

    setItems() {
        this.tools = [];

        let c = 0;
        this.player.getInventory("tools").forEach(tool => {
            this.tools.push({
                tool: tool.item as Tool,
                rect: new Rect(this.dRect.x + (65 * (c % 2)), this.dRect.y + (65 * Math.floor(c / 2)), 55, 55)
            });
            c++;
        })
    }
}