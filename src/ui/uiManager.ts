import { EventBus } from "../core/EventBus.js";
import type { InputManager } from "../core/InputManager.js";
import type { Item } from "../entities/Item.js";
import type Player from "../entities/Player.js";
import { ToolsBook, type UIBook } from "./uiElements/Book/UIBook.js";
import UIHover from "./uiElements/uiHover.js";
import { uiHUD } from "./uiPanels/uiHUD.js";

export class UIManager {

    private hud: uiHUD;
    private hovers : Map<string, UIHover> = new Map<string, UIHover>();
    private isHUDActive: boolean = true;

    private activeToolTip : string = "";
    private holding : { item : Item, amount : number, size : { width : number, height : number } } | null = null;

    private activeBook : string = "";
    private books : Map<string, UIBook> = new Map<string, UIBook>();

    constructor(private input: InputManager, protected player: Player) {
        this.hud = new uiHUD(input, player, this);

        this.books.set("tools",
            new ToolsBook(this.input, "black")
        )
    }

    public setToolTip(toolTip: string) {
        this.activeToolTip = toolTip;
    }

    public setHolding(item: Item, amount: number, size: { width: number, height: number }, sum : boolean = false) {
        if (sum) {
            if (this.holding !== null && this.holding.item === item) {
                this.holding.amount += amount;
                return;
            }
        }
        this.holding = { item, amount, size };
    }

    public removeHolding() {
        this.holding = null;
    }

    public isHolding() : boolean {
        return this.holding !== null;
    }

    public getHolding() : { item : Item, amount : number, size : { width : number, height : number } } | null {
        return this.holding;
    }

    public setIsHUDActive(isHUDActive: boolean) {
        this.isHUDActive = isHUDActive;
    }

    public toggleBook(book: string) {
        if (this.activeBook === book) {
            this.activeBook = "";
        } else {
            this.activeBook = book;
        }
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (!this.isHUDActive) return;

        this.hud.draw(ctx);

        this.hovers.forEach((hover) => hover.draw(ctx));

        this.drawBook(ctx);

        this.drawHoldingItem(ctx);

        if (this.activeBook !== "") return;

        this.drawToolTip(ctx);
    }

    private drawHoldingItem(ctx: CanvasRenderingContext2D) {
        if (this.holding !== null) {
            const {item, amount, size} = this.holding;
            ctx.drawImage(item.getSprite(), ...item.getClip(), this.input.x - size.width / 2, this.input.y - size.height / 2, size.width, size.height);

            ctx.fillStyle = "white";
            ctx.font = "24px MonogramFont";

            if (amount === 0) return;

            ctx.fillText(amount.toString(), this.input.x + 16, this.input.y + 16);
        }
    }

    private drawToolTip(ctx: CanvasRenderingContext2D) {
        if (this.activeToolTip === "") return;

        ctx.font = "16px MonogramFont";
        const wordData = ctx.measureText(this.activeToolTip);

        ctx.fillStyle = "black";
        let x = this.input.x - wordData.width / 2 - 5;
        let y = this.input.y - 20;

        if (x < 0) x = 0;
        else if (x + wordData.width + 10 > ctx.canvas.width) x = ctx.canvas.width - wordData.width - 10;

        if (y < 0) y = 0;

        ctx.fillRect(x, y, wordData.width + 10, 20);

        ctx.fillStyle = "white";        
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.activeToolTip, x + wordData.width / 2 + 5, y + 10);

        this.activeToolTip = "";
    }

    private drawBook(ctx: CanvasRenderingContext2D) {
        if (this.activeBook === "") return;

        this.books.get(this.activeBook)?.draw(ctx);
    }

    public update(dt: number) {
        this.hud.update(dt);
        this.hovers.forEach((hover) => {
            hover.update(dt);
        });

        if (this.activeBook !== "") this.books.get(this.activeBook)?.update(dt);
    }
}