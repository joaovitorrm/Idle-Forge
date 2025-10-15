import type { InputManager } from "../core/InputManager.js";
import type Rect from "../util/rect.js";
import { uiHUD } from "./uiPanels/uiHUD.js";

type HUDSection = "left" | "right" | "top" | "bottom";

export class UIManager {

    hud : uiHUD;
    isHUDActive : boolean = true;

    constructor(private input : InputManager) {
        this.hud = new uiHUD(input);
    }

    public setIsHUDActive(isHUDActive : boolean) {
        this.isHUDActive = isHUDActive;
    }

    public addHUDColorButton(side : HUDSection, name : string, color : string, rect : Rect, handleClick : (args? : unknown) => void) : void {
        this.hud.sections.get(side)!.addColorButton(name, color, rect, handleClick);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        if (this.isHUDActive)
            this.hud.draw(ctx);
    }

    public update(dt : number) {
        this.hud.update(dt, this.input);
    }
}