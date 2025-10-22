import { AssetManager } from "../core/AssetManager.js";
import type Rect from "../util/rect.js";
import { GenericObject } from "./GenericObject.js";
import { CoalOre, CopperOre, Fuel, GoldOre, Item, Ore, type OreType } from "./Item.js";

export default class Furnace extends GenericObject {

    isActive: boolean = false;

    animationTimer: number = 0;
    animationStep: number = 0;
    animationSpeed: number = 20;

    public temperature: number = 0;

    private animatedSprites: Map<number, { img: HTMLImageElement, clip: [number, number, number, number] }>;

    private fuel: { item: Fuel, amount: number } | null = null;
    private output: { item: Ore, amount: number } | null = null;

    private outputMelt : number = 0;

    private maxSpaceAmount : number = 30;
    public content : { ore : Ore, amount : number}[] = [];

    constructor(rect: Rect) {

        const assetManager = AssetManager.getInstance();

        const sprite = assetManager.getObjectImage("furnace")!.img;
        const clip = assetManager.getObjectImage("furnace")!.clip;

        super(rect, sprite, clip);

        this.animatedSprites =
            new Map([
                [0, { img: assetManager.getObjectImage("furnaceAnimation1")!.img, clip: assetManager.getObjectImage("furnaceAnimation1")!.clip }],
                [1, { img: assetManager.getObjectImage("furnaceAnimation2")!.img, clip: assetManager.getObjectImage("furnaceAnimation2")!.clip }],
                [2, { img: assetManager.getObjectImage("furnaceAnimation3")!.img, clip: assetManager.getObjectImage("furnaceAnimation3")!.clip }]
            ]);
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (!this.isActive) {
            ctx.drawImage(this.sprite!, ...this.spriteClip, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
        } else {
            ctx.drawImage(
                this.animatedSprites.get(this.animationStep)!.img, 
                ...this.animatedSprites.get(this.animationStep)!.clip,
                this.rect.x, this.rect.y, this.rect.width, this.rect.height
            );
        }
        
    }

    update(dt: number) {
        if (!this.isActive) return;

        if (this.temperature <= 0) {
            if (this.fuel !== null && this.fuel.amount > 0) {
                this.fuel.amount--;
                this.temperature += this.fuel.item.burnTime;
            }
            else {
                if (this.fuel!.amount === 0) this.fuel = null;
                this.isActive = false;
            }
        }
        else if (this.temperature > 0) {
            this.temperature -= dt;
            if (this.output && !this.checkIsFull()) {
                this.outputMelt += dt;
                if (this.outputMelt >= this.output.item.meltTime) {
                    this.addInnerContent(this.output.item, 1);
                    if (--this.output.amount === 0) this.output = null;
                    this.outputMelt = 0;
                }
            }
        }

        if (this.animationTimer > this.animationSpeed) {
            this.animationStep = (this.animationStep + 1) % 3;
            this.animationTimer = 0;
        }

        this.animationTimer += dt * 150;
    }

    addFuel(fuel: Fuel, amount: number) : boolean {
        if (this.fuel !== null) {
            if (this.fuel.item.name === fuel.name) {
                this.fuel.amount += amount;
                return true;
            }
            return false;
        }

        this.fuel = { item: fuel, amount: amount };
        this.isActive = true;
        return true;
    }

    addOutput(output: Ore, amount: number) : boolean {
        if (this.output !== null) {
            if (this.output.item.name === output.name) {
                this.output.amount += amount;
                return true;
            }
            return false;
        }

        this.output = { item: output, amount: amount };
        return true;
    }

    private addInnerContent(ore : Ore, amount : number) {
        for (const c of this.content) {
            if (c.ore.name === ore.name) {
                c.amount += amount;
                return;
            }
        }
        this.content.push({ore, amount});
    }

    private checkIsFull() : boolean {
        let amount = 0;
        for (const c of this.content) {
            amount += c.amount;
        }
        return amount >= this.maxSpaceAmount;
    }

    getFuel(): { item: Fuel, amount: number } | null {
        return this.fuel;
    }

    getOutput(): { item: Ore, amount: number } | null {
        return this.output;
    }
}