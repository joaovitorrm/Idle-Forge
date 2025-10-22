import type { InputManager } from "../core/InputManager.js";
import type Player from "../entities/Player.js";
import type Rect from "../util/rect.js";
import { ColorButton } from "./uiElements/Button.js";
import { uiHUD } from "./uiPanels/uiHUD.js";

type HUDSection = "left" | "right" | "top" | "bottom";

export class UIManager {

    hud: uiHUD;
    isHUDActive: boolean = true;

    constructor(private input: InputManager, protected player: Player) {
        this.hud = new uiHUD(input, player);
    }

    public setIsHUDActive(isHUDActive: boolean) {
        this.isHUDActive = isHUDActive;
    }

    public addHUDColorButton(side: HUDSection, name: string, color: string, rect: Rect, handleClick: (args?: unknown) => void): void {
        this.hud.sections.get(side)!.buttons.set(name, new ColorButton(color, this.hud.sections.get(side)!.rect, rect, this.input, handleClick));
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (this.isHUDActive)
            this.hud.draw(ctx);
    }

    public update(dt: number) {
        this.hud.update(dt);
    }
}