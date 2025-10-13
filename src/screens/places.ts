import forgeBackground from "../assets/forge.png";
import questsBackground from "../assets/quest_board.png";
import caveBackground from "../assets/caverna.png";
import Furnace from "../objects/furnace.js";
import Rect from "../util/rect.js";
import forgesData from "./forges.json" with { type: "json" };


abstract class GenericPlace {
    protected sprite : HTMLImageElement;
    rect : Rect;
    constructor(sprite : HTMLImageElement, rect : Rect) {
        this.sprite = sprite;
        this.rect = rect;
    }

    abstract draw(ctx : CanvasRenderingContext2D) : void;
}

export class Forge extends GenericPlace {

    private furnaces : Furnace[] = [];    

    constructor(rect : Rect) {
        const sprite = new Image();
        sprite.src = forgeBackground;

        super(sprite, rect);

        this.addFurnace(50, 80, 160, 250);
        this.addFurnace(220, 80, 160, 250);
        this.addFurnace(390, 80, 160, 250);
        this.addFurnace(500, 80, 160, 250);
    }

    draw(ctx : CanvasRenderingContext2D) {
        ctx.drawImage(this.sprite, this.rect.x, this.rect.y, this.rect.width, this.rect.height);

        for (let furnace of this.furnaces) {
            furnace.draw(ctx);
        }
    }

    addFurnace(x: number, y: number, width: number, height: number) : void {
        if (this.furnaces.length >= forgesData[1].maxForgesAmount) return;
        this.furnaces.push(new Furnace(new Rect(x, y, width, height)));
    }
}

export class QuestBoard extends GenericPlace {
    constructor(rect : Rect) {
        const sprite = new Image();
        sprite.src = questsBackground;

        super(sprite, rect);
    }

    draw(ctx : CanvasRenderingContext2D) {
        ctx.drawImage(this.sprite, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }
}

export class Cave extends GenericPlace {
    constructor(rect : Rect) {
        const sprite = new Image();
        sprite.src = caveBackground;

        super(sprite, rect);
    }

    draw(ctx : CanvasRenderingContext2D) {
        ctx.drawImage(this.sprite, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }
}