import type { InputManager } from "../../core/InputManager.js";
import type Player from "../../entities/Player.js";
import type Rect from "../../util/rect.js";
import type { Button } from "../uiElements/uiButton.js";

export abstract class UIGeneric {

    protected isShown: boolean = true;
    public buttons : Map<string, Button> = new Map<string, Button>();

    constructor(public rect : Rect, protected input : InputManager, protected player : Player) {}

    abstract draw(ctx: CanvasRenderingContext2D): void;
    abstract update(dt : number): void;
    setIsShown(isShown: boolean): void { this.isShown = isShown };
}