import type { InputManager } from "../../core/InputManager.js";
import type { UIGeneric } from "./uiGeneric.js";
import UIBottom from "./uiBottom.js";
import UILeft from "./uiLeft.js";
import UIRight from "./uiRight.js";
import UITop from "./uiTop.js";

type HUDSection = "left" | "right" | "top" | "bottom";

export class uiHUD {

    public sections: Map<HUDSection, UIGeneric>;

    constructor(input: InputManager) {
        this.sections = new Map<HUDSection, UIGeneric>([
            ["left", new UILeft(input)],
            ["right", new UIRight(input)],
            ["top", new UITop(input)],
            ["bottom", new UIBottom(input)],
        ]);
    }

    draw(ctx : CanvasRenderingContext2D) {
        for (const section of this.sections.values()) {
            section.draw(ctx);
        }
    }

    update(dt : number, input : InputManager) {
        for (const section of this.sections.values()) {
            section.update(dt, input);
        }
    }
}