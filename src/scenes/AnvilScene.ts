import { AssetManager } from "../core/AssetManager.js";
import type { InputManager } from "../core/InputManager.js";
import { Piece } from "../entities/Item.js";
import type Player from "../entities/Player.js";
import type { UIManager } from "../ui/uiManager.js";
import Rect from "../util/rect.js";
import { drawHitBox } from "../util/utils.js";
import { GenericScene } from "./GenericScene.js";

export class AnvilScene extends GenericScene {
    protected anvilRect: Rect;
    protected craftingPieces: { piece: Piece, rect: Rect }[] = [];
    constructor(input: InputManager, player: Player, protected ui: UIManager) {

        const sprite = AssetManager.getInstance().getBackgroundImage("anvilBackground")!;

        super(input, player, ui, sprite);

        this.anvilRect = new Rect(160, 126, 330, 200);
    }

    update(dt: number) {
        if (this.input.clicked) {
            this.input.clicked = false;
            if (this.ui.isHolding()) {
                const {item, size} = this.ui.getHolding()!;
                if (this.input.isMouseOver(this.anvilRect) && item instanceof Piece) {
                    this.craftingPieces.push({ piece: item, rect: new Rect(this.input.x - 64, this.input.y - 64, size.width, size.height) });
                    this.ui.removeHolding();
                }
            } else {
                this.craftingPieces.forEach(({ rect }) => {
                    if (this.input.isMouseOver(rect)) {
                        this.craftingPieces = this.craftingPieces.filter(p => p.rect !== rect);
                    }
                });
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx);

        this.craftingPieces.forEach(({ piece, rect }) => {
            ctx.drawImage(piece.getSprite(), ...piece.getClip(), rect.x, rect.y, rect.width, rect.height);
        });
    }

    enter(): void {

    }

    exit(): void {

    }
}