import { AssetManager } from "../core/AssetManager.js";
import type Rect from "../util/rect.js";
import { GenericObject } from "./GenericObject.js";
import { Fuel, Melt } from "./Item.js";

export default class Furnace extends GenericObject {

    isActive: boolean = false;

    animationTimer: number = 0;
    animationStep: number = 0;
    animationSpeed: number = 20;

    public temperature: number = 0;

    private animatedSprites: Map<number, { img: HTMLImageElement, clip: [number, number, number, number] }>;

    private fuel: { item: Fuel, amount: number } | null = null;
    private smelting: { item: Melt, amount: number } | null = null;

    private smeltProgress: number = 0;

    public maxSpaceAmount: number = 30;
    public usedSpaceAmount: number = 0;

    public inventory: { ore: Melt, amount: number }[] = [];

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
        else {
            this.temperature -= dt;
            if (this.smelting && this.usedSpaceAmount < this.maxSpaceAmount) {
                this.smeltProgress += dt;
                if (this.smeltProgress >= this.smelting.item.meltTime) {
                    this.smeltToInvetory();
                    if (--this.smelting.amount === 0) this.smelting = null;
                    this.smeltProgress = 0;
                }
            }
        }

        if (this.animationTimer > this.animationSpeed) {
            this.animationStep = (this.animationStep + 1) % 3;
            this.animationTimer = 0;
        }

        this.animationTimer += dt * 150;
    }

    addFuel(fuel: Fuel, amount: number): boolean {
        if (this.fuel !== null) {
            if (this.fuel.item.name !== fuel.name) {
                return false;
            }
            this.fuel.amount += amount;
        } else {
            this.fuel = { item: fuel, amount: amount };
            this.isActive = true;
        }

        return true;
    }

    addSmelting(smelting: Melt, amount: number): boolean {
        if (this.smelting !== null) {
            if (this.smelting.item.name === smelting.name) {
                this.smelting.amount += amount;
                return true;
            }
            return false;
        }

        this.smelting = { item: smelting, amount: amount };
        return true;
    }

    private smeltToInvetory() {
        this.usedSpaceAmount++;
        for (const c of this.inventory) {
            if (c.ore.name === this.smelting!.item.name) {
                c.amount++;
                return;
            }
        }
        this.inventory.push({ ore: this.smelting!.item, amount: 1 });
    }

    public passTime(elapsedTime: number) {
        if (!this.isActive) return;

        this.temperature -= elapsedTime;
        this.smeltProgress += elapsedTime;

        while (this.temperature <= 0 && this.fuel!.amount > 0) {
            this.fuel!.amount--;
            this.temperature += this.fuel!.item.burnTime;
            
            if (this.smelting) {
                if (this.smeltProgress > this.smelting!.item.meltTime) {
                    this.smeltProgress -= this.smelting!.item.meltTime;
                    if (this.usedSpaceAmount < this.maxSpaceAmount) {
                        this.smeltToInvetory();
                        if (--this.smelting!.amount === 0) {
                            this.smelting = null;
                            this.smeltProgress = 0;
                        };
                    }
                }
            }
        }
        
        if (this.fuel!.amount === 0) {
            this.fuel = null;
            this.isActive = false;
            this.temperature = 0;
        }


    }

    getFuel(): { item: Fuel, amount: number } | null {
        return this.fuel;
    }

    getSmelting(): { item: Melt, amount: number } | null {
        return this.smelting;
    }

    getSmeltProgress(): number {
        return this.smeltProgress;
    }
}