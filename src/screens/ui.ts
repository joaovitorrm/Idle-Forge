import type Player from "../objects/player.js";
import type { Button } from "../types/button.js";
import type Mouse from "../types/mouse.js";
import Rect from "../util/rect.js";
import { drawHitBox } from "../util/utils.js";

export class UI {

    UI: { top: TopUI, right: RightUI, bottom: BottomUI, left: LeftUI };
    private player: Player;

    constructor(screenWidth: number, screenHeight: number, player: Player, mouse: Mouse) {
        this.UI = {
            top: new TopUI(0, 0, screenWidth, 40, player, mouse),
            right: new RightUI(screenWidth - 150, 40, 150, screenHeight - 80, player, mouse),
            bottom: new BottomUI(0, screenHeight - 40, screenWidth, 40, player, mouse),
            left: new LeftUI(0, 40, 150, screenHeight - 80, player, mouse)
        };

        this.player = player;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        this.UI.top.draw(ctx);
        this.UI.right.draw(ctx);
        this.UI.bottom.draw(ctx);
        this.UI.left.draw(ctx);
    }

    public update() {
        this.UI.top.update();
        this.UI.right.update();
        this.UI.bottom.update();
        this.UI.left.update();
    }
}

abstract class GenericUI {
    rect: Rect;
    protected isShown: boolean = true;
    protected isReduced : boolean = false;
    mouse: Mouse;
    player: Player;

    constructor(x: number, y: number, width: number, height: number, player: Player, mouse: Mouse) {
        this.rect = new Rect(x, y, width, height);
        this.player = player;
        this.mouse = mouse;
    }

    abstract draw(ctx: CanvasRenderingContext2D): void;
    abstract update(): void;
    setIsShown(isShown: boolean): void { this.isShown = isShown };
    getWidth(): number { return this.rect.width };
    getHeight(): number { return this.rect.height };
}

class BottomUI extends GenericUI {

    buttons: Record<string, Button> = {}

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "hsl(0, 0%, 10%)";
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);

        Object.keys(this.buttons).forEach(key => {
            const btn = this.buttons[key] || null;
            if (!btn) return;

            ctx.drawImage(btn.sprite, ...btn.spriteClip, btn.rect.x, btn.rect.y, btn.rect.width, btn.rect.height);
        });
    }

    addButton(name: string, btn: Button): void {
        this.buttons[name] = btn;
    }

    update() {
        Object.keys(this.buttons).forEach(key => {
            if (!this.buttons[key]) return;

            if (this.buttons[key].rect.collide(new Rect(this.mouse.x, this.mouse.y, 1, 1)) && this.mouse.isDown) {
                this.buttons[key].action();
            }
        });
    }
}

class TopUI extends GenericUI {
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.font = "16px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(this.player.getMoney().toString(), this.rect.right - 20, this.rect.getCenterY() + 8);
    }

    update() {

    }
}

class LeftUI extends GenericUI {
    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "hsl(30, 50%, 30%)";
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);

        ctx.fillStyle = "red";
        ctx.fillRect(this.rect.x + this.rect.width - 20, this.rect.y, 20, 20);
    }

    update() {
        if (this.mouse.isDown && (new Rect(this.rect.x + this.rect.width - 20, this.rect.y, 20, 20)).collide(new Rect(this.mouse.x, this.mouse.y, 1, 1))) {
            this.reduceUI();
        }
    }

    reduceUI() {
        this.isReduced = !this.isReduced;

        if (this.isReduced) {
            this.rect.width = 20;
        } else {
            this.rect.width = 150;
        }
    }
}

class RightUI extends GenericUI {

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "hsl(30, 50%, 30%)";
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);

        ctx.fillStyle = "red";
        ctx.fillRect(this.rect.x, this.rect.y, 20, 20);
    }

    update() {
        if (this.mouse.isDown && (new Rect(this.rect.x, this.rect.y, 20, 20)).collide(new Rect(this.mouse.x, this.mouse.y, 1, 1))) {
            this.reduceUI();
        }
    }

    reduceUI() {
        this.isReduced = !this.isReduced;

        if (this.isReduced) {
            this.rect.x = this.rect.x + 150 - 20;
            this.rect.width = 20;
        } else {
            this.rect.x = this.rect.x - 150 + 20;
            this.rect.width = 150;
        }
    }
}
