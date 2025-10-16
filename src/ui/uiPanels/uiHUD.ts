import type { InputManager } from "../../core/InputManager.js";
import type { UIGeneric } from "./uiGeneric.js";
import UIBottom from "./uiBottom.js";
import UILeft from "./uiLeft.js";
import UIRight from "./uiRight.js";
import UITop from "./uiTop.js";
import type Player from "../../entities/Player.js";

type HUDSection = "left" | "right" | "top" | "bottom";

export class uiHUD {

    public sections: Map<HUDSection, UIGeneric>;

    constructor(input: InputManager, protected player: Player) {
        this.sections = new Map<HUDSection, UIGeneric>([
            ["left", new UILeft(input, player)],
            ["right", new UIRight(input, player)],
            ["top", new UITop(input, player)],
            ["bottom", new UIBottom(input, player)],
        ]);
    }

    draw(ctx : CanvasRenderingContext2D) {
        for (const section of this.sections.values()) {
            section.draw(ctx);
        }
    }

    update(dt : number) {
        for (const section of this.sections.values()) {
            section.update(dt);
        }
    }
}