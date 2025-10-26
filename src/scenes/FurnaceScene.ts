import { AssetManager } from "../core/AssetManager.js";
import type { InputManager } from "../core/InputManager.js";
import type Furnace from "../entities/Furnace.js";
import { Ore, Plate } from "../entities/Item.js";
import type Player from "../entities/Player.js";
import { LabelButton, type Button } from "../ui/uiElements/uiButton.js";
import Rect from "../util/rect.js";
import { GenericScene } from "./GenericScene.js";

const colors = {
    "Copper Ore": "hsl(20, 50%, 50%)",
    "Gold Ore": "hsl(50, 80%, 50%)"
}

export default class FurnaceScene extends GenericScene {

    private activePlate: Plate | null = null;
    private platePos: Rect;
    private meltedBackground: { rect: Rect, color: string | null };
    private furnaceTank: { rect: Rect, ores: Ore[] };
    private smeltProcess: { ore: Ore, amount: number } | null = null;
    private smeltBtn: Button;

    constructor(input: InputManager, player: Player, private furnace: Furnace) {

        const assetManager = AssetManager.getInstance();
        const sprite = assetManager.getBackgroundImage("furnaceBackground")!;

        super(input, player, sprite);

        this.platePos = new Rect(this.rect.width / 2 - 100, 150, 200, 200);

        this.meltedBackground = {
            rect: new Rect(this.platePos.x + this.platePos.width / 2 - 73, this.platePos.y + this.platePos.height / 2 - 73, 146, 146),
            color: null //furnace.getOutput()?.item.outputType ? colors[furnace.getOutput()!.item.outputType as keyof typeof colors] : null
        }

        this.furnaceTank = {
            rect: new Rect(60, this.platePos.y + this.platePos.height / 2 - 120 - 50, 140, 260),
            ores: []
        }

        this.smeltBtn = new LabelButton("DROP", "black", "cyan", 16, this.furnaceTank.rect,
            new Rect(this.furnaceTank.rect.width / 2 - 25, this.furnaceTank.rect.height + 60, 50, 30), this.input, this.meltToPlate.bind(this)
        );
    }

    draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx);

        this.drawFurnaceTank(ctx);
        this.smeltBtn.draw(ctx);

        this.drawPlate(ctx);
    }

    update(dt: number) {
        if (this.player.holdingItem && this.input.clicked) {
            if (this.player.holdingItem?.item instanceof Plate && this.input.isMouseOver(this.platePos)) {
                this.activePlate = this.player.holdingItem.item;
                this.smeltProcess = null;
            }
            this.player.holdingItem = null;
        }
        this.smeltBtn.update(dt);
    }

    meltToPlate() {
        if (this.furnace.content.length === 0 || !this.activePlate) return;

        const { ore } = this.furnace.content[0]!;
        if (this.smeltProcess) {
            if (this.smeltProcess.ore.name === ore.name && this.smeltProcess.amount < this.activePlate.oreNeededAmount) {
                this.smeltProcess.amount += 1;
                this.furnace.content[0]!.amount -= 1;
                if (this.furnace.content[0]!.amount === 0) this.furnace.content.shift();

            }           
        } else {
            this.smeltProcess = { ore, amount: 1 };
            this.furnace.content[0]!.amount -= 1;
            this.meltedBackground.color = colors[ore.name as keyof typeof colors];
        }

        if (this.smeltProcess.amount === this.activePlate.oreNeededAmount) {
            this.player.addItem(this.activePlate!.getPiece(ore), 1);
            this.activePlate = null;
            this.smeltProcess = null;            
        }
    }

    drawPlate(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "gray";
        ctx.fillRect(this.platePos.x, this.platePos.y, this.platePos.width, this.platePos.height);

        if (this.activePlate) {

            ctx.fillStyle = this.meltedBackground.color ?? "white";
            ctx.fillRect(
                this.platePos.x + this.platePos.width / 2 - 73,
                this.platePos.y + this.platePos.height / 2 - 73,
                146, 146 * (this.smeltProcess?.amount ?? 0) / this.activePlate.oreNeededAmount
            );

            ctx.drawImage(
                this.activePlate!.sprite,
                ...this.activePlate!.spriteClip,
                this.platePos.x + this.platePos.width / 2 - 90,
                this.platePos.y + this.platePos.height / 2 - 90,
                180, 180
            );

            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.font = "20px MonogramFont";

            ctx.fillText(
                this.activePlate.name,
                this.platePos.x + this.platePos.width / 2,
                this.platePos.y + this.platePos.height)

            const filledAmount = this.smeltProcess?.amount ?? 0;
            ctx.fillText(
                `${filledAmount}/${this.activePlate.oreNeededAmount}`,
                this.platePos.x + this.platePos.width / 2,
                this.platePos.y + this.platePos.height + 15
            );
        } else {
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.font = "20px MonogramFont";
            ctx.fillText("No Plate", this.platePos.x + this.platePos.width / 2, this.platePos.y + this.platePos.height)
        }
    }

    drawFurnaceTank(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "gray";
        ctx.fillRect(this.furnaceTank.rect.x, this.furnaceTank.rect.y, this.furnaceTank.rect.width, this.furnaceTank.rect.height);
        let outputYPos = this.furnaceTank.rect.y + this.furnaceTank.rect.height;
        for (const { ore, amount } of this.furnace.content) {
            outputYPos -= 260 * amount / this.furnace.maxSpaceAmount;
            ctx.fillStyle = colors[ore.name as keyof typeof colors] ?? "white";
            ctx.fillRect(this.furnaceTank.rect.x, outputYPos, this.furnaceTank.rect.width, (260 * amount / this.furnace.maxSpaceAmount));
        }

        ctx.fillStyle = "black";
        ctx.font = "20px MonogramFont";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";

        ctx.fillText(
            "Melted Ores",
            this.furnaceTank.rect.x + this.furnaceTank.rect.width / 2,
            this.furnaceTank.rect.y + this.furnaceTank.rect.height
        )

        ctx.fillText(
            `${this.furnace.content.reduce((a, b) => a + b.amount, 0)}/${this.furnace.maxSpaceAmount}`,
            this.furnaceTank.rect.x + this.furnaceTank.rect.width / 2,
            this.furnaceTank.rect.y + this.furnaceTank.rect.height + 15
        );
    }

    enter() {

    }

    exit() {

    }
}