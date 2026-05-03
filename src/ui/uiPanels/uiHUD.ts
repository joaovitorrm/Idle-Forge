import type { InputManager } from "../../core/InputManager.js";
import type { UIGeneric } from "./uiGeneric.js";
import UIBottom from "./uiBottom.js";
import UILeft from "./uiLeft.js";
import UIRight from "./uiRight.js";
import UITop from "./uiTop.js";
import type Player from "../../entities/Player.js";
import type { UIManager } from "../uiManager.js";

type HUDSection = "right" | "top" | "bottom";

export class uiHUD {

    public sections: Map<HUDSection, UIGeneric>;

    constructor(protected input: InputManager, protected player: Player, protected ui: UIManager) {
        this.sections = new Map<HUDSection, UIGeneric>([
            ["right", new UIRight(input, player, ui)],
            ["top", new UITop(input, player, ui)],
            ["bottom", new UIBottom(input, player, ui)],
        ]);
    }

    draw(ctx: CanvasRenderingContext2D) {
        for (const section of this.sections.values()) {
            section.draw(ctx);
        }
    }

    update(dt: number) {
        for (const section of this.sections.values()) {
            section.update(dt);
        }
    }
}