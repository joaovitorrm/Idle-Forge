import { EventBus } from "../core/EventBus.js";
import type { InputManager } from "../core/InputManager.js";
import type Player from "../entities/Player.js";
import type Rect from "../util/rect.js";
import { Button, ColorButton, ImageButton } from "./uiElements/Button.js";
import UIHover from "./uiElements/uiHover.js";
import { uiHUD } from "./uiPanels/uiHUD.js";

type HUDSection = "right" | "top" | "bottom";

export class UIManager {

    hud: uiHUD;
    hovers : Map<string, UIHover> = new Map<string, UIHover>();
    isHUDActive: boolean = true;
    activeToolTip : string = "";

    constructor(private input: InputManager, protected player: Player) {
        this.hud = new uiHUD(input, player);
        EventBus.on("set_tooltip", (tooltip : string) => this.activeToolTip = tooltip);
    }

    public setIsHUDActive(isHUDActive: boolean) {
        this.isHUDActive = isHUDActive;
    }

    public addHUDColorButton(side: HUDSection, name: string, color: string, rect: Rect, handleClick: (args?: unknown) => void): void {
        this.hud.sections.get(side)!.buttons.set(name, new ColorButton(color, this.hud.sections.get(side)!.rect, rect, this.input));
        this.hud.sections.get(side)!.buttons.get(name)!.setOnClick(handleClick);
    }

    public addHUDImageButton(side: HUDSection, name: string, image: HTMLImageElement, clip: [number, number, number, number] | null, rect: Rect, handleClick: ((args?: unknown) => void) | null = null): void {
        this.hud.sections.get(side)!.buttons.set(name, new ImageButton(this.hud.sections.get(side)!.rect, rect, this.input, image, clip, handleClick));
    }

    public addButtonHover(button : Button, dRect : Rect, title : string, description : string = "") : void {
        this.hovers.set(title, new UIHover(button.dRect, dRect, this.input, title, description));
    }

    public getHUDButton(side: HUDSection, name: string): Button | undefined {
        return this.hud.sections.get(side)!.buttons.get(name);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (!this.isHUDActive) return;

        this.hud.draw(ctx);
        this.hovers.forEach((hover) => hover.draw(ctx));

        this.drawToolTip(ctx);
        this.drawHoldingItem(ctx);
    }

    private drawHoldingItem(ctx: CanvasRenderingContext2D) {
        if (this.player.holdingItem) {
            ctx.drawImage(this.player.holdingItem!.item.sprite, ...this.player.holdingItem!.item.spriteClip, this.input.x - 32, this.input.y - 32, 64, 64);

            ctx.fillStyle = "white";
            ctx.font = "24px MonogramFont";

            if (this.player.holdingItem!.amount === 0) return;

            ctx.fillText(this.player.holdingItem!.amount.toString(), this.input.x + 16, this.input.y + 16);
        }
    }

    private drawToolTip(ctx: CanvasRenderingContext2D) {
        if (this.activeToolTip === "") return;

        ctx.font = "16px MonogramFont";
        const wordData = ctx.measureText(this.activeToolTip);

        ctx.fillStyle = "black";
        ctx.fillRect(this.input.x - wordData.width / 2 - 6, this.input.y - 20, wordData.width + 10, 20);

        ctx.fillStyle = "white";        
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.activeToolTip, this.input.x, this.input.y - 10);

        this.activeToolTip = "";
    }

    public update(dt: number) {
        this.hud.update(dt);
        this.hovers.forEach((hover) => hover.update(dt));
    }
}